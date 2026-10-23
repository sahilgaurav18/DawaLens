from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.medicine import MedicineVerificationInput


class ReportStatusEnum(str, Enum):
    RISK_DETECTED = "RISK_DETECTED"
    NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS = "NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS"
    VERIFICATION_INCOMPLETE = "VERIFICATION_INCOMPLETE"


class SeverityLevelEnum(str, Enum):
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    ADVISORY = "advisory"


class SafetyFindingSchema(BaseModel):
    id: str
    type: str  # "duplicate_ingredient", "drug_interaction", "dosage_ceiling", "incomplete_data"
    title: str
    severity: SeverityLevelEnum
    medicines_involved: List[str]
    ingredients_involved: List[str]
    explanation: str
    explanation_hi: Optional[str] = None
    clinical_mechanism: str
    action_guidance: str
    action_guidance_hi: Optional[str] = None
    evidence_source: str
    rule_id: str


class SafetyCheckRequest(BaseModel):
    scan_id: Optional[str] = None
    medicines: List[MedicineVerificationInput]
    patient_notes: Optional[str] = None


class SafetyReportResponse(BaseModel):
    report_id: str
    checked_at: str
    medicines_checked: List[str]
    verification_status: str
    overall_status: ReportStatusEnum
    findings: List[SafetyFindingSchema]
    duplicate_ingredient_findings: List[SafetyFindingSchema]
    interaction_findings: List[SafetyFindingSchema]
    evidence_sources: List[str]
    rule_versions: List[str]
    checks_completed: List[str]
    checks_failed_or_unavailable: List[str]
    limitations: List[str]
    recommended_next_steps: List[str]
    patient_notes: Optional[str] = None
