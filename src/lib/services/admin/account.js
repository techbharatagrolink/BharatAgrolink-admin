import "server-only";
import { api } from "@/lib/api";
import { getStore } from "@/lib/mock/admin/store";
import { getPermissionCatalog } from "@/lib/content/admin/navigation";
import { mockLatency } from "./_query";

/**
 * Signed-in admin's own profile. Planned API: GET /api/admin/me
 * Only the caller's own record and own audit entries are returned.
 */

export async function getMyAccount(user) {
  await mockLatency();
  const s = getStore();
  const catalog = getPermissionCatalog();
  const grants = user.role.superAdmin
    ? catalog.map((p) => ({ ...p, actions: ["view", "add", "edit", "delete"] }))
    : catalog.filter((p) => user.role.permissions?.[p.key]?.length).map((p) => ({ ...p, actions: user.role.permissions[p.key] }));
  return {
    profile: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, designation: user.designation, twoFactor: user.twoFactor, lastLoginAt: user.lastLoginAt, createdAt: user.createdAt },
    role: { id: user.role.id, name: user.role.name, superAdmin: Boolean(user.role.superAdmin), scope: user.role.scope ?? "all" },
    grants,
    activity: s.auditLog.filter((a) => a.actorId === user.id).slice(0, 12),
  };
}

/** Active logins of the signed-in admin (this panel and the PHP panel). Live API: GET /admin/auth/sessions */
export async function getMySessions(user) {
  const { data } = await api("admin/auth/sessions", { token: user.token });
  return Array.isArray(data) ? data : [];
}
