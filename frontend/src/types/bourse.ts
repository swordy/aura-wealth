export interface Position {
  nom: string;
  ticker: string;
  valeur: number;
  poids: number;
  ytd: number;
  pvEur: number;
  sparkData?: number[] | null;
}

export interface Envelope {
  nom: string;
  total: number;
  ytdPct: number;
  plafond: number | null;
  versementRestant: number | null;
  positions: Position[];
}

export interface Crypto {
  nom: string;
  symbol: string;
  valeur: number;
  poids: number;
  ytd: number;
}

export interface BourseData {
  actifsFinanciers: number;
  pea: Envelope;
  cto: Envelope;
  peaPme: Envelope;
  cryptoTotal: number;
  cryptoYtdPct: number;
  cryptos: Crypto[];
}
