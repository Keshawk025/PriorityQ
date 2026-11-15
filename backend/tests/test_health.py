"""Health check endpoint test suite."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_status_code():
    """Verify that GET /health returns HTTP 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_check_payload():
    """Verify that GET /health returns valid service metadata."""
    response = client.get("/health")
    data = response.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "AI Lead Prioritization CRM Backend"
    assert data.get("version") == "1.0.0"
