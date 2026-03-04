import { formatEur } from "@/utils/format";

interface Props {
  actifsFinanciers: number;
  peaTotal: number;
  peaYtd: number;
  cryptoTotal: number;
  cryptoYtd: number;
}

export default function BourseKpi({ actifsFinanciers, peaTotal, peaYtd, cryptoTotal, cryptoYtd }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
      {/* Actifs Financiers */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(59,130,246,0.5)" }}>
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Actifs Financiers
          <span className="tooltip-text">Total de vos placements en bourse et en cryptomonnaies. C'est la partie « marchés financiers » de votre patrimoine.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {formatEur(actifsFinanciers)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">PEA + Crypto</p>
      </div>

      {/* PEA */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(59,130,246,0.5)" }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help" style={{ color: "#3B82F6" }}>
          PEA (Actions)
          <span className="tooltip-text">Plan d'Épargne en Actions : enveloppe fiscale avantageuse pour investir en bourse. Les gains sont exonérés d'impôt après 5 ans.</span>
        </h2>
        <p className="text-4xl font-semibold tracking-tight font-display" style={{ color: "#3B82F6" }}>
          {formatEur(peaTotal)}
        </p>
        <p className="text-xs text-green-400/80 mt-1">▲ +{peaYtd}% YTD</p>
      </div>

      {/* Crypto */}
      <div className="glass-panel p-6 rounded-2xl text-center card-hover border-t-2" style={{ borderTopColor: "rgba(59,130,246,0.3)" }}>
        <h2 className="text-purple-400 text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Crypto (Total)
          <span className="tooltip-text">Valeur totale de vos cryptomonnaies (Bitcoin, Ethereum, etc.). Actifs très volatils, à considérer sur le long terme.</span>
        </h2>
        <p className="text-4xl font-light text-purple-300 tracking-tight font-display">
          {formatEur(cryptoTotal)}
        </p>
        <p className="text-xs text-green-400/80 mt-1">▲ +{cryptoYtd}% YTD</p>
      </div>
    </div>
  );
}
