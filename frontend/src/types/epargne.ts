export interface Livret {
  nom: string;
  solde: number;
  plafond: number;
  taux: number;
  statut: string;
}

export interface RetraiteCompte {
  solde: number;
  rendementYtd: number;
}

export interface Retraite {
  per: RetraiteCompte;
  percol: RetraiteCompte;
  total: number;
  plafondDeductibleRestant: number;
}

export interface AssuranceVie {
  solde: number;
  fondsEurosPct: number;
  ucPct: number;
  rendementAnnuel: number;
}

export interface Prevoyance {
  capitalDeces: number;
  ijMensuelle: number;
  invalidite: string;
  assuranceEmprunteur: number;
  rcPno: boolean;
}

export interface EpargneData {
  total: number;
  rendementMoyen: number;
  objectifAnnuel: number;
  effortMensuel: number;
  livrets: Livret[];
  retraite: Retraite;
  assuranceVie: AssuranceVie;
  prevoyance: Prevoyance;
}
