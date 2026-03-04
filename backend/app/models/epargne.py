from app.models.common import CamelModel


class Livret(CamelModel):
    nom: str
    solde: int
    plafond: int
    taux: float
    statut: str


class RetraiteCompte(CamelModel):
    solde: int
    rendement_ytd: float


class Retraite(CamelModel):
    per: RetraiteCompte
    percol: RetraiteCompte
    total: int
    plafond_deductible_restant: int


class AssuranceVie(CamelModel):
    solde: int
    fonds_euros_pct: int
    uc_pct: int
    rendement_annuel: float


class Prevoyance(CamelModel):
    capital_deces: int
    ij_mensuelle: int
    invalidite: str
    assurance_emprunteur: int
    rc_pno: bool


class EpargneData(CamelModel):
    total: int
    rendement_moyen: float
    objectif_annuel: int
    effort_mensuel: int
    livrets: list[Livret]
    retraite: Retraite
    assurance_vie: AssuranceVie
    prevoyance: Prevoyance
