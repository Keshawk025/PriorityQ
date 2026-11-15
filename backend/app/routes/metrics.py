"""FastAPI route handlers for CRM operational metrics.

Exposes endpoints for lead counts, lifecycle status breakdown, and AI predicted
priority distribution.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.lead import MetricsResponse
from app.services.lead_service import get_metrics

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("", response_model=MetricsResponse, summary="Retrieve CRM lead aggregation metrics")
def get_crm_metrics(db: Session = Depends(get_db)) -> MetricsResponse:
    """Retrieve total leads count, lifecycle status counts, and AI predicted priority breakdown.
    
    Category counts with 0 leads are always returned with value 0.
    """
    return get_metrics(db=db)
