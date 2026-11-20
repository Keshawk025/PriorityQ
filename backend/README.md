# AI Lead Prioritization Mini CRM — Backend

Production-style modular FastAPI backend for AI-powered lead scoring, qualification, and CRM workflow management.

---

## 1. Project Overview

The AI Lead Prioritization CRM backend is designed to receive sales leads, process order values and messages, generate AI-based priority predictions (with confidence scores), and allow sales representatives to override priorities while preserving auditability and machine learning integrity.

### Core Technology Stack
- **Language**: Python 3.10+
- **Web Framework**: FastAPI (high-performance asynchronous API framework)
- **Database**: SQLite (local persistence) with SQLAlchemy ORM 2.0+
- **Validation**: Pydantic v2
- **Machine Learning**: Scikit-learn, Pandas, NumPy
- **Server**: Uvicorn ASGI server

---

## 2. Directory Structure

```text
backend/
├── app/
│   ├── __init__.py           # Application package marker
│   ├── main.py               # FastAPI application factory, CORS, and core endpoints
│   ├── database.py           # SQLite engine, session factory, Base declarative, and DB dependency
│   ├── models/               # SQLAlchemy ORM database models
│   │   └── __init__.py
│   ├── schemas/              # Pydantic schemas for request/response serialization
│   │   └── __init__.py
│   ├── routes/               # FastAPI route controllers grouped by domain
│   │   └── __init__.py
│   └── services/             # Business logic layer and ML inference services
│       └── __init__.py
├── ml_models/                # Storage directory for trained serialized ML models (.joblib/.pkl)
├── tests/                    # Pytest test suite
│   ├── __init__.py
│   └── test_health.py        # Automated test for GET /health endpoint
├── requirements.txt          # Pinned/compatible dependency specification
├── .env.example              # Template environment variables
└── README.md                 # Project documentation and developer guide
```

---

## 3. Architecture & Separation of Concerns

The backend follows clean layered architecture principles:

1. **Routing Layer (`app/routes/`)**: Exposes RESTful HTTP endpoints, parses incoming HTTP parameters, and returns response models.
2. **Schema Layer (`app/schemas/`)**: Pydantic schemas defining strict data contracts, validation rules, and Swagger documentation models.
3. **Service Layer (`app/services/`)**: Business logic isolation. Handles priority calculations, dynamic override resolution, and invokes ML inference without coupling to HTTP or database protocols.
4. **Data Persistence Layer (`app/models/` & `app/database.py`)**: SQLAlchemy ORM definitions and SQLite session lifecycle management via `get_db` generator dependency.
5. **Machine Learning Layer (`ml_models/`)**: Stores trained classification pipelines loaded by the service layer.

---

## 4. Setup & Installation

### Step 1: Create a Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS
# venv\Scripts\activate   # On Windows
```

### Step 2: Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```
Inspect `.env` and adjust `DATABASE_URL` or `CORS_ORIGINS` if necessary.

---

## 5. Running the Application

Start the development server with hot-reload enabled:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 6. Testing

Execute the test suite using `pytest`:

```bash
PYTHONPATH=. pytest tests/ -v
```

The test suite contains **109 automated tests** verifying:
- Model inference, confidence scores, and priority classification
- SQLite database integrity and unique constraints
- Server-generated timestamps (`created_at`, `updated_at`)
- Human-in-the-loop priority override logic and clearing
- Priority ranking and sorting (`priority_desc` High $\to$ Medium $\to$ Low, `priority_asc` Low $\to$ Medium $\to$ High)
- CSV batch import, delimiter sniffing (`,`, `;`, `\t`, `|`), header normalization, and error isolation
- Pipeline metrics and lifecycle conversion calculations
- Database pipeline clearing (`DELETE /leads`)

---

## 7. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint returning service status. |
| `POST` | `/leads` | Ingest a new lead, execute ML scoring, and commit to DB. |
| `GET` | `/leads` | Query leads with pagination, search, status filtering, and sorting (`newest`, `oldest`, `priority_desc`, `priority_asc`). |
| `GET` | `/leads/{id}` | Retrieve a specific lead by its integer ID. |
| `PATCH` | `/leads/{id}` | Update lead status (`New`, `Contacted`, `Qualified`, `Closed`) or override priority (`High`, `Medium`, `Low`, or `null`). |
| `DELETE` | `/leads` | Clear all leads from the active database pipeline. |
| `POST` | `/leads/import` | Upload CSV for batch ingestion with auto-delimiter sniffing and header alias mapping. |
| `GET` | `/metrics` | Real-time pipeline aggregations and priority distribution breakdown. |
