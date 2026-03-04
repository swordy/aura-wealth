import GlowLine from "@/components/shared/GlowLine";
import type { AssuranceVie } from "@/types/epargne";
import { formatEur } from "@/utils/format";

interface Props {
  assuranceVie: AssuranceVie;
}

export default function AssuranceVieBlock({ assuranceVie }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Assurance Vie
      </h2>
      <div className="glass-panel-inner p-4 rounded-lg mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[--text-primary]">Solde Total</span>
          <span className="text-xl font-semibold">{formatEur(assuranceVie.solde)}</span>
        </div>
        <p className="text-xs text-[--text-muted] mb-3">Répartition Fonds Euros / UC</p>
        <div className="flex rounded-full overflow-hidden h-2 bg-[--input-bg] mb-2">
          <div className="bg-green-500" style={{ width: `${assuranceVie.fondsEurosPct}%` }} />
          <div className="bg-blue-500" style={{ width: `${assuranceVie.ucPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[--text-muted]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Fonds € {assuranceVie.fondsEurosPct}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> UC {assuranceVie.ucPct}%
          </span>
        </div>
      </div>
      <GlowLine className="my-3" />
      <div className="flex justify-between items-center text-sm">
        <span className="text-[--text-muted]">Rendement annuel :</span>
        <span className="text-green-400 font-semibold">+{assuranceVie.rendementAnnuel}%</span>
      </div>
    </div>
  );
}
