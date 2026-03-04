from app.models.common import CamelModel


class BienLmnp(CamelModel):
    nom: str
    type: str
    valeur: int
    loyer_mensuel: int
    rendement: float
    statut: str
    crd: int
    amortissement_restant: int


class SciParts(CamelModel):
    vous: int
    conjoint: int


class Sci(CamelModel):
    nom: str
    parts: int
    valeur: int
    regime: str
    parts_repartition: SciParts
    crd: int


class Scpi(CamelModel):
    nom: str
    parts: int
    valeur: int
    rendement: float
    delai_jouissance: str


class BienSynthese(CamelModel):
    nom: str
    valeur: int
    crd: int
    loyer_mensuel: int | None = None
    rendement: float | None = None
    type: str


class AssuranceImmo(CamelModel):
    nom: str
    type: str
    statut: str


class ImmobilierData(CamelModel):
    valeur_venale: int
    rendement_brut: float
    plus_value_latente: int
    cashflow_net_mensuel: int
    rendement_moyen: float
    crd_total: int
    lmnp: list[BienLmnp]
    sci: Sci
    scpis: list[Scpi]
    synthese: list[BienSynthese]
    assurances: list[AssuranceImmo]
    residence_principale: BienSynthese
