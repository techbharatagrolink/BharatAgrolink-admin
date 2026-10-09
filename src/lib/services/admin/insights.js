import "server-only";
import { api } from "@/lib/api";
import { RANGES } from "./dashboards";

/**
 * Module dashboards. Planned APIs:
 *   GET /api/admin/finance/pnl?range=
 *   GET /api/admin/b2b/dashboard
 *   GET /api/admin/crm/dashboard
 *   GET /api/admin/sales/dashboard
 *   GET /api/admin/operations/center
 *   GET /api/admin/operations/team/dashboard
 * Row-level scope ("own" roles) is applied here, never in the browser.
 */

export async function getProfitLoss(range, user) {
  const value = Array.isArray(range) ? range[0] : range;
  const { data } = await api("admin/panel-dashboards/pnl", {
    token: user.token,
    query: { range: RANGES.some((item) => item.value === value) ? value : "30d" },
  });
  return data;
}

/* ------------------------------------------------------------------- B2B */

export async function getB2BDashboard(user) {
  const { data } = await api("admin/b2b/dashboard", { token: user?.token });
  return data;
}

/* ------------------------------------------------------------------- CRM */

export async function getCrmDashboard(user) {
  const { data } = await api("admin/crm/dashboard", { token: user?.token });
  return data;
}

/* ----------------------------------------------------------------- Sales */

export async function getSalesDashboard(user) {
  const { data } = await api("admin/sales/dashboard", { token: user?.token });
  return data;
}

/* ------------------------------------------------------------ Operations */

const EMPTY_CENTER = { scoped: false, kpis: [], stages: [], kpiTargets: [], escalations: [], breached: [] };
const EMPTY_TEAM = { stats: { agents: 0, open: 0, breached: 0, unassigned: 0, avgConfirmed: 0, calls: 0 }, agents: [], kpiTargets: [] };

export async function getOperationsCenter(user) {
  if (!user?.token) return EMPTY_CENTER;
  const { data } = await api("admin/operations/center", { token: user.token });
  return data ?? EMPTY_CENTER;
}

export async function getOperationsTeam(user) {
  if (!user?.token) return EMPTY_TEAM;
  const { data } = await api("admin/operations/team", { token: user.token });
  return data ?? EMPTY_TEAM;
}
