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

export async function getMenuTree(user) {
  if (!user?.token) return [];
  const { data } = await api("admin/access/menus", { token: user.token });
  return Array.isArray(data) ? data : [];
}
