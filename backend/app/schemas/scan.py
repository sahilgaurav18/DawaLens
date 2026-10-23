from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.medicine import CandidateMedicineSchema, MedicineVerificationInput


class ScanUploadResponse(BaseModel):
    scan_id: str
    created_at: str
    status: str
    image_count: int
    inference_provider: str
    candidate_medicines: List[CandidateMedicineSchema]
    uncertainty_notes: List[str] = []
    message: str


class ScanDetailResponse(BaseModel):
    scan_id: str
    created_at: str
    status: str
    image_count: int
    inference_provider: str
    candidate_medicines: List[CandidateMedicineSchema]
    uncertainty_notes: List[str] = []
    is_verified: bool
    verified_medicines: Optional[List[dict]] = None


class VerificationSubmitRequest(BaseModel):
    verified_medicines: List[MedicineVerificationInput]
    patient_acknowledgement: bool = Field(
        True,
        description="User confirms they inspected the physical blister/packaging label",
    )
