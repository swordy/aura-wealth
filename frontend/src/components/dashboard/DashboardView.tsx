import { useCallback } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useMutation } from "@/hooks/useMutation";
import { useToast } from "@/context/ToastContext";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import ResetButton from "@/components/shared/ResetButton";
import RequireRole from "@/components/auth/RequireRole";
import KpiRow from "./KpiRow";
import RendementGlobal from "./RendementGlobal";
import DistributionBar from "./DistributionBar";
import DiversificationScore from "./DiversificationScore";
import TreasuryBlock from "./TreasuryBlock";
import DebtBlock from "./DebtBlock";
import RealEstateMotor from "./RealEstateMotor";
import FiscalMonitor from "./FiscalMonitor";
import RecentOps from "./RecentOps";

export default function DashboardView() {
  const { data, loading, error, refetch } = useDashboard();
  const { mutate } = useMutation("/dashboard", "PATCH");
  const toast = useToast();

  const handlePatch = useCallback(
    async (patch: Record<string, unknown>) => {
      const result = await mutate(patch);
      if (result) {
        toast.success("Valeur mise à jour");
        refetch();
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    },
    [mutate, toast, refetch],
  );

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Données indisponibles"} />;

  return (
    <>
      <div className="tab-indicator" style={{ background: "linear-gradient(90deg, transparent, var(--tab-home), transparent)" }} />

      <div className="flex items-center justify-between mb-2">
        <div />
        <RequireRole allowed={["abonne", "super_admin"]}>
          <ResetButton domain="dashboard" label="Dashboard" onReset={refetch} />
        </RequireRole>
      </div>

      <KpiRow
        patrimoineBrut={data.patrimoineBrut}
        patrimoineNet={data.patrimoineNet}
        projection10Ans={data.projection10Ans}
        projectionTaux={data.projectionTaux}
        variationYtd={data.variationYtd}
      />

      <RendementGlobal pct={data.rendementGlobalPct} eur={data.rendementGlobalEur} />

      <DistributionBar repartition={data.repartition} />

      <DiversificationScore score={data.scoreDiversification} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreasuryBlock tresorerie={data.tresorerie} onPatch={handlePatch} />
        <DebtBlock endettement={data.endettement} onPatch={handlePatch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealEstateMotor moteurImmo={data.moteurImmo} onPatch={handlePatch} />
        <FiscalMonitor fiscal={data.fiscal} onPatch={handlePatch} />
      </div>

      <RecentOps operations={data.operationsRecentes} />
    </>
  );
}
