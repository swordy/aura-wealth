import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { useMutation } from "@/hooks/useMutation";

interface Props {
  domain: string;
  label: string;
  onReset?: () => void;
}

export default function ResetButton({ domain, label, onReset }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();
  const { mutate, loading } = useMutation(`/${domain}/reset`, "POST");

  const handleConfirm = async () => {
    setShowConfirm(false);
    const result = await mutate({});
    if (result) {
      toast.success(`Données ${label} réinitialisées`);
      onReset?.();
    } else {
      toast.error("Erreur lors de la réinitialisation");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        title={`Réinitialiser ${label}`}
        className="opacity-40 hover:opacity-100 hover:text-red-400 transition-all duration-200 disabled:opacity-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <ConfirmDialog
        open={showConfirm}
        variant="danger"
        title={`Réinitialiser ${label} ?`}
        message="Cette action remplacera toutes vos données actuelles par les valeurs par défaut. Elle est irréversible."
        confirmLabel="Réinitialiser"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
