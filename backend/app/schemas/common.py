from typing import List, Optional
from pydantic import BaseModel


class HealthCheckResponse(BaseModel):
    status: str
    app_name: str
    version: str
    database_status: str
    gemma_service_status: str
    active_rules_count: int
    rule_version: str


class ReferenceSourceItem(BaseModel):
    id: str
    source_name: str
    authority: str
    publication_year: Optional[str]
    source_url: Optional[str]
    review_status: str


class ReferenceSourcesResponse(BaseModel):
    sources: List[ReferenceSourceItem]
    active_rule_version: str
