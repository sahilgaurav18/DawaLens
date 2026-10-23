from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, Text, Boolean, JSON
from backend.app.db.session import Base


class EvidenceSourceRecord(Base):
    __tablename__ = "evidence_sources"

    id = Column(String, primary_key=True, index=True)
    source_name = Column(String, nullable=False)  # e.g. "National Formulary of India (NFI 2024)"
    authority = Column(String, nullable=False)  # e.g. "CDSCO / Indian Pharmacopoeia Commission"
    publication_year = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    review_status = Column(String, default="clinically_verified")
    last_verified = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DrugInteractionRule(Base):
    __tablename__ = "drug_interaction_rules"

    id = Column(String, primary_key=True, index=True)
    rule_code = Column(String, unique=True, index=True, nullable=False)  # e.g. "DR-INT-ASP-IBU-001"
    substance_a = Column(String, index=True, nullable=False)  # Normalized canonical salt
    substance_b = Column(String, index=True, nullable=False)  # Normalized canonical salt
    severity = Column(String, nullable=False)  # "high", "moderate", "low", "advisory"
    clinical_mechanism = Column(Text, nullable=False)
    explanation_en = Column(Text, nullable=False)
    explanation_hi = Column(Text, nullable=True)
    action_guidance_en = Column(Text, nullable=False)
    action_guidance_hi = Column(Text, nullable=True)
    monograph_source = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    rule_version = Column(String, default="CDSCO-2026.4.1")
    is_active = Column(Boolean, default=True)
    review_status = Column(String, default="approved")  # "approved", "pending_review"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_audited = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DuplicateIngredientRule(Base):
    __tablename__ = "duplicate_ingredient_rules"

    id = Column(String, primary_key=True, index=True)
    canonical_salt = Column(String, index=True, nullable=False)
    single_dose_ceiling_mg = Column(Float, nullable=False)  # e.g. 1000 mg
    daily_ceiling_mg = Column(Float, nullable=False)  # e.g. 4000 mg
    clinical_risk_mechanism = Column(Text, nullable=False)
    action_guidance_en = Column(Text, nullable=False)
    action_guidance_hi = Column(Text, nullable=True)
    monograph_source = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    rule_version = Column(String, default="CDSCO-2026.4.1")


class ClinicalAuditLog(Base):
    __tablename__ = "clinical_audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    reviewer_name = Column(String, nullable=False)
    reviewer_registration = Column(String, nullable=True)
    action = Column(String, nullable=False)  # RULE_APPROVED, RULE_CREATED, MONOGRAPH_SYNC
    rule_code = Column(String, nullable=True)
    details = Column(Text, nullable=False)
    previous_state = Column(JSON, nullable=True)
    new_state = Column(JSON, nullable=True)
