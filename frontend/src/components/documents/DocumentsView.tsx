import { useEffect, useState } from "react";
import type { DocumentItem, ExtractionResult } from "@/types/document";
import {
  useDocuments,
  useUploadDocument,
  useAnalyzeDocument,
  useIntegrateDocument,
  useDeleteDocument,
} from "@/hooks/useDocuments";
import { useToast } from "@/context/ToastContext";
import FileUpload from "@/components/shared/FileUpload";
import DocumentCard from "./DocumentCard";
import ParsingLoader from "./ParsingLoader";
import IntegrationPreview from "./IntegrationPreview";

export default function DocumentsView() {
  const { documents, loading, refetch } = useDocuments();
  const { upload, loading: uploading } = useUploadDocument();
  const { analyze, loading: analyzing } = useAnalyzeDocument();
  const { integrate, loading: integrating } = useIntegrateDocument();
  const { deleteDoc } = useDeleteDocument();
  const toast = useToast();

  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(file: File) {
    const doc = await upload(file);
    if (doc) {
      toast.success(`"${file.name}" importe avec succes`);
      await refetch();
    } else {
      toast.error("Erreur lors de l'import");
    }
  }

  async function handleAnalyze(doc: DocumentItem) {
    setActiveDoc(doc);
    setShowPreview(false);
    const result = await analyze(doc.id);
    if (result) {
      setActiveDoc(result);
      if (result.status === "ready") {
        setShowPreview(true);
        toast.success(`Analyse terminee : ${result.extractedData.length} valeur${result.extractedData.length > 1 ? "s" : ""} detectee${result.extractedData.length > 1 ? "s" : ""}`);
      }
      await refetch();
    } else {
      toast.error("Erreur lors de l'analyse");
      setActiveDoc(null);
      await refetch();
    }
  }

  function handleViewResults(doc: DocumentItem) {
    setActiveDoc(doc);
    setShowPreview(true);
  }

  async function handleIntegrate(selected: ExtractionResult[]) {
    if (!activeDoc) return;
    const result = await integrate(activeDoc.id, selected);
    if (result) {
      toast.success(`${selected.length} valeur${selected.length > 1 ? "s" : ""} integree${selected.length > 1 ? "s" : ""} avec succes`);
      setShowPreview(false);
      setActiveDoc(null);
      await refetch();
    } else {
      toast.error("Erreur lors de l'integration");
    }
  }

  async function handleDelete(doc: DocumentItem) {
    const ok = await deleteDoc(doc.id);
    if (ok) {
      toast.success("Document supprime");
      if (activeDoc?.id === doc.id) {
        setActiveDoc(null);
        setShowPreview(false);
      }
      await refetch();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  }

  // Check if any doc is being processed
  const processingDoc = activeDoc && (activeDoc.status === "extracting" || activeDoc.status === "analyzing");

  return (
    <>
      <div
        className="tab-indicator"
        style={{
          background: "linear-gradient(90deg, transparent, #06B6D4, transparent)",
        }}
      />

      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-light font-display text-[--text-primary]">Documents</h2>
        <p className="text-sm text-[--text-muted] mt-1">
          Importez vos documents pour alimenter automatiquement votre patrimoine
        </p>
      </div>

      {/* Upload zone */}
      <div className="glass-panel rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[--text-muted] mb-4">
          Importer un document
        </h3>
        <FileUpload onFile={handleUpload} uploading={uploading} />
      </div>

      {/* Processing state */}
      {processingDoc && analyzing && (
        <div className="mb-6">
          <ParsingLoader status={activeDoc.status} />
        </div>
      )}

      {/* Integration preview */}
      {showPreview && activeDoc && activeDoc.extractedData.length >= 0 && (
        <div className="mb-6">
          <IntegrationPreview
            results={activeDoc.extractedData}
            onIntegrate={handleIntegrate}
            onClose={() => {
              setShowPreview(false);
              setActiveDoc(null);
            }}
            loading={integrating}
          />
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg className="w-8 h-8 mx-auto text-gold animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[--text-muted] text-sm mt-3">Chargement des documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-[--text-faint]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-[--text-muted] text-sm">Aucun document</p>
          <p className="text-[--text-faint] text-xs mt-1">
            Importez votre premier document pour commencer
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={() => handleDelete(doc)}
              onAnalyze={() => handleAnalyze(doc)}
              onViewResults={() => handleViewResults(doc)}
            />
          ))}
        </div>
      )}
    </>
  );
}
