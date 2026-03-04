import type { TimelineEvent } from "@/types/private-equity";
import { formatEur } from "@/utils/format";

interface Props {
  timeline: TimelineEvent[];
}

export default function PeTimeline({ timeline }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2" style={{ color: "#8B5CF6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Historique Appels / Distributions
      </h2>
      <div className="relative ml-4">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[--border-section]" />

        <div className="space-y-4">
          {timeline.map((ev, i) => {
            const isAppel = ev.type.toLowerCase() === "appel";
            return (
              <div key={i} className="relative pl-6">
                {/* Dot */}
                <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                  isAppel ? "bg-amber-500" : "bg-green-500"
                }`} />

                <div className="glass-panel-inner p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[--text-primary]">{ev.fonds}</p>
                    <p className="text-xs text-[--text-faint]">{ev.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isAppel ? "text-amber-400" : "text-green-400"}`}>
                      {isAppel ? "↓" : "↑"} {formatEur(ev.montant)}
                    </p>
                    <p className="text-xs text-[--text-faint]">{isAppel ? "Appel de fonds" : "Distribution"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
