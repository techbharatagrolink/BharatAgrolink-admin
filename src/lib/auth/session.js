import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/mock/admin/store";
import { can } from "./permissions";

/**
 * Demo session. The cookie is httpOnly and HMAC-signed so the browser cannot
 * forge a user id or role. When the backend is connected, replace this with
 * the backend-issued session and load the user + role from the API.
 */

export const SESSION_COOKIE = "ba_admin_session";
const SESSION_HOURS = 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production.");
  }
  return value || "dev-only-insecure-admin-session-secret";
}

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(userId) {
  const expires = Date.now() + SESSION_HOURS * 3600000;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const expected = sign(`${userId}.${expires}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;
  return { userId };
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};

export function loadUser(userId) {
  const store = getStore();
  const staff = store.staff.find((u) => u.id === userId && u.status === "Active");
  if (!staff) return null;
  const role = store.roles.find((r) => r.id === staff.roleId);
  if (!role) return null;
  return { ...staff, role };
}

export async function getCurrentAdmin() {
  const jar = await cookies();
  const session = decodeSession(jar.get(SESSION_COOKIE)?.value);
  return session ? loadUser(session.userId) : null;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

/** For pages: returns the user and whether the permission is granted. */
export async function checkPermission(permission, action = "view") {
  const user = await requireAdmin();
  return { user, allowed: can(user, permission, action) };
}

/** For server actions: never trust the client; re-check on every mutation. */
export async function assertPermission(permission, action) {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, user: null, message: "Your session has expired. Please log in again." };
  if (!can(user, permission, action)) return { ok: false, user, message: "You do not have permission to perform this action." };
  return { ok: true, user };
}
