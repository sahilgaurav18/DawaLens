from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.models.safety_rule import EvidenceSourceRecord, DrugInteractionRule
from backend.app.schemas.common import ReferenceSourcesResponse, ReferenceSourceItem

router = APIRouter(prefix="/reference", tags=["Clinical Reference & Governance"])


@router.get("/sources", response_model=ReferenceSourcesResponse)
def get_evidence_sources(db: Session = Depends(get_db)):
    """Returns statutory clinical formularies, compendia, and review statuses."""
    sources = db.query(EvidenceSourceRecord).all()
    source_items = [
        ReferenceSourceItem(
            id=s.id,
            source_name=s.source_name,
            authority=s.authority,
            publication_year=s.publication_year,
            source_url=s.source_url,
            review_status=s.review_status,
        )
        for s in sources
    ]
    return ReferenceSourcesResponse(
        sources=source_items,
        active_rule_version=settings.CLINICAL_RULE_VERSION,
    )


@router.get("/rules")
def get_active_rules(db: Session = Depends(get_db)):
    """Returns all active, approved clinical drug interaction and duplicate ingredient rules."""
    rules = db.query(DrugInteractionRule).filter_by(is_active=True).all()
    rule_dicts = []
    for r in rules:
        rule_dicts.append(
            {
                "id": r.id,
                "rule_code": r.rule_code,
                "substance_a": r.substance_a,
                "substance_b": r.substance_b,
                "severity": r.severity,
                "clinical_mechanism": r.clinical_mechanism,
                "explanation_en": r.explanation_en,
                "action_guidance_en": r.action_guidance_en,
                "monograph_source": r.monograph_source,
                "rule_version": r.rule_version,
                "review_status": r.review_status,
                "last_audited": r.last_audited.isoformat() if r.last_audited else None,
            }
        )
    return {
        "rule_version": settings.CLINICAL_RULE_VERSION,
        "total_rules": len(rule_dicts),
        "rules": rule_dicts,
    }
