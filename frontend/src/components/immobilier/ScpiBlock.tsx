import GlowLine from "@/components/shared/GlowLine";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import type { Scpi } from "@/types/immobilier";
import { formatEur } from "@/utils/format";

interface Props {
  scpis: Scpi[];
  onAdd?: () => void;
}

export default function ScpiBlock({ scpis, onAdd }: Props) {
  const totalScpi = scpis.reduce((s, sc) => s + sc.valeur, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        SCPI — {formatEur(totalScpi)}
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto"><AddButton onClick={onAdd} label="Ajouter une SCPI" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scpis.map((sc) => (
          <div key={sc.nom} className="glass-panel-inner p-4 rounded-lg" style={{ borderLeft: "4px solid rgba(217,119,6,0.4)" }}>
            <p className="text-sm font-medium text-[--text-primary]">{sc.nom}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-[--text-muted]">Parts</p>
                <p className="text-lg font-semibold text-[--text-primary]">{sc.parts}</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">Valorisation</p>
                <p className="text-lg font-semibold text-[--text-primary]">{formatEur(sc.valeur)}</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">Rendement annuel</p>
                <p className="text-lg font-semibold text-green-400">{sc.rendement}%</p>
              </div>
              <div>
                <p className="text-xs text-[--text-muted]">Liquidité</p>
                <p className="text-sm text-[--text-secondary]">{sc.delaiJouissance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GlowLine className="my-3" />
      <div className="flex justify-between items-center text-sm">
        <span className="text-[--text-muted]">Total SCPI :</span>
        <span className="font-semibold" style={{ color: "#D97706" }}>{formatEur(totalScpi)}</span>
      </div>
    </div>
  );
}
