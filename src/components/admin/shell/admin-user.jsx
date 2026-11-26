"use client";

import { createContext, useContext } from "react";
import { canExport } from "@/lib/auth/permissions";

const AdminUserContext = createContext(null);

/** The signed-in admin (toClientUser snapshot) for client components below the admin shell. */
export function AdminUserProvider({ user, children }) {
  return <AdminUserContext.Provider value={user ?? null}>{children}</AdminUserContext.Provider>;
}

export function useAdminUser() {
  return useContext(AdminUserContext);
}

/** Whether to show Export buttons (super admins only). Only hides UI: export actions and routes re-check on the server. */
export function useCanExport() {
  return canExport(useContext(AdminUserContext));
}
