import "server-only";
import { api } from "@/lib/api";

/**
 * Main dashboard. Live API:
 *   GET /api/v1/admin/panel-dashboards/main
 */

export const PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "mtd", label: "Month till today" },
  { value: "30d", label: "Last 30 days" },
  { value: "lastmonth", label: "Last month" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All days" },
];

const FILTER_KEYS = ["preset", "from", "to", "fy", "season", "cycle", "vendor", "type", "range"];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
// Mirrors the API's query schema; anything else is a 400, so it is dropped here.
const VALID = {
  preset: (v) => v.length <= 32,
  range: (v) => v.length <= 32,
  from: (v) => DATE.test(v),
  to: (v) => DATE.test(v),
  fy: (v) => /^\d{4}$/.test(v),
  season: (v) => v.length <= 16,
  cycle: (v) => v.length <= 32,
  vendor: (v) => v.length <= 64,
  type: (v) => ["all", "b2c", "b2b"].includes(v),
};

function one(value) {
  return Array.isArray(value) ? value[0] : value;
}

function dashboardQuery(params = {}) {
  const query = {};
  for (const key of FILTER_KEYS) {
    const value = one(params?.[key])?.trim();
    if (value && VALID[key](value)) query[key] = value;
  }
  const page = one(params?.page)?.trim();
  if (page && /^\d+$/.test(page)) query.page = page;
  const pageSize = one(params?.pageSize)?.trim();
  if (pageSize && ["10", "20", "25", "50", "100"].includes(pageSize)) query.pageSize = pageSize;
  return query;
}

export function dashboardFilterHref(pathname, params = {}) {
  const query = dashboardQuery(params);
  delete query.page;
  delete query.pageSize;
  delete query.range;
  if (query.type === "all") delete query.type;
  const qs = new URLSearchParams(query).toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export async function getMainDashboard(params = {}, user) {
  const { data } = await api("admin/panel-dashboards/main", { token: user.token, query: dashboardQuery(params) });
  return data;
}

/** Row list for one dashboard card. Same filters as the main dashboard, 20 rows a page. */
export async function getDashboardCard(slug, params = {}, user) {
  const { data } = await api(`admin/panel-dashboards/cards/${encodeURIComponent(slug)}`, { token: user.token, query: dashboardQuery(params) });
  return data;
}
