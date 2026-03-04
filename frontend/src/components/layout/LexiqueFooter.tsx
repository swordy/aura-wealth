const TERMS = [
  "Patrimoine Brut",
  "Net",
  "Valeur Vénale",
  "TMI",
  "HCSF",
  "PS",
  "IFI",
  "PEA",
  "LMNP",
  "CRD",
  "PER",
  "Flat Tax",
  "TVPI",
  "SCPI",
];

export default function LexiqueFooter() {
  return (
    <div className="fixed bottom-0 w-full z-40 hidden md:block bg-[--surface-overlay] backdrop-blur-md border-t border-[--border-section]">
      <div className="p-2.5 text-xs text-[--text-muted] text-center">
        {TERMS.map((term, i) => (
          <span key={term}>
            <span className="font-bold text-[--text-secondary]">{term}</span>
            {i < TERMS.length - 1 && " · "}
          </span>
        ))}
      </div>
    </div>
  );
}
