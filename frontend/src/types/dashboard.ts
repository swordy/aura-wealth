export interface RepartitionItem {
  valeur: number;
  pct: number;
}

export interface Repartition {
  immobilier: RepartitionItem;
  pea: RepartitionItem;
  crypto: RepartitionItem;
  epargne: RepartitionItem;
  liquidites: RepartitionItem;
}

export interface Tresorerie {
  comptesCourants: number;
  banques: string;
  epargnePrecaution: number;
  tauxEpargneMensuel: number;
}

export interface Endettement {
  crd: number;
  tauxEndettement: number;
  maxHcsf: number;
  capaciteResiduelle: number;
}

export interface MoteurImmo {
  revenusLocatifsAnnuels: number;
  revenusLocatifsMensuels: number;
  mensualitesCredits: number;
  cashflowNetMensuel: number;
}

export interface Fiscal {
  tmi: number;
  ir: number;
  ps: number;
  tf: number;
  ifi: number | null;
  totalAnnuel: number;
  economiePer10K: number;
  tauxEffectif: number;
}

export interface Operation {
  label: string;
  date: string;
  montant: number;
  type: string;
}

export interface DashboardData {
  patrimoineBrut: number;
  patrimoineNet: number;
  projection10Ans: number;
  projectionTaux: number;
  variationYtd: number;
  rendementGlobalPct: number;
  rendementGlobalEur: number;
  scoreDiversification: number;
  repartition: Repartition;
  tresorerie: Tresorerie;
  endettement: Endettement;
  moteurImmo: MoteurImmo;
  fiscal: Fiscal;
  operationsRecentes: Operation[];
}
