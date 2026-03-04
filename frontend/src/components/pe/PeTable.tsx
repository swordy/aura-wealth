import SparkAi from "@/components/shared/SparkAi";
import AddButton from "@/components/shared/AddButton";
import RequireRole from "@/components/auth/RequireRole";
import type { Investissement } from "@/types/private-equity";
import { formatEur } from "@/utils/format";

type Statut = "En cours" | "Exit" | "Write-off";

const STATUT_CLASSES: Record<Statut, string> = {
  "En cours": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Exit: "bg-green-500/15 text-green-400 border-green-500/30",
  "Write-off": "bg-red-500/15 text-red-400 border-red-500/30",
};

interface Props {
  fonds: Investissement[];
  irrEstime: number;
  onAdd?: () => void;
}

export default function PeTable({ fonds, irrEstime, onAdd }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="pe" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#8B5CF6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Portefeuille Private Equity
        {onAdd && (
          <RequireRole allowed={["abonne", "super_admin"]}>
            <span className="ml-auto mr-8"><AddButton onClick={onAdd} label="Ajouter un fonds" /></span>
          </RequireRole>
        )}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-[--text-muted] uppercase tracking-wide border-b border-[--border-section]">
              <th className="text-left py-3 pr-4">Investissement</th>
              <th className="text-right py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Investi</th>
              <th className="text-right py-3 px-4">Valorisation</th>
              <th className="text-right py-3 px-4">TVPI</th>
              <th className="text-right py-3 pl-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {fonds.map((inv) => (
              <tr key={inv.nom} className="text-sm">
                <td className="py-3 pr-4 text-[--text-primary] font-medium">{inv.nom}</td>
                <td className="py-3 px-4 text-right text-[--text-muted]">{inv.vintage}</td>
                <td className="py-3 px-4 text-right">{formatEur(inv.investi)}</td>
                <td className="py-3 px-4 text-right">{formatEur(inv.valorisation)}</td>
                <td className="py-3 px-4 text-right">{inv.tvpi.toFixed(2)}x</td>
                <td className="py-3 pl-4 text-right">
                  <span className={`tag border ${STATUT_CLASSES[inv.statut as Statut] ?? ""}`}>{inv.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-lg border mt-4 flex justify-between items-center" style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
        <div className="tooltip-wrapper">
          <span className="text-sm text-[--text-secondary]">IRR estimé :</span>
          <span className="tooltip-text">Le Taux de Rendement Interne mesure la rentabilité annualisée de vos investissements en tenant compte du timing des flux</span>
        </div>
        <span className="text-lg font-bold" style={{ color: "#8B5CF6" }}>~{irrEstime}%</span>
      </div>
    </div>
  );
}
