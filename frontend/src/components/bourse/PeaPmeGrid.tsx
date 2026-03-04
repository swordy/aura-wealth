import SparkAi from "@/components/shared/SparkAi";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import Sparkline from "@/components/shared/Sparkline";
import type { Envelope } from "@/types/bourse";
import { formatEur } from "@/utils/format";

interface Props {
  envelope: Envelope;
  onAdd?: () => void;
}

export default function PeaPmeGrid({ envelope, onAdd }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="pea" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        PEA-PME — {formatEur(envelope.total)}
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto mr-8"><AddButton onClick={onAdd} label="Ajouter une position" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {envelope.positions.map((pos) => {
          const positive = pos.ytd >= 0;
          return (
            <div key={pos.nom} className="glass-panel-inner p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[--text-primary]">{pos.nom}</span>
                <span className="tag border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">PME</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold">{formatEur(pos.valeur)}</p>
                {pos.sparkData && pos.sparkData.length > 0 && (
                  <Sparkline data={pos.sparkData} positive={positive} />
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[--text-muted]">{pos.poids}% du PEA-PME</span>
                <span className={`text-sm font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
                  {positive ? "+" : ""}{formatEur(pos.pvEur)} ({positive ? "+" : ""}{pos.ytd}%)
                </span>
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill bg-emerald-500" style={{ width: `${pos.poids}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {envelope.versementRestant !== null && envelope.plafond !== null && (
        <div className="p-3 rounded-lg border mt-4 flex justify-between items-center" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
          <span className="text-sm text-[--text-secondary]">Versement PEA-PME restant autorisé :</span>
          <span className="text-lg font-bold text-emerald-400">{formatEur(envelope.versementRestant)} <span className="text-xs text-[--text-faint] font-normal">(plafond {formatEur(envelope.plafond)})</span></span>
        </div>
      )}
    </div>
  );
}
