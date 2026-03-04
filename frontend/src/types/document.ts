export type DocumentType = "releve_bancaire" | "assurance" | "bilan" | "officiel" | "autre";
export type DocumentStatus = "uploaded" | "extracting" | "analyzing" | "ready" | "integrated" | "error";

export interface ExtractionResult {
  domain: string;
  fieldPath: string;
  fieldLabel: string;
  newValue: unknown;
  currentValue: unknown;
  action: "create" | "update";
  confidence: number;
}

export interface IntegrationRequest {
  results: ExtractionResult[];
}

export interface DocumentItem {
  id: string;
  filename: string;
  originalName: string;
  contentType: string;
  status: DocumentStatus;
  rawText: string | null;
  extractedData: ExtractionResult[];
  uploadDate: string;
  integratedAt: string | null;
  errorMessage: string | null;
}
