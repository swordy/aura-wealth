import { useCallback, useState } from "react";
import { apiFetch } from "@/api/client";

interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (body: unknown) => Promise<T | null>;
}

export function useMutation<T = unknown>(
  path: string,
  method: "PUT" | "PATCH" | "POST" | "DELETE" = "PATCH",
): MutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body: unknown): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFetch<T>(path, {
          method,
          body: JSON.stringify(body),
        });
        setData(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [path, method],
  );

  return { data, loading, error, mutate };
}
