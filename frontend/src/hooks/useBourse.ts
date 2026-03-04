import type { BourseData } from "@/types/bourse";
import { useApiData } from "./useApiData";

export const useBourse = () => useApiData<BourseData>("/bourse");
