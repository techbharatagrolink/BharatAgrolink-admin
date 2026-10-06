"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

const TOKEN_KEY = "ba-admin-token";
const PROFILE_KEY = "ba-admin-session";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    if (stored?.expiresAt && new Date(stored.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      return null;
    }
    return { token, expiresAt: stored?.expiresAt || null, profile: stored?.profile || null };
  } catch {
    return null;
  }
}

function persistSession(session) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ expiresAt: session.expiresAt, profile: session.profile }));
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    const token = session?.token;
    setSession(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
    if (token) {
      api("admin/auth/logout", { method: "POST", token }).catch(() => {});
    }
    router.replace("/login");
  }, [router, session?.token]);

  const login = useCallback(async (email, password) => {
    const { data } = await api("admin/auth/login", { method: "POST", body: { email, password } });
    const next = {
      token: data.token,
      expiresAt: data.expiresAt,
      profile: {
        admin: data.admin,
        role: data.role,
        superAdmin: data.superAdmin,
        pages: data.pages,
      },
    };
    persistSession(next);
    setSession(next);
    router.replace("/dashboard");
  }, [router]);

  const replaceToken = useCallback((token, expiresAt) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, token, expiresAt: expiresAt || current.expiresAt };
      persistSession(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!session && pathname !== "/login") router.replace("/login");
    if (session && pathname === "/login") router.replace("/dashboard");
  }, [ready, session, pathname, router]);

  const value = useMemo(
    () => ({ session, ready, login, logout, replaceToken }),
    [session, ready, login, logout, replaceToken]
  );

  if (!ready) {
    return <div className="grid min-h-dvh place-items-center text-sm text-ink-muted">Loading…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

export function useApi() {
  const { session, logout } = useAuth();
  return useCallback(
    async (path, options) => {
      if (!session?.token) throw new ApiError("Please log in again.", { status: 401, code: "ADMIN_TOKEN_INVALID" });
      try {
        return await api(path, { ...options, token: session.token });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) logout();
        throw error;
      }
    },
    [session?.token, logout]
  );
}
