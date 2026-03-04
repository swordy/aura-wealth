import { useAi } from "@/components/ai/AiContext";
import { AI_RESPONSES } from "@/components/ai/aiResponses";

interface SparkAiProps {
  contextKey?: string;
  className?: string;
}

export default function SparkAi({ contextKey, className = "" }: SparkAiProps) {
  const { askAi } = useAi();

  function handleClick() {
    if (contextKey && AI_RESPONSES[contextKey]) {
      const { title, message } = AI_RESPONSES[contextKey];
      askAi(title, message);
    } else {
      askAi("Aura AI", "Je suis votre assistant patrimonial. Cliquez sur un indicateur spécifique pour obtenir une analyse contextuelle.");
    }
  }

  return (
    <div
      className={`w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center spark-ai animate-pulse-gold cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 100 100" fill="none">
        {/* AW monogram — W grows from inside the A */}
        <g>
          <path d="M22 82 L50 14 L78 82" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="32" y1="58" x2="68" y2="58" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
          <path d="M36 82 L50 38 L64 82" stroke="#AA8020" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        {/* AI sparkles */}
        <path d="M84 8 L86.5 17 L95.5 19.5 L86.5 22 L84 31 L81.5 22 L72.5 19.5 L81.5 17 Z" fill="#F3E5AB" opacity="0.9"/>
        <path d="M72 0 L73.5 5 L78.5 6.5 L73.5 8 L72 13 L70.5 8 L65.5 6.5 L70.5 5 Z" fill="#D4AF37" opacity="0.6"/>
      </svg>
    </div>
  );
}
