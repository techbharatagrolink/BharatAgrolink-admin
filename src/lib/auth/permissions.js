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

/**
 * Data exports (CSV / Excel downloads of admin lists and reports) are for super admins only.
 * Client code uses it to hide Export buttons; every export server action and download route
 * re-checks it with `assertExport` (lib/auth/session.js).
 */
export function canExport(user) {
  return Boolean(user?.role?.superAdmin || user?.superAdmin);
}

export const EXPORT_DENIED = "Only a super admin can export data.";

/**
 * PHP grant key for an admin_menus link: its file name with query or #anchor, as the API's pageKey.
 * '#dashboard_*' anchors (the Main Dashboard's Sales/Orders/Shipping/Product & Location Overview
 * sections) keep their own distinct key rather than collapsing into "dashboard.php", so each one
 * is gated by its own Roles & Permissions checkbox instead of all sharing the page-level grant.
 */
export function pageKey(link) {
  const value = String(link ?? "").trim();
  return value.split("/").pop();
}

/** Whether the role grants `action` on a PHP menu link (header.php's rule for showing a menu item). */
export const SALES_CARD_SLUGS = [
  "total-sales-b2c",
  "total-sales-b2b",
  "total-revenue",
  "seller-payout",
  "platform-revenue",
  "shipping-charges",
  "pg-charges",
  "prepaid-partial",
  "tcs",
  "rto-charges",
];

const FINANCE_CARDS = new Set(["seller-payout", "platform-revenue", "pg-charges", "tcs", "rto-charges"]);

/**
 * Non-sales dashboard cards are gated by the SAME section permission that renders their tile on the
 * main dashboard (see app/admin/(panel)/dashboard/page.js). They have no individual
 * #dashboard_card_* checkbox, so a card's detail page is viewable iff its section is. Keyed by
 * card slug → section page key.
 */
const NON_SALES_CARD_SECTION = {
  // Orders overview
  "total-orders": "#dashboard_orders_overview",
  "accepted-orders": "#dashboard_orders_overview",
  "rejected-orders": "#dashboard_orders_overview",
  "sub-orders": "#dashboard_orders_overview",
  shipped: "#dashboard_orders_overview",
  "delivered-orders": "#dashboard_orders_overview",
  "delivered-gross": "#dashboard_orders_overview",
  "cancelled-orders": "#dashboard_orders_overview",
  "rto-orders": "#dashboard_orders_overview",
  "rto-rate": "#dashboard_orders_overview",
  "new-orders": "#dashboard_orders_overview",
  "repeat-orders": "#dashboard_orders_overview",
  "repeat-customers": "#dashboard_orders_overview",
  // Shipping & courier analytics
  delhivery: "#dashboard_logistics_overview",
  shiprocket: "#dashboard_logistics_overview",
  "average-shipping": "#dashboard_logistics_overview",
  // Marketplace, product & location
  "top-products": "#dashboard_products_overview",
  "top-locations": "#dashboard_products_overview",
  // Customers
  "unique-visitors": "#dashboard_customers_overview",
  "web-visitors": "#dashboard_customers_overview",
  "page-views": "#dashboard_customers_overview",
  "new-registrations": "#dashboard_customers_overview",
  "ordering-customers": "#dashboard_customers_overview",
  // Payments
  "prepaid-orders": "#dashboard_payments_overview",
  "partial-orders": "#dashboard_payments_overview",
  "cod-orders": "#dashboard_payments_overview",
};

export function cardPermissionKey(slug) {
  return `#dashboard_card_${String(slug || "").replace(/-/g, "_")}`;
}

/** Whether the user's role grants viewing a specific dashboard card (e.g. 'total-sales-b2c'). */
export function canCard(user, slug) {
  if (!user || !user.role) return false;
  if (user.role.superAdmin) return true;

  const key = cardPermissionKey(slug);
  if (canPage(user, key, "view")) return true;

  // Non-sales cards (Orders Overview, shipping, marketplace, customers, payments) have no individual
  // #dashboard_card_* checkbox. The detail page mirrors the SAME section permission that renders the
  // tile on the main dashboard, so the card is viewable iff its section is. This keeps e.g. the
  // "RTO rate" orders card visible regardless of which specific Sales cards a role has configured.
  const sectionKey = NON_SALES_CARD_SECTION[slug];
  if (sectionKey) return canPage(user, sectionKey, "view");

  // Sales cards: if this role has configured ANY specific sales card, sales cards not granted are hidden.
  const hasAnySpecificCard = SALES_CARD_SLUGS.some((s) => canPage(user, cardPermissionKey(s), "view"));
  if (hasAnySpecificCard) return false;

  // Backward compatibility: role hasn't configured specific sales cards yet — check section and finance.
  const hasSection = canPage(user, "#dashboard_sales_overview", "view");
  if (!hasSection) return false;

  if (FINANCE_CARDS.has(slug)) {
    return can(user, "finance") || can(user, "payouts");
  }
  return true;
}

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
