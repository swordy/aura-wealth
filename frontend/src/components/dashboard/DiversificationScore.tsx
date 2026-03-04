interface Props {
  score: number;
}

export default function DiversificationScore({ score }: Props) {
  const pct = score * 10;

  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center justify-between card-hover">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-[--text-muted] uppercase tracking-wide font-semibold">
            Score de Diversification
          </p>
          <p className="text-xs text-[--text-faint] mt-0.5">
            Concentration immobilière élevée (85%)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="tooltip-wrapper">
          <span className="text-2xl font-bold text-amber-400 font-display">{score}<span className="text-sm text-[--text-faint]">/10</span></span>
          <span className="tooltip-text">
            Score basé sur la répartition entre classes d'actifs. 10 = parfaitement diversifié. Votre concentration en immobilier (85%) réduit le score.
          </span>
        </div>
        <div className="w-20">
          <div className="progress-bar">
            <div
              className="progress-bar-fill bg-amber-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
