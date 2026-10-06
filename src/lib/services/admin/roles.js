import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { ACTIONS, can } from "@/lib/auth/permissions";
import { getPermissionCatalog, navigation } from "@/lib/content/admin/navigation";
import { validateReason } from "@/lib/validation/admin/forms";
import { mockLatency } from "./_query";

/**
 * Roles & permissions (`user_roles.permissions_json`). Planned APIs:
 *   GET /api/admin/roles
 *   GET /api/admin/roles/{id}
 *   PUT /api/admin/roles/{id}/permissions   { permissions, reason }
 * Guards: the super admin role is immutable, nobody edits their own role, and
 * a non-super admin cannot grant an action they do not hold themselves.
 */

export async function listRoles() {
  await mockLatency();
  const s = getStore();
  const catalog = getPermissionCatalog();
  return s.roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    superAdmin: Boolean(r.superAdmin),
    scope: r.scope ?? "all",
    users: s.staff.filter((u) => u.roleId === r.id && u.status === "Active").length,
    modules: r.superAdmin ? catalog.length : Object.keys(r.permissions).filter((k) => r.permissions[k]?.includes("view")).length,
    writes: r.superAdmin ? catalog.length : Object.values(r.permissions).filter((a) => a.some((x) => x !== "view")).length,
  }));
}

export async function getRole(id) {
  await mockLatency();
  const s = getStore();
  const role = s.roles.find((r) => String(r.id) === String(id));
  if (!role) return null;
  return {
    role: { id: role.id, name: role.name, description: role.description, superAdmin: Boolean(role.superAdmin), scope: role.scope ?? "all", permissions: structuredClone(role.permissions) },
    catalog: getPermissionCatalog(),
    users: s.staff.filter((u) => u.roleId === role.id).map((u) => ({ id: u.id, name: u.name, email: u.email, status: u.status })),
    history: s.auditLog.filter((a) => a.module === "Roles" && a.entity === role.name).slice(0, 10),
  };
}

export async function updateRolePermissions(id, input, rawReason, user) {
  if (!can(user, "roles", "edit")) return { ok: false, message: "You do not have permission to change roles." };
  const s = getStore();
  const role = s.roles.find((r) => String(r.id) === String(id));
  if (!role) return { ok: false, message: "Role not found." };
  if (role.superAdmin) return { ok: false, message: "The Super Admin role cannot be changed." };
  if (role.id === user.roleId) return { ok: false, message: "You cannot change the permissions of your own role." };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error };

  const keys = new Set(getPermissionCatalog().map((p) => p.key));
  const next = {};
  for (const [key, actions] of Object.entries(input && typeof input === "object" ? input : {})) {
    if (!keys.has(key) || !Array.isArray(actions)) continue;
    const clean = ACTIONS.filter((a) => actions.includes(a));
    if (!clean.length) continue;
    if (!clean.includes("view")) clean.unshift("view");
    const denied = clean.filter((a) => !can(user, key, a));
    if (denied.length) return { ok: false, message: `You cannot grant ${denied.join("/")} on “${key}” because you do not hold it.` };
    next[key] = clean;
  }

  const added = [];
  const removed = [];
  for (const key of keys) {
    const was = role.permissions[key] ?? [];
    const now = next[key] ?? [];
    ACTIONS.forEach((a) => {
      if (now.includes(a) && !was.includes(a)) added.push(`${key}:${a}`);
      if (was.includes(a) && !now.includes(a)) removed.push(`${key}:${a}`);
    });
  }
  if (!added.length && !removed.length) return { ok: false, message: "No permission changes to save." };

  await mockLatency(200);
  role.permissions = next;
  appendAudit({
    actorId: user.id,
    actor: user.name,
    module: "Roles",
    action: `Updated permissions (+${added.length} / −${removed.length})`,
    entity: role.name,
    before: { removed },
    after: { added },
    reason: reason.reason,
  });
  return { ok: true, message: `${role.name}: ${added.length} granted, ${removed.length} revoked. Changes apply on the next request.` };
}

export async function getMenuTree() {
  await mockLatency();
  const s = getStore();
  const holders = (permission) => s.roles.filter((r) => !permission || r.superAdmin || r.permissions[permission]?.includes("view")).map((r) => r.name);
  return navigation.map((section) => ({
    section: section.section,
    items: section.items.map((item) => ({
      key: item.key,
      label: item.label,
      sensitive: Boolean(item.sensitive),
      children: (item.children ?? [item]).map((c) => ({ key: c.key, label: c.label, href: c.href, permission: c.permission ?? "(all staff)", action: c.action ?? "view", legacy: c.legacy, roles: holders(c.permission) })),
    })),
  }));
}
