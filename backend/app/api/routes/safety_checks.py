from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.schemas.safety_report import SafetyCheckRequest, SafetyReportResponse
from backend.app.services.safety_check_service import safety_check_service

router = APIRouter(prefix="/safety-checks", tags=["Safety Checker"])


@router.post("", response_model=SafetyReportResponse)
def run_safety_check(
    payload: SafetyCheckRequest,
    db: Session = Depends(get_db),
):
    """
    Step 8 & 9: Deterministic multi-medicine safety evaluation.
    Only verified medicines enter this pipeline.
    Cross-references CDSCO and WHO interaction matrices, sums duplicate salt doses,
    and returns a structured clinical report.
    """
    if len(payload.medicines) == 0:
        raise HTTPException(status_code=400, detail="At least one verified medicine must be submitted.")

    return safety_check_service.execute_safety_check(db, payload)
