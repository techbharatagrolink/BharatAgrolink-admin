import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Roles and admin menus.
 * GET/PUT /api/v1/admin/access/roles and /api/v1/admin/access/menus.
 * permissions_json is keyed by admin_menus.id.
 */

function fail(error) {
  const message = error instanceof ApiError ? error.message : "The admin API could not update that role.";
  return { ok: false, message };
}

export async function listRoles(user) {
  if (!user?.token) return [];
  const { data } = await api("admin/access/roles", { token: user.token });
  return (data || []).map((role) => ({
    id: role.id,
    name: role.name,
    description: "",
    superAdmin: Boolean(role.superAdmin),
    manager: Boolean(role.manager),
    users: role.users,
    modules: role.modules,
    writes: role.writes,
  }));
}

export async function getRole(id, user) {
  if (!user?.token) return null;
  try {
    const { data } = await api(`admin/access/roles/${encodeURIComponent(id)}`, { token: user.token });
    if (!data?.role) return null;
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function updateRolePermissions(id, input, rawReason, user) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/access/roles/${encodeURIComponent(id)}/permissions`, {
      method: "PUT",
      token: user.token,
      body: { permissions: input, reason: rawReason },
    });
    return { ok: true, message: data?.message || "Permissions saved." };
  } catch (error) {
    return fail(error);
  }
}

/** The whole admin_menus tree, hidden rows included: [{ id, parentId, name, link, icon, order, status, roles, children }]. */
export async function getMenuTree(user) {
  if (!user?.token) return [];
  const { data } = await api("admin/access/menus", { token: user.token });
  return Array.isArray(data) ? data : [];
}

async function menuCall(path, method, body, user, fallback) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(path, { method, token: user.token, body });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : fallback };
  }
}

export function createMenu(input, user) {
  return menuCall("admin/access/menus", "POST", input, user, "The admin API could not add that menu.");
}

export function updateMenu(id, input, user) {
  return menuCall(`admin/access/menus/${encodeURIComponent(id)}`, "PUT", input, user, "The admin API could not update that menu.");
}

export function moveMenu(id, direction, visibleOnly, user) {
  return menuCall(`admin/access/menus/${encodeURIComponent(id)}/move`, "POST", { direction, visibleOnly: Boolean(visibleOnly) }, user, "The admin API could not move that menu.");
}

export function deleteMenu(id, reason, user) {
  return menuCall(`admin/access/menus/${encodeURIComponent(id)}`, "DELETE", { reason }, user, "The admin API could not delete that menu.");
}
