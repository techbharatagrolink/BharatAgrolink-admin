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

/** Live inventory counts (GET /admin/stock/summary + open short orders) for the Inventory Management badges. */
async function stockCounts(user) {
  const none = { outOfStock: 0, stockAlerts: 0, shortOrders: 0 };
  if (!can(user, "inventory")) return none;
  try {
    const [summary, shortfalls] = await Promise.all([api("admin/stock/summary", { token: user.token }), api("admin/stock/shortfalls", { token: user.token })]);
    const s = summary.data ?? {};
    return {
      outOfStock: Number(s.outOfStock ?? 0),
      stockAlerts: Number(s.outOfStock ?? 0) + Number(s.critical ?? 0) + Number(s.lowStock ?? 0),
      shortOrders: Array.isArray(shortfalls.data) ? shortfalls.data.length : 0,
    };
  } catch {
    return none;
  }
}

/** Banner ads waiting for review and refunds to issue (GET /admin/monetization/orders meta.counts). */
async function bannerCounts(user) {
  const none = { bannerReview: 0, bannerRefunds: 0 };
  if (!can(user, "monetization")) return none;
  try {
    const { meta } = await api("admin/monetization/orders", { token: user.token, query: { queue: "review", limit: 1 } });
    return { bannerReview: Number(meta?.counts?.review ?? 0), bannerRefunds: Number(meta?.counts?.refund ?? 0) };
  } catch {
    return none;
  }
}

/** Sidebar badge counts from the live lists. Queues without an endpoint stay at 0. */
export async function getNavBadges(user) {
  const [pendingProducts, pendingShipments, pendingReturns, pendingVendors, openTickets, stock, banners] = await Promise.all([
    total(user, "/products/pending", { permission: "products.approval" }),
    total(user, "/shipments", { permission: "shipping", params: { status: "Ready to Ship" } }),
    total(user, "/returns", { permission: "returns", params: { status: "Pending" } }),
    total(user, "/vendors/verification", { permission: "vendors.verification", params: { status: "Pending" } }),
    total(user, "/support/tickets", { permission: "support", params: { status: "Open" } }),
    stockCounts(user),
    bannerCounts(user),
  ]);
  const { outOfStock, stockAlerts, shortOrders } = stock;
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
    stockAlerts,
    shortOrders,
    bannerReview: banners.bannerReview,
    bannerRefunds: banners.bannerRefunds,
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
  if (badges.shortOrders) items.push({ id: "so", title: `${badges.shortOrders} paid orders were short of stock – call the customers`, meta: "Inventory · Short Orders", href: "/admin/inventory/exceptions", tone: "warning" });
  if (badges.outOfStock) items.push({ id: "ls", title: `${badges.outOfStock} SKUs are out of stock`, meta: "Inventory · Stock Alerts", href: "/admin/inventory/stock?status=OUT_OF_STOCK", tone: "warning" });
  if (badges.pendingVendors) items.push({ id: "vn", title: `${badges.pendingVendors} sellers waiting for approval`, meta: "Vendors", href: "/admin/vendors/verification?status=Pending", tone: "warning" });
  if (badges.bannerReview) items.push({ id: "bar", title: `${badges.bannerReview} paid banner ads waiting for review`, meta: "Monetization Center · Banner Orders", href: "/admin/monetization/orders?queue=review", tone: "warning" });
  if (badges.bannerRefunds) items.push({ id: "baf", title: `${badges.bannerRefunds} banner refunds to issue`, meta: "Monetization Center · Banner Orders", href: "/admin/monetization/orders?queue=refund", tone: "warning" });
  return items;
}
