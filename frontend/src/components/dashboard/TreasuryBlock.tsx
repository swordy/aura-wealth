import SparkAi from "@/components/shared/SparkAi";
import GlowLine from "@/components/shared/GlowLine";
import InlineEdit from "@/components/shared/InlineEdit";
import type { Tresorerie } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

interface Props {
  tresorerie: Tresorerie;
  onPatch: (patch: Record<string, unknown>) => void;
}

export default function TreasuryBlock({ tresorerie, onPatch }: Props) {
  const totalLiquidites = tresorerie.comptesCourants + tresorerie.epargnePrecaution;

  return (
    <div className="glass-panel p-6 rounded-2xl relative card-hover">
      <SparkAi contextKey="liquidites" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Trésorerie & Épargne Disponible
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center glass-panel-inner p-3 rounded-lg">
          <div>
            <p className="text-sm font-medium text-[--text-primary]">Comptes Courants</p>
            <p className="text-xs text-[--text-faint]">
              <InlineEdit
                value={tresorerie.banques}
                type="text"
                label="les banques"
                className="text-xs text-[--text-faint]"
                onSave={(v) => onPatch({ "tresorerie.banques": v })}
              />
            </p>
          </div>
          <InlineEdit
            value={tresorerie.comptesCourants}
            format={formatEur}
            type="currency"
            label="les comptes courants"
            onSave={(v) => onPatch({ "tresorerie.comptes_courants": v })}
          />
        </div>
        <div className="flex justify-between items-center glass-panel-inner p-3 rounded-lg">
          <div>
            <p className="text-sm font-medium text-[--text-primary]">Épargne de Précaution</p>
            <p className="text-xs text-[--text-faint]">Livret A, LDDS</p>
          </div>
          <InlineEdit
            value={tresorerie.epargnePrecaution}
            format={formatEur}
            type="currency"
            label="l'épargne de précaution"
            onSave={(v) => onPatch({ "tresorerie.epargne_precaution": v })}
          />
        </div>
        <GlowLine className="my-3" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-[--text-muted]">Taux d'épargne mensuel :</span>
          <span className="tag bg-green-500/15 text-green-400 border border-green-500/30">
            {tresorerie.tauxEpargneMensuel}% — Excellent
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[--text-muted]">
            Ratio liquidités / patrimoine :
          </span>
          <span className="tooltip-wrapper">
            <span className="text-xs font-semibold text-[--text-secondary]">
              3.2% ({formatEur(totalLiquidites)})
            </span>
            <span className="tooltip-text">
              Recommandé : 3 à 6 mois de charges (~15 000–30 000 €). Vous êtes dans la fourchette haute — situation confortable.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
