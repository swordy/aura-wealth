from datetime import datetime

from pydantic import Field

from app.models.common import CamelModel


class AuditEntry(CamelModel):
    user_id: str
    action: str  # "update" | "reset" | "delete"
    domain: str  # "dashboard" | "epargne" | "bourse" | "immobilier" | "private_equity"
    field: str | None = None  # dot-notation path, e.g. "fiscal.ir"
    old_value: object = None
    new_value: object = None
    source: str = "manual"  # "manual" | "document" | "reset"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AuditEntryResponse(CamelModel):
    id: str
    user_id: str
    action: str
    domain: str
    field: str | None = None
    old_value: object = None
    new_value: object = None
    source: str = "manual"
    timestamp: datetime
