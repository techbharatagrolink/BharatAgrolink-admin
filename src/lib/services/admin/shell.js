import { getStore } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { NOW } from "@/lib/mock/admin/seed";

/** Sidebar badge counts. Planned API: GET /api/admin/navigation/badges */
export async function getNavBadges(user) {
  const s = getStore();
  const counts = {
    pendingProducts: can(user, "products.approval") ? s.products.filter((p) => p.statusCode === 0 || p.statusCode === 2).length : 0,
    pendingShipments: can(user, "shipping") ? s.shipments.filter((x) => x.status === "Ready to Ship").length : 0,
    pendingReturns: can(user, "returns") ? s.returns.filter((r) => r.status === "Pending").length : 0,
    pendingVendors: can(user, "vendors.verification") ? s.vendors.filter((v) => v.status === "Pending").length : 0,
    dueFollowUps: can(user, "crm.leads") ? s.leads.filter((l) => l.nextFollowUp && new Date(l.nextFollowUp).getTime() <= NOW).length : 0,
    openRfqs: can(user, "b2b.rfqs") ? s.rfqs.filter((r) => ["Open", "Seller Sourcing"].includes(r.status)).length : 0,
    openEscalations: can(user, "operations.center") ? s.escalations.filter((e) => e.status === "Open").length : 0,
    openTickets: can(user, "support") ? s.tickets.filter((t) => t.status === "Open").length : 0,
    outOfStock: can(user, "products") ? s.products.filter((p) => [1, 3].includes(p.statusCode) && p.stock === 0).length : 0,
  };
  return counts;
}

/** Header notifications built from live queues the user can access. */
export async function getNotifications(user) {
  const s = getStore();
  const items = [];
  const pendingProducts = s.products.filter((p) => p.statusCode === 0 || p.statusCode === 2).length;
  if (can(user, "products.approval") && pendingProducts) items.push({ id: "pp", title: `${pendingProducts} products waiting for approval`, meta: "Catalog · Pending Products", href: "/admin/products/pending", tone: "warning" });
  const stuck = s.orderItems.filter((l) => l.status === "Pending Pickup" && NOW - new Date(l.createdAt).getTime() > 86400000).length;
  if (can(user, "orders") && stuck) items.push({ id: "pk", title: `${stuck} orders pending pickup for over 24 hours`, meta: "Orders · Shipping", href: "/admin/orders?status=Pending+Pickup", tone: "danger" });
  const esc = s.escalations.filter((e) => e.status === "Open" && e.severity === "High").length;
  if (can(user, "operations.center") && esc) items.push({ id: "esc", title: `${esc} high-severity escalations open`, meta: "Operations Center", href: "/admin/operations/ndr", tone: "danger" });
  const ret = s.returns.filter((r) => r.status === "Pending").length;
  if (can(user, "returns") && ret) items.push({ id: "ret", title: `${ret} return requests need a decision`, meta: "Returns & RTO", href: "/admin/returns?status=Pending", tone: "warning" });
  const holds = s.payouts.filter((p) => p.status === "On Hold").length;
  if (can(user, "payouts") && holds) items.push({ id: "hold", title: `${holds} vendor payouts on hold`, meta: "Vendor Payouts", href: "/admin/payouts?status=On+Hold", tone: "warning" });
  const tickets = s.tickets.filter((t) => t.priority === "Urgent" && !["Resolved", "Closed", "Rejected"].includes(t.status)).length;
  if (can(user, "support") && tickets) items.push({ id: "tk", title: `${tickets} urgent tickets open`, meta: "Support", href: "/admin/support?priority=Urgent", tone: "danger" });
  const lowStock = s.products.filter((p) => [1, 3].includes(p.statusCode) && p.stock > 0 && p.stock < 50).length;
  if (can(user, "products") && lowStock) items.push({ id: "ls", title: `${lowStock} products have stock below 50 units`, meta: "Catalog · Inventory", href: "/admin/inventory?reorder=below50", tone: "warning" });
  return items;
}
