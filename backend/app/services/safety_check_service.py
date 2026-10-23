import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.safety_rule import DrugInteractionRule, DuplicateIngredientRule
from backend.app.models.scan import SafetyReportRecord
from backend.app.schemas.medicine import MedicineVerificationInput
from backend.app.schemas.safety_report import SafetyCheckRequest, SafetyReportResponse
from backend.app.services.rule_engine import ClinicalRuleEngine


class SafetyCheckService:
    def execute_safety_check(self, db: Session, request: SafetyCheckRequest) -> SafetyReportResponse:
        """
        Orchestrates deterministic clinical evaluation on user-verified medications.
        Pulls active rules from DB, evaluates them, persists the report record, and returns structured result.
        """
        # Fetch active interaction rules from DB
        db_interactions = db.query(DrugInteractionRule).filter_by(is_active=True).all()
        interaction_rule_dicts = [
            {
                "rule_code": r.rule_code,
                "substance_a": r.substance_a,
                "substance_b": r.substance_b,
                "severity": r.severity,
                "clinical_mechanism": r.clinical_mechanism,
                "explanation_en": r.explanation_en,
                "explanation_hi": r.explanation_hi,
                "action_guidance_en": r.action_guidance_en,
                "action_guidance_hi": r.action_guidance_hi,
                "monograph_source": r.monograph_source,
                "is_active": r.is_active,
            }
            for r in db_interactions
        ]

        # Fetch active duplicate ceiling rules
        db_duplicates = db.query(DuplicateIngredientRule).filter_by(is_active=True).all()
        duplicate_rule_dicts = [
            {
                "canonical_salt": d.canonical_salt,
                "single_dose_ceiling_mg": d.single_dose_ceiling_mg,
                "daily_ceiling_mg": d.daily_ceiling_mg,
                "clinical_risk_mechanism": d.clinical_risk_mechanism,
                "action_guidance_en": d.action_guidance_en,
                "action_guidance_hi": d.action_guidance_hi,
                "monograph_source": d.monograph_source,
                "is_active": d.is_active,
            }
            for d in db_duplicates
        ]

        # Initialize engine with database rules
        engine = ClinicalRuleEngine(
            interaction_rules=interaction_rule_dicts,
            duplicate_rules=duplicate_rule_dicts,
        )

        (
            overall_status,
            all_findings,
            dup_findings,
            int_findings,
            checks_completed,
            checks_failed_or_unavailable,
            evidence_sources,
            recommended_next_steps,
        ) = engine.evaluate_safety(request.medicines)

        now_utc = datetime.now(timezone.utc)
        report_id = f"REP-{now_utc.year}-{uuid.uuid4().hex[:6].upper()}"
        checked_at = now_utc.strftime("%Y-%m-%d %H:%M UTC")
        med_names = [m.brand_name for m in request.medicines]
        med_ids = [m.id for m in request.medicines]

        report_record = SafetyReportRecord(
            id=report_id,
            created_at=now_utc,
            scan_id=request.scan_id,
            medicine_ids=med_ids,
            medicine_names=med_names,
            status=overall_status.value,
            verification_status="verified_by_user",
            findings=[f.model_dump() for f in all_findings],
            duplicate_ingredient_findings=[f.model_dump() for f in dup_findings],
            interaction_findings=[f.model_dump() for f in int_findings],
            evidence_sources=evidence_sources,
            rule_versions=["CDSCO-2026.4.1"],
            checks_completed=checks_completed,
            checks_failed_or_unavailable=checks_failed_or_unavailable,
            limitations=[
                "Supported checks evaluate reviewed CDSCO and WHO interaction databases. Cannot evaluate unlisted proprietary additives or individual genetics."
            ],
            recommended_next_steps=recommended_next_steps,
            patient_notes=request.patient_notes,
        )
        db.add(report_record)
        db.commit()

        return SafetyReportResponse(
            report_id=report_id,
            checked_at=checked_at,
            medicines_checked=med_names,
            verification_status="verified_by_user",
            overall_status=overall_status,
            findings=all_findings,
            duplicate_ingredient_findings=dup_findings,
            interaction_findings=int_findings,
            evidence_sources=evidence_sources,
            rule_versions=["CDSCO-2026.4.1"],
            checks_completed=checks_completed,
            checks_failed_or_unavailable=checks_failed_or_unavailable,
            limitations=[
                "Supported checks evaluate reviewed CDSCO and WHO interaction databases. Cannot evaluate unlisted proprietary additives or individual genetics."
            ],
            recommended_next_steps=recommended_next_steps,
            patient_notes=request.patient_notes,
        )


safety_check_service = SafetyCheckService()
