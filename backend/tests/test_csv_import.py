"""Test suite for CSV import and validation endpoint (POST /leads/import).

Verifies:
1. Missing ML model artifact behavior (operational 503 error).
2. Valid CSV import and correct database persistence.
3. Prediction and confidence generation from message field.
4. Non-use of optional CSV 'priority' column as ML feature or import value.
5. Missing required CSV column headers (400 error).
6. Empty CSV file rejection (400 error).
7. Malformed CSV content handling (400 error).
8. Non-CSV file extension rejection (400 error).
9. Row-level validation: missing fields, invalid order values.
10. Duplicate lead IDs within the file.
11. Duplicate lead IDs already in the SQLite database.
12. Row-level transaction safety (mixed valid and invalid rows).
"""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.lead import Lead

client = TestClient(app)


class MockMLPipeline:
    """Deterministic mock for Scikit-learn Pipeline used in controlled tests."""

    def predict(self, messages):
        results = []
        for msg in messages:
            text = str(msg).lower()
            if "urgent" in text or "immediate" in text:
                results.append("High")
            elif "bulk" in text or "regular" in text:
                results.append("Medium")
            else:
                results.append("Low")
        return results

    def predict_proba(self, messages):
        results = []
        for msg in messages:
            text = str(msg).lower()
            if "urgent" in text or "immediate" in text:
                # Class probabilities: [Low, Medium, High] -> High has 0.88
                results.append([0.05, 0.07, 0.88])
            elif "bulk" in text or "regular" in text:
                # Medium has 0.75
                results.append([0.15, 0.75, 0.10])
            else:
                # Low has 0.82
                results.append([0.82, 0.10, 0.08])
        return results


@pytest.fixture
def mock_ml_model(monkeypatch):
    """Monkeypatch the model loader to return a controlled deterministic pipeline."""
    mock = MockMLPipeline()
    monkeypatch.setattr("app.services.import_service.load_lead_model", lambda: mock)
    return mock


def test_missing_model_artifact_returns_503(monkeypatch):
    """Verify that attempting to import leads when model is missing returns clear 503 error."""
    # Ensure ML_MODEL_PATH points to non-existent path
    monkeypatch.setenv("ML_MODEL_PATH", "/non/existent/path/lead_priority_model.pkl")

    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-M01,Web,Fleet,Tata,Brakes,10000,Urgent delivery needed\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 503
    detail = response.json()["detail"]
    assert "ML model artifact not found" in detail
    assert "backend/ml_models/lead_priority_model.pkl" in detail


def test_valid_csv_import(mock_ml_model, db_session):
    """Verify valid CSV import parses rows, predicts priorities, and persists leads."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-V01,Website Form,Fleet Owner,Tata Ace,Brake Pads,15000,Urgent brake replacement needed.\n"
        "LEAD-V02,Phone Inbound,Workshop,Mahindra Bolero,Clutch,8000,Regular stock replenishment.\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["total_rows"] == 2
    assert data["imported_count"] == 2
    assert data["rejected_count"] == 0
    assert data["imported_lead_ids"] == ["LEAD-V01", "LEAD-V02"]
    assert data["rejected_rows"] == []

    # Verify database persistence
    lead1 = db_session.query(Lead).filter(Lead.lead_id == "LEAD-V01").first()
    assert lead1 is not None
    assert lead1.predicted_priority == "High"
    assert lead1.confidence == 0.88
    assert lead1.override_priority is None
    assert lead1.effective_priority == "High"
    assert lead1.status == "New"

    lead2 = db_session.query(Lead).filter(Lead.lead_id == "LEAD-V02").first()
    assert lead2 is not None
    assert lead2.predicted_priority == "Medium"
    assert lead2.confidence == 0.75
    assert lead2.override_priority is None
    assert lead2.effective_priority == "Medium"
    assert lead2.status == "New"
    assert lead1.created_at is not None
    assert lead2.created_at is not None


def test_csv_timestamp_recorded_and_user_timestamp_ignored(mock_ml_model, db_session):
    """Verify CSV import records server-generated created_at and ignores user-supplied timestamp columns."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message,created_at\n"
        "LEAD-TS-CSV,Phone,Fleet,Tata,Brakes,10000,Emergency brake failure,2020-01-01 00:00:00\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200

    lead = db_session.query(Lead).filter(Lead.lead_id == "LEAD-TS-CSV").first()
    assert lead is not None
    assert lead.created_at is not None
    # Must be server-generated (year 2026), not the user-supplied 2020 timestamp
    assert lead.created_at.year >= 2026


def test_csv_priority_column_is_ignored(mock_ml_model, db_session):
    """Verify that an optional 'priority' column in the CSV is never used as prediction."""
    # CSV specifies 'priority' as Low, but message text indicates urgent (High in ML)
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message,priority\n"
        "LEAD-IGN-PRIO,Email,Dealer,Eicher,Engine,30000,Urgent breakdown on highway!,Low\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["imported_count"] == 1

    lead = db_session.query(Lead).filter(Lead.lead_id == "LEAD-IGN-PRIO").first()
    assert lead is not None
    # Must use AI model output ('High'), not CSV reference label ('Low')
    assert lead.predicted_priority == "High"
    assert lead.override_priority is None


