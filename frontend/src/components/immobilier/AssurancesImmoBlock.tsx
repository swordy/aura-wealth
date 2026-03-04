import type { AssuranceImmo } from "@/types/immobilier";

interface Props {
  assurances: AssuranceImmo[];
}

export default function AssurancesImmoBlock({ assurances }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Assurances Immobilières
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {assurances.map((a) => {
          const active = a.statut === "Active";
          return (
            <div key={a.nom} className="glass-panel-inner p-4 rounded-lg flex items-center justify-between">
              <span className="text-sm text-[--text-primary]">{a.nom}</span>
              <span className={`text-sm font-medium ${active ? "text-green-400" : "text-red-400"}`}>
                {active ? "✓ Active" : "✗ Inactive"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
