from typing import List, Optional
from pydantic import BaseModel, Field


class ActiveIngredientSchema(BaseModel):
    name: str = Field(..., description="Chemical salt name e.g. Paracetamol, Ibuprofen")
    strength: str = Field(..., description="Strength label e.g. 650mg, 400mg")
    amount_mg: Optional[float] = Field(None, description="Calculated mass in milligrams")


class CandidateMedicineSchema(BaseModel):
    id: str
    brand_name: str
    generic_name: Optional[str] = None
    active_ingredients: List[ActiveIngredientSchema] = []
    strength: str
    dosage_form: str
    manufacturer: Optional[str] = None
    confidence: float = Field(..., ge=0.0, le=100.0)
    packaging_image_url: Optional[str] = None
    verification_status: str = "unconfirmed"  # Always unconfirmed until patient reviews
    is_ambiguous: bool = False
    ambiguity_reason: Optional[str] = None


class MedicineVerificationInput(BaseModel):
    id: str
    brand_name: str
    generic_name: Optional[str] = None
    active_ingredients: List[ActiveIngredientSchema]
    strength: str
    dosage_form: str
    manufacturer: Optional[str] = None
    is_confirmed: bool = Field(True, description="Explicit human confirmation against physical packaging")
    patient_notes: Optional[str] = None
