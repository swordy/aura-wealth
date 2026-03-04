from app.models.common import CamelModel


class Position(CamelModel):
    nom: str
    ticker: str
    valeur: int
    poids: float
    ytd: float
    pv_eur: int
    spark_data: list[float] | None = None


class Envelope(CamelModel):
    nom: str
    total: int
    ytd_pct: float
    plafond: int | None = None
    versement_restant: int | None = None
    positions: list[Position]


class Crypto(CamelModel):
    nom: str
    symbol: str
    valeur: int
    poids: float
    ytd: float


class BourseData(CamelModel):
    actifs_financiers: int
    pea: Envelope
    cto: Envelope
    pea_pme: Envelope
    crypto_total: int
    crypto_ytd_pct: float
    cryptos: list[Crypto]
