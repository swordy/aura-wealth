import { useRef, useState, useEffect } from "react";
import { useNavigation, type TabId } from "@/context/NavigationContext";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/user";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/shared/ThemeToggle";

const NAV_ITEMS: { id: TabId; label: string; activeClass: string }[] = [
  { id: "home", label: "Tableau de Bord", activeClass: "text-tab-home" },
  { id: "epargne", label: "Épargne", activeClass: "text-tab-finance" },
  { id: "bourse", label: "Bourse & Crypto", activeClass: "text-tab-bourse" },
  { id: "immobilier", label: "Immobilier", activeClass: "text-tab-immo" },
];

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "visiteur", label: "Visiteur" },
  { value: "abonne", label: "Abonné" },
  { value: "super_admin", label: "Admin" },
];

export default function Header() {
  const { activeTab, navigateTo } = useNavigation();
  const { user, role, setRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  return (
    <>
      <header className="flex items-center justify-between glass-panel rounded-2xl px-5 py-4 relative z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 512 512" fill="none">
            <rect width="512" height="512" rx="96" fill="#030303"/>
            <rect x="10" y="10" width="492" height="492" rx="86" stroke="#D4AF37" strokeWidth="1" opacity="0.15"/>
            <g>
              <path d="M116 408 L256 100 L396 408" stroke="#D4AF37" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="168" y1="298" x2="344" y2="298" stroke="#D4AF37" strokeWidth="16" strokeLinecap="round" opacity="0.85"/>
              <path d="M186 408 L256 210 L326 408" stroke="#AA8020" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <path d="M412 72 L418 96 L442 102 L418 108 L412 132 L406 108 L382 102 L406 96 Z" fill="#F3E5AB" opacity="0.85"/>
            <path d="M376 46 L379 58 L391 61 L379 64 L376 76 L373 64 L361 61 L373 58 Z" fill="#D4AF37" opacity="0.6"/>
            <path d="M442 48 L444 55 L451 57 L444 59 L442 66 L440 59 L433 57 L440 55 Z" fill="#D4AF37" opacity="0.4"/>
          </svg>
          <h1 className="text-lg md:text-2xl font-light tracking-[0.2em] text-gold uppercase font-display">
            Aura Wealth
          </h1>
        </div>

        {/* Desktop Nav — 4 tabs only */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`nav-btn pb-1 px-3 text-sm lg:text-base font-medium tracking-wide ${
                activeTab === item.id
                  ? `active ${item.activeClass}`
                  : "text-[--text-muted] hover:text-[--text-secondary]"
              }`}
              style={
                activeTab === item.id
                  ? { ["--active-tab" as string]: `var(--tab-${item.id === "epargne" ? "finance" : item.id === "immobilier" ? "immo" : item.id})` }
                  : undefined
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop — Theme toggle + Profile */}
        <div className="hidden md:flex items-center gap-2" ref={profileRef}>
          <ThemeToggle />
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="group relative w-9 h-9 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/60 transition-all"
          >
            <svg className="w-4.5 h-4.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-[--text-faint] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Profil & paramètres
            </span>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl border border-gold/20 shadow-2xl animate-modal-in overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[--border-subtle]">
                <p className="text-sm font-medium text-[--text-primary]">{user?.prenom} {user?.nom}</p>
                <p className="text-xs text-[--text-faint]">{user?.email}</p>
              </div>

              {/* Nav links */}
              <div className="py-1">
                <ProfileNavItem
                  label="Documents"
                  active={activeTab === "documents"}
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                  onClick={() => { navigateTo("documents"); setProfileOpen(false); }}
                />
                <ProfileNavItem
                  label="Historique"
                  active={activeTab === "historique"}
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  onClick={() => { navigateTo("historique"); setProfileOpen(false); }}
                />
              </div>

              {/* Logout */}
              <div className="py-1 border-t border-[--border-subtle]">
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>

              {/* Role selector */}
              <div className="px-4 py-3 border-t border-[--border-subtle]">
                <p className="text-[9px] font-bold tracking-widest uppercase text-[--text-faint] mb-2">
                  DEV — Rôle
                </p>
                <div className="flex gap-1">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all text-center ${
                        role === opt.value
                          ? "bg-gold/20 text-gold border border-gold/50"
                          : "text-[--text-faint] hover:text-[--text-secondary] border border-[--border-subtle] hover:border-[--border-strong]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[--surface-hover] transition-colors"
        >
          <span
            className="block w-5 h-0.5 bg-gold rounded-full transition-all duration-300"
            style={
              mobileOpen
                ? { transform: "rotate(45deg) translate(2px, 2px)" }
                : undefined
            }
          />
          <span
            className="block w-5 h-0.5 bg-gold rounded-full transition-all duration-300"
            style={mobileOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="block w-5 h-0.5 bg-gold rounded-full transition-all duration-300"
            style={
              mobileOpen
                ? { transform: "rotate(-45deg) translate(2px, -2px)" }
                : undefined
            }
          />
        </button>
      </header>

      {mobileOpen && (
        <MobileNav onClose={() => setMobileOpen(false)} />
      )}
    </>
  );
}

interface ProfileNavItemProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

function ProfileNavItem({ label, active, icon, onClick }: ProfileNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "text-gold bg-gold/5"
          : "text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover]"
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      {label}
    </button>
  );
}
