import { formatEur } from "@/utils/format";

interface Props {
  total: number;
  effortMensuel: number;
  capitalDeces: number;
}

export default function EpargneKpi({ total, effortMensuel, capitalDeces }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
      {/* Épargne Totale */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(16,185,129,0.5)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Épargne Totale
          <span className="tooltip-text">Somme de toute votre épargne disponible : livrets, plans retraite (PER, PERCOL) et assurance vie.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {formatEur(total)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Livret A + PER + PERCOL</p>
      </div>

      {/* Effort Épargne Mensuel */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(16,185,129,0.5)" }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help" style={{ color: "#10B981" }}>
          Effort d'Épargne Mensuel
          <span className="tooltip-text">Le montant que vous mettez de côté chaque mois. Un bon objectif est entre 15% et 25% de vos revenus nets.</span>
        </h2>
        <p className="text-4xl font-light tracking-tight font-display" style={{ color: "#10B981" }}>
          {formatEur(effortMensuel)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">22% des revenus nets</p>
      </div>

      {/* Prévoyance */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(16,185,129,0.3)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Prévoyance (Capital Décès)
          <span className="tooltip-text">Montant garanti versé à vos proches en cas de décès. C'est la couverture prévue par vos contrats d'assurance.</span>
        </h2>
        <p className="text-4xl font-light text-purple-300 tracking-tight font-display">
          {formatEur(capitalDeces)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Garantie contractuelle</p>
      </div>
    </div>
  );
}
