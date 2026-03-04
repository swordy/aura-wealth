import { useState } from "react";
import type { AuditEntry } from "@/types/audit";
import { useAuditLog } from "@/hooks/useAuditLog";
import AuditEntryRow from "./AuditEntryRow";

type DomainFilter = AuditEntry["domain"] | "all";

const DOMAIN_OPTIONS: { value: DomainFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "dashboard", label: "Dashboard" },
  { value: "epargne", label: "Epargne" },
  { value: "bourse", label: "Bourse" },
  { value: "immobilier", label: "Immobilier" },
  { value: "private_equity", label: "Private Equity" },
];

const PERIOD_OPTIONS: { value: number | undefined; label: string }[] = [
  { value: 7, label: "7j" },
  { value: 30, label: "30j" },
  { value: 90, label: "90j" },
  { value: undefined, label: "Tout" },
];

export default function HistoriqueView() {
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
  const [daysFilter, setDaysFilter] = useState<number | undefined>(undefined);

  const { entries } = useAuditLog(
    domainFilter === "all" ? undefined : domainFilter,
    daysFilter,
  );

  return (
    <>
      <div
        className="tab-indicator"
        style={{
          background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
        }}
      />

      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-light font-display text-[--text-primary]">Historique</h2>
        <p className="text-sm text-[--text-muted] mt-1">
          Journal des modifications de votre patrimoine
        </p>
      </div>

      {/* Filter bar */}
      <div className="glass-panel rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Domain filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-[--text-faint] mr-2 flex-shrink-0">
              Domaine
            </span>
            {DOMAIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDomainFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  domainFilter === opt.value
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover] border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[--text-faint] mr-2 flex-shrink-0">
              Periode
            </span>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setDaysFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  daysFilter === opt.value
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover] border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entry count */}
      <div className="mb-4">
        <p className="text-xs text-[--text-faint]">
          {entries.length} {entries.length === 1 ? "entree" : "entrees"}
        </p>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-[--text-faint]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[--text-muted] text-sm">Aucune modification</p>
          <p className="text-[--text-faint] text-xs mt-1">
            Les modifications apportees a votre patrimoine apparaitront ici
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {entries.map((entry) => (
            <AuditEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}
