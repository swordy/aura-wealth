import type { BienSynthese } from "@/types/immobilier";
import { formatEur } from "@/utils/format";

const TAG_CLASSES: Record<string, string> = {
  LMNP: "bg-green-500/15 text-green-400 border-green-500/30",
  SCI: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  RP: "bg-[--surface-hover] text-[--text-muted] border-[--border-default]",
};

interface Props {
  synthese: BienSynthese[];
}

export default function ImmoSynthese({ synthese }: Props) {
  const totalValeur = synthese.reduce((s, b) => s + b.valeur, 0);
  const totalCrd = synthese.reduce((s, b) => s + b.crd, 0);
  const totalLoyer = synthese
    .filter((b) => b.loyerMensuel !== null && b.loyerMensuel > 0)
    .reduce((s, b) => s + (b.loyerMensuel ?? 0), 0);

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Synthèse Patrimoine Immobilier
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-[--text-muted] uppercase tracking-wide border-b border-[--border-section]">
              <th className="text-left py-3 pr-4">Bien</th>
              <th className="text-right py-3 px-4">Valeur</th>
              <th className="text-right py-3 px-4">CRD</th>
              <th className="text-right py-3 px-4">Loyer/mois</th>
              <th className="text-right py-3 px-4">Rdt Net</th>
              <th className="text-right py-3 pl-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {synthese.map((b) => (
              <tr key={b.nom} className="text-sm">
                <td className="py-3 pr-4 text-[--text-primary] font-medium">{b.nom}</td>
                <td className="py-3 px-4 text-right">{formatEur(b.valeur)}</td>
                <td className="py-3 px-4 text-right text-red-400">{formatEur(b.crd)}</td>
                <td className="py-3 px-4 text-right">{b.loyerMensuel !== null && b.loyerMensuel > 0 ? formatEur(b.loyerMensuel) : "—"}</td>
                <td className="py-3 px-4 text-right">{b.rendement !== null && b.rendement > 0 ? `${b.rendement}%` : "—"}</td>
                <td className="py-3 pl-4 text-right">
                  <span className={`tag border ${TAG_CLASSES[b.type] ?? TAG_CLASSES.RP}`}>{b.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-sm font-semibold" style={{ borderTop: "2px solid rgba(217,119,6,0.3)" }}>
              <td className="py-3 pr-4" style={{ color: "#D97706" }}>Total</td>
              <td className="py-3 px-4 text-right" style={{ color: "#D97706" }}>{formatEur(totalValeur)}</td>
              <td className="py-3 px-4 text-right text-red-400">{formatEur(totalCrd)}</td>
              <td className="py-3 px-4 text-right">{formatEur(totalLoyer)}</td>
              <td className="py-3 px-4 text-right">—</td>
              <td className="py-3 pl-4" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
