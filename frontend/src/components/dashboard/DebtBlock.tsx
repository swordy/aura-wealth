import SparkAi from "@/components/shared/SparkAi";
import InlineEdit from "@/components/shared/InlineEdit";
import type { Endettement } from "@/types/dashboard";
import { formatEur } from "@/utils/format";

interface Props {
  endettement: Endettement;
  onPatch: (patch: Record<string, unknown>) => void;
}

export default function DebtBlock({ endettement, onPatch }: Props) {
  const barPct = (endettement.tauxEndettement / endettement.maxHcsf) * 100;

  return (
    <div className="glass-panel p-6 rounded-2xl relative card-hover border-l-4 border-l-blue-500/50">
      <SparkAi contextKey="endettement" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        Endettement & Levier Bancaire
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-panel-inner p-3 rounded-lg">
          <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold">
            Capital Restant Dû
          </p>
          <p className="text-xl font-medium text-[--text-primary] mt-1">
            <InlineEdit
              value={endettement.crd}
              format={formatEur}
              type="currency"
              label="le capital restant dû"
              className="text-xl font-medium text-[--text-primary]"
              onSave={(v) => onPatch({ "endettement.crd": v })}
            />
          </p>
        </div>
        <div className="glass-panel-inner p-3 rounded-lg">
          <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold">
            Taux d'endettement
          </p>
          <p className="text-xl font-medium text-blue-400 mt-1">
            <InlineEdit
              value={endettement.tauxEndettement}
              type="percent"
              label="le taux d'endettement"
              className="text-xl font-medium text-blue-400"
              onSave={(v) => onPatch({ "endettement.taux_endettement": v })}
            /> %
          </p>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill bg-blue-500" style={{ width: `${barPct}%` }} />
          </div>
          <p className="text-xs text-[--text-faint] mt-1">Max HCSF : {endettement.maxHcsf}%</p>
        </div>
      </div>
      <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/30 flex justify-between items-center">
        <span className="text-sm text-blue-100">Capacité d'emprunt résiduelle :</span>
        <span className="text-lg font-bold text-blue-400">
          ~{" "}
          <InlineEdit
            value={endettement.capaciteResiduelle}
            format={formatEur}
            type="currency"
            label="la capacité résiduelle"
            className="text-lg font-bold text-blue-400"
            onSave={(v) => onPatch({ "endettement.capacite_residuelle": v })}
          />
        </span>
      </div>
    </div>
  );
}
