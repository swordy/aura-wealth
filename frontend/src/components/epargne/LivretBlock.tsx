import GlowLine from "@/components/shared/GlowLine";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import type { Livret } from "@/types/epargne";
import { formatEur } from "@/utils/format";

interface Props {
  livrets: Livret[];
  onAdd?: () => void;
  onEdit?: (livret: Livret, index: number) => void;
}

export default function LivretBlock({ livrets, onAdd, onEdit }: Props) {
  const totalLivrets = livrets.reduce((s, l) => s + l.solde, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Épargne de Précaution & Livrets
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto"><AddButton onClick={onAdd} label="Ajouter un livret" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="space-y-3">
        {livrets.map((livret, index) => (
          <div
            key={`${livret.nom}-${index}`}
            className={`flex justify-between items-center glass-panel-inner p-4 rounded-lg ${onEdit ? "cursor-pointer hover:border-gold/30 hover:bg-[--surface-hover] transition-colors" : ""}`}
            onClick={() => onEdit?.(livret, index)}
          >
            <div>
              <p className="text-sm font-medium text-[--text-primary]">{livret.nom}</p>
              <p className="text-xs text-[--text-faint]">Taux : {livret.taux}% net • Plafond {formatEur(livret.plafond)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">{formatEur(livret.solde)}</p>
              {livret.statut === "Plein" && (
                <span className="tag bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Plein
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <GlowLine className="my-4" />
      <div className="flex justify-between items-center">
        <span className="text-xs text-[--text-muted]">Total Livrets Réglementés :</span>
        <span className="text-lg font-bold text-[--text-primary]">{formatEur(totalLivrets)}</span>
      </div>
    </div>
  );
}
