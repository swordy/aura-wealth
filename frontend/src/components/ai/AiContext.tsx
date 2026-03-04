import { createContext, useContext, useState, type ReactNode } from "react";

interface AiState {
  open: boolean;
  title: string;
  message: string;
  loading: boolean;
}

interface AiContextType {
  state: AiState;
  toggle: () => void;
  askAi: (title: string, message: string) => void;
  close: () => void;
}

const AiCtx = createContext<AiContextType | null>(null);

export function useAi() {
  const ctx = useContext(AiCtx);
  if (!ctx) throw new Error("useAi must be inside AiProvider");
  return ctx;
}

export function AiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AiState>({
    open: false,
    title: "Aura AI",
    message: "",
    loading: false,
  });

  function toggle() {
    setState((s) => ({ ...s, open: !s.open }));
  }

  function close() {
    setState((s) => ({ ...s, open: false }));
  }

  function askAi(title: string, message: string) {
    setState({ open: true, title, message: "", loading: true });
    // Simulate "Analyse en cours…" for 600ms
    setTimeout(() => {
      setState({ open: true, title, message, loading: false });
    }, 600);
  }

  return <AiCtx.Provider value={{ state, toggle, askAi, close }}>{children}</AiCtx.Provider>;
}
