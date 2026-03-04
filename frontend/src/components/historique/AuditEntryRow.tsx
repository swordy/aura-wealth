import type { AuditEntry } from "@/types/audit";

interface Props {
  entry: AuditEntry;
}

const DOMAIN_LABELS: Record<AuditEntry["domain"], string> = {
  dashboard: "Dashboard",
  epargne: "Epargne",
  bourse: "Bourse",
  immobilier: "Immobilier",
  private_equity: "Private Equity",
};

const ACTION_CONFIG: Record<
  AuditEntry["action"],
  { label: string; icon: string; color: string }
> = {
  update: {
    label: "Modification",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    color: "text-blue-400",
  },
  create: {
    label: "Creation",
    icon: "M12 4v16m8-8H4",
    color: "text-green-400",
  },
  delete: {
    label: "Suppression",
    icon: "M6 18L18 6M6 6l12 12",
    color: "text-red-400",
  },
  reset: {
    label: "Reinitialisation",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    color: "text-amber-400",
  },
  integrate: {
    label: "Integration",
    icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    color: "text-purple-400",
  },
};

const SOURCE_CONFIG: Record<AuditEntry["source"], { label: string; classes: string }> = {
  manual: { label: "Manuel", classes: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  document: { label: "Document", classes: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  reset: { label: "Reset", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
};

function formatTimestampFr(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + " a " + date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatValue(val: string | number | null): string {
  if (val === null) return "\u2014";
  if (typeof val === "number") {
    return val.toLocaleString("fr-FR");
  }
  return String(val);
}

export default function AuditEntryRow({ entry }: Props) {
  const action = ACTION_CONFIG[entry.action];
  const source = SOURCE_CONFIG[entry.source];

  return (
    <div className="glass-panel-inner rounded-xl p-4 card-hover flex items-start gap-4">
      {/* Action icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg bg-[--surface-hover] flex items-center justify-center ${action.color}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={action.icon}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-sm font-medium ${action.color}`}>
            {action.label}
          </span>
          <span className="text-[--text-faint]">|</span>
          <span className="text-sm text-[--text-secondary]">
            {DOMAIN_LABELS[entry.domain]}
          </span>
          <span className="text-[--text-faint]">&rsaquo;</span>
          <span className="text-sm text-[--text-muted] font-mono">{entry.field}</span>
        </div>

        {/* Values */}
        {(entry.oldValue !== null || entry.newValue !== null) && (
          <div className="flex items-center gap-2 text-xs mt-1">
            {entry.oldValue !== null && (
              <span className="text-red-400/70 line-through">
                {formatValue(entry.oldValue)}
              </span>
            )}
            {entry.oldValue !== null && entry.newValue !== null && (
              <svg className="w-3 h-3 text-[--text-faint] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
            {entry.newValue !== null && (
              <span className="text-green-400">
                {formatValue(entry.newValue)}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-[--text-faint] mt-1.5">
          {formatTimestampFr(entry.timestamp)}
        </p>
      </div>

      {/* Source badge */}
      <span className={`tag border flex-shrink-0 ${source.classes}`}>
        {source.label}
      </span>
    </div>
  );
}
