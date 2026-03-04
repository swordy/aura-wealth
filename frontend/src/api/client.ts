const API_BASE = "/api/v1";

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `API error ${res.status}`;
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}
