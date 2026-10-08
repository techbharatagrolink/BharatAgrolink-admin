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

/** PHP grant key for an admin_menus link: its file name with query or #anchor, as the API's pageKey. */
export function pageKey(link) {
  const value = String(link ?? "").trim();
  if (value.startsWith("#dashboard_")) return "dashboard.php";
  return value.split("/").pop();
}

/** Whether the role grants `action` on a PHP menu link (header.php's rule for showing a menu item). */
export function canPage(user, page, action = "view") {
  if (!user || !user.role) return false;
  if (user.role.superAdmin) return true;
  const granted = user.role.pages?.[pageKey(page)];
  return Array.isArray(granted) && granted.includes(action);
}

function showLeaf(user, leaf) {
  if (leaf.page) return canPage(user, leaf.page, "view") && (!leaf.action || canPage(user, leaf.page, leaf.action));
  return can(user, leaf.permission, "view") && (!leaf.action || can(user, leaf.permission, leaf.action));
}

export function filterNavigation(tree, user) {
  return tree
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (!item.children) return showLeaf(user, item) ? item : null;
          const children = item.children.filter((child) => showLeaf(user, child));
          return children.length ? { ...item, children } : null;
        })
        .filter(Boolean),
    }))
    .filter((section) => section.items.length > 0);
}

/** Whether a list column is shown: `requires: "b2b.margin"` / `"b2b.cost"` follow the role's B2B visibility. */
export function columnVisible(user, column) {
  if (!column.requires) return true;
  if (user?.role?.superAdmin) return true;
  if (column.requires === "b2b.margin") return Boolean(user?.b2b?.canViewMargin);
  if (column.requires === "b2b.cost") return Boolean(user?.b2b?.canViewCost);
  return can(user, column.requires, "view");
}

/** Serializable snapshot of a user's grants, safe to send to client components. */
export function toClientUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    designation: user.designation,
    b2b: user.b2b ? { canViewMargin: Boolean(user.b2b.canViewMargin), canViewCost: Boolean(user.b2b.canViewCost), maxDiscountPct: Number(user.b2b.maxDiscountPct) || 0 } : null,
    role: {
      id: user.role.id,
      name: user.role.name,
      superAdmin: Boolean(user.role.superAdmin),
      permissions: user.role.permissions || {},
      pages: user.role.pages || {},
    },
  };
}
