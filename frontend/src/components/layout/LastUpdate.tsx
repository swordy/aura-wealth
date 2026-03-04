export default function LastUpdate() {
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formatted = `${date} à ${time}`;

  return (
    <div className="flex items-center justify-end py-3 px-1 text-xs text-[--text-faint]">
      <svg
        className="w-3.5 h-3.5 mr-1.5 text-[--text-faint]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Dernière mise à jour :{" "}
      <span className="text-[--text-secondary] ml-1">{formatted}</span>
    </div>
  );
}
