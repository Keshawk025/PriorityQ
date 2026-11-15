"""SQLAlchemy database model for sales leads.

Defines the Lead entity, persistence schema, constraints, and dynamic
effective priority resolution for the AI-Powered Lead Prioritization CRM.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Lead(Base):
    """Sales lead database model.
    
    Stores incoming lead data, AI-predicted priority, confidence scoring,
    and optional sales agent priority overrides while preserving original predictions.
    """

    __tablename__ = "leads"

    __table_args__ = (
        CheckConstraint(
            "predicted_priority IN ('High', 'Medium', 'Low')",
            name="ck_lead_predicted_priority",
        ),
        CheckConstraint(
            "override_priority IS NULL OR override_priority IN ('High', 'Medium', 'Low')",
            name="ck_lead_override_priority",
        ),
        CheckConstraint(
            "status IN ('New', 'Contacted', 'Qualified', 'Closed')",
            name="ck_lead_status",
        ),
        CheckConstraint(
            "confidence >= 0.0 AND confidence <= 1.0",
            name="ck_lead_confidence_range",
        ),
    )

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Lead identifier (unique business key)
    lead_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    # Lead origin and customer details
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    customer_type: Mapped[str] = mapped_column(String(50), nullable=False)
    vehicle: Mapped[str] = mapped_column(String(100), nullable=False)
    part_needed: Mapped[str] = mapped_column(String(150), nullable=False)
    estimated_order_value_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    # AI Prioritization fields
    predicted_priority: Mapped[str] = mapped_column(String(20), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)

    # Human agent override (nullable)
    override_priority: Mapped[Optional[str]] = mapped_column(
        String(20), nullable=True, default=None
    )

    # Lead qualification lifecycle status
    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="New", server_default="New"
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    @property
    def effective_priority(self) -> str:
        """Dynamically resolve the operational priority of the lead.
        
        If a human representative has provided an override_priority, that
        value is returned. Otherwise, it falls back to the AI predicted_priority.
        This property is computed on the fly and never modifies predicted_priority.
        
        Returns:
            str: 'High', 'Medium', or 'Low'
        """
        if self.override_priority is not None:
            return self.override_priority
        return self.predicted_priority

    def __repr__(self) -> str:
        return (
            f"<Lead(id={self.id}, lead_id='{self.lead_id}', "
            f"effective_priority='{self.effective_priority}', status='{self.status}')>"
        )
