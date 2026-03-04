import SparkAi from "@/components/shared/SparkAi";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import GlowLine from "@/components/shared/GlowLine";
import type { Sci } from "@/types/immobilier";
import { formatEur } from "@/utils/format";

interface Props {
  sci: Sci;
  onAdd?: () => void;
}

export default function SciBlock({ sci, onAdd }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="sci" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        {sci.nom}
        <span className="tag bg-amber-500/15 text-amber-400 border border-amber-500/30 ml-2">{sci.regime}</span>
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto mr-8"><AddButton onClick={onAdd} label="Ajouter une SCI" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Répartition des parts */}
        <div className="glass-panel-inner p-4 rounded-lg">
          <p className="text-xs text-[--text-muted] mb-3">Répartition des parts</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[--text-primary]">Vous</span>
                <span className="text-[--text-muted]">{sci.partsRepartition.vous}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${sci.partsRepartition.vous}%`, background: "#D97706" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[--text-primary]">Conjoint</span>
                <span className="text-[--text-muted]">{sci.partsRepartition.conjoint}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${sci.partsRepartition.conjoint}%`, background: "#E8A317" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Valeur immeuble */}
        <div className="glass-panel-inner p-4 rounded-lg">
          <p className="text-xs text-[--text-muted] mb-2">Valeur immeuble</p>
          <p className="text-2xl font-semibold text-[--text-primary] font-display">{formatEur(sci.valeur)}</p>
          <p className="text-xs text-[--text-faint] mt-1">Estimation notariale 2024</p>
        </div>

        {/* CRD SCI */}
        <div className="glass-panel-inner p-4 rounded-lg">
          <p className="text-xs text-[--text-muted] mb-2">CRD SCI</p>
          <p className="text-2xl font-semibold text-red-400 font-display">{formatEur(sci.crd)}</p>
          <p className="text-xs text-[--text-faint] mt-1">Crédit in fine, échéance 2032</p>
        </div>
      </div>

      <GlowLine className="my-4" />

      <div className="p-3 rounded-lg border text-sm text-[--text-secondary]" style={{ background: "rgba(217,119,6,0.05)", borderColor: "rgba(217,119,6,0.2)" }}>
        <span className="font-medium text-amber-400">Transmission :</span>{" "}
        Abattement 100 000 € par parent par enfant tous les 15 ans. La SCI facilite la donation progressive de parts.
      </div>
    </div>
  );
}
