"""Automated test suite for single lead creation API (POST /leads).

Verifies:
1. Successful lead creation with 201 Created.
2. Correct AI priority prediction and confidence score generation from message.
3. Initial status set to 'New'.
4. Initial override_priority set to null.
5. Effective priority dynamically equals predicted priority.
6. Duplicate lead_id rejection with HTTP 409 Conflict.
7. Validation rejection of invalid input (missing fields, empty strings, negative order value) with HTTP 422.
8. Rejection of forbidden client-supplied fields (predicted_priority, confidence, override_priority, status) with HTTP 422.
9. ML model unavailable handling with HTTP 503 Service Unavailable.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.lead import Lead

client = TestClient(app)


def test_create_lead_success(db_session):
    """Verify successful creation of an individual lead with automated ML prediction."""
    payload = {
        "lead_id": "LEAD-SINGLE-01",
        "source": "Phone Inbound",
        "customer_type": "Fleet Owner",
        "vehicle": "2020 Hyundai Creta",
        "part_needed": "starter motor",
        "estimated_order_value_inr": 6200,
        "message": "The existing starter motor has failed and caused downtime. Need a same-day quotation.",
    }

    response = client.post("/leads", json=payload)
    assert response.status_code == 201
    data = response.json()

    # Core response fields
    assert data["lead_id"] == "LEAD-SINGLE-01"
    assert data["source"] == "Phone Inbound"
    assert data["customer_type"] == "Fleet Owner"
    assert data["vehicle"] == "2020 Hyundai Creta"
    assert data["part_needed"] == "starter motor"
    assert data["estimated_order_value_inr"] == 6200
    assert data["message"] == payload["message"]

    # ML prediction & initial state
    assert data["predicted_priority"] in ("High", "Medium", "Low")
    assert 0.0 <= data["confidence"] <= 1.0
    assert data["status"] == "New"
    assert data["override_priority"] is None
    assert data["effective_priority"] == data["predicted_priority"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

    # Verify persistence in database
    db_lead = db_session.query(Lead).filter(Lead.lead_id == "LEAD-SINGLE-01").first()
    assert db_lead is not None
    assert db_lead.predicted_priority == data["predicted_priority"]
    assert db_lead.confidence == data["confidence"]
    assert db_lead.override_priority is None
    assert db_lead.status == "New"
    assert db_lead.effective_priority == data["predicted_priority"]


def test_create_lead_duplicate_id_rejected(db_session):
    """Verify duplicate lead_id returns HTTP 409 Conflict."""
    payload = {
        "lead_id": "LEAD-DUP-TEST",
        "source": "Website",
        "customer_type": "Garage",
        "vehicle": "Tata Ace",
        "part_needed": "Clutch Plate",
        "estimated_order_value_inr": 8500,
        "message": "Need clutch plate urgently.",
    }

    # First creation succeeds
    res1 = client.post("/leads", json=payload)
    assert res1.status_code == 201

    # Second creation with identical lead_id fails with 409
    res2 = client.post("/leads", json=payload)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]


@pytest.mark.parametrize(
    "invalid_payload",
    [
        # Missing lead_id
        {
            "source": "Web",
            "customer_type": "Garage",
            "vehicle": "Tata Ace",
            "part_needed": "Brake",
            "estimated_order_value_inr": 5000,
            "message": "Urgent brake order",
        },
        # Empty whitespace lead_id
        {
            "lead_id": "   ",
            "source": "Web",
            "customer_type": "Garage",
            "vehicle": "Tata Ace",
            "part_needed": "Brake",
            "estimated_order_value_inr": 5000,
            "message": "Urgent brake order",
        },
        # Empty message
        {
            "lead_id": "LEAD-EMP-MSG",
            "source": "Web",
            "customer_type": "Garage",
            "vehicle": "Tata Ace",
            "part_needed": "Brake",
            "estimated_order_value_inr": 5000,
            "message": "",
        },
        # Negative estimated order value
        {
            "lead_id": "LEAD-NEG-VAL",
            "source": "Web",
            "customer_type": "Garage",
            "vehicle": "Tata Ace",
            "part_needed": "Brake",
            "estimated_order_value_inr": -100,
            "message": "Urgent brake order",
        },
        # String instead of int for order value
        {
            "lead_id": "LEAD-STR-VAL",
            "source": "Web",
            "customer_type": "Garage",
            "vehicle": "Tata Ace",
            "part_needed": "Brake",
            "estimated_order_value_inr": "invalid_number",
            "message": "Urgent brake order",
        },
    ],
)
def test_create_lead_invalid_inputs_rejected(invalid_payload):
    """Verify invalid payloads are rejected with HTTP 422 Unprocessable Entity."""
    response = client.post("/leads", json=invalid_payload)
    assert response.status_code == 422


@pytest.mark.parametrize(
    "forbidden_field,val",
    [
        ("predicted_priority", "High"),
        ("confidence", 0.95),
        ("override_priority", "Low"),
        ("status", "Contacted"),
    ],
)
def test_create_lead_forbidden_client_fields_rejected(forbidden_field, val):
    """Verify clients cannot manually set AI priority, confidence, override, or status during creation."""
    payload = {
        "lead_id": "LEAD-FORBIDDEN-01",
        "source": "Phone",
        "customer_type": "Individual",
        "vehicle": "Maruti Swift",
        "part_needed": "Headlight",
        "estimated_order_value_inr": 3500,
        "message": "Broken headlight.",
        forbidden_field: val,
    }

    response = client.post("/leads", json=payload)
    assert response.status_code == 422


def test_create_lead_ml_model_unavailable(monkeypatch):
    """Verify that if ML model is unavailable, HTTP 503 Service Unavailable is returned."""
    monkeypatch.setenv("ML_MODEL_PATH", "/non/existent/path/lead_priority_model.pkl")

    payload = {
        "lead_id": "LEAD-NO-MODEL",
        "source": "Phone",
        "customer_type": "Individual",
        "vehicle": "Maruti Swift",
        "part_needed": "Headlight",
        "estimated_order_value_inr": 3500,
        "message": "Broken headlight.",
    }

    response = client.post("/leads", json=payload)
    assert response.status_code == 503
    assert "ML model artifact not found" in response.json()["detail"]
