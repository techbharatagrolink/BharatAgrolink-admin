"use client";

import { AppFrame } from "@/components/app-frame";
import { AuthProvider } from "@/components/auth-provider";

export default function ConsoleLayout({ children }) {
  return (
    <AuthProvider>
      <AppFrame>{children}</AppFrame>
    </AuthProvider>
  );
}
