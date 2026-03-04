import { useEffect, useState } from "react";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";
import { useToast } from "@/context/ToastContext";
import type { Position } from "@/types/bourse";

interface PositionLike extends Partial<Position> {
  enveloppe?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  position?: PositionLike | null;
  envelope?: string;
  onSaved: () => void;
}

const ENVELOPE_OPTIONS = [
  { value: "PEA", label: "PEA" },
  { value: "CTO", label: "CTO" },
  { value: "PEA-PME", label: "PEA-PME" },
];

export default function PositionForm({
  open,
  onClose,
  position,
  envelope,
  onSaved,
}: Props) {
  const toast = useToast();
  const isEdit = !!position;

  const [enveloppe, setEnveloppe] = useState("");
  const [nom, setNom] = useState("");
  const [ticker, setTicker] = useState("");
  const [valeur, setValeur] = useState("");
  const [poids, setPoids] = useState("");
  const [ytd, setYtd] = useState("");
  const [pvEur, setPvEur] = useState("");

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (position) {
        setEnveloppe(position.enveloppe ?? envelope ?? "");
        setNom(position.nom ?? "");
        setTicker(position.ticker ?? "");
        setValeur(position.valeur != null ? String(position.valeur) : "");
        setPoids(position.poids != null ? String(position.poids) : "");
        setYtd(position.ytd != null ? String(position.ytd) : "");
        setPvEur(position.pvEur != null ? String(position.pvEur) : "");
      } else {
        setEnveloppe(envelope ?? "");
        setNom("");
        setTicker("");
        setValeur("");
        setPoids("");
        setYtd("");
        setPvEur("");
      }
    }
  }, [open, position, envelope]);

  const handleSaveClick = () => {
    setConfirmSaveOpen(true);
  };

  const handleConfirmSave = () => {
    setConfirmSaveOpen(false);
    toast.success(isEdit ? "Position mise à jour" : "Position ajoutée");
    onSaved();
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="py-2.5 px-5 rounded-xl text-sm font-medium text-[--text-secondary] bg-[--surface-hover] hover:bg-[--surface-hover] border border-[--border-default] transition-colors"
      >
        Annuler
      </button>
      <RequireRole allowed={["abonne", "super_admin"]}>
        <button
          onClick={handleSaveClick}
          className="py-2.5 px-5 rounded-xl text-sm font-medium text-white bg-gold/80 hover:bg-gold border border-gold/50 transition-colors"
        >
          Enregistrer
        </button>
      </RequireRole>
    </>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={isEdit ? "Modifier la position" : "Ajouter une position"}
        footer={footer}
      >
        <div className="space-y-4">
          <FormField
            label="Enveloppe"
            type="select"
            value={enveloppe}
            onChange={setEnveloppe}
            options={ENVELOPE_OPTIONS}
          />
          <FormField
            label="Nom"
            type="text"
            value={nom}
            onChange={setNom}
            placeholder="Ex : LVMH, Air Liquide..."
          />
          <FormField
            label="Ticker"
            type="text"
            value={ticker}
            onChange={setTicker}
            placeholder="Ex : MC.PA, AI.PA..."
          />
          <FormField
            label="Valeur actuelle"
            type="currency"
            value={valeur}
            onChange={setValeur}
            placeholder="0.00"
            min={0}
          />
          <FormField
            label="Poids"
            type="percent"
            value={poids}
            onChange={setPoids}
            placeholder="Optionnel"
            min={0}
            max={100}
            step={0.1}
          />
          <FormField
            label="Performance YTD"
            type="percent"
            value={ytd}
            onChange={setYtd}
            placeholder="0.00"
            step={0.1}
          />
          <FormField
            label="Plus-value"
            type="currency"
            value={pvEur}
            onChange={setPvEur}
            placeholder="Peut être négatif"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSaveOpen}
        variant="info"
        title={isEdit ? "Confirmer la modification" : "Confirmer l'ajout"}
        message={
          isEdit
            ? "Les modifications de la position seront enregistrées."
            : "Une nouvelle position sera ajoutée à votre portefeuille."
        }
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />
    </>
  );
}
