const PERIODS = ["7j", "1m", "3m", "YTD", "1an"] as const;
export type Period = (typeof PERIODS)[number];

interface PeriodSelectorProps {
  value: Period;
  onChange: (p: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
            value === p
              ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
              : "bg-transparent text-[--text-faint] border-[--border-section] hover:border-[--border-strong]"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
