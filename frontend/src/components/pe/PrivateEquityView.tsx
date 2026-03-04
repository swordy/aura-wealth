import { useState } from "react";
import { usePrivateEquity } from "@/hooks/usePrivateEquity";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import ResetButton from "@/components/shared/ResetButton";
import RequireRole from "@/components/auth/RequireRole";
import PeKpi from "./PeKpi";
import PeTable from "./PeTable";
import PeTimeline from "./PeTimeline";
import FondsForm from "./FondsForm";

export default function PrivateEquityView() {
  const { data, loading, error } = usePrivateEquity();
  const [formOpen, setFormOpen] = useState(false);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Données indisponibles"} />;

  return (
    <>
      <div className="tab-indicator" style={{ background: "linear-gradient(90deg, transparent, var(--tab-pe), transparent)" }} />

      <div className="flex items-center justify-between mb-2">
        <div />
        <RequireRole allowed={["abonne", "super_admin"]}>
          <ResetButton domain="private-equity" label="Private Equity" />
        </RequireRole>
      </div>

      <PeKpi investi={data.investi} valorisation={data.valorisation} tvpi={data.tvpi} dpi={data.dpi} />

      <PeTable fonds={data.fonds} irrEstime={data.irrEstime} onAdd={() => setFormOpen(true)} />

      <PeTimeline timeline={data.timeline} />

      <FondsForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />
    </>
  );
}
