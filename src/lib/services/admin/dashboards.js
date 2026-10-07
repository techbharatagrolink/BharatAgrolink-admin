import "server-only";
import { api } from "@/lib/api";

/**
 * Dashboard aggregates. Live APIs:
 *   GET /api/v1/admin/panel-dashboards/orders?range=
 *   GET /api/v1/admin/panel-dashboards/products
 *   GET /api/v1/admin/panel-dashboards/logistics?range=
 *   GET /api/v1/admin/panel-dashboards/finance?range=
 *   GET /api/v1/admin/panel-dashboards/sellers
 */

export const RANGES = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

function one(value) {
  return Array.isArray(value) ? value[0] : value;
}

function rangeQuery(range) {
  const value = one(range);
  return { range: RANGES.some((item) => item.value === value) ? value : "30d" };
}

export async function getOrdersDashboard(range, user) {
  const { data } = await api("admin/panel-dashboards/orders", { token: user.token, query: rangeQuery(range) });
  return data;
}

export async function getProductsDashboard(user) {
  const { data } = await api("admin/panel-dashboards/products", { token: user.token });
  return data;
}

export async function getLogisticsDashboard(range, user) {
  const { data } = await api("admin/panel-dashboards/logistics", { token: user.token, query: rangeQuery(range) });
  return data;
}

export async function getFinanceDashboard(range, user) {
  const { data } = await api("admin/panel-dashboards/finance", { token: user.token, query: rangeQuery(range) });
  return data;
}

export async function getVendorDashboard(user) {
  const { data } = await api("admin/panel-dashboards/sellers", { token: user.token });
  return data;
}
