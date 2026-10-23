from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import String, cast
from backend.app.db.session import get_db
from backend.app.models.scan import SafetyReportRecord
from backend.app.schemas.safety_report import SafetyReportResponse

router = APIRouter(prefix="/reports", tags=["Safety Reports & History"])


@router.get("", response_model=List[SafetyReportResponse])
def get_reports_history(
    status: Optional[str] = Query(None, description="Filter by overall status"),
    search: Optional[str] = Query(None, description="Search by medicine name or Report ID"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Retrieves saved clinical safety evaluation reports with status filtering and medicine search."""
    query = db.query(SafetyReportRecord)

    if status:
        query = query.filter(SafetyReportRecord.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (SafetyReportRecord.id.ilike(search_term))
            | (cast(SafetyReportRecord.medicine_names, String).ilike(search_term))
        )

    records = query.order_by(SafetyReportRecord.created_at.desc()).limit(limit).all()

    response_list: List[SafetyReportResponse] = []
    for r in records:
        response_list.append(
            SafetyReportResponse(
                report_id=r.id,
                checked_at=r.created_at.strftime("%Y-%m-%d %H:%M UTC") if r.created_at else "",
                medicines_checked=r.medicine_names or [],
                verification_status=r.verification_status or "verified",
                overall_status=r.status,
                findings=r.findings or [],
                duplicate_ingredient_findings=r.duplicate_ingredient_findings or [],
                interaction_findings=r.interaction_findings or [],
                evidence_sources=r.evidence_sources or [],
                rule_versions=r.rule_versions or ["CDSCO-2026.4.1"],
                checks_completed=r.checks_completed or [],
                checks_failed_or_unavailable=r.checks_failed_or_unavailable or [],
                limitations=r.limitations or [],
                recommended_next_steps=r.recommended_next_steps or [],
                patient_notes=r.patient_notes,
            )
        )

    return response_list


@router.get("/{report_id}", response_model=SafetyReportResponse)
def get_report_by_id(report_id: str, db: Session = Depends(get_db)):
    """Retrieves full clinical safety report by unique report identifier."""
    r = db.query(SafetyReportRecord).filter_by(id=report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Safety report not found.")

    return SafetyReportResponse(
        report_id=r.id,
        checked_at=r.created_at.strftime("%Y-%m-%d %H:%M UTC") if r.created_at else "",
        medicines_checked=r.medicine_names or [],
        verification_status=r.verification_status or "verified",
        overall_status=r.status,
        findings=r.findings or [],
        duplicate_ingredient_findings=r.duplicate_ingredient_findings or [],
        interaction_findings=r.interaction_findings or [],
        evidence_sources=r.evidence_sources or [],
        rule_versions=r.rule_versions or ["CDSCO-2026.4.1"],
        checks_completed=r.checks_completed or [],
        checks_failed_or_unavailable=r.checks_failed_or_unavailable or [],
        limitations=r.limitations or [],
        recommended_next_steps=r.recommended_next_steps or [],
        patient_notes=r.patient_notes,
    )


@router.delete("/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db)):
    """Deletes a saved safety report."""
    r = db.query(SafetyReportRecord).filter_by(id=report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Safety report not found.")

    db.delete(r)
    db.commit()
    return {"status": "SUCCESS", "message": f"Report {report_id} deleted."}
