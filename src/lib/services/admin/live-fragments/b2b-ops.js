/**
 * Live list screens for B2B, bulk inquiries and operations.
 * Merged into LIVE_RESOURCES / LIVE_ADMIN_PATHS by the parent catalog.
 * `page` is the PHP menu link adminCan checks.
 *
 * Buyer and order detail are not exact paths. Also treat these as live:
 *   /^\/admin\/b2b\/buyers\/[^/]+$/
 *   /^\/admin\/b2b\/orders\/[^/]+$/
 */
export const resources = {
  "b2b.buyers": { path: "/b2b/buyers", page: "b2b_orders/buyers.php", permission: "b2b.buyers" },
  "b2b.rfqs": { path: "/b2b/rfqs", page: "b2b_orders/rfqs.php", permission: "b2b.rfqs" },
  "b2b.quotations": { path: "/b2b/quotations", page: "b2b_orders/b2b_quotations.php", permission: "b2b.quotations" },
  "b2b.orders": { path: "/b2b/orders", page: "b2b_orders/b2b_order_list.php", permission: "b2b.orders" },
  "b2b.payments": { path: "/b2b/payments", page: "b2b_orders/payments.php", permission: "b2b.finance" },
  "b2b.settlements": { path: "/b2b/settlements", page: "b2b_orders/settlements.php", permission: "b2b.finance" },
  "b2b.claims": { path: "/b2b/claims", page: "b2b_orders/claims.php", permission: "b2b.orders" },
  "b2b.alerts": { path: "/b2b/alerts", page: "b2b_orders/alerts.php", permission: "b2b" },
  bulk: { path: "/bulk-orders/inquiries", page: "bulk_orders/bulk_inquiry.php", permission: "bulk" },
  "bulk.warehouses": { path: "/bulk-orders/warehouses", page: "bulk_orders/warehouses.php", permission: "bulk" },
  "operations.ndr": { path: "/operations/ndr", page: "operations_center/ndr_escalations.php", permission: "operations.center" },
  "operations.escalations": { path: "/operations/escalations", page: "operations_center/ndr_escalations.php", permission: "operations.center" },
  "operations.recordings": { path: "/operations/recordings", page: "operations_center/index.php", permission: "operations.center" },
  "operations.rules": { path: "/operations/rules", page: "operations_center/settings.php", permission: "operations.rules" },
  "operations.sla": { path: "/operations/sla", page: "operations_center/settings.php", permission: "operations.rules" },
  "operations.assignments": { path: "/operations/assignments", page: "operations_team/agent_orders.php", permission: "operations.team" },
  "operations.agents": { path: "/operations/agents", page: "operations_team/agent_report.php", permission: "operations.team" },
  "operations.agentMaster": { path: "/operations/agent-master", page: "operations_team/setup.php", permission: "operations.setup" },
  "operations.setup": { path: "/operations/kpi-targets", page: "operations_team/setup.php", permission: "operations.setup" },
};

export const livePaths = [
  "/admin/b2b",
  "/admin/b2b/quotations/new",
  "/admin/b2b/catalog/generate",
  "/admin/b2b/buyers",
  "/admin/b2b/rfqs",
  "/admin/b2b/quotations",
  "/admin/b2b/orders",
  "/admin/b2b/payments",
  "/admin/b2b/settlements",
  "/admin/b2b/claims",
  "/admin/b2b/alerts",
  "/admin/bulk-orders",
  "/admin/bulk-orders/warehouses",
  "/admin/operations",
  "/admin/operations/ndr",
  "/admin/operations/escalations",
  "/admin/operations/recordings",
  "/admin/operations/rules",
  "/admin/operations/sla",
  "/admin/operations/team",
  "/admin/operations/team/assignments",
  "/admin/operations/team/agents",
  "/admin/operations/team/setup",
];

export function isLiveB2bOpsPath(pathname) {
  if (livePaths.includes(pathname)) return true;
  return /^\/admin\/b2b\/buyers\/[^/]+$/.test(pathname || "") || /^\/admin\/b2b\/orders\/[^/]+$/.test(pathname || "");
}
