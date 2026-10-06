import "server-only";
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

const round = (n) => Math.round(n * 100) / 100;
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const inWindow = (iso, from, to) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= from && t < to;
};
const toList = (counts, order) => (order ?? Object.keys(counts)).map((label) => ({ label, value: counts[label] ?? 0 })).filter((d) => d.value > 0);
const ownOnly = (user) => user.role.scope === "own" && !user.role.superAdmin;

function period(range) {
  const def = RANGES.find((r) => r.value === range) ?? RANGES[1];
  return { ...def, start: NOW - def.days * DAY, end: NOW };
}

/* ------------------------------------------------------------ Finance P&L */

const FORWARD_SHIPPING_PER_LINE = 72;
const RTO_COST_PER_LINE = 145;
const GATEWAY_FEE_PCT = 2;

function pnlFor(s, from, to, days) {
  const delivered = s.orderItems.filter((l) => l.status === "Delivered" && inWindow(l.deliveryDate, from, to));
  const shipped = s.orderItems.filter((l) => l.awb && inWindow(l.createdAt, from, to));
  const rto = shipped.filter((l) => l.status.startsWith("RTO"));
  const orderIds = new Set(delivered.map((l) => l.orderId));
  const orders = s.orders.filter((o) => orderIds.has(o.id));
  const prepaidGross = sum(delivered.filter((l) => l.paymentMode !== "COD"), "price");

  const commission = round(sum(delivered, "taxable") - sum(delivered, "nrv"));
  const shippingIncome = round(sum(orders, "shippingFee") + sum(orders, "handling"));
  const revenue = round(commission + shippingIncome);

  const shippingCost = round(shipped.length * FORWARD_SHIPPING_PER_LINE);
  const rtoCost = round(rto.length * RTO_COST_PER_LINE);
  const gatewayFees = round((prepaidGross * GATEWAY_FEE_PCT) / 100);
  const discounts = round(sum(orders, "discount"));
  const fixed = round((sum(s.fixedExpenses.filter((f) => f.status === "Active"), "amount") * days) / 30);
  const costs = round(shippingCost + rtoCost + gatewayFees + discounts + fixed);

  return {
    gmv: sum(delivered, "price"),
    revenue,
    costs,
    net: round(revenue - costs),
    lines: [
      { group: "Revenue", label: "Platform commission (taxable − NRV)", value: commission },
      { group: "Revenue", label: "Shipping & COD handling collected", value: shippingIncome },
      { group: "Cost", label: `Forward shipping (est. ₹${FORWARD_SHIPPING_PER_LINE}/shipment)`, value: -shippingCost },
      { group: "Cost", label: `RTO cost (est. ₹${RTO_COST_PER_LINE}/RTO)`, value: -rtoCost },
      { group: "Cost", label: `Payment gateway (${GATEWAY_FEE_PCT}% of prepaid)`, value: -gatewayFees },
      { group: "Cost", label: "Prepaid discounts & coupons", value: -discounts },
      { group: "Cost", label: "Fixed expenses (pro-rated)", value: -fixed },
    ],
  };
}

export async function getProfitLoss(range) {
  await mockLatency();
  const s = getStore();
  const p = period(range);
  const current = pnlFor(s, p.start, p.end, p.days);
  const months = Array.from({ length: 6 }, (_, i) => {
    const end = NOW - (5 - i) * 30 * DAY;
    const r = pnlFor(s, end - 30 * DAY, end, 30);
    return { label: new Date(end - DAY).toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }), revenue: Math.round(r.revenue), costs: Math.round(r.costs) };
  });
  return {
    period: { value: p.value, label: p.label },
    ...current,
    marginPct: pct(current.net, current.gmv),
    months,
    expenseCaps: s.expenseCaps,
    assumptions: [
      "Commission and shipping income come from delivered order lines in the period.",
      "Shipping, RTO and gateway costs are estimates until courier and Razorpay settlement APIs are connected.",
      "Fixed expenses are pro-rated from the Fixed Expenses master.",
    ],
  };
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

const LEAD_STATUSES = ["New", "Called", "Interested", "Follow Up", "Not Interested", "Converted"];

