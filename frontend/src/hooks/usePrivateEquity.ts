import type { PrivateEquityData } from "@/types/private-equity";
import { useApiData } from "./useApiData";

export const usePrivateEquity = () =>
  useApiData<PrivateEquityData>("/private-equity");
