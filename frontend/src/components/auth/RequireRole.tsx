import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/user";

interface Props {
  allowed: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ allowed, children, fallback = null }: Props) {
  const { role } = useAuth();

  if (!allowed.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