export async function getCrmDashboard(user) {
  await mockLatency();
  const s = getStore();
  const leads = ownOnly(user) ? s.leads.filter((l) => l.assignedTo === user.name) : s.leads;
  const startOfDay = NOW - (NOW % DAY);
  const due = leads.filter((l) => l.nextFollowUp && !["Converted", "Not Interested"].includes(l.status));
  const converted = leads.filter((l) => l.status === "Converted");
  const execs = [...new Set(s.leads.map((l) => l.assignedTo))];
  return {
    scoped: ownOnly(user),
    stats: {
      total: leads.length,
      fresh: leads.filter((l) => l.status === "New").length,
      hot: leads.filter((l) => l.priority === "Hot" && !["Converted", "Not Interested"].includes(l.status)).length,
      overdue: due.filter((l) => new Date(l.nextFollowUp).getTime() < startOfDay).length,
      dueToday: due.filter((l) => inWindow(l.nextFollowUp, startOfDay, startOfDay + DAY)).length,
      conversion: pct(converted.length, leads.length),
      convertedValue: sum(converted, "orderValue"),
      avgAttempts: leads.length ? Math.round((sum(leads, "attempts") / leads.length) * 10) / 10 : 0,
    },
    byStatus: toList(countBy(leads, "status"), LEAD_STATUSES),
    bySource: toList(countBy(leads, "source")).sort((a, b) => b.value - a.value),
    byCrop: toList(countBy(leads, "crop")).sort((a, b) => b.value - a.value).slice(0, 6),
    leaderboard: ownOnly(user)
      ? []
      : execs
          .map((name) => {
            const own = s.leads.filter((l) => l.assignedTo === name);
            const won = own.filter((l) => l.status === "Converted");
            return { id: name, name, leads: own.length, converted: won.length, conversion: pct(won.length, own.length), value: sum(won, "orderValue") };
          })
          .sort((a, b) => b.value - a.value),
    followUps: due
      .sort((a, b) => (a.nextFollowUp < b.nextFollowUp ? -1 : 1))
      .slice(0, 8)
      .map((l) => ({ ...l, overdue: new Date(l.nextFollowUp).getTime() < NOW })),
  };
}

/* ----------------------------------------------------------------- Sales */

export async function getSalesDashboard(user) {
  await mockLatency();
  const s = getStore();
  const rows = ownOnly(user) ? s.achievements.filter((a) => a.person === user.name) : s.achievements;
  const payouts = ownOnly(user) ? s.salesPayouts.filter((p) => p.person === user.name) : s.salesPayouts;
  const target = sum(rows, "target");
  const achieved = sum(rows, "achieved");
  const dayOfMonth = new Date(NOW).getUTCDate();
  const daysInMonth = new Date(Date.UTC(new Date(NOW).getUTCFullYear(), new Date(NOW).getUTCMonth() + 1, 0)).getUTCDate();
  return {
    scoped: ownOnly(user),
    month: rows[0]?.month ?? "",
    stats: {
      target,
      achieved,
      percent: pct(achieved, target),
      runRate: Math.round((achieved / dayOfMonth) * daysInMonth),
      metTarget: rows.filter((r) => r.achieved >= r.target).length,
      people: rows.length,
      payoutTotal: sum(payouts, "total"),
      payoutPending: sum(payouts.filter((p) => p.status === "Pending"), "total"),
      orders: sum(rows, "orders"),
    },
    leaderboard: [...rows].sort((a, b) => b.percent - a.percent),
    payouts,
  };
}

/* ------------------------------------------------------------ Operations */

const STAGES = [
  ["pending", "Pending confirmation"],
  ["processing", "Processing"],
  ["packed", "Packed / pickup"],
  ["shipped", "In transit"],
  ["ndr", "NDR"],
  ["delivered", "Delivered"],
  ["rto", "RTO"],
  ["returns", "Returns"],
  ["cancelled", "Cancelled"],
];

