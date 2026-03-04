import { useCallback, useRef, useState, type DragEvent } from "react";

interface Props {
  accept?: string;
  maxSizeMb?: number;
  onFile: (file: File) => void;
  uploading?: boolean;
  progress?: number;
}

export default function FileUpload({
  accept = "*/*",
  maxSizeMb = 10,
  onFile,
  uploading = false,
  progress = 0,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): boolean => {
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`Le fichier dépasse ${maxSizeMb} Mo`);
        return false;
      }
      setError(null);
      return true;
    },
    [maxSizeMb],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file && validate(file)) {
        onFile(file);
      }
    },
    [onFile, validate],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        dragging
          ? "border-gold/60 bg-gold/5"
          : "border-[--border-strong] hover:border-gold/30 hover:bg-[--surface-hover]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <svg className="w-10 h-10 mx-auto mb-3 text-[--text-faint]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>

      <p className="text-sm text-[--text-muted] mb-1">
        {dragging ? "Déposez votre fichier ici" : "Glissez un fichier ou cliquez pour parcourir"}
      </p>
      <p className="text-xs text-[--text-faint]">
        PDF, Word, Excel, images, JSON, TXT — max {maxSizeMb} Mo
      </p>

      {uploading && (
        <div className="mt-4">
          <div className="progress-bar w-full">
            <div
              className="progress-bar-fill bg-gold"
              style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
            />
          </div>
          <p className="text-xs text-gold mt-1">{progress}%</p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
