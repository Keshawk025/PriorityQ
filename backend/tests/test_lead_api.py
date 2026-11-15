"""Comprehensive API test suite for Lead and Metrics endpoints.

Tests:
1. GET /leads: retrieval, pagination, search across columns, and status filtering.
2. GET /leads/{id}: retrieval and 404 on non-existent ID.
3. PATCH /leads/{id}:
   - Updating status only.
   - Updating override_priority only.
   - Updating both together.
   - Restoring effective_priority to predicted_priority via null override.
   - Immutability of predicted_priority and confidence.
   - Rejection of invalid status and invalid override_priority.
   - Rejection of empty PATCH payload.
   - 404 on non-existent lead ID.
4. GET /metrics:
   - Empty database response with zero counts.
   - Correct aggregation of status and AI predicted priorities.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.lead import Lead

client = TestClient(app)


@pytest.fixture
def sample_leads(db_session):
    """Seed the database with sample leads for querying and filtering tests."""
    leads_data = [
        Lead(
            lead_id="LEAD-101",
            source="Website Form",
            customer_type="Fleet Owner",
            vehicle="Tata Ace",
            part_needed="Brake Pads",
            estimated_order_value_inr=15000,
            message="Urgent brake pads needed for 10 delivery vans.",
            predicted_priority="High",
            confidence=0.91,
            override_priority=None,
            status="New",
        ),
        Lead(
            lead_id="LEAD-102",
            source="Phone Inbound",
            customer_type="Independent Mechanic",
            vehicle="Mahindra Bolero",
            part_needed="Clutch Plate",
            estimated_order_value_inr=8500,
            message="Replacement clutch plate needed by Friday.",
            predicted_priority="Medium",
            confidence=0.74,
            override_priority="High",  # Pre-overridden
            status="Contacted",
        ),
        Lead(
            lead_id="LEAD-103",
            source="Email Inquiry",
            customer_type="Retail Workshop",
            vehicle="Ashok Leyland Dost",
            part_needed="Oil Filter",
            estimated_order_value_inr=3200,
            message="Inquiring about bulk discount on filters.",
            predicted_priority="Low",
            confidence=0.62,
            override_priority=None,
            status="Qualified",
        ),
        Lead(
            lead_id="LEAD-104",
            source="Referral",
            customer_type="Fleet Owner",
            vehicle="Eicher Pro",
            part_needed="Radiator Assembly",
            estimated_order_value_inr=22000,
            message="Engine radiator leak detected.",
            predicted_priority="High",
            confidence=0.88,
            override_priority=None,
            status="Closed",
        ),
    ]
    for lead in leads_data:
        db_session.add(lead)
    db_session.commit()
    return leads_data


def test_get_leads_success(sample_leads):
    """Verify GET /leads returns a list of leads with pagination metadata."""
    response = client.get("/leads")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "skip" in data
    assert "limit" in data
    assert "leads" in data
    assert data["total"] == 4
    assert len(data["leads"]) == 4

    # Verify schema fields on the first lead
    lead = data["leads"][0]
    assert lead["lead_id"] == "LEAD-101"
    assert lead["effective_priority"] == "High"
    assert lead["predicted_priority"] == "High"
    assert lead["status"] == "New"


def test_get_leads_pagination(sample_leads):
    """Verify skip and limit parameters in GET /leads."""
    response = client.get("/leads?skip=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 4
    assert data["skip"] == 1
    assert data["limit"] == 2
    assert len(data["leads"]) == 2
    assert data["leads"][0]["lead_id"] == "LEAD-102"
    assert data["leads"][1]["lead_id"] == "LEAD-103"


def test_get_leads_status_filter(sample_leads):
    """Verify status query parameter filters leads correctly."""
    response = client.get("/leads?status=Contacted")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["leads"]) == 1
    assert data["leads"][0]["lead_id"] == "LEAD-102"
    assert data["leads"][0]["status"] == "Contacted"


def test_get_leads_invalid_status_filter():
    """Verify invalid status filter returns 400 Bad Request."""
    response = client.get("/leads?status=InvalidStatus")
    assert response.status_code == 400
    assert "Invalid status filter" in response.json()["detail"]


@pytest.mark.parametrize(
    "search_term,expected_ids",
    [
        ("LEAD-101", ["LEAD-101"]),
        ("tata", ["LEAD-101"]),
        ("radiator", ["LEAD-104"]),
        ("discount", ["LEAD-103"]),
        ("fleet owner", ["LEAD-101", "LEAD-104"]),
        ("nonexistent", []),
    ],
)
def test_get_leads_search(sample_leads, search_term, expected_ids):
    """Verify search across lead_id, source, customer_type, vehicle, part_needed, and message."""
    response = client.get(f"/leads?search={search_term}")
    assert response.status_code == 200
    data = response.json()
    retrieved_ids = [lead["lead_id"] for lead in data["leads"]]
    assert retrieved_ids == expected_ids
    assert data["total"] == len(expected_ids)


def test_get_lead_by_id_success(sample_leads):
    """Verify GET /leads/{id} returns the complete lead response."""
    lead_id = sample_leads[0].id
    response = client.get(f"/leads/{lead_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == lead_id
    assert data["lead_id"] == "LEAD-101"
    assert data["source"] == "Website Form"
    assert data["customer_type"] == "Fleet Owner"
    assert data["vehicle"] == "Tata Ace"
    assert data["part_needed"] == "Brake Pads"
    assert data["estimated_order_value_inr"] == 15000
    assert data["message"] == "Urgent brake pads needed for 10 delivery vans."
    assert data["predicted_priority"] == "High"
    assert data["confidence"] == 0.91
    assert data["override_priority"] is None
    assert data["effective_priority"] == "High"
    assert data["status"] == "New"
    assert "created_at" in data
    assert "updated_at" in data


def test_get_lead_by_id_not_found():
    """Verify GET /leads/{id} returns 404 when lead does not exist."""
    response = client.get("/leads/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Lead with id 999999 not found"


def test_patch_lead_status_only(sample_leads):
    """Verify updating only status via PATCH /leads/{id}."""
    lead_id = sample_leads[0].id
    response = client.patch(f"/leads/{lead_id}", json={"status": "Contacted"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Contacted"
    assert data["predicted_priority"] == "High"
    assert data["override_priority"] is None
    assert data["effective_priority"] == "High"


def test_patch_lead_override_priority_only(sample_leads):
    """Verify updating override_priority changes effective_priority dynamically without altering predicted_priority."""
    lead_id = sample_leads[0].id  # Initially High predicted, None override
    response = client.patch(f"/leads/{lead_id}", json={"override_priority": "Low"})
    assert response.status_code == 200
    data = response.json()
    assert data["override_priority"] == "Low"
    assert data["effective_priority"] == "Low"
    assert data["predicted_priority"] == "High", "predicted_priority was mutated!"
    assert data["confidence"] == 0.91, "confidence was mutated!"


def test_patch_lead_both_fields(sample_leads):
    """Verify updating both status and override_priority together."""
    lead_id = sample_leads[0].id
    response = client.patch(
        f"/leads/{lead_id}",
        json={"status": "Qualified", "override_priority": "Medium"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Qualified"
    assert data["override_priority"] == "Medium"
    assert data["effective_priority"] == "Medium"
    assert data["predicted_priority"] == "High"


def test_patch_lead_clear_override_with_null(sample_leads):
    """Verify setting override_priority to null restores effective_priority to the AI prediction."""
    lead_id = sample_leads[1].id  # Initially Medium predicted, High override
    assert sample_leads[1].effective_priority == "High"

    response = client.patch(f"/leads/{lead_id}", json={"override_priority": None})
    assert response.status_code == 200
    data = response.json()
    assert data["override_priority"] is None
    assert data["predicted_priority"] == "Medium"
    assert data["effective_priority"] == "Medium"  # Restored to AI prediction!


def test_patch_lead_not_found():
    """Verify PATCH /leads/{id} returns 404 for a non-existent lead ID."""
    response = client.patch("/leads/999999", json={"status": "Contacted"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Lead with id 999999 not found"


def test_patch_lead_reject_empty_payload(sample_leads):
    """Verify PATCH /leads/{id} rejects an empty payload."""
    lead_id = sample_leads[0].id
    response = client.patch(f"/leads/{lead_id}", json={})
    assert response.status_code == 422


def test_patch_lead_reject_invalid_status(sample_leads):
    """Verify PATCH /leads/{id} rejects invalid status values."""
    lead_id = sample_leads[0].id
    response = client.patch(f"/leads/{lead_id}", json={"status": "Archived"})
    assert response.status_code == 422


def test_patch_lead_reject_null_status(sample_leads):
    """Verify PATCH /leads/{id} rejects null status."""
    lead_id = sample_leads[0].id
    response = client.patch(f"/leads/{lead_id}", json={"status": None})
    assert response.status_code == 422


def test_patch_lead_reject_invalid_override_priority(sample_leads):
    """Verify PATCH /leads/{id} rejects invalid priority values."""
    lead_id = sample_leads[0].id
    response = client.patch(f"/leads/{lead_id}", json={"override_priority": "Critical"})
    assert response.status_code == 422


def test_patch_lead_reject_forbidden_fields(sample_leads):
    """Verify PATCH /leads/{id} rejects unauthorized field modifications."""
    lead_id = sample_leads[0].id
    response = client.patch(
        f"/leads/{lead_id}",
        json={"predicted_priority": "Low", "confidence": 0.1},
    )
    assert response.status_code == 422


def test_metrics_empty_database():
    """Verify GET /metrics returns zero counts when database has no leads."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_leads"] == 0
    assert data["status_counts"] == {
        "New": 0,
        "Contacted": 0,
        "Qualified": 0,
        "Closed": 0,
    }
    assert data["predicted_priority_counts"] == {
        "High": 0,
        "Medium": 0,
        "Low": 0,
    }


