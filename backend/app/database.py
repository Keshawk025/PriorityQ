"""Database configuration and session management.

Configures SQLite database connection and SQLAlchemy ORM session factory
with environment-based configuration and automatic table initialization.
"""

import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

# Load environment configuration from .env if present
load_dotenv()

# Base directory for the backend package
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Resolve database URL
# If DATABASE_URL is unset or uses relative SQLite path (./), resolve relative to backend directory
raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url:
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'lead_crm.db')}"
elif raw_db_url.startswith("sqlite:///./"):
    relative_path = raw_db_url.replace("sqlite:///./", "", 1)
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, relative_path)}"
else:
    DATABASE_URL = raw_db_url

# SQLite-specific connection arguments (disables single-thread restriction for FastAPI concurrency)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=os.getenv("DATABASE_ECHO", "False").lower() in ("true", "1"),
)

# Thread-local database session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


def get_db() -> Generator[Session, None, None]:
    """Dependency provider for database sessions.
    
    Yields:
        Session: An active SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all database tables registered with SQLAlchemy Base metadata.
    
    Ensures models are imported to register with Base.metadata before creating tables.
    """
    import app.models  # noqa: F401 - ensure models are imported and registered
    Base.metadata.create_all(bind=engine)
