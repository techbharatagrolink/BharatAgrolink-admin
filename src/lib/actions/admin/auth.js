"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, encodeSession, loadUser, sessionCookieOptions, getCurrentAdmin } from "@/lib/auth/session";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { demoAccounts } from "@/lib/mock/admin/access";

const DEMO_PASSWORD = "Demo@1234";

function safeNext(next) {
  return typeof next === "string" && next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/dashboard";
}

/**
 * Demo login. Planned API: POST /api/admin/auth/login (backend verifies a
 * hashed password with password_verify and returns a server session).
 */
export async function loginAction(_prev, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const staff = getStore().staff.find((u) => u.email.toLowerCase() === email);
  const isDemoAccount = staff && demoAccounts.some((a) => a.userId === staff.id);
  if (!staff || !isDemoAccount || password !== DEMO_PASSWORD) {
    return { ok: false, message: "Email or password is incorrect." };
  }
  const user = loadUser(staff.id);
  if (!user) return { ok: false, message: "This account is inactive. Contact a Super Admin." };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(user.id), sessionCookieOptions);
  appendAudit({ actorId: user.id, actor: user.name, module: "Auth", action: "Login", entity: "Session" });
  redirect(next);
}

export async function logoutAction() {
  const user = await getCurrentAdmin();
  if (user) appendAudit({ actorId: user.id, actor: user.name, module: "Auth", action: "Logout", entity: "Session" });
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
