import SparkAi from "@/components/shared/SparkAi";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import type { BienLmnp } from "@/types/immobilier";
import { formatEur } from "@/utils/format";

interface Props {
  lmnp: BienLmnp[];
  onAdd?: () => void;
}

export default function LmnpBlock({ lmnp, onAdd }: Props) {
  const occupe = lmnp.filter((b) => b.statut === "Loué").length;
  const total = lmnp.length;
  const tauxOccupation = Math.round((occupe / total) * 100);
  const occColor = tauxOccupation >= 90 ? "bg-green-500" : tauxOccupation >= 70 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="lmnp" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="mr-2">{total} Biens Actifs</span>
        <span className="tag bg-green-500/15 text-green-400 border border-green-500/30">{tauxOccupation}% Occupé</span>
        <span className={`w-2 h-2 rounded-full ${occColor} ml-2`} />
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto mr-8"><AddButton onClick={onAdd} label="Ajouter un bien" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {lmnp.map((bien) => (
          <div key={bien.nom} className="glass-panel-inner p-5 rounded-xl" style={{ borderLeft: "4px solid rgba(217,119,6,0.6)" }}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-medium text-[--text-primary]">{bien.nom}</p>
                <p className="text-xs text-[--text-faint]">{bien.type}</p>
              </div>
              <span className={`tag border ${bien.statut === "Loué" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}>
                {bien.statut}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[--text-muted]">Valeur estimée</p>
                <p className="text-lg font-semibold text-[--text-primary]">{formatEur(bien.valeur)}</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">CRD</p>
                <p className="text-lg font-semibold text-red-400">{formatEur(bien.crd)}</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">Loyer mensuel</p>
                <p className="text-lg font-semibold text-green-400">{formatEur(bien.loyerMensuel)}</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">Rendement net</p>
                <p className="text-lg font-semibold text-[--text-primary]">{bien.rendement}%</p>
              </div>
            </div>
            <p className="text-xs text-[--text-faint] mt-3">Amortissement restant : {bien.amortissementRestant} ans</p>
          </div>
        ))}
      </div>
    </div>
  );
}
