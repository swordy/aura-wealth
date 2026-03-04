import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, nom, prenom });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg className="w-10 h-10" viewBox="0 0 512 512" fill="none">
            <rect width="512" height="512" rx="96" fill="#030303"/>
            <path d="M116 408 L256 100 L396 408" stroke="#D4AF37" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="168" y1="298" x2="344" y2="298" stroke="#D4AF37" strokeWidth="16" strokeLinecap="round" opacity="0.85"/>
            <path d="M186 408 L256 210 L326 408" stroke="#AA8020" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M412 72 L418 96 L442 102 L418 108 L412 132 L406 108 L382 102 L406 96 Z" fill="#F3E5AB" opacity="0.85"/>
            <path d="M376 46 L379 58 L391 61 L379 64 L376 76 L373 64 L361 61 L373 58 Z" fill="#D4AF37" opacity="0.6"/>
          </svg>
          <h1 className="text-2xl font-light tracking-[0.2em] text-gold uppercase font-display">
            Aura Wealth
          </h1>
        </div>

        <h2 className="text-lg font-medium text-[--text-primary] text-center mb-6">Créer un compte</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[--text-faint] mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full px-4 py-3 rounded-lg bg-[--surface-inner] border border-[--border-default] text-[--text-primary] placeholder-[--input-placeholder] focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="Jean"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[--text-faint] mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                autoComplete="family-name"
                className="w-full px-4 py-3 rounded-lg bg-[--surface-inner] border border-[--border-default] text-[--text-primary] placeholder-[--input-placeholder] focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[--text-faint] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-[--surface-inner] border border-[--border-default] text-[--text-primary] placeholder-[--input-placeholder] focus:border-gold/50 focus:outline-none transition-colors"
              placeholder="jean@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[--text-faint] mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg bg-[--surface-inner] border border-[--border-default] text-[--text-primary] placeholder-[--input-placeholder] focus:border-gold/50 focus:outline-none transition-colors"
              placeholder="Min. 8 caractères"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[--text-faint] mb-1.5">
              Confirmer
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg bg-[--surface-inner] border border-[--border-default] text-[--text-primary] placeholder-[--input-placeholder] focus:border-gold/50 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gold-gradient text-black font-semibold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[--text-faint]">
          Déjà un compte ?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-gold hover:text-gold-light transition-colors"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
