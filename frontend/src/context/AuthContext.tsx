import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role, TokenResponse, User } from "@/types/user";
import { apiFetch, getAccessToken, setAccessToken } from "@/api/client";

interface AuthState {
  user: User | null;
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; nom: string; prenom: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

// Keep refresh token in memory only (not localStorage)
// Exported for future token refresh logic
let _refreshToken: string | null = null;
export function getRefreshToken() { return _refreshToken; }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const u = await apiFetch<User>("/auth/me");
      setUser(u);
    } catch {
      // Token invalid or expired — clear it
      setAccessToken(null);
      _refreshToken = null;
      setUser(null);
    }
  }, []);

  // On mount: verify existing token
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(tokens.accessToken);
    _refreshToken = tokens.refreshToken;
    await fetchMe();
  }, [fetchMe]);

  const register = useCallback(async (data: { email: string; password: string; nom: string; prenom: string }) => {
    await apiFetch<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Auto-login after register
    await login(data.email, data.password);
  }, [login]);

  const logout = useCallback(() => {
    setAccessToken(null);
    _refreshToken = null;
    setUser(null);
  }, []);

  const setRole = useCallback((role: Role) => {
    setUser((prev) => (prev ? { ...prev, role } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? "visiteur",
        setRole,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
