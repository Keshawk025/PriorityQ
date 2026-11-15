"""FastAPI Application Entrypoint.

Initializes the FastAPI application, CORS middleware, startup lifecycle,
and core endpoints.
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict, List
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import leads_router, metrics_router

# Load environment configuration from .env if present
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager.
    
    Handles startup events (database table creation) and shutdown cleanup.
    """
    init_db()
    yield


# Initialize FastAPI application with OpenAPI metadata and lifespan handler
app = FastAPI(
    title="AI Lead Prioritization CRM Backend",
    description="Backend API for AI-Powered Lead Prioritization Mini CRM",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS origins for React frontend integration
default_origins: List[str] = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    env_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    origins: List[str] = list(dict.fromkeys(default_origins + env_origins))
else:
    origins: List[str] = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app"),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include domain routers
app.include_router(leads_router)
app.include_router(metrics_router)


@app.get("/health", tags=["Health"], summary="Health check endpoint")
async def health_check() -> Dict[str, str]:
    """Basic health-check endpoint to verify backend service operational status.
    
    Returns:
        Dict[str, str]: Service status, name, and version.
    """
    return {
        "status": "healthy",
        "service": "AI Lead Prioritization CRM Backend",
        "version": "1.0.0",
    }
