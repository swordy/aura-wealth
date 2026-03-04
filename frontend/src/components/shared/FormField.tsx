interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  type?: "text" | "number" | "currency" | "percent" | "date" | "select";
  value: string | number;
  onChange: (value: string) => void;
  options?: Option[];
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  error,
  placeholder,
  readOnly = false,
  min,
  max,
  step,
}: Props) {
  const isNumeric = type === "number" || type === "currency" || type === "percent";
  const suffix = type === "currency" ? "€" : type === "percent" ? "%" : null;
  const inputType = isNumeric ? "number" : type === "date" ? "date" : "text";

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-[--text-muted]">
        {label}
      </label>
      {type === "select" ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          className={`w-full bg-[--input-bg] border rounded-lg px-3 py-2.5 text-sm text-[--text-primary] outline-none transition-colors ${
            error
              ? "border-red-500/60 focus:border-red-400"
              : "border-[--border-default] focus:border-gold/50"
          } ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <option value="" className="bg-[--surface-overlay]">— Sélectionner —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[--surface-overlay]">
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step ?? (isNumeric ? 0.01 : undefined)}
            className={`w-full bg-[--input-bg] border rounded-lg px-3 py-2.5 text-sm text-[--text-primary] outline-none transition-colors ${
              suffix ? "pr-8" : ""
            } ${
              error
                ? "border-red-500/60 focus:border-red-400"
                : "border-[--border-default] focus:border-gold/50"
            } ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[--text-faint] pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
