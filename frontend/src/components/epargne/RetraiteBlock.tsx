import SparkAi from "@/components/shared/SparkAi";
import GlowLine from "@/components/shared/GlowLine";
import type { Retraite } from "@/types/epargne";
import { formatEur } from "@/utils/format";

interface Props {
  retraite: Retraite;
}

export default function RetraiteBlock({ retraite }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover border-l-4" style={{ borderLeftColor: "rgba(16,185,129,0.5)" }}>
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Épargne Retraite
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center glass-panel-inner p-4 rounded-lg relative">
          <SparkAi contextKey="per" className="absolute top-2 right-2" />
          <div>
            <p className="text-sm font-medium text-[--text-primary]">PER Individuel</p>
            <p className="text-xs text-[--text-faint]">Déductible IR • Bloqué jusqu'à la retraite</p>
          </div>
          <p className="text-xl font-semibold" style={{ color: "#10B981" }}>{formatEur(retraite.per.solde)}</p>
        </div>
        <div className="flex justify-between items-center glass-panel-inner p-4 rounded-lg">
          <div>
            <p className="text-sm font-medium text-[--text-primary]">PERCOL (Entreprise)</p>
            <p className="text-xs text-[--text-faint]">Abondement employeur • Gestion pilotée</p>
          </div>
          <p className="text-xl font-semibold">{formatEur(retraite.percol.solde)}</p>
        </div>
      </div>
      <GlowLine className="my-4" />
      <div className="flex justify-between items-center">
        <span className="text-xs text-[--text-muted]">Total Retraite :</span>
        <span className="text-lg font-bold" style={{ color: "#10B981" }}>{formatEur(retraite.total)}</span>
      </div>
      <div
        className="p-3 rounded-lg border mt-3 flex justify-between items-center"
        style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
      >
        <span className="text-sm text-[--text-secondary]">Plafond déductible restant :</span>
        <span className="text-lg font-bold" style={{ color: "#10B981" }}>{formatEur(retraite.plafondDeductibleRestant)}</span>
      </div>

      <div
        className="p-3 rounded-lg border mt-3 text-sm text-[--text-secondary]"
        style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
      >
        <span className="font-medium" style={{ color: "#10B981" }}>Astuce :</span>{" "}
        Versez 10 000 € sur votre PER avant le 31/12 pour économiser 3 000 € d'IR (TMI 30%).
      </div>
    </div>
  );
}
