import type { Operation } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

const ICON_CONFIG: Record<string, { bg: string; text: string; path: string }> = {
  credit: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    path: "M7 11l5-5m0 0l5 5m-5-5v12",
  },
  debit: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    path: "M17 13l-5 5m0 0l-5-5m5 5V6",
  },
  transfer: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    path: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
};

interface Props {
  operations: Operation[];
}

export default function RecentOps({ operations }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Dernières Opérations (Compte Courant)
      </h2>
      <div className="space-y-2 stagger">
        {operations.map((op, i) => {
          const icon = ICON_CONFIG[op.type] ?? ICON_CONFIG.debit;
          const sign = op.montant >= 0 ? "+" : "";
          return (
            <div
              key={i}
              className="flex justify-between items-center glass-panel-inner p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${icon.bg} flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${icon.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[--text-primary]">{op.label}</p>
                  <p className="text-xs text-[--text-faint]">{op.date}</p>
                </div>
              </div>
              <span className={`${icon.text} font-semibold`}>{sign} {formatEur(Math.abs(op.montant))}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