export async function getOperationsCenter(user) {
  await mockLatency();
  const s = getStore();
  const scoped = ownOnly(user);
  const rows = scoped ? s.opsTracker.filter((r) => r.agent === user.name) : s.opsTracker;
  const stage = countBy(rows, "stage");
  const shipped = rows.filter((r) => ["shipped", "ndr", "delivered", "rto", "returns"].includes(r.stage)).length;
  const last24 = rows.filter((r) => NOW - new Date(r.createdAt).getTime() < DAY);
  const escalations = s.escalations.filter((e) => ["Open", "Acknowledged"].includes(e.status) && (!scoped || e.owner === user.name));
  const ndrOpen = s.ndr.filter((n) => n.status !== "Resolved" && (!scoped || n.owner === user.name));
  const kpis = [
    { label: "Orders in last 24h", value: last24.length, href: "/admin/operations/team/assignments" },
    { label: "Pending confirmation", value: stage.pending ?? 0, tone: "warning", href: "/admin/operations/team/assignments?stage=pending" },
    { label: "Processing", value: stage.processing ?? 0, href: "/admin/operations/team/assignments?stage=processing" },
    { label: "Packed / awaiting pickup", value: stage.packed ?? 0, href: "/admin/operations/team/assignments?stage=packed" },
    { label: "In transit", value: stage.shipped ?? 0, tone: "info", href: "/admin/operations/team/assignments?stage=shipped" },
    { label: "Delivered", value: stage.delivered ?? 0, href: "/admin/operations/team/assignments?stage=delivered" },
    { label: "Open NDR", value: ndrOpen.length, tone: "danger", href: "/admin/operations/ndr" },
    { label: "RTO", value: stage.rto ?? 0, tone: "danger", hint: `${pct(stage.rto ?? 0, shipped)}% of shipped`, href: "/admin/rto" },
    { label: "Returns", value: stage.returns ?? 0, tone: "warning", href: "/admin/returns" },
    { label: "Cancelled", value: stage.cancelled ?? 0, tone: "neutral" },
    { label: "SLA breached", value: rows.filter((r) => r.slaState === "Breached").length, tone: "danger", href: "/admin/operations/team/assignments?slaState=Breached" },
    { label: "SLA at risk", value: rows.filter((r) => r.slaState === "At risk").length, tone: "warning", href: "/admin/operations/team/assignments?slaState=At+risk" },
    { label: "Open escalations", value: escalations.length, tone: "danger", href: "/admin/operations/ndr" },
    { label: "COD share", value: `${pct(rows.filter((r) => r.paymentMode === "COD").length, rows.length)}%`, tone: "neutral" },
  ];
  return {
    scoped,
    kpis,
    stages: STAGES.map(([key, label]) => ({ label, value: stage[key] ?? 0 })),
    kpiTargets: s.kpiTargets,
    escalations: escalations.sort((a, b) => (a.severity === "High" ? -1 : 1) - (b.severity === "High" ? -1 : 1)).slice(0, 8),
    breached: rows.filter((r) => r.slaState === "Breached").slice(0, 8),
  };
}

export async function getOperationsTeam() {
  await mockLatency();
  const s = getStore();
  const agents = s.opsAgents.map((a) => {
    const rows = s.opsTracker.filter((r) => r.agent === a.name);
    const open = rows.filter((r) => !["delivered", "cancelled", "rto", "returns"].includes(r.stage));
    return {
      id: a.id,
      name: a.name,
      assigned: rows.length,
      open: open.length,
      breached: rows.filter((r) => r.slaState === "Breached").length,
      delivered: rows.filter((r) => r.stage === "delivered").length,
      confirmedPct: a.confirmedPct,
      dispatch24Pct: a.dispatch24Pct,
      ndrResolutionPct: a.ndrResolutionPct,
      calls: a.calls,
      escalations: s.escalations.filter((e) => e.owner === a.name && ["Open", "Acknowledged"].includes(e.status)).length,
    };
  });
  return {
    stats: {
      agents: agents.length,
      open: sum(agents, "open"),
      breached: sum(agents, "breached"),
      unassigned: s.opsTracker.filter((r) => !r.agent).length,
      avgConfirmed: Math.round(sum(agents, "confirmedPct") / (agents.length || 1)),
      calls: sum(agents, "calls"),
    },
    agents,
    kpiTargets: s.kpiTargets,
  };
}
