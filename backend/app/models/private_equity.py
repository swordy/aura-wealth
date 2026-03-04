from app.models.common import CamelModel


class Investissement(CamelModel):
    nom: str
    vintage: int
    investi: int
    valorisation: int
    tvpi: float
    statut: str


class TimelineEvent(CamelModel):
    date: str
    type: str
    montant: int
    fonds: str


class PrivateEquityData(CamelModel):
    investi: int
    valorisation: int
    tvpi: float
    dpi: float
    irr_estime: float
    fonds: list[Investissement]
    timeline: list[TimelineEvent]
