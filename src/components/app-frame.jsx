"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/shell/admin-shell";
import { useAuth } from "@/components/auth-provider";

export function AppFrame({ children }) {
  const pathname = usePathname();
  const { session } = useAuth();

  if (pathname === "/login") {
    return <div className="min-h-dvh bg-canvas text-ink">{children}</div>;
  }

  if (!session) return null;

  return <AdminShell>{children}</AdminShell>;
}
