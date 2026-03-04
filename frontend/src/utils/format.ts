export function formatEur(n: number): string {
  return n.toLocaleString("fr-FR") + " €";
}

export function formatPct(n: number, sign = false): string {
  const s = sign && n > 0 ? "+" : "";
  return `${s}${n.toFixed(1)}%`;
}
