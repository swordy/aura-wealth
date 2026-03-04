export interface Investissement {
  nom: string;
  vintage: number;
  investi: number;
  valorisation: number;
  tvpi: number;
  statut: string;
}

export interface TimelineEvent {
  date: string;
  type: string;
  montant: number;
  fonds: string;
}

export interface PrivateEquityData {
  investi: number;
  valorisation: number;
  tvpi: number;
  dpi: number;
  irrEstime: number;
  fonds: Investissement[];
  timeline: TimelineEvent[];
}
