import { useState } from "react";
import SparkAi from "@/components/shared/SparkAi";
import InlineEdit from "@/components/shared/InlineEdit";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";
import type { Fiscal } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

const TMI_VALUES = [11, 30, 41, 45];

interface Props {
  fiscal: Fiscal;
  onPatch: (patch: Record<string, unknown>) => void;
}

export default function FiscalMonitor({ fiscal, onPatch }: Props) {
  const [pendingTmi, setPendingTmi] = useState<number | null>(null);

  const handleTmiClick = (rate: number) => {
    if (rate !== fiscal.tmi) {
      setPendingTmi(rate);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative card-hover border-l-4 border-l-red-500/50">
      <SparkAi contextKey="fiscal" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Moniteur Fiscal
      </h2>

      {/* TMI Selector */}
      <div className="mb-4">
        <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold mb-2">
          Votre Tranche Marginale (TMI)
        </p>
        <div className="flex gap-1">
          {TMI_VALUES.map((rate) => {
            const active = rate === fiscal.tmi;
            return (
              <RequireRole
                key={rate}
                allowed={["abonne", "super_admin"]}
                fallback={
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${
                      active
                        ? "bg-gold/20 text-gold border-gold/50 font-bold"
                        : "bg-[--input-bg] text-[--text-faint] border-[--border-section]"
                    }`}
                  >
                    {rate}%
                  </span>
                }
              >
                <button
                  onClick={() => handleTmiClick(rate)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    active
                      ? "bg-gold/20 text-gold border-gold/50 font-bold"
                      : "bg-[--input-bg] text-[--text-faint] border-[--border-section] hover:border-gold/30 hover:text-[--text-secondary] cursor-pointer"
                  }`}
                >
                  {rate}%
                </button>
              </RequireRole>
            );
          })}
        </div>
      </div>

      {/* Tax lines */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[--text-secondary]">Impôt sur le Revenu (IR)</span>
          <InlineEdit
            value={fiscal.ir}
            format={formatEur}
            type="currency"
            label="l'impôt sur le revenu"
            className="font-medium text-[--text-primary]"
            onSave={(v) => onPatch({ "fiscal.ir": v })}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[--text-secondary]">Prélèvements Sociaux (17.2%)</span>
          <InlineEdit
            value={fiscal.ps}
            format={formatEur}
            type="currency"
            label="les prélèvements sociaux"
            className="font-medium text-[--text-primary]"
            onSave={(v) => onPatch({ "fiscal.ps": v })}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[--text-secondary]">Taxes Foncières</span>
          <InlineEdit
            value={fiscal.tf}
            format={formatEur}
            type="currency"
            label="les taxes foncières"
            className="font-medium text-[--text-primary]"
            onSave={(v) => onPatch({ "fiscal.tf": v })}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[--text-secondary]">IFI</span>
          <span className="tag bg-green-500/15 text-green-400 border border-green-500/30">
            Exonéré (&lt; 1.3M€)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[--text-secondary]">Taxe d'Habitation (Rés. Secondaire)</span>
          <span className="font-medium text-[--text-primary]">—</span>
        </div>
      </div>

      {/* Taux effectif */}
      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-[--text-muted]">Taux effectif d'imposition :</span>
        <span className="tooltip-wrapper">
          <span className="font-semibold text-amber-400">{fiscal.tauxEffectif}%</span>
          <span className="tooltip-text">Charge fiscale totale ({formatEur(fiscal.totalAnnuel)}) / revenus bruts annuels estimés</span>
        </span>
      </div>

      {/* Total */}
      <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30 flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-red-200">Total payé (Annuel) :</span>
        <span className="text-xl font-bold text-red-400">{formatEur(fiscal.totalAnnuel)}</span>
      </div>

      {/* PER simulation */}
      <div className="bg-gold/5 p-3 rounded-lg border border-gold/20 flex justify-between items-center">
        <span className="text-sm text-gold/80">Économie si 10 000 € en PER :</span>
        <span className="text-lg font-bold text-gold">{formatEur(fiscal.economiePer10K)}</span>
      </div>

      {/* TMI ConfirmDialog */}
      <ConfirmDialog
        open={pendingTmi !== null}
        variant="info"
        title="Modifier la tranche marginale ?"
        message={`Ancienne valeur : ${fiscal.tmi}%\nNouvelle valeur : ${pendingTmi}%`}
        confirmLabel="Enregistrer"
        onConfirm={() => {
          if (pendingTmi !== null) {
            onPatch({ "fiscal.tmi": pendingTmi });
          }
          setPendingTmi(null);
        }}
        onCancel={() => setPendingTmi(null)}
      />
    </div>
  );
}
