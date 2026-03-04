import { useTheme } from "@/context/ThemeContext";

/**
 * Animated SVG vector background for light mode.
 * Subtle geometric grid with slow-drifting diagonal lines.
 * Immaculate, minimal, no particles — pure vector elegance.
 */
export default function LightBackground() {
  const { theme } = useTheme();

  if (theme !== "light") return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base white */}
      <div className="absolute inset-0 bg-[#fafafa]" />

      {/* Subtle radial gradient — warmth at center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(140,114,37,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Animated SVG pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Fine geometric grid */}
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="80" y1="0" x2="80" y2="80" stroke="rgba(0,0,0,0.025)" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="80" y2="80" stroke="rgba(0,0,0,0.025)" strokeWidth="0.5" />
          </pattern>

          {/* Diagonal accent lines */}
          <pattern id="diag" width="200" height="200" patternUnits="userSpaceOnUse">
            <line x1="0" y1="200" x2="200" y2="0" stroke="rgba(140,114,37,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Static grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Drifting diagonal lines — layer 1 */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 200,200; 0,0"
            dur="120s"
            repeatCount="indefinite"
          />
          <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#diag)" />
        </g>

        {/* Drifting diagonal lines — layer 2, counter-direction */}
        <g opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; -150,100; 0,0"
            dur="90s"
            repeatCount="indefinite"
          />
          <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#diag)" />
        </g>

        {/* Floating horizontal accent line */}
        <line x1="10%" y1="25%" x2="40%" y2="25%" stroke="rgba(140,114,37,0.05)" strokeWidth="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 60,20; 0,0"
            dur="80s"
            repeatCount="indefinite"
          />
        </line>

        <line x1="55%" y1="70%" x2="90%" y2="70%" stroke="rgba(140,114,37,0.04)" strokeWidth="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; -40,-15; 0,0"
            dur="100s"
            repeatCount="indefinite"
          />
        </line>

        {/* Corner accent — top right */}
        <g opacity="0.5">
          <line x1="85%" y1="5%" x2="98%" y2="5%" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
          <line x1="98%" y1="5%" x2="98%" y2="18%" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
        </g>

        {/* Corner accent — bottom left */}
        <g opacity="0.5">
          <line x1="2%" y1="82%" x2="2%" y2="95%" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
          <line x1="2%" y1="95%" x2="15%" y2="95%" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Bottom edge fade to white */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, #fafafa, transparent)",
        }}
      />
    </div>
  );
}
