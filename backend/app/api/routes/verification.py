from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.scan import ScanRecord
from backend.app.schemas.scan import VerificationSubmitRequest
from backend.app.services.medicine_normalizer import medicine_normalizer

router = APIRouter(prefix="/scans", tags=["Verification Gate"])


@router.post("/{scan_id}/verify")
def verify_scan_candidates(
    scan_id: str,
    payload: VerificationSubmitRequest,
    db: Session = Depends(get_db),
):
    """
    Step 6 & 7: Human-in-the-loop verification gate.
    The user reviews candidate details against the physical packaging label and submits corrections.
    Backend independently normalizes ingredients and ensures no unconfirmed medicine proceeds silently.
    """
    scan = db.query(ScanRecord).filter_by(id=scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan session not found.")

    if not payload.patient_acknowledgement:
        raise HTTPException(
            status_code=400,
            detail="Patient physical label confirmation acknowledgement is mandatory.",
        )

    normalized_verified_list: List[Dict[str, Any]] = []

    for med in payload.verified_medicines:
        if not med.brand_name.strip():
            raise HTTPException(status_code=400, detail="Medicine brand name cannot be blank.")

        normalized_ingredients = []
        for ing in med.active_ingredients:
            canonical_name = medicine_normalizer.normalize_ingredient_name(ing.name)
            amount_mg = ing.amount_mg
            if amount_mg is None:
                amount_mg = medicine_normalizer.parse_strength_mg(ing.strength)

            normalized_ingredients.append(
                {
                    "name": canonical_name,
                    "strength": ing.strength,
                    "amount_mg": amount_mg,
                }
            )

        med_dict = med.model_dump()
        med_dict["active_ingredients"] = normalized_ingredients
        med_dict["verification_status"] = "verified" if med.is_confirmed else "unconfirmed"
        normalized_verified_list.append(med_dict)

    scan.is_verified = True
    scan.status = "verified"
    scan.verified_medicines = normalized_verified_list
    db.commit()

    return {
        "status": "SUCCESS",
        "scan_id": scan_id,
        "message": f"Successfully verified {len(normalized_verified_list)} medicine(s). Ready for safety check.",
        "verified_medicines": normalized_verified_list,
    }
