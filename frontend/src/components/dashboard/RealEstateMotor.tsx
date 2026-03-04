import SparkAi from "@/components/shared/SparkAi";
import GlowLine from "@/components/shared/GlowLine";
import InlineEdit from "@/components/shared/InlineEdit";
import type { MoteurImmo } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

interface Props {
  moteurImmo: MoteurImmo;
  onPatch: (patch: Record<string, unknown>) => void;
}

export default function RealEstateMotor({ moteurImmo, onPatch }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl relative card-hover">
      <SparkAi contextKey="revenus-locatifs" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Moteur Immobilier
      </h2>
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold">
            Revenus Locatifs Annuels (Bruts)
          </p>
          <div className="flex items-baseline mt-1">
            <p className="text-3xl font-semibold text-[--text-primary] font-display">{formatEur(moteurImmo.revenusLocatifsAnnuels)}</p>
            <p className="text-sm text-[--text-muted] ml-2">
              soit{" "}
              <InlineEdit
                value={moteurImmo.revenusLocatifsMensuels}
                format={formatEur}
                type="currency"
                label="les revenus locatifs mensuels"
                className="text-sm text-[--text-muted]"
                onSave={(v) => onPatch({ "moteur_immo.revenus_locatifs_mensuels": v })}
              />
              {" "}/ mois
            </p>
          </div>
        </div>
        <div className="glass-panel-inner p-3 rounded-lg text-sm">
          <div className="flex justify-between text-[--text-secondary] mb-1">
            <span>Mensualités Crédits Immo :</span>
            <span className="text-red-400">
              -{" "}
              <InlineEdit
                value={moteurImmo.mensualitesCredits}
                format={formatEur}
                type="currency"
                label="les mensualités crédits"
                className="text-red-400"
                editClassName="text-red-400"
                onSave={(v) => onPatch({ "moteur_immo.mensualites_credits": v })}
              />
              {" "}/ an
            </span>
          </div>
          <GlowLine className="my-2" />
          <div className="flex justify-between font-medium">
            <span className="text-[--text-primary]">Cash-Flow Net :</span>
            <span className="text-green-400 text-lg font-bold">+ {formatEur(moteurImmo.cashflowNetMensuel)} / mois</span>
          </div>
        </div>
      </div>
    </div>
  );
}
