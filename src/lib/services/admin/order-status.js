import "server-only";
import { api } from "@/lib/api";
import { dashboardQuery } from "@/lib/services/admin/main-dashboard";

/**
 * Order Analytics V2.0 – current-status buckets over one canonical B2C sub-order dataset.
 *   GET /api/v1/admin/panel-dashboards/order-status          summary (same filters as the main dashboard)
 *   GET /api/v1/admin/panel-dashboards/order-status/list     exact rows behind a card
 *   GET /api/v1/admin/panel-dashboards/order-status/export   Super Admin file (proxied by /admin/dashboard-exports/order-status)
 */

/** URL segment of a drill-down -> API selector. Every card opens one of these. */
export const DRILLS = {
  orders: { view: "orders", metric: "total" },
  total: { metric: "total" },
  pending: { metric: "pending" },
  dispatched: { metric: "dispatched" },
  active: { metric: "active" },
  unsuccessful: { metric: "unsuccessful" },
  "dispatch-rate": { metric: "dispatchRate" },
  "pending-rate": { metric: "pendingRate" },
  "delivered-share": { metric: "deliveredShare" },
  "rto-share": { metric: "rtoShare" },
  "final-delivery": { metric: "finalDelivery" },
  "final-rto": { metric: "finalRto" },
  mixed: { metric: "mixed" },
  placed: { bucket: "P" },
  manifested: { bucket: "M" },
  "in-transit": { bucket: "I" },
  "out-for-delivery": { bucket: "O" },
  delivered: { bucket: "D" },
  rejected: { bucket: "J" },
  cancelled: { bucket: "C" },
  rto: { bucket: "R" },
  unmapped: { bucket: "U" },
};

/** Bucket key -> drill segment. */
export const BUCKET_DRILL = { P: "placed", M: "manifested", I: "in-transit", O: "out-for-delivery", D: "delivered", J: "rejected", C: "cancelled", R: "rto", U: "unmapped" };

/** API metric key -> drill segment. */
export const METRIC_DRILL = {
  dispatchRate: "dispatch-rate",
  pendingRate: "pending-rate",
  deliveredShare: "delivered-share",
  rtoShare: "rto-share",
  finalDelivery: "final-delivery",
  finalRto: "final-rto",
};

/** Snapshot hash (counts + filters), without the time part, to tell whether two views saw the same data. */
export const snapshotHash = (id) => String(id || "").split("-")[1] || "";

export async function getOrderStatusSummary(params = {}, user) {
  const { data } = await api("admin/panel-dashboards/order-status", { token: user.token, query: dashboardQuery(params) });
  return data;
}

/** Rows behind one drill-down, server-side search and pagination. */
export async function getOrderStatusList(drill, params = {}, user) {
  const selector = DRILLS[drill];
  const { data } = await api("admin/panel-dashboards/order-status/list", { token: user.token, query: { ...dashboardQuery(params), ...selector } });
  return data;
}

/** Download link for the Super Admin export of a drill-down (all filtered rows, not just the page). */
export function orderStatusExportHref(drill, params = {}, format = "xlsx") {
  const query = { ...dashboardQuery(params), ...DRILLS[drill], format };
  delete query.page;
  delete query.pageSize;
  return `/admin/dashboard-exports/order-status?${new URLSearchParams(query).toString()}`;
}
