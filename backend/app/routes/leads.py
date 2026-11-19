"""FastAPI route handlers for sales leads management.

Exposes endpoints for listing leads with search/filters, creating single leads,
importing leads via CSV, retrieving individual leads, and patching status or human priority overrides.
"""

from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.lead import (
    CSVImportResponse,
    LeadCreate,
    LeadListResponse,
    LeadResponse,
    LeadUpdate,
)
from app.services.import_service import CSVValidationError, process_lead_import
from app.services.lead_service import (
    ALLOWED_SORTS,
    ALLOWED_STATUSES,
    DuplicateLeadError,
    clear_all_leads,
    create_lead,
    delete_lead,
    get_lead_by_id,
    get_leads,
    update_lead,
)
from app.services.ml_service import MLModelUnavailableError

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("", response_model=LeadListResponse, summary="List leads with search and pagination")
def list_leads(
    skip: int = Query(0, ge=0, description="Number of items to skip for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of items to return"),
    search: Optional[str] = Query(
        None,
        description="Search term matching lead_id, source, customer_type, vehicle, part_needed, or message",
    ),
    status_filter: Optional[str] = Query(
        None,
        alias="status",
        description="Filter leads by lifecycle status (New, Contacted, Qualified, Closed)",
    ),
    sort: Optional[str] = Query(
        None,
        description="Sort order by creation timestamp: 'newest' (descending) or 'oldest' (ascending)",
    ),
    db: Session = Depends(get_db),
) -> LeadListResponse:
    """Retrieve leads from the database supporting free-text search, status filtering, sorting, and pagination."""
    if status_filter is not None and status_filter not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status filter '{status_filter}'. Allowed values: {', '.join(ALLOWED_STATUSES)}",
        )

    if sort is not None and sort not in ALLOWED_SORTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid sort parameter '{sort}'. Allowed values: {', '.join(ALLOWED_SORTS)}",
        )

    leads, total = get_leads(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        status=status_filter,
        sort=sort,
    )

    return LeadListResponse(
        total=total,
        skip=skip,
        limit=limit,
        leads=leads,
    )


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a single lead",
)
def create_single_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
) -> LeadResponse:
    """Create an individual sales lead.
    
    Generates AI priority prediction and confidence score using the customer message,
    initializes status to 'New', and sets override_priority to null.
    """
    try:
        return create_lead(db=db, lead_data=lead_in)
    except DuplicateLeadError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc
    except MLModelUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post(
    "/import",
    response_model=CSVImportResponse,
    status_code=status.HTTP_200_OK,
    summary="Import leads from uploaded CSV file",
)
async def import_leads(
    file: UploadFile = File(..., description="CSV file containing leads to import"),
    db: Session = Depends(get_db),
) -> CSVImportResponse:
    """Upload and import leads from a CSV file.
    
    Validates CSV headers, applies row-level validation, generates AI priority predictions
    via scikit-learn pipeline, and persists valid records with row-level transaction safety.
    """
    file_bytes = await file.read()
    try:
        return process_lead_import(
            file_bytes=file_bytes,
            filename=file.filename,
            db=db,
        )
    except CSVValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except MLModelUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.get("/{id}", response_model=LeadResponse, summary="Retrieve lead by ID")
def get_lead(id: int, db: Session = Depends(get_db)) -> LeadResponse:
    """Retrieve a single lead by its internal database ID."""
    lead = get_lead_by_id(db=db, lead_id=id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {id} not found",
        )
    return lead


@router.patch("/{id}", response_model=LeadResponse, summary="Update lead status or priority override")
def patch_lead(
    id: int,
    lead_update: LeadUpdate,
    db: Session = Depends(get_db),
) -> LeadResponse:
    """Update a lead's qualification status and/or sales representative priority override.
    
    Human-in-the-loop integrity rules:
    - Never mutates original AI predicted_priority or confidence.
    - Setting override_priority to null restores effective_priority to the AI prediction.
    """
    lead = get_lead_by_id(db=db, lead_id=id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {id} not found",
        )

    updated_lead = update_lead(db=db, lead=lead, lead_update=lead_update)
    return updated_lead


@router.delete("", summary="Delete all leads / clear pipeline database")
def delete_all_leads_route(db: Session = Depends(get_db)):
    """Clear all lead records from the database.
    
    Returns:
        dict: Confirmation message and count of deleted records.
    """
    deleted_count = clear_all_leads(db=db)
    return {
        "message": "Database pipeline cleared successfully",
        "deleted_count": deleted_count,
    }


@router.delete("/{id}", summary="Delete lead by ID")
def delete_single_lead_route(id: int, db: Session = Depends(get_db)):
    """Delete a single lead by its internal database ID."""
    lead = get_lead_by_id(db=db, lead_id=id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {id} not found",
        )
    delete_lead(db=db, lead=lead)
    return {"message": f"Lead {id} deleted successfully"}

