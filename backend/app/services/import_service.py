"""CSV Lead Import Service.

Handles CSV parsing, file-level schema validation, row-level domain validation,
ML priority inference, transaction safety, and persistent storage.
"""

import csv
from datetime import datetime, timezone
import io
import re
from typing import List, Optional, Set
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.lead import CSVImportResponse, RejectedRow
from app.services.ml_service import (
    MLModelUnavailableError,
    load_lead_model,
    predict_lead_priority,
)

REQUIRED_COLUMNS = [
    "lead_id",
    "source",
    "customer_type",
    "vehicle",
    "part_needed",
    "estimated_order_value_inr",
    "message",
]

# Comprehensive alias mapping for real-world CSV exports (Google Sheets, Excel, ERPs, CRM dumps)
COLUMN_ALIASES = {
    # lead_id
    "lead_id": "lead_id",
    "leadid": "lead_id",
    "lead_no": "lead_id",
    "leadno": "lead_id",
    "lead_number": "lead_id",
    "id": "lead_id",
    "lead": "lead_id",
    "inquiry_id": "lead_id",
    "inquiryid": "lead_id",
    "inquiry_no": "lead_id",

    # source
    "source": "source",
    "source_channel": "source",
    "sourcechannel": "source",
    "channel": "source",
    "origin": "source",
    "inbound_source": "source",
    "lead_source": "source",

    # customer_type
    "customer_type": "customer_type",
    "customertype": "customer_type",
    "customer": "customer_type",
    "client_type": "customer_type",
    "type": "customer_type",
    "customer_category": "customer_type",
    "buyer_type": "customer_type",

    # vehicle
    "vehicle": "vehicle",
    "vehicle_model": "vehicle",
    "vehiclemodel": "vehicle",
    "model": "vehicle",
    "vehicle_name": "vehicle",
    "car": "vehicle",
    "truck": "vehicle",
    "commercial_vehicle": "vehicle",

    # part_needed
    "part_needed": "part_needed",
    "partneeded": "part_needed",
    "part": "part_needed",
    "part_name": "part_needed",
    "partname": "part_needed",
    "item": "part_needed",
    "item_name": "part_needed",
    "required_part": "part_needed",
    "spare_part": "part_needed",
    "part_description": "part_needed",
    "parts": "part_needed",

    # estimated_order_value_inr
    "estimated_order_value_inr": "estimated_order_value_inr",
    "estimated_order_value": "estimated_order_value_inr",
    "estimatedordervalue": "estimated_order_value_inr",
    "order_value": "estimated_order_value_inr",
    "order_value_inr": "estimated_order_value_inr",
    "ordervalue": "estimated_order_value_inr",
    "value": "estimated_order_value_inr",
    "amount": "estimated_order_value_inr",
    "order_amount": "estimated_order_value_inr",
    "price": "estimated_order_value_inr",
    "estimated_value": "estimated_order_value_inr",
    "eov": "estimated_order_value_inr",

    # message
    "message": "message",
    "customer_message": "message",
    "customermessage": "message",
    "problem": "message",
    "problem_statement": "message",
    "problemstatement": "message",
    "issue": "message",
    "inquiry": "message",
    "description": "message",
    "notes": "message",
    "comment": "message",
    "comments": "message",
    "query": "message",
}


def normalize_column_header(header: str) -> str:
    """Normalize column header: lowercase, strip quotes/whitespace/punctuation."""
    if not header:
        return ""
    h = header.lower().strip().strip('"').strip("'")
    h = h.replace(" ", "_").replace("-", "_").replace(".", "_")
    while "__" in h:
        h = h.replace("__", "_")
    return h


class CSVValidationError(ValueError):
    """Raised for file-level CSV validation failures (e.g., missing columns, empty files)."""
    pass


