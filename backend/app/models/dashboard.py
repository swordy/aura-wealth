from app.models.common import CamelModel


class RepartitionItem(CamelModel):
    valeur: int
    pct: float


class Repartition(CamelModel):
    immobilier: RepartitionItem
    pea: RepartitionItem
    crypto: RepartitionItem
    epargne: RepartitionItem
    liquidites: RepartitionItem


class Tresorerie(CamelModel):
    comptes_courants: int
    banques: str
    epargne_precaution: int
    taux_epargne_mensuel: int


class Endettement(CamelModel):
    crd: int
    taux_endettement: float
    max_hcsf: int
    capacite_residuelle: int


class MoteurImmo(CamelModel):
    revenus_locatifs_annuels: int
    revenus_locatifs_mensuels: int
    mensualites_credits: int
    cashflow_net_mensuel: int


class Fiscal(CamelModel):
    tmi: int
    ir: int
    ps: int
    tf: int
    ifi: int | None = None
    total_annuel: int
    economie_per_10k: int
    taux_effectif: float


class Operation(CamelModel):
    label: str
    date: str
    montant: int
    type: str


class DashboardData(CamelModel):
    patrimoine_brut: int
    patrimoine_net: int
    projection_10ans: int
    projection_taux: float
    variation_ytd: float
    rendement_global_pct: float
    rendement_global_eur: int
    score_diversification: int
    repartition: Repartition
    tresorerie: Tresorerie
    endettement: Endettement
    moteur_immo: MoteurImmo
    fiscal: Fiscal
    operations_recentes: list[Operation]
