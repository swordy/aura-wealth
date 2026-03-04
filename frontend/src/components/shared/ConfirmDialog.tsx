import { useEffect } from "react";

type Variant = "danger" | "warning" | "info";

interface Props {
  open: boolean;
  variant?: Variant;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES: Record<Variant, { border: string; bg: string; btn: string; icon: string }> = {
  danger: {
    border: "border-red-500/40",
    bg: "bg-red-900/20",
    btn: "bg-red-600 hover:bg-red-700 text-white",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  },
  warning: {
    border: "border-amber-500/40",
    bg: "bg-amber-900/20",
    btn: "bg-amber-600 hover:bg-amber-700 text-white",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  },
  info: {
    border: "border-blue-500/40",
    bg: "bg-blue-900/20",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
};

export default function ConfirmDialog({
  open,
  variant = "info",
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const s = VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-[--backdrop] backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md glass-panel rounded-2xl border ${s.border} shadow-2xl p-6 animate-modal-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-4`}>
          <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
          </svg>
        </div>
        <h3 className="text-lg font-display font-light text-[--text-primary] text-center mb-2">{title}</h3>
        <p className="text-sm text-[--text-muted] text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[--text-secondary] bg-[--surface-hover] hover:bg-[--surface-hover] border border-[--border-default] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${s.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
