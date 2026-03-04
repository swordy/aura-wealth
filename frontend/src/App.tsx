import { useState } from "react";
import { NavigationProvider, useNavigation } from "@/context/NavigationContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AiProvider } from "@/components/ai/AiContext";
import Header from "@/components/layout/Header";
import LastUpdate from "@/components/layout/LastUpdate";
import LexiqueFooter from "@/components/layout/LexiqueFooter";
import ParticleBackground from "@/components/webgl/ParticleBackground";
import LightBackground from "@/components/webgl/LightBackground";
import AiPanel from "@/components/ai/AiPanel";
import DashboardView from "@/components/dashboard/DashboardView";
import EpargneView from "@/components/epargne/EpargneView";
import BourseView from "@/components/bourse/BourseView";
import ImmobilierView from "@/components/immobilier/ImmobilierView";
import PrivateEquityView from "@/components/pe/PrivateEquityView";
import DocumentsView from "@/components/documents/DocumentsView";
import HistoriqueView from "@/components/historique/HistoriqueView";
import LoginPage from "@/components/auth/LoginPage";
import RegisterPage from "@/components/auth/RegisterPage";

const TAB_CLASS: Record<string, string> = {
  home: "tab-home",
  epargne: "tab-finance",
  bourse: "tab-bourse",
  immobilier: "tab-immo",
  "private-equity": "tab-pe",
  documents: "tab-documents",
  historique: "tab-historique",
};

function DashboardContent() {
  const { activeTab } = useNavigation();

  return (
    <div className="relative w-full h-screen overflow-y-auto px-4 py-6 md:px-10 md:py-8 max-w-7xl mx-auto pb-32 font-body">
      <Header />
      <LastUpdate />

      <div className={`animate-fade-in space-y-6 ${TAB_CLASS[activeTab] ?? ""}`}>
        {activeTab === "home" && <DashboardView />}
        {activeTab === "epargne" && <EpargneView />}
        {activeTab === "bourse" && <BourseView />}
        {activeTab === "immobilier" && <ImmobilierView />}
        {activeTab === "private-equity" && <PrivateEquityView />}
        {activeTab === "documents" && <DocumentsView />}
        {activeTab === "historique" && <HistoriqueView />}
      </div>
    </div>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <svg className="w-12 h-12 animate-pulse" viewBox="0 0 512 512" fill="none">
            <rect width="512" height="512" rx="96" fill="#030303"/>
            <path d="M116 408 L256 100 L396 408" stroke="#D4AF37" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="168" y1="298" x2="344" y2="298" stroke="#D4AF37" strokeWidth="16" strokeLinecap="round" opacity="0.85"/>
            <path d="M186 408 L256 210 L326 408" stroke="#AA8020" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M412 72 L418 96 L442 102 L418 108 L412 132 L406 108 L382 102 L406 96 Z" fill="#F3E5AB" opacity="0.85"/>
            <path d="M376 46 L379 58 L391 61 L379 64 L376 76 L373 64 L361 61 L373 58 Z" fill="#D4AF37" opacity="0.6"/>
          </svg>
          <p className="text-sm text-[--text-faint] tracking-wide">Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authPage === "login"
      ? <LoginPage onSwitchToRegister={() => setAuthPage("register")} />
      : <RegisterPage onSwitchToLogin={() => setAuthPage("login")} />;
  }

  return (
    <NavigationProvider>
      <AiProvider>
        <DashboardContent />
        <AiPanel />
        <LexiqueFooter />
      </AiProvider>
    </NavigationProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ParticleBackground />
          <LightBackground />
          <AuthGate />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
