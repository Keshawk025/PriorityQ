"""Pytest fixtures and test configuration.

Configures an isolated temporary SQLite test database to ensure tests never
modify the actual development database (backend/lead_crm.db).
"""

import os
import tempfile
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Direct DATABASE_URL to a temporary directory before app modules load
_temp_dir = tempfile.TemporaryDirectory()
_temp_db_path = os.path.join(_temp_dir.name, "test_lead_crm.db")
os.environ["DATABASE_URL"] = f"sqlite:///{_temp_db_path}"

from app.database import Base, engine, SessionLocal, init_db
from app.models.lead import Lead


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Initialize temporary test database tables for the session and clean up on completion."""
    init_db()
    yield
    Base.metadata.drop_all(bind=engine)
    _temp_dir.cleanup()


@pytest.fixture(scope="function")
def db_session():
    """Provide an isolated database session per test with automatic teardown."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        # Clean up any records inserted during test
        try:
            session.query(Lead).delete()
            session.commit()
        except Exception:
            session.rollback()
        session.close()
