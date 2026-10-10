import "server-only";
import { api } from "@/lib/api";
import { getStore } from "@/lib/mock/admin/store";
import { NOW, DAY } from "@/lib/mock/admin/seed";
import { mockLatency, countBy, sum } from "./_query";
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

const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const inWindow = (iso, from, to) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= from && t < to;
};
const toList = (counts, order) => (order ?? Object.keys(counts)).map((label) => ({ label, value: counts[label] ?? 0 })).filter((d) => d.value > 0);
const ownOnly = (user) => user.role.scope === "own" && !user.role.superAdmin;

export async function getProfitLoss(range, user) {
  const value = Array.isArray(range) ? range[0] : range;
  const { data } = await api("admin/panel-dashboards/pnl", {
    token: user.token,
    query: { range: RANGES.some((item) => item.value === value) ? value : "30d" },
  });
  return data;
}

/* ------------------------------------------------------------------- B2B */

const OPEN_RFQ = ["Draft", "Open", "Seller Sourcing", "Quotes Received", "Customer Quote Ready", "Sent", "Negotiation"];

export async function getB2BDashboard(user) {
  await mockLatency();
  const s = getStore();
  const mine = (r) => !ownOnly(user) || r.owner === user.name;
  const buyers = s.b2bBuyers.filter(mine);
  const rfqs = s.rfqs.filter(mine);
  const quotes = s.quotations.filter(mine);
  const orders = s.b2bOrders.filter(mine);
  const orderIds = new Set(orders.map((o) => o.id));
  const payments = s.b2bPayments.filter((p) => orderIds.has(p.orderId));
  const open = rfqs.filter((r) => OPEN_RFQ.includes(r.status));
  const converted = rfqs.filter((r) => r.status === "Converted").length;
  const decided = rfqs.filter((r) => ["Converted", "Lost", "Expired"].includes(r.status)).length;
  const value = sum(orders.filter((o) => o.status !== "cancelled"), "value");
  return {
    stats: {
      buyers: buyers.length,
      openRfqs: open.length,
      slaBreached: open.filter((r) => new Date(r.slaDueAt).getTime() < NOW && ["Open", "Seller Sourcing", "Quotes Received"].includes(r.status)).length,
      approvalPending: quotes.filter((q) => q.status === "Approval Pending" || q.approval === "Approval Pending").length,
      orderValue: value,
      contributionPct: pct(sum(orders, "contribution"), value),
      outstanding: sum(buyers, "outstanding"),
      overdue: sum(payments.filter((p) => p.status === "Overdue"), "amount"),
      winRate: pct(converted, decided),
    },
    funnel: [
      { label: "RFQs", value: rfqs.length },
      { label: "Quoted", value: quotes.length },
      { label: "Accepted / converted", value: quotes.filter((q) => ["Accepted", "Converted"].includes(q.status)).length },
      { label: "Orders", value: orders.length },
    ],
    rfqStatus: toList(countBy(rfqs, "status")),
    lostReasons: toList(countBy(rfqs.filter((r) => r.lostReason), "lostReason")),
    segments: toList(countBy(buyers, "segment")),
    alerts: s.b2bAlerts.filter((a) => a.status !== "Resolved" && (!ownOnly(user) || a.assignedTo === user.name)).slice(0, 8),
    recentOrders: [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6),
  };
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
const EMPTY_TEAM = {
  stats: { agents: 0, open: 0, breached: 0, unassigned: 0, avgConfirmed: 0, calls: 0 },
  agents: [],
  kpiTargets: [],
  summary: { totalAssigned: 0, kpiAchievement: { pct: 0, label: "Below Target" }, revenue: 0, delivered: 0, deliveryRate: 0, slaBreached: 0 },
  funnel: [],
  kpiHealth: [],
  trend: [],
};

export async function getOperationsCenter(user) {
  if (!user?.token) return EMPTY_CENTER;
  const { data } = await api("admin/operations/center", { token: user.token });
  return data ?? EMPTY_CENTER;
}

/** filters: { from, to, days } as on operations_team/dashboard.php. */
export async function getOperationsTeam(user, filters) {
  if (!user?.token) return EMPTY_TEAM;
  const { data } = await api("admin/operations/team", { token: user.token, query: filters });
  return data ?? EMPTY_TEAM;
}
