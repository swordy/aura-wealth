interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 text-center">
      <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-2">
        Erreur de chargement
      </p>
      <p className="text-[--text-muted] text-sm">{message}</p>
    </div>
  );
}
