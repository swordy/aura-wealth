import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RequireRole from "@/components/auth/RequireRole";
import { useToast } from "@/context/ToastContext";
import { formatPct } from "@/utils/format";

type TypeBien = "LMNP" | "SCI" | "SCPI" | "RP";

interface BienLike {
  nom?: string;
  type?: string;
  valeur?: number;
  loyerMensuel?: number;
  rendement?: number;
  crd?: number;
  amortissementRestant?: number;
  parts?: number;
  regime?: string;
  delaiJouissance?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  bien?: BienLike | null;
  typeBien?: string;
  onSaved: () => void;
}

const TYPE_BIEN_OPTIONS = [
  { value: "LMNP", label: "LMNP" },
  { value: "SCI", label: "SCI" },
  { value: "SCPI", label: "SCPI" },
  { value: "RP", label: "Résidence principale" },
];

const TYPE_LMNP_OPTIONS = [
  { value: "Studio", label: "Studio" },
  { value: "T2", label: "T2" },
  { value: "T3", label: "T3" },
  { value: "Maison", label: "Maison" },
];

const REGIME_FISCAL_OPTIONS = [
  { value: "IS", label: "IS" },
  { value: "IR", label: "IR" },
];

export default function BienForm({
  open,
  onClose,
  bien,
  typeBien,
  onSaved,
}: Props) {
  const toast = useToast();
  const isEdit = !!bien;

  const [selectedType, setSelectedType] = useState<TypeBien>("LMNP");

  // Champs communs
  const [nom, setNom] = useState("");
  const [valeur, setValeur] = useState("");
  const [crd, setCrd] = useState("");

  // LMNP
  const [typeLmnp, setTypeLmnp] = useState("");
  const [loyerMensuel, setLoyerMensuel] = useState("");
  const [amortissementRestant, setAmortissementRestant] = useState("");

  // SCI
  const [parts, setParts] = useState("");
  const [regime, setRegime] = useState("");

  // SCPI
  const [partsScpi, setPartsScpi] = useState("");
  const [rendement, setRendement] = useState("");
  const [delaiJouissance, setDelaiJouissance] = useState("");

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const type = (typeBien ?? bien?.type ?? "LMNP").toUpperCase() as TypeBien;
      const validType = ["LMNP", "SCI", "SCPI", "RP"].includes(type) ? type : "LMNP";
      setSelectedType(validType);

      if (bien) {
        setNom(bien.nom ?? "");
        setValeur(bien.valeur != null ? String(bien.valeur) : "");
        setCrd(bien.crd != null ? String(bien.crd) : "");
        setTypeLmnp(bien.type ?? "");
        setLoyerMensuel(
          bien.loyerMensuel != null ? String(bien.loyerMensuel) : "",
        );
        setAmortissementRestant(
          bien.amortissementRestant != null
            ? String(bien.amortissementRestant)
            : "",
        );
        setParts(bien.parts != null ? String(bien.parts) : "");
        setRegime(bien.regime ?? "");
        setPartsScpi(bien.parts != null ? String(bien.parts) : "");
        setRendement(bien.rendement != null ? String(bien.rendement) : "");
        setDelaiJouissance(bien.delaiJouissance ?? "");
      } else {
        setNom("");
        setValeur("");
        setCrd("");
        setTypeLmnp("");
        setLoyerMensuel("");
        setAmortissementRestant("");
        setParts("");
        setRegime("");
        setPartsScpi("");
        setRendement("");
        setDelaiJouissance("");
      }
    }
  }, [open, bien, typeBien]);

  const rendementBrutAuto = useMemo(() => {
    const v = parseFloat(valeur);
    const l = parseFloat(loyerMensuel);
    if (!v || !l || v <= 0) return null;
    return (l * 12) / v;
  }, [valeur, loyerMensuel]);

  const handleSaveClick = () => {
    setConfirmSaveOpen(true);
  };

  const handleConfirmSave = () => {
    setConfirmSaveOpen(false);
    toast.success(isEdit ? "Bien mis à jour" : "Bien ajouté");
    onSaved();
    onClose();
  };

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    toast.success("Bien supprimé");
    onSaved();
    onClose();
  };

  const renderFieldsByType = () => {
    switch (selectedType) {
      case "LMNP":
        return (
          <>
            <FormField
              label="Nom"
              type="text"
              value={nom}
              onChange={setNom}
              placeholder="Ex : Studio Lyon 3e"
            />
            <FormField
              label="Type"
              type="select"
              value={typeLmnp}
              onChange={setTypeLmnp}
              options={TYPE_LMNP_OPTIONS}
            />
            <FormField
              label="Valeur vénale"
              type="currency"
              value={valeur}
              onChange={setValeur}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="Loyer mensuel"
              type="currency"
              value={loyerMensuel}
              onChange={setLoyerMensuel}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="Rendement brut"
              type="percent"
              value={
                rendementBrutAuto != null
                  ? rendementBrutAuto.toFixed(2)
                  : ""
              }
              onChange={() => {}}
              readOnly
              placeholder="Calculé automatiquement"
            />
            <FormField
              label="CRD"
              type="currency"
              value={crd}
              onChange={setCrd}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="Amortissement restant (années)"
              type="number"
              value={amortissementRestant}
              onChange={setAmortissementRestant}
              placeholder="0"
              min={0}
              step={1}
            />
          </>
        );

      case "SCI":
        return (
          <>
            <FormField
              label="Nom"
              type="text"
              value={nom}
              onChange={setNom}
              placeholder="Ex : SCI Patrimoine"
            />
            <FormField
              label="Nombre de parts"
              type="number"
              value={parts}
              onChange={setParts}
              placeholder="0"
              min={0}
              step={1}
            />
            <FormField
              label="Valeur"
              type="currency"
              value={valeur}
              onChange={setValeur}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="Régime fiscal"
              type="select"
              value={regime}
              onChange={setRegime}
              options={REGIME_FISCAL_OPTIONS}
            />
            <FormField
              label="CRD"
              type="currency"
              value={crd}
              onChange={setCrd}
              placeholder="0.00"
              min={0}
            />
          </>
        );

      case "SCPI":
        return (
          <>
            <FormField
              label="Nom"
              type="text"
              value={nom}
              onChange={setNom}
              placeholder="Ex : Corum Origin"
            />
            <FormField
              label="Nombre de parts"
              type="number"
              value={partsScpi}
              onChange={setPartsScpi}
              placeholder="0"
              min={0}
              step={1}
            />
            <FormField
              label="Valeur"
              type="currency"
              value={valeur}
              onChange={setValeur}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="Rendement"
              type="percent"
              value={rendement}
              onChange={setRendement}
              placeholder="0.00"
              min={0}
              step={0.01}
            />
            <FormField
              label="Délai de jouissance"
              type="text"
              value={delaiJouissance}
              onChange={setDelaiJouissance}
              placeholder="Ex : 5 mois"
            />
          </>
        );

      case "RP":
        return (
          <>
            <FormField
              label="Valeur"
              type="currency"
              value={valeur}
              onChange={setValeur}
              placeholder="0.00"
              min={0}
            />
            <FormField
              label="CRD"
              type="currency"
              value={crd}
              onChange={setCrd}
              placeholder="0.00"
              min={0}
            />
          </>
        );

      default:
        return null;
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
        title={isEdit ? "Modifier le bien" : "Ajouter un bien"}
        footer={footer}
      >
        <div className="space-y-4">
          <FormField
            label="Type de bien"
            type="select"
            value={selectedType}
            onChange={(v) => setSelectedType(v as TypeBien)}
            options={TYPE_BIEN_OPTIONS}
          />

          <div className="glow-line my-2" />

          {renderFieldsByType()}

          {selectedType === "LMNP" && rendementBrutAuto != null && (
            <p className="text-xs text-[--text-faint]">
              Rendement brut calculé : {formatPct(rendementBrutAuto * 100)}
            </p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSaveOpen}
        variant="info"
        title={isEdit ? "Confirmer la modification" : "Confirmer l'ajout"}
        message={
          isEdit
            ? "Les modifications du bien seront enregistrées."
            : "Un nouveau bien sera ajouté à votre patrimoine immobilier."
        }
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        variant="danger"
        title="Supprimer le bien ?"
        message="Cette action est irréversible. Le bien sera définitivement supprimé de votre patrimoine."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
