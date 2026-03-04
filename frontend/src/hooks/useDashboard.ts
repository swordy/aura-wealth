import type { DashboardData } from "@/types/dashboard";
import { useApiData } from "./useApiData";

export const useDashboard = () => useApiData<DashboardData>("/dashboard");
