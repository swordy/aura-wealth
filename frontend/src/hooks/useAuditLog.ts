import { useMemo, useState } from "react";
import type { AuditEntry } from "@/types/audit";

const MOCK_ENTRIES: AuditEntry[] = [
  {
    id: "audit-001",
    action: "update",
    domain: "dashboard",
    field: "fiscal.ir",
    oldValue: 11_800,
    newValue: 12_500,
    source: "manual",
    timestamp: "2024-12-15T14:30:00Z",
  },
  {
    id: "audit-002",
    action: "integrate",
    domain: "epargne",
    field: "livretA.solde",
    oldValue: 21_500,
    newValue: 22_950,
    source: "document",
    timestamp: "2024-12-15T10:35:00Z",
  },
  {
    id: "audit-003",
    action: "update",
    domain: "bourse",
    field: "pea.valorisation",
    oldValue: 78_600,
    newValue: 84_200,
    source: "manual",
    timestamp: "2024-12-14T16:20:00Z",
  },
  {
    id: "audit-004",
    action: "create",
    domain: "immobilier",
    field: "biens.lmnp-studio-lyon",
    oldValue: null,
    newValue: "Studio Lyon 3e",
    source: "manual",
    timestamp: "2024-12-13T11:00:00Z",
  },
  {
    id: "audit-005",
    action: "reset",
    domain: "epargne",
    field: "retraite",
    oldValue: "valeurs modifiees",
    newValue: "valeurs par defaut",
    source: "reset",
    timestamp: "2024-12-12T09:15:00Z",
  },
  {
    id: "audit-006",
    action: "delete",
    domain: "private_equity",
    field: "fonds.eurazeo-v",
    oldValue: "Eurazeo V",
    newValue: null,
    source: "manual",
    timestamp: "2024-12-11T15:45:00Z",
  },
  {
    id: "audit-007",
    action: "update",
    domain: "immobilier",
    field: "rprinc.valorisation",
    oldValue: 680_000,
    newValue: 720_000,
    source: "manual",
    timestamp: "2024-12-10T10:30:00Z",
  },
  {
    id: "audit-008",
    action: "integrate",
    domain: "bourse",
    field: "crypto.btc",
    oldValue: 25_400,
    newValue: 32_800,
    source: "document",
    timestamp: "2024-12-09T14:00:00Z",
  },
  {
    id: "audit-009",
    action: "update",
    domain: "dashboard",
    field: "endettement.crd",
    oldValue: 435_000,
    newValue: 420_000,
    source: "manual",
    timestamp: "2024-12-08T08:45:00Z",
  },
  {
    id: "audit-010",
    action: "create",
    domain: "epargne",
    field: "placements.per-swisslife",
    oldValue: null,
    newValue: "PER SwissLife",
    source: "manual",
    timestamp: "2024-12-07T17:20:00Z",
  },
];

export function useAuditLog(domain?: string, days?: number) {
  const [entries] = useState<AuditEntry[]>(MOCK_ENTRIES);

  const filtered = useMemo(() => {
    let result = entries;

    if (domain) {
      result = result.filter((e) => e.domain === domain);
    }

    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((e) => new Date(e.timestamp) >= cutoff);
    }

    return result;
  }, [entries, domain, days]);

  return { entries: filtered, loading: false, error: null };
}
