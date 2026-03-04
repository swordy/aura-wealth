import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";
import { useToast } from "@/context/ToastContext";
import type { Investissement } from "@/types/private-equity";

interface Props {
  open: boolean;
  onClose: () => void;
  fonds?: Investissement | null;
  onSaved: () => void;
}

const STATUT_OPTIONS = [
  { value: "En cours", label: "En cours" },
  { value: "Exit", label: "Exit" },
  { value: "Write-off", label: "Write-off" },
];

export default function FondsForm({ open, onClose, fonds, onSaved }: Props) {
  const toast = useToast();
  const isEdit = !!fonds;

  const [nom, setNom] = useState("");
  const [vintage, setVintage] = useState("");
  const [investi, setInvesti] = useState("");
  const [valorisation, setValorisation] = useState("");
  const [statut, setStatut] = useState("");

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (fonds) {
        setNom(fonds.nom);
        setVintage(String(fonds.vintage));
        setInvesti(String(fonds.investi));
        setValorisation(String(fonds.valorisation));
        setStatut(fonds.statut);
      } else {
        setNom("");
        setVintage("");
        setInvesti("");
        setValorisation("");
        setStatut("");
      }
    }
  }, [open, fonds]);

  const tvpiAuto = useMemo(() => {
    const inv = parseFloat(investi);
    const val = parseFloat(valorisation);
    if (!inv || inv <= 0 || isNaN(val)) return null;
    return val / inv;
  }, [investi, valorisation]);

  const handleSaveClick = () => {
    setConfirmSaveOpen(true);
  };

  const handleConfirmSave = () => {
    setConfirmSaveOpen(false);
    toast.success(isEdit ? "Fonds mis à jour" : "Fonds ajouté");
    onSaved();
    onClose();
  };

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    toast.success("Fonds supprimé");
    onSaved();
    onClose();
  };

  const footer = (
    <>
      {isEdit && (
        <RequireRole allowed={["abonne", "super_admin"]}>
          <button
            onClick={handleDeleteClick}
            className="mr-auto py-2.5 px-4 rounded-xl text-sm font-medium text-red-400 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 transition-colors"
          >
            Supprimer
          </button>
        </RequireRole>
      )}
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
        title={isEdit ? "Modifier le fonds" : "Ajouter un fonds"}
        footer={footer}
      >
        <div className="space-y-4">
          <FormField
            label="Nom du fonds"
            type="text"
            value={nom}
            onChange={setNom}
            placeholder="Ex : Ardian Growth Fund V"
          />
          <FormField
            label="Vintage"
            type="number"
            value={vintage}
            onChange={setVintage}
            placeholder="Ex : 2022"
            min={2000}
            max={2100}
            step={1}
          />
          <FormField
            label="Montant investi"
            type="currency"
            value={investi}
            onChange={setInvesti}
            placeholder="0.00"
            min={0}
          />
          <FormField
            label="Valorisation"
            type="currency"
            value={valorisation}
            onChange={setValorisation}
            placeholder="0.00"
            min={0}
          />
          <FormField
            label="TVPI"
            type="number"
            value={tvpiAuto != null ? tvpiAuto.toFixed(2) : ""}
            onChange={() => {}}
            readOnly
            placeholder="Calculé automatiquement"
            step={0.01}
          />
          <FormField
            label="Statut"
            type="select"
            value={statut}
            onChange={setStatut}
            options={STATUT_OPTIONS}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSaveOpen}
        variant="info"
        title={isEdit ? "Confirmer la modification" : "Confirmer l'ajout"}
        message={
          isEdit
            ? "Les modifications du fonds seront enregistrées."
            : "Un nouveau fonds sera ajouté à votre Private Equity."
        }
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        variant="danger"
        title="Supprimer le fonds ?"
        message="Cette action est irréversible. Le fonds sera définitivement supprimé."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