def test_missing_required_columns(mock_ml_model):
    """Verify missing required column headers triggers a 400 Bad Request."""
    csv_content = (
        "lead_id,source,customer_type,vehicle\n"
        "LEAD-X,Web,Fleet,Tata\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert "Missing required CSV column(s)" in detail
    assert "part_needed" in detail
    assert "message" in detail


def test_empty_csv_file(mock_ml_model):
    """Verify uploading an empty CSV file returns 400 Bad Request."""
    files = {"file": ("empty.csv", io.BytesIO(b""), "text/csv")}
    response = client.post("/leads/import", files=files)
    assert response.status_code == 400
    assert "Uploaded CSV file is empty" in response.json()["detail"]


def test_malformed_csv_file(mock_ml_model):
    """Verify malformed CSV content returns 400 Bad Request."""
    files = {"file": ("malformed.csv", io.BytesIO(b"\x00\x01\x02\x03"), "text/csv")}
    response = client.post("/leads/import", files=files)
    assert response.status_code == 400
    assert "Malformed CSV file" in response.json()["detail"]


def test_non_csv_file_extension(mock_ml_model):
    """Verify uploading non-.csv file triggers 400 Bad Request."""
    files = {"file": ("leads.txt", io.BytesIO(b"some,data\n"), "text/plain")}
    response = client.post("/leads/import", files=files)
    assert response.status_code == 400
    assert "Uploaded file must be a CSV file (.csv)" in response.json()["detail"]


def test_missing_required_field_in_row(mock_ml_model):
    """Verify row with empty required field is rejected."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-MISS-01,Web,Fleet,Tata,,15000,Need parts urgently\n"  # missing part_needed
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["total_rows"] == 1
    assert data["imported_count"] == 0
    assert data["rejected_count"] == 1
    assert data["rejected_rows"][0]["row_number"] == 2
    assert "Missing or empty required field" in data["rejected_rows"][0]["reason"]
    assert "part_needed" in data["rejected_rows"][0]["reason"]


def test_invalid_estimated_order_value(mock_ml_model):
    """Verify non-integer or negative order value is rejected."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-NEG,Web,Fleet,Tata,Brakes,-500,Urgent order\n"
        "LEAD-TXT,Web,Fleet,Tata,Brakes,abc,Urgent order\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["imported_count"] == 0
    assert data["rejected_count"] == 2
    assert "must be a non-negative integer" in data["rejected_rows"][0]["reason"]
    assert "must be a non-negative integer" in data["rejected_rows"][1]["reason"]


def test_duplicate_lead_ids_within_file(mock_ml_model):
    """Verify duplicate lead_id within the uploaded file rejects the second occurrence."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-DUP-FILE,Web,Fleet,Tata,Brakes,10000,Urgent brake order\n"
        "LEAD-DUP-FILE,Phone,Workshop,Eicher,Clutch,12000,Follow up order\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["total_rows"] == 2
    assert data["imported_count"] == 1
    assert data["rejected_count"] == 1
    assert data["imported_lead_ids"] == ["LEAD-DUP-FILE"]
    assert data["rejected_rows"][0]["row_number"] == 3
    assert "Duplicate lead_id 'LEAD-DUP-FILE' found within the uploaded file" in data["rejected_rows"][0]["reason"]


def test_duplicate_lead_id_already_in_database(mock_ml_model, db_session):
    """Verify lead_id already existing in SQLite database is rejected."""
    # Pre-insert lead into DB
    existing_lead = Lead(
        lead_id="LEAD-IN-DB",
        source="Pre-existing",
        customer_type="Retail",
        vehicle="Bolero",
        part_needed="Filter",
        estimated_order_value_inr=2000,
        message="Old message",
        predicted_priority="Low",
        confidence=0.7,
        status="New",
    )
    db_session.add(existing_lead)
    db_session.commit()

    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-IN-DB,Web,Fleet,Tata,Brakes,10000,Urgent brake order\n"
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["imported_count"] == 0
    assert data["rejected_count"] == 1
    assert "already exists in the database" in data["rejected_rows"][0]["reason"]


def test_mixed_valid_and_invalid_rows_partial_acceptance(mock_ml_model, db_session):
    """Verify row-level acceptance: valid rows are saved while invalid rows are rejected without corrupting data."""
    csv_content = (
        "lead_id,source,customer_type,vehicle,part_needed,estimated_order_value_inr,message\n"
        "LEAD-MIX-1,Web,Fleet,Tata,Brakes,10000,Urgent message 1\n"
        "LEAD-MIX-2,Web,Fleet,Tata,Brakes,invalid_val,Urgent message 2\n"  # Invalid order value
        "LEAD-MIX-3,Web,Fleet,Tata,Brakes,15000,Urgent message 3\n"
        ",Web,Fleet,Tata,Brakes,15000,Urgent message 4\n"                  # Missing lead_id
        "LEAD-MIX-1,Web,Fleet,Tata,Brakes,12000,Urgent message 5\n"       # Duplicate in file
    )
    files = {"file": ("leads.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = client.post("/leads/import", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["total_rows"] == 5
    assert data["imported_count"] == 2
    assert data["rejected_count"] == 3
    assert data["imported_lead_ids"] == ["LEAD-MIX-1", "LEAD-MIX-3"]

    # Check rejected row numbers: Row 3, Row 5, Row 6
    rejection_rows = [r["row_number"] for r in data["rejected_rows"]]
    assert rejection_rows == [3, 5, 6]

    # Verify database has exactly the 2 valid leads
    leads_in_db = (
        db_session.query(Lead)
        .filter(Lead.lead_id.in_(["LEAD-MIX-1", "LEAD-MIX-3"]))
        .all()
    )
    assert len(leads_in_db) == 2
