"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { SESSION_COOKIE, sessionCookieOptions, dropAdminProfile } from "@/lib/auth/session";

function safeNext(next) {
  return typeof next === "string" && next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/dashboard";
}

/**
 * Staff login against POST /admin/auth/login. The bearer token is stored in
 * an httpOnly cookie; the API checks the same password as the PHP admin.
 */
export async function loginAction(_prev, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  try {
    const { data } = await api("admin/auth/login", { method: "POST", body: { email, password } });
    const maxAge = data.expiresAt ? Math.max(60, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)) : sessionCookieOptions.maxAge;
    const jar = await cookies();
    jar.set(SESSION_COOKIE, data.token, { ...sessionCookieOptions, maxAge });
    dropAdminProfile(data.token);
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "Could not reach the admin API.";
    return { ok: false, message };
  }
  redirect(next);
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    dropAdminProfile(token);
    await api("admin/auth/logout", { method: "POST", token }).catch(() => {});
  }
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
