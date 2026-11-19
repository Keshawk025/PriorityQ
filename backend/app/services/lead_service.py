"""Business logic service for lead management and metrics.

Encapsulates database querying, filtering, search, pagination, single-lead creation,
status/priority updates, and aggregation metrics calculation.
"""

from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate, MetricsResponse
from app.services.ml_service import (
    MLModelUnavailableError,
    load_lead_model,
    predict_lead_priority,
)

ALLOWED_STATUSES = ("New", "Contacted", "Qualified", "Closed")
ALLOWED_PRIORITIES = ("High", "Medium", "Low")
ALLOWED_SORTS = ("newest", "oldest")


class DuplicateLeadError(Exception):
    """Raised when attempting to create a lead with an existing lead_id."""
    pass


def get_leads(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort: Optional[str] = None,
) -> Tuple[List[Lead], int]:
    """Retrieve leads from the database with optional search, status filtering, sorting, and pagination.
    
    Args:
        db: Active database session.
        skip: Offset for pagination.
        limit: Maximum number of records to return.
        search: Optional search substring matched across multiple lead text fields.
        status: Optional lifecycle status filter.
        sort: Optional sort direction by created_at: 'newest' (descending) or 'oldest' (ascending).
        
    Returns:
        Tuple[List[Lead], int]: Paginated list of Lead entities and total matching count.
    """
    query = db.query(Lead)

    # Status filtering
    if status is not None:
        query = query.filter(Lead.status == status)

    # Free-text multi-column search
    if search is not None and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Lead.lead_id.ilike(term),
                Lead.source.ilike(term),
                Lead.customer_type.ilike(term),
                Lead.vehicle.ilike(term),
                Lead.part_needed.ilike(term),
                Lead.message.ilike(term),
            )
        )

    total = query.count()

    # Sorting support
    if sort == "newest":
        query = query.order_by(Lead.created_at.desc(), Lead.id.desc())
    elif sort == "oldest":
        query = query.order_by(Lead.created_at.asc(), Lead.id.asc())
    else:
        query = query.order_by(Lead.id.asc())

    leads = query.offset(skip).limit(limit).all()

    return leads, total


def get_lead_by_id(db: Session, lead_id: int) -> Optional[Lead]:
    """Retrieve a single lead by its primary key ID.
    
    Args:
        db: Active database session.
        lead_id: Database integer ID.
        
    Returns:
        Optional[Lead]: Found Lead or None.
    """
    return db.query(Lead).filter(Lead.id == lead_id).first()


def create_lead(db: Session, lead_data: LeadCreate, model=None) -> Lead:
    """Create a single lead, generate ML priority prediction and confidence, and persist.
    
    Args:
        db: Active database session.
        lead_data: Validated lead creation payload.
        model: Optional pre-loaded ML pipeline.
        
    Returns:
        Lead: Newly created Lead entity.
        
    Raises:
        DuplicateLeadError: If lead_id already exists in the database.
        MLModelUnavailableError: If ML model artifact is missing.
    """
    # 1. Uniqueness check
    existing = db.query(Lead).filter(Lead.lead_id == lead_data.lead_id).first()
    if existing:
        raise DuplicateLeadError(f"Lead with lead_id '{lead_data.lead_id}' already exists")

    # 2. Load ML model
    if model is None:
        model = load_lead_model()

    # 3. Predict priority and compute confidence from message field
    predicted_priority, confidence = predict_lead_priority(model, lead_data.message)
    confidence = round(confidence, 4)

    # 4. Instantiate Lead entity with server-generated UTC timestamps
    now = datetime.now(timezone.utc)
    new_lead = Lead(
        lead_id=lead_data.lead_id,
        source=lead_data.source,
        customer_type=lead_data.customer_type,
        vehicle=lead_data.vehicle,
        part_needed=lead_data.part_needed,
        estimated_order_value_inr=lead_data.estimated_order_value_inr,
        message=lead_data.message,
        predicted_priority=predicted_priority,
        confidence=confidence,
        override_priority=None,
        status="New",
        created_at=now,
        updated_at=now,
    )

    # 5. Save with integrity error fallback
    try:
        db.add(new_lead)
        db.commit()
        db.refresh(new_lead)
    except IntegrityError as exc:
        db.rollback()
        raise DuplicateLeadError(f"Lead with lead_id '{lead_data.lead_id}' already exists") from exc

    return new_lead


def update_lead(db: Session, lead: Lead, lead_update: LeadUpdate) -> Lead:
    """Update a lead's status and/or override priority while preserving AI predictions.
    
    Critical human-in-the-loop rules:
    - Never modifies predicted_priority.
    - Never modifies confidence.
    - Setting override_priority to None restores the AI-predicted priority.
    
    Args:
        db: Active database session.
        lead: Existing Lead ORM entity.
        lead_update: Validated update payload.
        
    Returns:
        Lead: Updated and refreshed Lead entity.
    """
    update_fields = lead_update.model_fields_set

    if "status" in update_fields and lead_update.status is not None:
        lead.status = lead_update.status

    if "override_priority" in update_fields:
        lead.override_priority = lead_update.override_priority

    db.commit()
    db.refresh(lead)
    return lead


def get_metrics(db: Session) -> MetricsResponse:
    """Calculate system aggregation metrics for leads, statuses, and predicted priorities.
    
    Uses predicted_priority for priority breakdown (preserving original AI distribution).
    Zero counts are returned for categories without leads.
    
    Args:
        db: Active database session.
        
    Returns:
        MetricsResponse: Total count and breakdown by status and predicted priority.
    """
    total_leads = db.query(func.count(Lead.id)).scalar() or 0

    # Initialize zero counts for all predefined categories
    status_counts = {s: 0 for s in ALLOWED_STATUSES}
    predicted_priority_counts = {p: 0 for p in ALLOWED_PRIORITIES}

    # Aggregate status counts
    status_rows = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    for st, count in status_rows:
        if st in status_counts:
            status_counts[st] = count

    # Aggregate predicted priority counts (AI original predictions)
    priority_rows = (
        db.query(Lead.predicted_priority, func.count(Lead.id))
        .group_by(Lead.predicted_priority)
        .all()
    )
    for pr, count in priority_rows:
        if pr in predicted_priority_counts:
            predicted_priority_counts[pr] = count

    return MetricsResponse(
        total_leads=total_leads,
        status_counts=status_counts,
        predicted_priority_counts=predicted_priority_counts,
    )


def clear_all_leads(db: Session) -> int:
    """Delete all leads from the database.
    
    Args:
        db: Active database session.
        
    Returns:
        int: Number of deleted records.
    """
    count = db.query(Lead).delete()
    db.commit()
    return count


def delete_lead(db: Session, lead: Lead) -> None:
    """Delete a single lead entity from the database.
    
    Args:
        db: Active database session.
        lead: Lead ORM entity to delete.
    """
    db.delete(lead)
    db.commit()

