import "server-only";
import { api, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

async function total(user, path, query) {
  if (!can(user, query.permission)) return 0;
  try {
    const { data } = await api(`admin${path}`, { token: user.token, query: { page: 1, pageSize: 10, ...(query.params || {}) } });
    return Number(data?.total ?? 0);
  } catch (error) {
    if (error instanceof ApiError) return 0;
    return 0;
  }
}

/** Sidebar badge counts from the live lists. Queues without an endpoint stay at 0. */
export async function getNavBadges(user) {
  const [pendingProducts, pendingShipments, pendingReturns, pendingVendors, openTickets, outOfStock] = await Promise.all([
    total(user, "/products/pending", { permission: "products.approval" }),
    total(user, "/shipments", { permission: "shipping", params: { status: "Ready to Ship" } }),
    total(user, "/returns", { permission: "returns", params: { status: "Pending" } }),
    total(user, "/vendors/verification", { permission: "vendors.verification", params: { status: "Pending" } }),
    total(user, "/support/tickets", { permission: "support", params: { status: "Open" } }),
    total(user, "/inventory", { permission: "products", params: { stockStatus: "Out of Stock" } }),
  ]);
  const badges = {
    pendingProducts,
    pendingShipments,
    pendingReturns,
    pendingVendors,
    dueFollowUps: 0,
    openRfqs: 0,
    openEscalations: 0,
    openTickets,
    outOfStock,
  };
  return badges;
}

/** Header notifications from the same live queues. */
export async function getNotifications(user) {
  const badges = await getNavBadges(user);
  const items = [];
  if (badges.pendingProducts) items.push({ id: "pp", title: `${badges.pendingProducts} products waiting for approval`, meta: "Catalog · Pending Products", href: "/admin/products/pending", tone: "warning" });
  if (badges.pendingReturns) items.push({ id: "ret", title: `${badges.pendingReturns} return requests need a decision`, meta: "Returns & RTO", href: "/admin/returns?status=Pending", tone: "warning" });
  if (badges.openTickets) items.push({ id: "tk", title: `${badges.openTickets} open support tickets`, meta: "Support", href: "/admin/support?status=Open", tone: "warning" });
  if (badges.outOfStock) items.push({ id: "ls", title: `${badges.outOfStock} products are out of stock`, meta: "Catalog · Inventory", href: "/admin/inventory?stockStatus=Out+of+Stock", tone: "warning" });
  if (badges.pendingVendors) items.push({ id: "vn", title: `${badges.pendingVendors} sellers waiting for approval`, meta: "Vendors", href: "/admin/vendors/verification?status=Pending", tone: "warning" });
  return items;
}