def test_metrics_with_leads(sample_leads):
    """Verify GET /metrics calculates correct aggregations based on predicted_priority."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_leads"] == 4
    assert data["status_counts"] == {
        "New": 1,
        "Contacted": 1,
        "Qualified": 1,
        "Closed": 1,
    }
    # Note: Sample leads has: High (101), Medium (102, overridden to High), Low (103), High (104).
    # Breakdown must use predicted_priority: High: 2, Medium: 1, Low: 1
    assert data["predicted_priority_counts"] == {
        "High": 2,
        "Medium": 1,
        "Low": 1,
    }


def test_get_leads_sort_newest(sample_leads):
    """Verify sort=newest returns leads sorted by created_at descending."""
    response = client.get("/leads?sort=newest")
    assert response.status_code == 200
    data = response.json()
    assert len(data["leads"]) == 4
    # With sample_leads inserted sequentially, the newest lead is LEAD-104
    assert data["leads"][0]["lead_id"] == "LEAD-104"
    assert data["leads"][-1]["lead_id"] == "LEAD-101"


def test_get_leads_sort_oldest(sample_leads):
    """Verify sort=oldest returns leads sorted by created_at ascending."""
    response = client.get("/leads?sort=oldest")
    assert response.status_code == 200
    data = response.json()
    assert len(data["leads"]) == 4
    assert data["leads"][0]["lead_id"] == "LEAD-101"
    assert data["leads"][-1]["lead_id"] == "LEAD-104"


def test_get_leads_invalid_sort():
    """Verify invalid sort parameter returns HTTP 400 Bad Request."""
    response = client.get("/leads?sort=random_sort")
    assert response.status_code == 400
    assert "Invalid sort parameter" in response.json()["detail"]


def test_lead_timestamps_server_generated(db_session):
    """Verify created_at is server-generated and client attempts to pass created_at are forbidden."""
    payload = {
        "lead_id": "LEAD-TS-CHECK",
        "source": "Website",
        "customer_type": "Fleet",
        "vehicle": "Tata Ace",
        "part_needed": "Brakes",
        "estimated_order_value_inr": 12000,
        "message": "Urgent parts delivery needed for fleet maintenance.",
    }
    create_res = client.post("/leads", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert "created_at" in created_data
    assert created_data["created_at"] is not None

    # Client cannot inject custom created_at via POST
    malicious_payload = {
        **payload,
        "lead_id": "LEAD-TS-MALICIOUS",
        "created_at": "2020-01-01T00:00:00Z",
    }
    bad_post_res = client.post("/leads", json=malicious_payload)
    assert bad_post_res.status_code == 422

    # Client cannot patch created_at via PATCH
    bad_patch_res = client.patch(
        f"/leads/{created_data['id']}",
        json={"created_at": "2020-01-01T00:00:00Z"},
    )
    assert bad_patch_res.status_code == 422
