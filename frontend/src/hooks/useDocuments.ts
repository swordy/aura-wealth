import { useCallback, useState } from "react";
import { apiFetch, getAccessToken } from "@/api/client";
import type { DocumentItem, ExtractionResult } from "@/types/document";

const API_BASE = "/api/v1";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<DocumentItem[]>("/documents");
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, loading, error, refetch };
}

export function useUploadDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<DocumentItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Erreur ${res.status}`);
      }

      return (await res.json()) as DocumentItem;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upload, loading, error };
}

export function useAnalyzeDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (docId: string): Promise<DocumentItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<DocumentItem>(`/documents/${docId}/analyze`, {
        method: "POST",
      });
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}

export function useIntegrateDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const integrate = useCallback(
    async (docId: string, results: ExtractionResult[]): Promise<DocumentItem | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFetch<DocumentItem>(`/documents/${docId}/integrate`, {
          method: "POST",
          body: JSON.stringify({ results }),
        });
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { integrate, loading, error };
}

export function useDeleteDocument() {
  const [loading, setLoading] = useState(false);

  const deleteDoc = useCallback(async (docId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiFetch(`/documents/${docId}`, { method: "DELETE" });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteDoc, loading };
}
