"""API routes package.

Exposes domain routers for FastAPI application registration.
"""

from app.routes.leads import router as leads_router
from app.routes.metrics import router as metrics_router

__all__ = ["leads_router", "metrics_router"]
