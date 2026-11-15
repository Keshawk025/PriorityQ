"""Machine learning inference service.

Manages loading of the serialized Scikit-learn classification pipeline,
running priority predictions, and computing maximum class confidence scores.
"""

import os
from typing import Optional, Tuple
import joblib

# Base directory pointing to backend/ (three levels up from backend/app/services/ml_service.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "lead_priority_model.pkl")


class MLModelUnavailableError(Exception):
    """Raised when the ML model artifact is missing or cannot be loaded.
    
    Prevents silent fallbacks or fabricated predictions per architectural rules.
    """
    pass


def get_model_path() -> str:
    """Resolve the filesystem path to the lead priority ML model artifact."""
    return os.getenv("ML_MODEL_PATH", DEFAULT_MODEL_PATH)


def load_lead_model(model_path: Optional[str] = None):
    """Load the trained scikit-learn Pipeline from disk.
    
    Args:
        model_path: Optional custom path to model artifact.
        
    Returns:
        Loaded scikit-learn pipeline object.
        
    Raises:
        MLModelUnavailableError: If model file does not exist or fails to deserialize.
    """
    path = model_path or get_model_path()
    if not os.path.isfile(path):
        raise MLModelUnavailableError(
            f"ML model artifact not found at '{path}'. "
            "Please ensure the trained scikit-learn Pipeline is placed at "
            "backend/ml_models/lead_priority_model.pkl before importing leads."
        )

    try:
        model = joblib.load(path)
        return model
    except Exception as exc:
        raise MLModelUnavailableError(
            f"Failed to load ML model artifact from '{path}': {str(exc)}"
        ) from exc


def predict_lead_priority(model, message: str) -> Tuple[str, float]:
    """Predict lead priority and maximum class probability confidence.
    
    Args:
        model: Trained scikit-learn pipeline.
        message: Lead customer inquiry text.
        
    Returns:
        Tuple[str, float]: (predicted_priority, confidence)
    """
    # Prediction on message field
    preds = model.predict([message])
    predicted_priority = str(preds[0])

    # Class probability calculation
    probs = model.predict_proba([message])[0]
    confidence = float(max(probs))

    return predicted_priority, confidence
