export interface BienLmnp {
  nom: string;
  type: string;
  valeur: number;
  loyerMensuel: number;
  rendement: number;
  statut: string;
  crd: number;
  amortissementRestant: number;
}

export interface SciParts {
  vous: number;
  conjoint: number;
}

export interface Sci {
  nom: string;
  parts: number;
  valeur: number;
  regime: string;
  partsRepartition: SciParts;
  crd: number;
}

export interface Scpi {
  nom: string;
  parts: number;
  valeur: number;
  rendement: number;
  delaiJouissance: string;
}

export interface BienSynthese {
  nom: string;
  valeur: number;
  crd: number;
  loyerMensuel: number | null;
  rendement: number | null;
  type: string;
}

export interface AssuranceImmo {
  nom: string;
  type: string;
  statut: string;
}

export interface ImmobilierData {
  valeurVenale: number;
  rendementBrut: number;
  plusValueLatente: number;
  cashflowNetMensuel: number;
  rendementMoyen: number;
  crdTotal: number;
  lmnp: BienLmnp[];
  sci: Sci;
  scpis: Scpi[];
  synthese: BienSynthese[];
  assurances: AssuranceImmo[];
  residencePrincipale: BienSynthese;
}
