import { formatEur } from "@/utils/format";

interface Props {
  valeurVenale: number;
  crdTotal: number;
  cashflowNetMensuel: number;
  rendementMoyen: number;
}

export default function ImmoKpi({ valeurVenale, crdTotal, cashflowNetMensuel, rendementMoyen }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 stagger">
      {/* Valeur Vénale */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(217,119,6,0.5)" }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help" style={{ color: "#D97706" }}>
          Valeur Vénale
          <span className="tooltip-text">Prix estimé de vos biens immobiliers s'ils étaient vendus aujourd'hui sur le marché.</span>
        </h2>
        <p className="text-4xl font-semibold tracking-tight font-display" style={{ color: "#D97706" }}>
          {formatEur(valeurVenale)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Estimation totale</p>
      </div>

      {/* CRD Total */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(217,119,6,0.3)" }}>
        <h2 className="text-red-400 text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          CRD Total
          <span className="tooltip-text">Capital Restant Dû : le montant total qu'il vous reste à rembourser sur l'ensemble de vos crédits immobiliers.</span>
        </h2>
        <p className="text-4xl font-light text-red-400 tracking-tight font-display">
          {formatEur(crdTotal)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Capital restant dû</p>
      </div>

      {/* Cash-Flow Net */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(217,119,6,0.3)" }}>
        <h2 className="text-green-400 text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Cash-Flow Net
          <span className="tooltip-text">Ce qu'il vous reste chaque mois après avoir payé toutes les charges : loyers perçus moins crédits, charges et impôts.</span>
        </h2>
        <p className="text-4xl font-light text-green-400 tracking-tight font-display">
          +{cashflowNetMensuel} <span className="text-xl text-[--text-muted]">€/mois</span>
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Loyers - Charges - Crédits</p>
      </div>

      {/* Rendement */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(217,119,6,0.3)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Rendement Moyen
          <span className="tooltip-text">Rentabilité annuelle de vos biens locatifs, une fois toutes les charges déduites. Un bon rendement se situe entre 3% et 7%.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {rendementMoyen} <span className="text-xl text-[--text-muted]">%</span>
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Net de charges</p>
      </div>
    </div>
  );
}
