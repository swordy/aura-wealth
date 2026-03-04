import SparkAi from "@/components/shared/SparkAi";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import Sparkline from "@/components/shared/Sparkline";
import type { Envelope } from "@/types/bourse";
import { formatEur } from "@/utils/format";

const TAG_MAP: Record<string, { tag: string; cls: string }> = {
  AAPL: { tag: "US Stock", cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  O: { tag: "REIT", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  EEM: { tag: "ETF", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
};

interface Props {
  envelope: Envelope;
  onAdd?: () => void;
}

export default function CtoGrid({ envelope, onAdd }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="cto" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#8B5CF6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Compte-Titres Ordinaire (CTO) — {formatEur(envelope.total)}
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto mr-8"><AddButton onClick={onAdd} label="Ajouter une position" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {envelope.positions.map((pos) => {
          const positive = pos.ytd >= 0;
          const tagInfo = TAG_MAP[pos.ticker] ?? { tag: "Stock", cls: "bg-[--surface-hover] text-[--text-muted] border-[--border-default]" };
          return (
            <div key={pos.nom} className="glass-panel-inner p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-sm font-medium text-[--text-primary]">{pos.nom}</span>
                  <span className="text-xs text-[--text-faint] ml-1">{pos.ticker}</span>
                </div>
                <span className={`tag border ${tagInfo.cls}`}>{tagInfo.tag}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold">{formatEur(pos.valeur)}</p>
                {pos.sparkData && pos.sparkData.length > 0 && (
                  <Sparkline data={pos.sparkData} positive={positive} />
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[--text-muted]">{pos.poids}% du CTO</span>
                <span className={`text-sm font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
                  {positive ? "+" : ""}{formatEur(pos.pvEur)} ({positive ? "+" : ""}{pos.ytd}%)
                </span>
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill bg-purple-500" style={{ width: `${pos.poids}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-lg border mt-4 text-sm text-[--text-secondary]" style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
        <span className="font-medium text-amber-400">Fiscalité CTO :</span>{" "}
        Flat tax 30% (12.8% IR + 17.2% PS) ou option pour le barème IR progressif.
      </div>
    </div>
  );
}
