import { useState } from "react";
import { useBourse } from "@/hooks/useBourse";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import ResetButton from "@/components/shared/ResetButton";
import RequireRole from "@/components/auth/RequireRole";
import BourseKpi from "./BourseKpi";
import PeriodSelector, { type Period } from "./PeriodSelector";
import PeaGrid from "./PeaGrid";
import CtoGrid from "./CtoGrid";
import PeaPmeGrid from "./PeaPmeGrid";
import CryptoGrid from "./CryptoGrid";
import PositionForm from "./PositionForm";

export default function BourseView() {
  const [period, setPeriod] = useState<Period>("YTD");
  const { data, loading, error } = useBourse();
  const [formOpen, setFormOpen] = useState(false);
  const [formEnvelope, setFormEnvelope] = useState<string | undefined>();

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Données indisponibles"} />;

  const openForm = (envelope?: string) => {
    setFormEnvelope(envelope);
    setFormOpen(true);
  };

  return (
    <>
      <div className="tab-indicator" style={{ background: "linear-gradient(90deg, transparent, var(--tab-bourse), transparent)" }} />

      <div className="flex items-center justify-between mb-2">
        <div />
        <RequireRole allowed={["abonne", "super_admin"]}>
          <ResetButton domain="bourse" label="Bourse" />
        </RequireRole>
      </div>

      <BourseKpi
        actifsFinanciers={data.actifsFinanciers}
        peaTotal={data.pea.total}
        peaYtd={data.pea.ytdPct}
        cryptoTotal={data.cryptoTotal}
        cryptoYtd={data.cryptoYtdPct}
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      <PeaGrid envelope={data.pea} onAdd={() => openForm("PEA")} />

      <CtoGrid envelope={data.cto} onAdd={() => openForm("CTO")} />

      <PeaPmeGrid envelope={data.peaPme} onAdd={() => openForm("PEA-PME")} />

      <CryptoGrid cryptos={data.cryptos} cryptoTotal={data.cryptoTotal} />

      <PositionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        envelope={formEnvelope}
        onSaved={() => setFormOpen(false)}
      />
    </>
  );
}
