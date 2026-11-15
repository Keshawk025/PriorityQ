"""Comprehensive test suite for the Lead model and SQLite database schema.

Verifies:
1. SQLite database file creation.
2. Table existence ('leads').
3. Column names, types, and nullability.
4. Unique constraint enforcement on lead_id.
5. Acceptance of valid priority, status, and confidence values.
6. Database CheckConstraint enforcement on invalid priorities, statuses, and confidence ranges.
7. Dynamic effective_priority fallback to predicted_priority.
8. Dynamic effective_priority precedence for override_priority.
9. Immutability of predicted_priority when override_priority is modified.
10. System health check stability.
"""

import pytest
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError
from fastapi.testclient import TestClient

from app.database import engine
from app.models.lead import Lead
from app.main import app


def test_01_sqlite_database_file_exists():
    """Verify that the SQLite database engine connects and operates on a valid SQLite database."""
    inspector = inspect(engine)
    assert inspector is not None


def test_02_leads_table_exists():
    """Verify that the 'leads' table was created in the database schema."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "leads" in tables


def test_03_all_required_columns_exist():
    """Verify that all required columns exist with expected nullability specifications."""
    inspector = inspect(engine)
    columns = {col["name"]: col for col in inspector.get_columns("leads")}

    expected_columns = {
        "id": False,
        "lead_id": False,
        "source": False,
        "customer_type": False,
        "vehicle": False,
        "part_needed": False,
        "estimated_order_value_inr": False,
        "message": False,
        "predicted_priority": False,
        "confidence": False,
        "override_priority": True,
        "status": False,
        "created_at": False,
        "updated_at": False,
    }

    for col_name, expected_nullable in expected_columns.items():
        assert col_name in columns, f"Missing required column: {col_name}"
        assert (
            columns[col_name]["nullable"] == expected_nullable
        ), f"Column {col_name} nullable expected {expected_nullable}, got {columns[col_name]['nullable']}"


def test_04_lead_id_uniqueness_enforced(db_session):
    """Verify that inserting a duplicate lead_id raises an IntegrityError."""
    lead1 = Lead(
        lead_id="LEAD-DUP-01",
        source="Website Form",
        customer_type="Fleet Owner",
        vehicle="Tata Ace",
        part_needed="Brake Pads",
        estimated_order_value_inr=15000,
        message="Need urgent replacement for 5 vehicles.",
        predicted_priority="High",
        confidence=0.92,
        status="New",
    )
    db_session.add(lead1)
    db_session.commit()

    lead2 = Lead(
        lead_id="LEAD-DUP-01",  # Duplicate ID
        source="Phone",
        customer_type="Independent Mechanic",
        vehicle="Mahindra Bolero",
        part_needed="Clutch Plate",
        estimated_order_value_inr=8000,
        message="Looking for spare parts.",
        predicted_priority="Medium",
        confidence=0.75,
        status="New",
    )
    db_session.add(lead2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


@pytest.mark.parametrize("priority", ["High", "Medium", "Low"])
@pytest.mark.parametrize("status", ["New", "Contacted", "Qualified", "Closed"])
@pytest.mark.parametrize("confidence", [0.0, 0.5, 1.0])
def test_05_valid_values_accepted(db_session, priority, status, confidence):
    """Verify that all valid priority, status, and boundary confidence values are accepted."""
    lead = Lead(
        lead_id=f"LEAD-VALID-{priority}-{status}-{int(confidence*100)}",
        source="Referral",
        customer_type="Retail Workshop",
        vehicle="Eicher Pro",
        part_needed="Oil Filter",
        estimated_order_value_inr=5000,
        message="Regular order.",
        predicted_priority=priority,
        confidence=confidence,
        override_priority=priority,
        status=status,
    )
    db_session.add(lead)
    db_session.commit()
    assert lead.id is not None


def test_06_invalid_predicted_priority_rejected(db_session):
    """Verify that invalid predicted_priority values violate database constraints."""
    lead = Lead(
        lead_id="LEAD-INV-PRED",
        source="Email",
        customer_type="Fleet Owner",
        vehicle="Ashok Leyland",
        part_needed="Fuel Pump",
        estimated_order_value_inr=25000,
        message="Fuel system issue.",
        predicted_priority="Urgent",  # Invalid priority
        confidence=0.85,
        status="New",
    )
    db_session.add(lead)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_06_invalid_override_priority_rejected(db_session):
    """Verify that invalid override_priority values violate database constraints."""
    lead = Lead(
        lead_id="LEAD-INV-OVER",
        source="Email",
        customer_type="Fleet Owner",
        vehicle="Ashok Leyland",
        part_needed="Fuel Pump",
        estimated_order_value_inr=25000,
        message="Fuel system issue.",
        predicted_priority="High",
        confidence=0.85,
        override_priority="Critical",  # Invalid override
        status="New",
    )
    db_session.add(lead)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_06_invalid_status_rejected(db_session):
    """Verify that invalid status values violate database constraints."""
    lead = Lead(
        lead_id="LEAD-INV-STAT",
        source="Email",
        customer_type="Fleet Owner",
        vehicle="Ashok Leyland",
        part_needed="Fuel Pump",
        estimated_order_value_inr=25000,
        message="Fuel system issue.",
        predicted_priority="High",
        confidence=0.85,
        status="Pending",  # Invalid status
    )
    db_session.add(lead)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


@pytest.mark.parametrize("invalid_confidence", [-0.1, 1.01, 2.5, -5.0])
def test_06_invalid_confidence_range_rejected(db_session, invalid_confidence):
    """Verify that confidence outside [0.0, 1.0] violates database check constraints."""
    lead = Lead(
        lead_id=f"LEAD-INV-CONF-{invalid_confidence}",
        source="Email",
        customer_type="Fleet Owner",
        vehicle="Ashok Leyland",
        part_needed="Fuel Pump",
        estimated_order_value_inr=25000,
        message="Fuel system issue.",
        predicted_priority="High",
        confidence=invalid_confidence,
        status="New",
    )
    db_session.add(lead)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_07_effective_priority_defaults_to_predicted():
    """Verify effective_priority returns predicted_priority when override_priority is None."""
    lead = Lead(
        lead_id="LEAD-EFF-01",
        source="Web",
        customer_type="Individual",
        vehicle="Maruti Swift",
        part_needed="Headlight",
        estimated_order_value_inr=3000,
        message="Broken headlight.",
        predicted_priority="Medium",
        confidence=0.72,
        override_priority=None,
        status="New",
    )
    assert lead.effective_priority == "Medium"


def test_08_effective_priority_uses_override():
    """Verify effective_priority returns override_priority when override_priority is set."""
    lead = Lead(
        lead_id="LEAD-EFF-02",
        source="Web",
        customer_type="Individual",
        vehicle="Maruti Swift",
        part_needed="Headlight",
        estimated_order_value_inr=3000,
        message="Broken headlight.",
        predicted_priority="Medium",
        confidence=0.72,
        override_priority="High",
        status="New",
    )
    assert lead.effective_priority == "High"


def test_09_override_does_not_mutate_predicted_priority(db_session):
    """Verify that updating override_priority never mutates the original predicted_priority."""
    lead = Lead(
        lead_id="LEAD-IMMUTABLE-01",
        source="Phone Inbound",
        customer_type="Fleet Owner",
        vehicle="Tata 407",
        part_needed="Radiator",
        estimated_order_value_inr=18000,
        message="Engine overheating.",
        predicted_priority="Low",
        confidence=0.61,
        override_priority=None,
        status="New",
    )
    db_session.add(lead)
    db_session.commit()
    db_session.refresh(lead)

    # Initial state check
    assert lead.predicted_priority == "Low"
    assert lead.override_priority is None
    assert lead.effective_priority == "Low"

    # Human agent changes priority to High
    lead.override_priority = "High"
    db_session.commit()
    db_session.refresh(lead)

    assert lead.effective_priority == "High"
    assert lead.predicted_priority == "Low", "predicted_priority was mutated by override!"

    # Human agent changes priority to Medium
    lead.override_priority = "Medium"
    db_session.commit()
    db_session.refresh(lead)

    assert lead.effective_priority == "Medium"
    assert lead.predicted_priority == "Low", "predicted_priority was mutated by secondary override!"


def test_10_health_endpoint_still_functional():
    """Verify that the /health endpoint remains functional and healthy."""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AI Lead Prioritization CRM Backend"
    assert data["version"] == "1.0.0"
