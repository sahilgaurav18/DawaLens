import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.models.scan import ScanRecord
from backend.app.schemas.scan import ScanUploadResponse, ScanDetailResponse
from backend.app.schemas.medicine import CandidateMedicineSchema
from backend.app.services.image_service import image_service
from backend.app.services.gemma_service import gemma_service

router = APIRouter(prefix="/scans", tags=["Medicine Scanning"])


@router.post("", response_model=ScanUploadResponse)
async def upload_and_scan_packaging(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    """
    Step 1 & 2: Ingests 1 to 5 medicine packaging images.
    Step 3 & 4: Validates with Pillow, sends to Gemma vision service,
    and returns extracted candidate medicine details with uncertainty scores.
    Does NOT declare medicines safe; human verification gate is required next.
    """
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="At least one packaging image must be uploaded.")

    if len(files) > settings.MAX_IMAGE_COUNT_PER_SCAN:
        raise HTTPException(
            status_code=400,
            detail=f"Exceeded maximum allowable images ({settings.MAX_IMAGE_COUNT_PER_SCAN}) per scan.",
        )

    scan_id = f"SCAN-{uuid.uuid4().hex[:8].upper()}"
    saved_paths: List[str] = []
    saved_filenames: List[str] = []
    candidates: List[CandidateMedicineSchema] = []
    uncertainty_notes: List[str] = []

    try:
        for idx, file in enumerate(files):
            # Validate and securely store temporary image
            file_path, metadata = image_service.validate_and_save_upload(file)
            saved_paths.append(file_path)
            saved_filenames.append(metadata["saved_filename"])

            # Execute Vision AI Packaging Extraction
            candidate_id = f"cand-{idx + 1}-{uuid.uuid4().hex[:6]}"
            candidate = await gemma_service.analyze_packaging_image(file_path, candidate_id=candidate_id)
            candidates.append(candidate)

            if candidate.is_ambiguous and candidate.ambiguity_reason:
                uncertainty_notes.append(f"{candidate.brand_name}: {candidate.ambiguity_reason}")

        # Record scan session in DB
        now_utc = datetime.now(timezone.utc)
        scan_record = ScanRecord(
            id=scan_id,
            created_at=now_utc,
            status="pending_verification",
            image_count=str(len(files)),
            image_filenames=saved_filenames,
            inference_provider=settings.AI_PROVIDER,
            candidate_medicines=[c.model_dump() for c in candidates],
            uncertainty_notes=uncertainty_notes,
            is_verified=False,
        )
        db.add(scan_record)
        db.commit()

    finally:
        # Secure cleanup of temporary images
        if settings.DELETE_TEMP_IMAGES_AFTER_PROCESSING:
            image_service.cleanup_files(saved_paths)

    return ScanUploadResponse(
        scan_id=scan_id,
        created_at=now_utc.isoformat(),
        status="pending_verification",
        image_count=len(files),
        inference_provider=settings.AI_PROVIDER,
        candidate_medicines=candidates,
        uncertainty_notes=uncertainty_notes,
        message="Candidate medicine packaging details extracted. Human verification required before safety evaluation.",
    )


@router.get("/{scan_id}", response_model=ScanDetailResponse)
def get_scan_details(scan_id: str, db: Session = Depends(get_db)):
    """Retrieves scan record and current verification state."""
    scan = db.query(ScanRecord).filter_by(id=scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    return ScanDetailResponse(
        scan_id=scan.id,
        created_at=scan.created_at.isoformat() if scan.created_at else "",
        status=scan.status,
        image_count=int(scan.image_count or 1),
        inference_provider=scan.inference_provider or "unknown",
        candidate_medicines=scan.candidate_medicines or [],
        uncertainty_notes=scan.uncertainty_notes or [],
        is_verified=scan.is_verified,
        verified_medicines=scan.verified_medicines,
    )
