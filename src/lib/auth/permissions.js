/**
 * RBAC helpers shared by server and client.
 *
 * Mirrors the legacy model: `user_roles.permissions_json` =
 * { "<menu permission key>": ["view", "add", "edit", "delete"] } and
 * role_id 0 = super admin. Client checks only hide UI; every server action
 * re-checks with `assertPermission` and the real backend stays authoritative.
 */

export const ACTIONS = ["view", "add", "edit", "delete"];

export function can(user, permission, action = "view") {
  if (!user || !user.role) return false;
  if (user.role.superAdmin) return true;
  if (!permission) return true;
  const granted = user.role.permissions?.[permission];
  return Array.isArray(granted) && granted.includes(action);
}

export function filterNavigation(tree, user) {
  return tree
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (!item.children) return can(user, item.permission) ? item : null;
          const children = item.children.filter(
            (child) => can(user, child.permission, "view") && (!child.action || can(user, child.permission, child.action)),
          );
          return children.length ? { ...item, children } : null;
        })
        .filter(Boolean),
    }))
    .filter((section) => section.items.length > 0);
}

/** Serializable snapshot of a user's grants, safe to send to client components. */
export function toClientUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    designation: user.designation,
    role: {
      id: user.role.id,
      name: user.role.name,
      superAdmin: Boolean(user.role.superAdmin),
      permissions: user.role.permissions || {},
    },
  };
}
