import { formatEur } from "@/utils/format";

interface Props {
  pct: number;
  eur: number;
}

export default function RendementGlobal({ pct, eur }: Props) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center justify-between card-hover">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold">
            Rendement Global Pondéré
          </p>
          <p className="text-xs text-[--text-faint] mt-0.5">
            Moyenne pondérée de tous les actifs
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-green-400">+{pct}%</span>
        <span className="text-sm text-[--text-muted]">soit</span>
        <span className="text-lg font-bold text-green-400">+{formatEur(eur)}</span>
      </div>
    </div>
  );
}
