import type { EpargneData } from "@/types/epargne";
import { useApiData } from "./useApiData";

export const useEpargne = () => useApiData<EpargneData>("/epargne");
