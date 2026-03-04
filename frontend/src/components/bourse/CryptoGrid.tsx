import SparkAi from "@/components/shared/SparkAi";
import type { Crypto } from "@/types/bourse";
import { formatEur } from "@/utils/format";

const ICON_MAP: Record<string, { symbol: string; bg: string; text: string }> = {
  BTC: { symbol: "₿", bg: "bg-orange-500/20", text: "text-orange-400" },
  ETH: { symbol: "Ξ", bg: "bg-blue-500/20", text: "text-blue-400" },
  ALTS: { symbol: "◆", bg: "bg-[--surface-hover]", text: "text-[--text-muted]" },
};

interface Props {
  cryptos: Crypto[];
  cryptoTotal: number;
}

export default function CryptoGrid({ cryptos, cryptoTotal }: Props) {
  return (
    <div className="glass-panel p-6 rounded-2xl card-hover relative">
      <SparkAi contextKey="crypto" className="absolute top-4 right-4" />
      <h2 className="text-lg font-light text-[--text-primary] mb-4 border-b border-[--border-section] pb-2 flex items-center font-display">
        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Crypto — {formatEur(cryptoTotal)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cryptos.map((c) => {
          const icon = ICON_MAP[c.symbol] ?? ICON_MAP.ALTS;
          const positive = c.ytd >= 0;
          return (
            <div key={c.nom} className="glass-panel-inner p-4 rounded-lg text-center">
              <div className={`w-10 h-10 rounded-full ${icon.bg} flex items-center justify-center mx-auto mb-2`}>
                <span className={`text-lg font-bold ${icon.text}`}>{icon.symbol}</span>
              </div>
              <p className="text-sm font-medium text-[--text-primary]">{c.nom}</p>
              <p className="text-xl font-semibold mt-1">{formatEur(c.valeur)}</p>
              <p className={`text-sm font-medium mt-1 ${positive ? "text-green-400" : "text-red-400"}`}>
                {positive ? "+" : ""}{c.ytd}%
              </p>
            </div>
          );
        })}
      </div>
      <div className="p-3 rounded-lg border mt-4 text-sm text-[--text-secondary]" style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
        <span className="font-medium text-amber-400">Rappel fiscal :</span>{" "}
        Flat tax 30% sur les plus-values crypto (12.8% IR + 17.2% PS). Déclaration obligatoire des comptes à l'étranger (Binance, etc.).
      </div>
      <div className="flex flex-wrap gap-2 mt-3 text-xs text-[--text-faint]">
        <span>Plateformes : Binance, Ledger, Coinbase</span>
      </div>
    </div>
  );
}
