import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TabId = "home" | "epargne" | "bourse" | "immobilier" | "private-equity" | "documents" | "historique";

interface NavigationState {
  activeTab: TabId;
  navigateTo: (tab: TabId) => void;
}

const NavigationContext = createContext<NavigationState | null>(null);

const TAB_COLORS: Record<TabId, string> = {
  home: "#D4AF37",
  epargne: "#10B981",
  bourse: "#3B82F6",
  immobilier: "#D97706",
  "private-equity": "#8B5CF6",
  documents: "#06B6D4",
  historique: "#F59E0B",
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const navigateTo = useCallback((tab: TabId) => {
    setActiveTab(tab);
    document.documentElement.style.setProperty("--active-tab", TAB_COLORS[tab]);
  }, []);

  return (
    <NavigationContext.Provider value={{ activeTab, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
