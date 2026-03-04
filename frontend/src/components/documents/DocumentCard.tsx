import { useState } from "react";
import type { DocumentItem, DocumentStatus } from "@/types/document";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface Props {
  doc: DocumentItem;
  onDelete: () => void;
  onAnalyze?: () => void;
  onViewResults?: () => void;
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; classes: string }> = {
  uploaded: { label: "Importe", classes: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  extracting: { label: "Extraction...", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse" },
  analyzing: { label: "Analyse IA...", classes: "bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse" },
  ready: { label: "Pret", classes: "bg-green-500/20 text-green-300 border-green-500/30" },
  integrated: { label: "Integre", classes: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  error: { label: "Erreur", classes: "bg-red-500/20 text-red-300 border-red-500/30" },
};

function getFileIcon(contentType: string): { color: string; label: string } {
  if (contentType === "application/pdf") return { color: "text-red-400", label: "PDF" };
  if (contentType === "text/csv") return { color: "text-green-400", label: "CSV" };
  if (contentType.includes("spreadsheet") || contentType.includes("excel"))
    return { color: "text-blue-400", label: "XLS" };
  if (contentType.includes("word") || contentType.includes("document"))
    return { color: "text-blue-400", label: "DOC" };
  if (contentType.startsWith("image/"))
    return { color: "text-amber-400", label: "IMG" };
  if (contentType === "application/json")
    return { color: "text-yellow-400", label: "JSON" };
  if (contentType.startsWith("text/"))
    return { color: "text-[--text-muted]", label: "TXT" };
  return { color: "text-[--text-muted]", label: "DOC" };
}

function formatDateFr(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DocumentCard({ doc, onDelete, onAnalyze, onViewResults }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const icon = getFileIcon(doc.contentType);
  const status = STATUS_CONFIG[doc.status];
  const canAnalyze = doc.status === "uploaded";
  const canView = doc.status === "ready";

  return (
    <>
      <div className="glass-panel-inner rounded-xl p-4 card-hover flex items-center gap-4">
        {/* File icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-[--surface-hover] flex items-center justify-center ${icon.color}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="sr-only">{icon.label}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-[--text-primary] truncate">{doc.originalName}</p>
            <span className={`tag border ${icon.color} bg-[--surface-hover]`}>{icon.label}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[--text-faint]">
            <span>{formatDateFr(doc.uploadDate)}</span>
            {doc.extractedData.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[--text-faint]" />
                <span>{doc.extractedData.length} valeur{doc.extractedData.length > 1 ? "s" : ""}</span>
              </>
            )}
            {doc.errorMessage && (
              <>
                <span className="w-1 h-1 rounded-full bg-red-400" />
                <span className="text-red-400 truncate max-w-[200px]">{doc.errorMessage}</span>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className={`tag border flex-shrink-0 ${status.classes}`}>
          {status.label}
        </span>

        {/* Action buttons */}
        {canAnalyze && onAnalyze && (
          <button
            onClick={onAnalyze}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 transition-colors"
          >
            Analyser
          </button>
        )}

        {canView && onViewResults && (
          <button
            onClick={onViewResults}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors"
          >
            Voir les resultats
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[--text-faint] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Supprimer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        variant="danger"
        title="Supprimer ce document ?"
        message={`Le fichier "${doc.originalName}" sera supprime definitivement. Cette action est irreversible.`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
