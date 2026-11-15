"""Pydantic schemas for Lead request and response validation.

Defines data contracts for lead creation, retrieval, pagination, status and priority updates,
aggregation metrics, and CSV bulk import validation results.
"""

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class LeadCreate(BaseModel):
    """Schema for individual sales lead creation.
    
    Clients may only supply core business fields. AI scoring and workflow
    status are strictly initialized server-side. Extra fields are forbidden.
    """

    lead_id: str = Field(..., min_length=1, description="Unique business lead identifier")
    source: str = Field(..., min_length=1, description="Lead acquisition channel")
    customer_type: str = Field(..., min_length=1, description="Customer classification")
    vehicle: str = Field(..., min_length=1, description="Vehicle make/model")
    part_needed: str = Field(..., min_length=1, description="Requested replacement part")
    estimated_order_value_inr: int = Field(..., ge=0, description="Estimated order value in INR (non-negative)")
    message: str = Field(..., min_length=1, description="Customer inquiry or problem description")

    model_config = ConfigDict(extra="forbid")

    @field_validator("lead_id", "source", "customer_type", "vehicle", "part_needed", "message")
    @classmethod
    def validate_non_whitespace(cls, value: str, info) -> str:
        """Ensure string fields contain non-whitespace text."""
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' cannot be empty or whitespace only")
        return stripped


class LeadResponse(BaseModel):
    """Schema representing a single lead response."""

    id: int
    lead_id: str
    source: str
    customer_type: str
    vehicle: str
    part_needed: str
    estimated_order_value_inr: int
    message: str
    predicted_priority: str
    confidence: float
    override_priority: Optional[str] = None
    effective_priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadUpdate(BaseModel):
    """Schema for updating a lead's status and/or priority override.
    
    Only status and override_priority can be updated. Any other fields are forbidden.
    Empty payloads are rejected.
    """

    status: Optional[str] = None
    override_priority: Optional[str] = None

    model_config = ConfigDict(extra="forbid")

    @model_validator(mode="after")
    def validate_update_payload(self) -> "LeadUpdate":
        """Validate that at least one field is provided and values match allowed domain sets."""
        if not self.model_fields_set:
            raise ValueError("At least one field ('status' or 'override_priority') must be provided for update")

        # Status validation: cannot be null, must be one of allowed lifecycle statuses
        if "status" in self.model_fields_set:
            if self.status is None:
                raise ValueError("status cannot be null")
            allowed_statuses = ("New", "Contacted", "Qualified", "Closed")
            if self.status not in allowed_statuses:
                raise ValueError(
                    f"Invalid status '{self.status}'. Must be one of: {', '.join(allowed_statuses)}"
                )

        # Override priority validation: can be None (to clear override) or one of High, Medium, Low
        if "override_priority" in self.model_fields_set and self.override_priority is not None:
            allowed_priorities = ("High", "Medium", "Low")
            if self.override_priority not in allowed_priorities:
                raise ValueError(
                    f"Invalid override_priority '{self.override_priority}'. "
                    f"Must be one of: {', '.join(allowed_priorities)}, or null"
                )

        return self


class LeadListResponse(BaseModel):
    """Paginated list response containing leads and pagination metadata."""

    total: int
    skip: int
    limit: int
    leads: List[LeadResponse]


class MetricsResponse(BaseModel):
    """System aggregation metrics for leads, statuses, and AI predicted priorities."""

    total_leads: int
    status_counts: Dict[str, int]
    predicted_priority_counts: Dict[str, int]


class RejectedRow(BaseModel):
    """Details for a single CSV row rejected during import validation."""

    row_number: int
    lead_id: Optional[str] = None
    reason: str


class CSVImportResponse(BaseModel):
    """Summary response for CSV bulk lead import."""

    total_rows: int
    imported_count: int
    rejected_count: int
    imported_lead_ids: List[str]
    rejected_rows: List[RejectedRow]
