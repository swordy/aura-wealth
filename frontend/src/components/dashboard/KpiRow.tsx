import SparkAi from "@/components/shared/SparkAi";
import { formatEur } from "@/utils/format";

interface Props {
  patrimoineBrut: number;
  patrimoineNet: number;
  projection10Ans: number;
  projectionTaux: number;
  variationYtd: number;
}

export default function KpiRow({ patrimoineBrut, patrimoineNet, projection10Ans, projectionTaux, variationYtd }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
      {/* Patrimoine Brut */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border-t-2 border-t-gold/50 card-hover">
        <SparkAi contextKey="patrimoine-brut" className="absolute top-3 right-3" />
        <h2 className="text-[--text-muted] text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Patrimoine Brut
          <span className="tooltip-text">Valeur totale de tout ce que vous possédez : immobilier, épargne, placements, avant déduction des dettes.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {formatEur(patrimoineBrut)}
        </p>
        <p className="text-xs text-green-400/80 mt-2">▲ +{variationYtd}% depuis Janv.</p>
      </div>

      {/* Patrimoine Net */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-black/40 to-[#D4AF37]/10 card-hover">
        <SparkAi contextKey="patrimoine-net" className="absolute top-3 right-3" />
        <h2 className="text-gold text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Patrimoine Net
          <span className="tooltip-text">Ce qui vous appartient vraiment : votre patrimoine brut moins vos crédits en cours. C'est votre richesse réelle.</span>
        </h2>
        <p className="text-4xl font-semibold text-gold tracking-tight font-display">
          {formatEur(patrimoineNet)}
        </p>
        <p className="text-xs text-[--text-muted] mt-2">Brut − Capital Restant Dû</p>
      </div>

      {/* Projection 10 ans */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border-t-2 border-t-blue-500/50 card-hover">
        <SparkAi contextKey="projection" className="absolute top-3 right-3" />
        <h2 className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-1 tooltip-wrapper cursor-help">
          Projection à 10 ans (Net)
          <span className="tooltip-text">Estimation de votre patrimoine net dans 10 ans, en supposant une croissance annuelle de vos actifs.</span>
        </h2>
        <p className="text-4xl font-light text-[--text-primary] tracking-tight font-display">
          {formatEur(projection10Ans)}
        </p>
        <p className="text-xs text-[--text-muted] mt-1">Hypothèse : +{projectionTaux}% / an</p>
      </div>
    </div>
  );
}
