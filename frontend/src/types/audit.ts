export interface AuditEntry {
  id: string;
  action: "update" | "reset" | "delete" | "create" | "integrate";
  domain: "dashboard" | "epargne" | "bourse" | "immobilier" | "private_equity";
  field: string;
  oldValue: string | number | null;
  newValue: string | number | null;
  source: "manual" | "document" | "reset";
  timestamp: string;
}
