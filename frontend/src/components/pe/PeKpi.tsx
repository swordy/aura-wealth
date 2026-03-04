import { formatEur } from "@/utils/format";

interface Props {
  investi: number;
  valorisation: number;
  tvpi: number;
  dpi: number;
}

export default function PeKpi({ investi, valorisation, tvpi, dpi }: Props) {
  const gainPct = ((valorisation - investi) / investi * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
      {/* Total Investi */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(139,92,246,0.5)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Total Investi
          <span className="tooltip-text">Montant total que vous avez investi dans des fonds de private equity (entreprises non cotées en bourse).</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {formatEur(investi)}
        </p>
      </div>

      {/* Valorisation */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(139,92,246,0.5)" }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help" style={{ color: "#8B5CF6" }}>
          Valorisation Estimée
          <span className="tooltip-text">Valeur actuelle estimée de vos parts en private equity. Cette valeur fluctue selon les performances des entreprises détenues.</span>
        </h2>
        <p className="text-4xl font-semibold tracking-tight font-display" style={{ color: "#8B5CF6" }}>
          {formatEur(valorisation)}
        </p>
        <p className="text-xs text-green-400/80 mt-1">▲ +{gainPct}% depuis investissement</p>
      </div>

      {/* Multiple TVPI */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(139,92,246,0.3)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Multiple (TVPI)
          <span className="tooltip-text">Total Value to Paid-In : combien votre investissement a été multiplié. {tvpi}x signifie +{((tvpi - 1) * 100).toFixed(0)}% de gain par rapport à la mise initiale.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {tvpi.toFixed(2)}<span className="text-xl text-[--text-muted]">x</span>
        </p>
        <p className="text-xs text-[--text-muted] mt-1">DPI : {dpi.toFixed(1)}x</p>
      </div>
    </div>
  );
}