def parse_and_validate_csv_file(file_bytes: bytes, filename: Optional[str] = None) -> csv.DictReader:
    """Validate CSV file structure, encoding, and required column headers.
    
    Args:
        file_bytes: Raw bytes of uploaded file.
        filename: Optional uploaded file name.
        
    Returns:
        csv.DictReader: Configured reader ready for row iteration.
        
    Raises:
        CSVValidationError: If file type, content, encoding, or required headers are invalid.
    """
    # 1. File extension validation
    if filename and not filename.lower().endswith(".csv"):
        raise CSVValidationError("Uploaded file must be a CSV file (.csv).")

    # 2. Empty file validation
    if not file_bytes or not file_bytes.strip():
        raise CSVValidationError("Uploaded CSV file is empty.")

    # 3. Decoding: try common encodings including Excel Windows/Mac variants
    text_content: Optional[str] = None
    for encoding in ("utf-8-sig", "utf-8", "latin-1", "cp1252", "iso-8859-1", "utf-16"):
        try:
            text_content = file_bytes.decode(encoding)
            break
        except (UnicodeDecodeError, LookupError):
            continue

    if text_content is None or "\x00" in text_content:
        raise CSVValidationError("Malformed CSV file. Unable to parse text content.")

    # 4. Delimiter detection (supports comma, semicolon, tab, pipe)
    delimiter = ","
    try:
        sample_snippet = text_content[:4096]
        dialect = csv.Sniffer().sniff(sample_snippet, delimiters=[",", ";", "\t", "|"])
        delimiter = dialect.delimiter
    except Exception:
        first_line = text_content.splitlines()[0] if text_content.splitlines() else ""
        if ";" in first_line and first_line.count(";") > first_line.count(","):
            delimiter = ";"
        elif "\t" in first_line and first_line.count("\t") > first_line.count(","):
            delimiter = "\t"

    # Parse CSV headers
    try:
        reader = csv.DictReader(io.StringIO(text_content), delimiter=delimiter)
    except Exception as exc:
        raise CSVValidationError(f"Malformed CSV content: {str(exc)}") from exc

    if not reader.fieldnames:
        raise CSVValidationError("Uploaded CSV file is empty or has no header.")

    # Strip column names
    clean_fieldnames = [col.strip() for col in reader.fieldnames if col is not None]

    # Map column aliases to canonical names using comprehensive alias lookup
    header_map = {}
    for col in clean_fieldnames:
        norm = normalize_column_header(col)
        canonical = COLUMN_ALIASES.get(norm, col)
        header_map[col] = canonical

    # 5. Check required columns against mapped headers
    effective_columns = set(header_map.values())
    missing_columns = [col for col in REQUIRED_COLUMNS if col not in effective_columns]
    if missing_columns:
        raise CSVValidationError(
            f"Missing required CSV column(s): {', '.join(missing_columns)}. "
            f"Required columns are: {', '.join(REQUIRED_COLUMNS)}"
        )

    # Attach header_map to reader for row iteration
    reader.header_map = header_map
    return reader


