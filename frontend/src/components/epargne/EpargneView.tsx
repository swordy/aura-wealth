import { useState } from "react";
import { useEpargne } from "@/hooks/useEpargne";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import ResetButton from "@/components/shared/ResetButton";
import RequireRole from "@/components/auth/RequireRole";
import EpargneKpi from "./EpargneKpi";
import LivretBlock from "./LivretBlock";
import LivretForm from "./LivretForm";
import AssuranceVieBlock from "./AssuranceVieBlock";
import RetraiteBlock from "./RetraiteBlock";
import PrevoyanceBlock from "./PrevoyanceBlock";
import type { Livret } from "@/types/epargne";

export default function EpargneView() {
  const { data, loading, error, refetch } = useEpargne();
  const [livretFormOpen, setLivretFormOpen] = useState(false);
  const [editingLivret, setEditingLivret] = useState<Livret | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Données indisponibles"} />;

  const handleAdd = () => {
    setEditingLivret(null);
    setEditingIndex(null);
    setLivretFormOpen(true);
  };

  const handleEdit = (livret: Livret, index: number) => {
    setEditingLivret(livret);
    setEditingIndex(index);
    setLivretFormOpen(true);
  };

  const handleFormClose = () => {
    setLivretFormOpen(false);
    setEditingLivret(null);
    setEditingIndex(null);
  };

  return (
    <>
      <div className="tab-indicator" style={{ background: "linear-gradient(90deg, transparent, var(--tab-finance), transparent)" }} />

      <div className="flex items-center justify-between mb-2">
        <div />
        <RequireRole allowed={["abonne", "super_admin"]}>
          <ResetButton domain="epargne" label="Épargne" onReset={refetch} />
        </RequireRole>
      </div>

      <EpargneKpi total={data.total} effortMensuel={data.effortMensuel} capitalDeces={data.prevoyance.capitalDeces} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LivretBlock livrets={data.livrets} onAdd={handleAdd} onEdit={handleEdit} />
        <RetraiteBlock retraite={data.retraite} />
      </div>

      <AssuranceVieBlock assuranceVie={data.assuranceVie} />

      <PrevoyanceBlock prevoyance={data.prevoyance} />

      <LivretForm
        open={livretFormOpen}
        onClose={handleFormClose}
        livret={editingLivret}
        livretIndex={editingIndex}
        onSaved={refetch}
      />
    </>
  );
}
