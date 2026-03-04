import { useEffect, useState } from "react";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";
import { useToast } from "@/context/ToastContext";
import { useMutation } from "@/hooks/useMutation";
import type { Livret } from "@/types/epargne";

interface Props {
  open: boolean;
  onClose: () => void;
  livret?: Livret | null;
  livretIndex?: number | null;
  onSaved: () => void;
}

const NOM_OPTIONS = [
  { value: "Livret A", label: "Livret A" },
  { value: "LDDS", label: "LDDS" },
  { value: "PEL", label: "PEL" },
  { value: "CEL", label: "CEL" },
  { value: "Livret Jeune", label: "Livret Jeune" },
  { value: "Autre", label: "Autre" },
];

const STATUT_OPTIONS = [
  { value: "Actif", label: "Actif" },
  { value: "Plein", label: "Plein" },
  { value: "Clôturé", label: "Clôturé" },
];

const CAPPED_LIVRETS = ["Livret A", "LDDS"];

export default function LivretForm({ open, onClose, livret, livretIndex, onSaved }: Props) {
  const toast = useToast();
  const { mutate } = useMutation("/epargne", "PATCH");
  const isEdit = !!livret;

  const [nom, setNom] = useState("");
  const [solde, setSolde] = useState("");
  const [plafond, setPlafond] = useState("");
  const [taux, setTaux] = useState("");
  const [statut, setStatut] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      if (livret) {
        setNom(livret.nom);
        setSolde(String(livret.solde));
        setPlafond(String(livret.plafond));
        setTaux(String(livret.taux));
        setStatut(livret.statut);
      } else {
        setNom("");
        setSolde("");
        setPlafond("");
        setTaux("");
        setStatut("Actif");
      }
    }
  }, [open, livret]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!nom) errs.nom = "Champ obligatoire";
    if (!solde || parseFloat(solde) < 0) errs.solde = "Montant invalide";
    if (!plafond || parseFloat(plafond) <= 0) errs.plafond = "Montant invalide";
    if (!taux || parseFloat(taux) <= 0) errs.taux = "Le taux doit être supérieur à 0";
    if (!statut) errs.statut = "Champ obligatoire";

    if (CAPPED_LIVRETS.includes(nom) && parseFloat(solde) > parseFloat(plafond)) {
      errs.solde = `Le solde ne peut pas dépasser le plafond pour un ${nom}`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveClick = () => {
    if (!validate()) return;
    setConfirmSaveOpen(true);
  };

  const buildLivretData = (): Livret => ({
    nom,
    solde: parseFloat(solde),
    plafond: parseFloat(plafond),
    taux: parseFloat(taux),
    statut,
  });

  const handleConfirmSave = async () => {
    setConfirmSaveOpen(false);
    const newLivret = buildLivretData();

    if (isEdit && livretIndex !== null && livretIndex !== undefined) {
      // Update existing livret at index
      const result = await mutate({ [`livrets.${livretIndex}`]: newLivret });
      if (result) {
        toast.success("Livret mis à jour");
        onSaved();
        onClose();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } else {
      // Add new livret — send special __append key
      const result = await mutate({ __append_livrets: newLivret });
      if (result) {
        toast.success("Livret ajouté");
        onSaved();
        onClose();
      } else {
        toast.error("Erreur lors de l'ajout");
      }
    }
  };

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    if (livretIndex !== null && livretIndex !== undefined) {
      const result = await mutate({ __delete_livrets: livretIndex });
      if (result) {
        toast.success("Livret supprimé");
        onSaved();
        onClose();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    }
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
        title={isEdit ? "Modifier le livret" : "Ajouter un livret"}
        footer={footer}
      >
        <div className="space-y-4">
          <FormField
            label="Nom"
            type="select"
            value={nom}
            onChange={setNom}
            options={NOM_OPTIONS}
            error={errors.nom}
          />
          <FormField
            label="Solde actuel"
            type="currency"
            value={solde}
            onChange={setSolde}
            placeholder="0.00"
            min={0}
            error={errors.solde}
          />
          <FormField
            label="Plafond"
            type="currency"
            value={plafond}
            onChange={setPlafond}
            placeholder="0.00"
            min={0}
            error={errors.plafond}
          />
          <FormField
            label="Taux"
            type="percent"
            value={taux}
            onChange={setTaux}
            placeholder="0.00"
            min={0}
            step={0.01}
            error={errors.taux}
          />
          <FormField
            label="Statut"
            type="select"
            value={statut}
            onChange={setStatut}
            options={STATUT_OPTIONS}
            error={errors.statut}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSaveOpen}
        variant="info"
        title={isEdit ? "Confirmer la modification" : "Confirmer l'ajout"}
        message={
          isEdit
            ? `Le livret ${nom} sera modifié avec un solde de ${solde} €.`
            : `Un nouveau livret ${nom} sera ajouté avec un solde de ${solde} €.`
        }
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        variant="danger"
        title={`Supprimer ${nom} ?`}
        message="Cette action est irréversible. Le livret sera définitivement supprimé."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
