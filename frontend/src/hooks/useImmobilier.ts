import type { ImmobilierData } from "@/types/immobilier";
import { useApiData } from "./useApiData";

export const useImmobilier = () => useApiData<ImmobilierData>("/immobilier");
