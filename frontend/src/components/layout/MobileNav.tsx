import { useNavigation, type TabId } from "@/context/NavigationContext";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/user";
import ThemeToggle from "@/components/shared/ThemeToggle";

const MOBILE_NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: "home", label: "Tableau de Bord" },
  { id: "epargne", label: "Épargne & Placements" },
  { id: "bourse", label: "Bourse & Crypto" },
  { id: "immobilier", label: "Immobilier" },
  { id: "documents", label: "Documents" },
  { id: "historique", label: "Historique" },
];

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "visiteur", label: "Visiteur" },
  { value: "abonne", label: "Abonné" },
  { value: "super_admin", label: "Admin" },
];

interface MobileNavProps {
  onClose: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const { activeTab, navigateTo } = useNavigation();
  const { user, role, setRole, logout } = useAuth();

  function handleNav(tab: TabId) {
    navigateTo(tab);
    onClose();
  }

  return (
    <div className="md:hidden glass-panel rounded-xl mt-2 p-3 z-30 relative animate-slide-up">
      {/* User */}
      <div className="px-4 py-2 mb-1 text-sm text-[--text-muted]">
        {user?.prenom} {user?.nom}
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1">
        {MOBILE_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`text-left font-medium py-2.5 px-4 rounded-lg text-sm ${
              activeTab === item.id
                ? "text-gold bg-gold/5"
                : "text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Theme + Logout */}
      <div className="mt-2 pt-2 border-t border-[--border-subtle] flex items-center justify-between px-4">
        <button
          onClick={() => { logout(); onClose(); }}
          className="text-left font-medium py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Déconnexion
        </button>
        <ThemeToggle />
      </div>

      {/* Role selector */}
      <div className="mt-2 pt-2 border-t border-[--border-subtle] px-3">
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
  );
}
