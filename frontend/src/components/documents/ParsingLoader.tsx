import type { DocumentStatus } from "@/types/document";

interface Props {
  status: DocumentStatus;
}

const STEPS: { status: DocumentStatus; label: string }[] = [
  { status: "extracting", label: "Extraction du texte..." },
  { status: "analyzing", label: "Analyse IA en cours..." },
];

function getStepIndex(status: DocumentStatus): number {
  const idx = STEPS.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : -1;
}

export default function ParsingLoader({ status }: Props) {
  const currentIdx = getStepIndex(status);
  if (currentIdx === -1) return null;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {/* Animated gold pulse */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
          <div className="relative w-6 h-6 rounded-full bg-gold/40 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[--text-primary]">Traitement en cours</p>
          <p className="text-xs text-[--text-muted]">Veuillez patienter</p>
        </div>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;

          return (
            <div key={step.status} className="flex items-center gap-3">
              {/* Step indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? "bg-green-500/20 text-green-400"
                    : isActive
                      ? "bg-gold/20 text-gold"
                      : "bg-[--surface-hover] text-[--text-faint]"
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm ${
                  isDone
                    ? "text-green-400"
                    : isActive
                      ? "text-gold font-medium"
                      : "text-[--text-faint]"
                }`}
              >
                {step.label}
              </span>

              {/* Active spinner */}
              {isActive && (
                <svg className="w-4 h-4 text-gold animate-spin ml-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
