import { useCallback, useRef, useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";

interface Props {
  value: number | string;
  format?: (v: number) => string;
  onSave: (newValue: number | string) => void;
  type?: "currency" | "percent" | "number" | "text";
  label?: string;
  className?: string;
  editClassName?: string;
}

export default function InlineEdit({
  value,
  format,
  onSave,
  type = "currency",
  label,
  className = "text-xl font-semibold",
  editClassName,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [pendingValue, setPendingValue] = useState<number | string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(String(value));
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [editing, value]);

  const commit = useCallback(() => {
    setEditing(false);
    const isNumeric = type !== "text";
    const parsed = isNumeric ? parseFloat(draft) : draft;
    if (isNumeric && isNaN(parsed as number)) return;
    if (parsed !== value) {
      setPendingValue(parsed);
    }
  }, [draft, value, type]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") setEditing(false);
    },
    [commit],
  );

  const formatValue = (v: number | string): string => {
    if (format && typeof v === "number") return format(v);
    if (type === "percent" && typeof v === "number") return `${v}%`;
    return String(v);
  };

  const displayValue = formatValue(value);

  return (
    <RequireRole allowed={["abonne", "super_admin"]} fallback={<span className={className}>{displayValue}</span>}>
      {editing ? (
        <input
          ref={inputRef}
          type={type === "text" ? "text" : "number"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          step={type === "percent" ? 0.1 : type === "text" ? undefined : 1}
          className={`bg-transparent border-b border-gold/50 outline-none text-[--text-primary] ${editClassName ?? className}`}
          style={{ width: `${Math.max(String(draft).length, 3) + 2}ch` }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className={`group relative cursor-pointer inline-flex items-center gap-1 ${className}`}
        >
          {displayValue}
          <svg
            className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </span>
      )}

      <ConfirmDialog
        open={pendingValue !== null}
        variant="info"
        title={`Modifier ${label ?? "la valeur"} ?`}
        message={`Ancienne valeur : ${formatValue(value)}\nNouvelle valeur : ${pendingValue !== null ? formatValue(pendingValue) : ""}`}
        confirmLabel="Enregistrer"
        onConfirm={() => {
          if (pendingValue !== null) {
            onSave(pendingValue);
          }
          setPendingValue(null);
        }}
        onCancel={() => setPendingValue(null)}
      />
    </RequireRole>
  );
}
