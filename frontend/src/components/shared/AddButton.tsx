interface Props {
  onClick: () => void;
  label?: string;
}

export default function AddButton({ onClick, label = "Ajouter" }: Props) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 hover:border-gold/50 transition-all group"
    >
      <svg className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
