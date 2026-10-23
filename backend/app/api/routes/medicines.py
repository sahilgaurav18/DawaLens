from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import String, cast
from backend.app.db.session import get_db
from backend.app.models.medicine import MedicineReference

router = APIRouter(prefix="/medicines", tags=["Medicines Reference"])


@router.get("/search")
def search_medicines(
    q: str = Query(..., min_length=1, description="Search query by brand name or active salt"),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Searches official reference medicines database by brand title or generic active ingredient."""
    term = f"%{q.strip()}%"
    results = (
        db.query(MedicineReference)
        .filter(
            (MedicineReference.brand_name.ilike(term))
            | (MedicineReference.generic_name.ilike(term))
            | (cast(MedicineReference.ingredients, String).ilike(term))
        )
        .limit(limit)
        .all()
    )

    output = []
    for m in results:
        output.append(
            {
                "id": m.id,
                "brand_name": m.brand_name,
                "generic_name": m.generic_name,
                "manufacturer": m.manufacturer,
                "dosage_form": m.dosage_form,
                "strength": m.strength,
                "ingredients": m.ingredients,
                "rx_required": m.rx_required,
            }
        )

    return {"query": q, "total_found": len(output), "medicines": output}
