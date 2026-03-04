import type { Repartition } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

interface Props {
  repartition: Repartition;
}

const SEGMENT_CONFIG = [
  { key: "immobilier" as const, label: "Immobilier", color: "bg-amber-600", dot: "bg-amber-600" },
  { key: "pea" as const, label: "PEA", color: "bg-blue-500", dot: "bg-blue-500" },
  { key: "crypto" as const, label: "Crypto", color: "bg-purple-500", dot: "bg-purple-500" },
  { key: "epargne" as const, label: "Épargne", color: "bg-green-500", dot: "bg-green-500" },
  { key: "liquidites" as const, label: "Liquidités", color: "bg-gray-400", dot: "bg-gray-400" },
];

export default function DistributionBar({ repartition }: Props) {
  const segments = SEGMENT_CONFIG.map((cfg) => ({
    ...cfg,
    pct: repartition[cfg.key].pct,
    valeur: repartition[cfg.key].valeur,
  }));

  return (
    <div className="glass-panel p-5 rounded-2xl">
      <h2 className="text-sm font-bold tracking-widest uppercase text-[--text-muted] mb-3">
        Répartition Patrimoniale
      </h2>
      <div className="flex rounded-full overflow-hidden h-3 bg-[--input-bg]">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} tooltip-wrapper`}
            style={{ width: `${seg.pct}%` }}
          >
            <span className="tooltip-text">
              {seg.label} — {formatEur(seg.valeur)} ({seg.pct}%)
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-[--text-muted]">
        {segments.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${seg.dot}`} />
            {seg.label} {seg.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
