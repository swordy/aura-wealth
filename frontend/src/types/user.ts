export type Role = "visiteur" | "abonne" | "super_admin";

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  preferences: Record<string, unknown>;
  onboardingCompleted: boolean;
  createdAt: string | null;
  lastLogin: string | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}
