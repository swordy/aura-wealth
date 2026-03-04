from datetime import datetime
from enum import Enum

from pydantic import Field

from app.models.common import CamelModel


class DocumentStatus(str, Enum):
    uploaded = "uploaded"
    extracting = "extracting"
    analyzing = "analyzing"
    ready = "ready"
    integrated = "integrated"
    error = "error"


class ExtractionResult(CamelModel):
    domain: str
    field_path: str
    field_label: str
    new_value: object
    current_value: object = None
    action: str = "create"  # "create" | "update"
    confidence: float = 0.0


class IntegrationRequest(CamelModel):
    results: list[ExtractionResult]


class DocumentCreate(CamelModel):
    filename: str
    content_type: str
    original_name: str


class DocumentResponse(CamelModel):
    id: str
    filename: str
    original_name: str
    content_type: str
    status: DocumentStatus
    raw_text: str | None = None
    extracted_data: list[ExtractionResult] = []
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    integrated_at: datetime | None = None
    error_message: str | None = None
