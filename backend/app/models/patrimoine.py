from datetime import datetime
from enum import Enum

from pydantic import Field

from app.models.common import CamelModel


class Domain(str, Enum):
    dashboard = "dashboard"
    epargne = "epargne"
    bourse = "bourse"
    immobilier = "immobilier"
    private_equity = "private_equity"


class PatrimoineDocument(CamelModel):
    user_id: str
    domain: Domain
    data: dict
    updated_at: datetime = Field(default_factory=datetime.utcnow)
