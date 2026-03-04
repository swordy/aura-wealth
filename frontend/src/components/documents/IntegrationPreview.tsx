import { useState } from "react";
import type { ExtractionResult } from "@/types/document";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface Props {
  results: ExtractionResult[];
  onIntegrate: (selected: ExtractionResult[]) => void;
  onClose: () => void;
  loading?: boolean;
}

const DOMAIN_LABELS: Record<string, string> = {
  dashboard: "Synthese",
  epargne: "Epargne",
  bourse: "Bourse",
  immobilier: "Immobilier",
  private_equity: "Private Equity",
};

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "number") {
    return val.toLocaleString("fr-FR");
  }
  if (typeof val === "object") {
    return JSON.stringify(val, null, 0);
  }
  return String(val);
}

function confidenceBadge(c: number): { label: string; classes: string } {
  if (c >= 0.9) return { label: "Haute", classes: "bg-green-500/20 text-green-300 border-green-500/30" };
  if (c >= 0.6) return { label: "Moyenne", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
  return { label: "Faible", classes: "bg-red-500/20 text-red-300 border-red-500/30" };
}

export default function IntegrationPreview({ results, onIntegrate, onClose, loading = false }: Props) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(results.map((_, i) => i)));
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allSelected = selected.size === results.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map((_, i) => i)));
    }
  }

  function toggle(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function handleConfirm() {
    setConfirmOpen(false);
    const selectedResults = results.filter((_, i) => selected.has(i));
    onIntegrate(selectedResults);
  }

  if (results.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-[--text-faint]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-[--text-muted] text-sm">Aucune donnee extraite</p>
        <p className="text-[--text-faint] text-xs mt-1">Le document ne contient pas de donnees financieres exploitables.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-panel rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-[--text-muted]">
              Resultats de l'analyse
            </h3>
            <p className="text-xs text-[--text-faint] mt-1">
              {results.length} valeur{results.length > 1 ? "s" : ""} detectee{results.length > 1 ? "s" : ""} — {selected.size} selectionnee{selected.size > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-faint] hover:text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-widest uppercase text-[--text-faint] border-b border-[--border-subtle]">
                <th className="py-2 pr-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-[--border-strong] bg-transparent text-gold focus:ring-gold/50"
                  />
                </th>
                <th className="py-2 px-3 text-left">Domaine</th>
                <th className="py-2 px-3 text-left">Champ</th>
                <th className="py-2 px-3 text-right">Valeur actuelle</th>
                <th className="py-2 px-3 text-right">Nouvelle valeur</th>
                <th className="py-2 px-3 text-center">Action</th>
                <th className="py-2 pl-3 text-center">Confiance</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const isCreate = r.action === "create";
                const conf = confidenceBadge(r.confidence);
                const rowBg = selected.has(i)
                  ? isCreate
                    ? "bg-green-500/5"
                    : "bg-amber-500/5"
                  : "";

                return (
                  <tr
                    key={`${r.domain}-${r.fieldPath}-${i}`}
                    className={`border-b border-[--border-subtle] transition-colors ${rowBg}`}
                  >
                    <td className="py-2.5 pr-3">
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggle(i)}
                        className="rounded border-[--border-strong] bg-transparent text-gold focus:ring-gold/50"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-[--text-muted]">
                      {DOMAIN_LABELS[r.domain] ?? r.domain}
                    </td>
                    <td className="py-2.5 px-3 text-[--text-primary] font-medium">
                      {r.fieldLabel}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[--text-faint] font-mono text-xs">
                      {formatValue(r.currentValue)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono text-xs font-medium ${isCreate ? "text-green-400" : "text-amber-300"}`}>
                      {formatValue(r.newValue)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`tag border ${isCreate ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}>
                        {isCreate ? "Nouveau" : "Mise a jour"}
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 text-center">
                      <span className={`tag border ${conf.classes}`}>
                        {conf.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[--border-subtle]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={selected.size === 0 || loading}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Integrer {selected.size} valeur{selected.size > 1 ? "s" : ""}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        variant="warning"
        title="Integrer les donnees du document ?"
        message={`${selected.size} valeur${selected.size > 1 ? "s" : ""} vont etre mises a jour dans votre patrimoine. Les valeurs existantes seront ecrasees.`}
        confirmLabel="Integrer"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
