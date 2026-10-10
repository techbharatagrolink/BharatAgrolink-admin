"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { SESSION_COOKIE, sessionCookieOptions, dropAdminProfile } from "@/lib/auth/session";

/** Same-origin paths only. Old console paths (e.g. /orders from /login?next=) are redirected to /admin by next.config. */
function safeNext(next) {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) && !/[\r\n]/.test(next) && next !== "/admin/login" ? next : "/admin/dashboard";
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
    const jar = await cookies();
    jar.set(SESSION_COOKIE, data.token, { ...sessionCookieOptions, maxAge: cookieMaxAge(data.expiresAt) });
    dropAdminProfile(data.token);
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "Could not reach the admin API.";
    return { ok: false, message };
  }
  redirect(next);
}

function cookieMaxAge(expiresAt) {
  return expiresAt ? Math.max(60, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : sessionCookieOptions.maxAge;
}

/**
 * POST /admin/auth/change-password. The API ends every login of this admin
 * and returns a new token for this device, which replaces the session cookie.
 */
export async function changePasswordAction(_prev, formData) {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  if (!currentPassword || !newPassword) return { ok: false, message: "Enter your current and new password." };
  if (newPassword !== confirmPassword) return { ok: false, message: "The new passwords do not match.", fieldErrors: { confirmPassword: "Does not match the new password." } };

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    const { data } = await api("admin/auth/change-password", { method: "POST", token, body: { currentPassword, newPassword } });
    jar.set(SESSION_COOKIE, data.token, { ...sessionCookieOptions, maxAge: cookieMaxAge(data.expiresAt) });
    revalidatePath("/admin/account");
    return { ok: true, message: "Password updated. Your other sessions were signed out." };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/admin/login");
    const field = error instanceof ApiError ? error.details?.field : undefined;
    return { ok: false, message: error instanceof ApiError ? error.message : "Could not reach the admin API.", fieldErrors: field ? { [field]: error.message } : undefined };
  }
}

/** POST /admin/auth/logout-all { keepCurrent: true } - signs out every other device. */
export async function logoutOtherSessionsAction() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    const { data } = await api("admin/auth/logout-all", { method: "POST", token, body: { keepCurrent: true } });
    const ended = data?.sessionsEnded ?? 0;
    revalidatePath("/admin/account");
    return { ok: true, message: `Ended ${ended} other session${ended === 1 ? "" : "s"}.` };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/admin/login");
    return { ok: false, message: error instanceof ApiError ? error.message : "Could not reach the admin API." };
  }
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
