import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          dark: "#AA8020",
        },
        tab: {
          home: "#D4AF37",
          finance: "#10B981",
          bourse: "#3B82F6",
          immo: "#D97706",
          pe: "#8B5CF6",
          documents: "#06B6D4",
          historique: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-up": "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "pulse-gold": "pulseGold 2.5s infinite",
        "modal-in": "modalIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "collapse": "collapse 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.35)" },
          "70%": { boxShadow: "0 0 0 7px rgba(212, 175, 55, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" },
        },
        modalIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        collapse: {
          from: { maxHeight: "500px", opacity: "1" },
          to: { maxHeight: "0", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
