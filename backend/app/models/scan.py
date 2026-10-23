from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, JSON, Text
from backend.app.db.session import Base


class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="pending_verification")  # pending_verification, verified, failed
    image_count = Column(String, default="1")
    image_filenames = Column(JSON, default=list)
    inference_provider = Column(String, nullable=True)  # gemma_4, huggingface, test_harness
    candidate_medicines = Column(JSON, default=list)  # Candidate extractions before user verification
    uncertainty_notes = Column(JSON, default=list)
    is_verified = Column(Boolean, default=False)
    verified_medicines = Column(JSON, nullable=True)  # Final verified medicines after user confirmation


class SafetyReportRecord(Base):
    __tablename__ = "safety_reports"

    id = Column(String, primary_key=True, index=True)  # e.g. REP-2026-089
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    scan_id = Column(String, nullable=True)
    medicine_ids = Column(JSON, default=list)
    medicine_names = Column(JSON, default=list)
    status = Column(String, nullable=False)  # RISK_DETECTED, NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS, VERIFICATION_INCOMPLETE
    verification_status = Column(String, default="confirmed")
    findings = Column(JSON, default=list)
    duplicate_ingredient_findings = Column(JSON, default=list)
    interaction_findings = Column(JSON, default=list)
    evidence_sources = Column(JSON, default=list)
    rule_versions = Column(JSON, default=list)
    checks_completed = Column(JSON, default=list)
    checks_failed_or_unavailable = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    recommended_next_steps = Column(JSON, default=list)
    patient_notes = Column(Text, nullable=True)
