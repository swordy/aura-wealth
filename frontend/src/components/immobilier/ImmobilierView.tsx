import { useState } from "react";
import { useImmobilier } from "@/hooks/useImmobilier";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import ResetButton from "@/components/shared/ResetButton";
import RequireRole from "@/components/auth/RequireRole";
import ImmoKpi from "./ImmoKpi";
import LmnpBlock from "./LmnpBlock";
import SciBlock from "./SciBlock";
import ImmoSynthese from "./ImmoSynthese";
import ScpiBlock from "./ScpiBlock";
import AssurancesImmoBlock from "./AssurancesImmoBlock";
import BienForm from "./BienForm";

export default function ImmobilierView() {
  const { data, loading, error } = useImmobilier();
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<string | undefined>();

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Données indisponibles"} />;

  const openForm = (typeBien?: string) => {
    setFormType(typeBien);
    setFormOpen(true);
  };

  return (
    <>
      <div className="tab-indicator" style={{ background: "linear-gradient(90deg, transparent, var(--tab-immo), transparent)" }} />

      <div className="flex items-center justify-between mb-2">
        <div />
        <RequireRole allowed={["abonne", "super_admin"]}>
          <ResetButton domain="immobilier" label="Immobilier" />
        </RequireRole>
      </div>

      <ImmoKpi
        valeurVenale={data.valeurVenale}
        crdTotal={data.crdTotal}
        cashflowNetMensuel={data.cashflowNetMensuel}
        rendementMoyen={data.rendementMoyen}
      />

      <LmnpBlock lmnp={data.lmnp} onAdd={() => openForm("LMNP")} />

      <SciBlock sci={data.sci} onAdd={() => openForm("SCI")} />

      <ScpiBlock scpis={data.scpis} onAdd={() => openForm("SCPI")} />

      <ImmoSynthese synthese={data.synthese} />

      <AssurancesImmoBlock assurances={data.assurances} />

      <BienForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        typeBien={formType}
        onSaved={() => setFormOpen(false)}
      />
    </>
  );
}
