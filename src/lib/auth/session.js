import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { can, canExport, EXPORT_DENIED, pageKey } from "./permissions";
import { permissionPages } from "@/lib/services/admin/live-catalog";

/**
 * Admin session is the bearer token from POST /admin/auth/login.
 * The cookie is httpOnly. Profile and page permissions are loaded from
 * GET /admin/auth/me on every request so a reload shows the current account.
 */

export const SESSION_COOKIE = "ba_admin_session";
const TOKEN_RE = /^[a-f0-9]{24}:[a-f0-9]{64}$/;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 12 * 3600,
};

function permissionsFrom(pages, superAdmin) {
  if (superAdmin) return {};
  const granted = pages || {};
  const permissions = {};
  for (const [permission, phpPages] of Object.entries(permissionPages())) {
    const actions = new Set();
    for (const page of phpPages) for (const action of granted[pageKey(page)] || []) actions.add(action);
    if (actions.size) permissions[permission] = [...actions];
  }
  return permissions;
}

function toUser(data, token) {
  return {
    id: data.admin.id,
    name: data.admin.name,
    email: data.admin.email,
    designation: data.role?.title || data.admin.company || "",
    token,
    // B2B cost / margin / discount visibility from the staff role (no separate B2B roles).
    b2b: data.b2b ?? { canViewMargin: Boolean(data.superAdmin), canViewCost: Boolean(data.superAdmin), maxDiscountPct: data.superAdmin ? 100 : 0, capabilities: [] },
    role: {
      id: data.role?.id ?? data.admin.roleId,
      name: data.superAdmin ? "Super Admin" : data.role?.title || "Staff",
      superAdmin: Boolean(data.superAdmin),
      permissions: permissionsFrom(data.pages, data.superAdmin),
      pages: data.superAdmin ? {} : data.pages || {},
    },
  };
}

// The API's database is remote and now and then drops a connection, so a single /me call can fail
// with a 5xx (or no response at all) even though the session is fine. Those are retried briefly;
// 401/403 (bad or expired session) are never retried and still send the admin to the login page.
const PROFILE_RETRY_DELAYS_MS = [300, 900, 2000];
const isTransient = (error) => !(error instanceof ApiError) || error.status >= 500;

async function profileFor(token) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const { data } = await api("admin/auth/me", { token });
      return toUser(data, token);
    } catch (error) {
      if (!isTransient(error) || attempt >= PROFILE_RETRY_DELAYS_MS.length) {
        if (isTransient(error)) console.warn(`[admin auth] GET admin/auth/me failed after ${attempt + 1} tries: ${error?.message} (status ${error?.status ?? "no response"}, code ${error?.code ?? "-"}) details=${JSON.stringify(error?.details ?? null)}`);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, PROFILE_RETRY_DELAYS_MS[attempt]));
    }
  }
}

export function dropAdminProfile() {}

// cache(): the layout and the page both ask for the admin; one /me call per request serves both.
export const getCurrentAdmin = cache(async () => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token || !TOKEN_RE.test(token)) return null;
  try {
    return await profileFor(token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
});

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

/** For export server actions and download routes: super admins only (see `canExport`). */
export async function assertExport() {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, user: null, status: 401, message: "Your session has expired. Please log in again." };
  if (!canExport(user)) return { ok: false, user, status: 403, message: EXPORT_DENIED };
  return { ok: true, user };
}
