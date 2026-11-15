"""SQLAlchemy database models package.

Contains ORM entities defining the persistence layer for SQLite.
Exposes Base declarative class and Lead model.
"""

from app.database import Base
from app.models.lead import Lead

__all__ = ["Base", "Lead"]
