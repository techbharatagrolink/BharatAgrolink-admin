import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { can, pageKey } from "./permissions";
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
    role: {
      id: data.role?.id ?? data.admin.roleId,
      name: data.superAdmin ? "Super Admin" : data.role?.title || "Staff",
      superAdmin: Boolean(data.superAdmin),
      permissions: permissionsFrom(data.pages, data.superAdmin),
      pages: data.superAdmin ? {} : data.pages || {},
    },
  };
}

async function profileFor(token) {
  const { data } = await api("admin/auth/me", { token });
  return toUser(data, token);
}

export function dropAdminProfile() {}

export async function getCurrentAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token || !TOKEN_RE.test(token)) return null;
  try {
    return await profileFor(token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
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