def process_lead_import(
    file_bytes: bytes,
    filename: Optional[str],
    db: Session,
    model=None,
) -> CSVImportResponse:
    """Import leads from CSV with row-level validation and ML inference.
    
    Transaction strategy:
    - Row-level acceptance: Each valid row is flushed via an individual transaction savepoint.
    - If a row fails validation, it is recorded in rejected_rows and does not block valid rows.
    - If all valid rows succeed, db.commit() persists them atomically.
    
    Args:
        file_bytes: Raw CSV upload bytes.
        filename: Uploaded file name.
        db: Active SQLAlchemy database session.
        model: Optional pre-loaded scikit-learn model pipeline (loads default if None).
        
    Returns:
        CSVImportResponse: Structured summary of imported and rejected leads.
        
    Raises:
        CSVValidationError: On file-level format or header errors.
        MLModelUnavailableError: If ML model artifact is missing.
    """
    # Parse and validate file headers
    reader = parse_and_validate_csv_file(file_bytes=file_bytes, filename=filename)

    # Load ML model if not explicitly injected
    if model is None:
        model = load_lead_model()

    # Track seen IDs to catch duplicates within the file and against the DB
    seen_file_lead_ids: Set[str] = set()
    existing_db_lead_ids: Set[str] = set(
        r[0] for r in db.query(Lead.lead_id).all()
    )

    imported_lead_ids: List[str] = []
    rejected_rows: List[RejectedRow] = []
    import_time = datetime.now(timezone.utc)

    # Iterate through data rows (Row 1 is header, data starts at Row 2)
    header_map = getattr(reader, "header_map", {})
    for row_idx, raw_row in enumerate(reader, start=2):
        # Clean whitespace from all row values and apply header aliases
        row = {}
        for k, v in raw_row.items():
            if k is not None:
                cleaned_k = k.strip()
                canonical_k = header_map.get(cleaned_k, cleaned_k)
                row[canonical_k] = v.strip() if v is not None else ""

        # 1. Validate required fields are not empty
        missing_fields = [
            col for col in REQUIRED_COLUMNS
            if col not in row or not row[col]
        ]
        if missing_fields:
            lead_id_val = row.get("lead_id") or None
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id_val,
                    reason=f"Missing or empty required field(s): {', '.join(missing_fields)}",
                )
            )
            continue

        lead_id = row["lead_id"]
        source = row["source"]
        customer_type = row["customer_type"]
        vehicle = row["vehicle"]
        part_needed = row["part_needed"]
        order_val_str = row["estimated_order_value_inr"]
        message = row["message"]

        # 2. Validate estimated_order_value_inr (handles currency signs, commas, decimals gracefully)
        try:
            val_trimmed = order_val_str.strip()
            if val_trimmed.startswith("-"):
                raise ValueError("Negative value")
            num_match = re.search(r"\b\d+(\.\d+)?\b", val_trimmed.replace(",", ""))
            if not num_match:
                raise ValueError("No numeric digits")
            order_val = int(float(num_match.group(0)))
            if order_val < 0:
                raise ValueError("Negative value")
        except (ValueError, TypeError):
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id,
                    reason="Invalid estimated_order_value_inr: must be a non-negative integer",
                )
            )
            continue

        # 3. Check duplicate lead_id within file
        if lead_id in seen_file_lead_ids:
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id,
                    reason=f"Duplicate lead_id '{lead_id}' found within the uploaded file",
                )
            )
            continue
        seen_file_lead_ids.add(lead_id)

        # 4. Check duplicate lead_id already in database
        if lead_id in existing_db_lead_ids:
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id,
                    reason=f"Duplicate lead_id '{lead_id}' already exists in the database",
                )
            )
            continue

        # 5. Predict priority and compute confidence using ML model on message field
        try:
            predicted_priority, confidence = predict_lead_priority(model, message)
            confidence = round(confidence, 4)
        except Exception as exc:
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id,
                    reason=f"ML inference failure on message field: {str(exc)}",
                )
            )
            continue

        # 6. Instantiate Lead entity and persist with savepoint protection
        new_lead = Lead(
            lead_id=lead_id,
            source=source,
            customer_type=customer_type,
            vehicle=vehicle,
            part_needed=part_needed,
            estimated_order_value_inr=order_val,
            message=message,
            predicted_priority=predicted_priority,
            confidence=confidence,
            override_priority=None,
            status="New",
            created_at=import_time,
            updated_at=import_time,
        )

        try:
            with db.begin_nested():
                db.add(new_lead)
                db.flush()
            imported_lead_ids.append(lead_id)
            existing_db_lead_ids.add(lead_id)
        except IntegrityError as exc:
            rejected_rows.append(
                RejectedRow(
                    row_number=row_idx,
                    lead_id=lead_id,
                    reason=f"Database constraint violation: {str(exc.orig)}",
                )
            )

    # Commit all accepted rows
    if imported_lead_ids:
        db.commit()

    total_rows = len(imported_lead_ids) + len(rejected_rows)

    return CSVImportResponse(
        total_rows=total_rows,
        imported_count=len(imported_lead_ids),
        rejected_count=len(rejected_rows),
        imported_lead_ids=imported_lead_ids,
        rejected_rows=rejected_rows,
    )
