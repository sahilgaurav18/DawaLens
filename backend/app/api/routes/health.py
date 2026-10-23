from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.schemas.common import HealthCheckResponse
from backend.app.services.gemma_service import gemma_service
from backend.app.models.safety_rule import DrugInteractionRule

router = APIRouter(tags=["Health & Status"])


@router.get("/health", response_model=HealthCheckResponse)
def get_health_status(db: Session = Depends(get_db)):
    """Health check endpoint evaluating DB connection, active clinical rules, and AI vision status."""
    db_status = "ONLINE"
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"DATABASE_ERROR: {str(exc)}"

    ai_status = gemma_service.get_service_status()
    ai_label = f"{ai_status.get('provider')}: {ai_status.get('status')}"

    rules_count = db.query(DrugInteractionRule).filter_by(is_active=True).count()

    return HealthCheckResponse(
        status="HEALTHY" if db_status == "ONLINE" else "DEGRADED",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        database_status=db_status,
        gemma_service_status=ai_label,
        active_rules_count=rules_count,
        rule_version=settings.CLINICAL_RULE_VERSION,
    )
