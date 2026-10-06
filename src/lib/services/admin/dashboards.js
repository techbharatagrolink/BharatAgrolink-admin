import "server-only";
import { getStore } from "@/lib/mock/admin/store";
import { NOW, DAY } from "@/lib/mock/admin/seed";
import { mockLatency, countBy, sum } from "./_query";

/**
 * Dashboard aggregates. Planned APIs:
 *   GET /api/admin/dashboards/main?range=
 *   GET /api/admin/dashboards/{orders|products|logistics|finance|vendors}?range=
 * All figures are computed on the server; the browser only renders them.
 */

export const RANGES = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

const SHIPPED = ["Shipped", "In Transit", "Out for Delivery", "Delivered", "Undelivered", "RTO", "RTO Delivered", "Return Requested", "Return Completed"];
const OPEN_FULFILMENT = ["Placed", "Accepted", "Packed", "Pending Pickup"];
const IN_TRANSIT = ["Shipped", "In Transit", "Out for Delivery", "Undelivered"];

function period(range) {
  const def = RANGES.find((r) => r.value === range) ?? RANGES[1];
  const end = NOW;
  const start = end - def.days * DAY;
  return { ...def, start, end, prevStart: start - def.days * DAY, prevEnd: start };
}

const inWindow = (iso, from, to) => {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
};

const pctChange = (current, previous) => (previous ? ((current - previous) / previous) * 100 : null);
const round1 = (n) => Math.round(n * 10) / 10;

function buckets(p) {
  const step = p.days > 30 ? 7 : 1;
  const out = [];
  for (let t = p.start; t < p.end; t += step * DAY) {
    const label = new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
    out.push({ from: t, to: Math.min(p.end, t + step * DAY), label });
  }
  return out;
}

function lineMetrics(lines) {
  const delivered = lines.filter((l) => l.status === "Delivered");
  const shipped = lines.filter((l) => SHIPPED.includes(l.status));
  const rto = lines.filter((l) => l.status.startsWith("RTO"));
  return {
    deliveredSales: sum(delivered, "price"),
    deliveredLines: delivered.length,
    shippedLines: shipped.length,
    rtoLines: rto.length,
    rtoPct: shipped.length ? round1((rto.length / shipped.length) * 100) : 0,
  };
}

/* -------------------------------------------------------------- Orders */

export async function getOrdersDashboard(range) {
  await mockLatency();
  const s = getStore();
  const p = period(range);
  const orders = s.orders.filter((o) => inWindow(o.createdAt, p.start, p.end));
  const lines = s.orderItems.filter((l) => inWindow(l.createdAt, p.start, p.end));
  const byStatus = countBy(lines, "status");
  const byChannel = Object.entries(countBy(orders, "channel")).map(([label, value]) => ({ label, value }));
  const byPayment = Object.entries(countBy(orders, "paymentMode")).map(([label, value]) => ({ label, value }));
  const trend = buckets(p).map((b) => {
    const bo = s.orders.filter((o) => inWindow(o.createdAt, b.from, b.to));
    return { label: b.label, COD: bo.filter((o) => o.paymentMode === "COD").length, Prepaid: bo.filter((o) => o.paymentMode === "Prepaid").length, Partial: bo.filter((o) => o.paymentMode === "Partial").length };
  });
  const funnel = [
    ["Placed", ["Placed"]],
    ["Accepted / packed", ["Accepted", "Packed", "Pending Pickup"]],
    ["In transit", IN_TRANSIT],
    ["Delivered", ["Delivered", "Return Requested", "Return Completed"]],
    ["RTO", ["RTO", "RTO Delivered"]],
    ["Cancelled / rejected", ["Cancelled", "Rejected"]],
  ].map(([label, statuses]) => ({ label, value: statuses.reduce((acc, st) => acc + (byStatus[st] || 0), 0) }));
  return {
    period: { value: p.value, label: p.label },
    stats: {
      orders: orders.length,
      lines: lines.length,
      gmv: sum(orders, "total"),
      cancelled: (byStatus.Cancelled || 0) + (byStatus.Rejected || 0),
      multiVendor: orders.filter((o) => o.vendors > 1).length,
      awaitingAcceptance: s.orderItems.filter((l) => l.status === "Placed").length,
    },
    trend,
    funnel,
    byChannel,
    byPayment,
  };
}

/* ------------------------------------------------------------ Products */

export async function getProductsDashboard() {
  await mockLatency();
  const s = getStore();
  const live = s.products.filter((x) => x.statusCode === 1);
  const byVerdict = Object.entries(countBy(live, "verdict")).map(([label, value]) => ({ label, value }));
  const byCategory = Object.entries(countBy(live, "parentCategory"))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const soldQty = {};
  for (const l of s.orderItems) if (l.status === "Delivered") soldQty[l.productName] = (soldQty[l.productName] || 0) + l.qty;
  const bestSellers = Object.entries(soldQty)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  return {
    stats: {
      total: s.products.length,
      live: live.length,
      pending: s.products.filter((x) => x.statusCode === 0 || x.statusCode === 2).length,
      rejected: s.products.filter((x) => x.statusCode === 3).length,
      lowStock: s.products.filter((x) => [1, 3].includes(x.statusCode) && x.stockStatus === "Low Stock").length,
      outOfStock: s.products.filter((x) => [1, 3].includes(x.statusCode) && x.stockStatus === "Out of Stock").length,
      lossMaking: live.filter((x) => x.verdict === "loss").length,
    },
    byVerdict,
    byCategory,
    bestSellers,
    pending: s.products
      .filter((x) => x.statusCode === 0 || x.statusCode === 2)
      .slice(0, 6)
      .map((x) => ({ id: x.id, name: x.name, vendor: x.vendor, createdAt: x.createdAt })),
  };
}

/* ----------------------------------------------------------- Logistics */

export async function getLogisticsDashboard(range) {
  await mockLatency();
  const s = getStore();
  const p = period(range);
  const lines = s.orderItems.filter((l) => inWindow(l.createdAt, p.start, p.end) && l.courier);
  const couriers = [...new Set(lines.map((l) => l.courier))].map((courier) => {
    const cl = lines.filter((l) => l.courier === courier);
    const m = lineMetrics(cl);
    return { courier, shipments: cl.length, delivered: m.deliveredLines, rto: m.rtoLines, rtoPct: m.rtoPct, deliveredPct: cl.length ? round1((m.deliveredLines / cl.length) * 100) : 0 };
  });
  const byZone = Object.entries(countBy(lines, "zone")).map(([label, value]) => ({ label: label.replace(/_/g, " "), value }));
  const m = lineMetrics(lines);
  return {
    period: { value: p.value, label: p.label },
    stats: {
      readyToShip: s.shipments.filter((x) => x.status === "Ready to Ship").length,
      inTransit: s.orderItems.filter((l) => IN_TRANSIT.includes(l.status)).length,
      ndrOpen: s.ndr.filter((n) => n.status !== "Resolved").length,
      rtoPct: m.rtoPct,
      weightDisputes: s.weightDiscrepancies.filter((w) => w.status === "Raised by courier").length,
      escalations: s.escalations.filter((e) => e.status === "Open").length,
    },
    couriers,
    byZone,
    trend: buckets(p).map((b) => {
      const bl = s.orderItems.filter((l) => inWindow(l.createdAt, b.from, b.to) && l.courier);
      return { label: b.label, shipped: bl.length, rto: bl.filter((l) => l.status.startsWith("RTO")).length };
    }),
  };
}

/* ------------------------------------------------------------- Finance */

export async function getFinanceDashboard(range) {
  await mockLatency();
  const s = getStore();
  const p = period(range);
  const delivered = s.orderItems.filter((l) => l.status === "Delivered" && l.deliveryDate && inWindow(l.deliveryDate, p.start, p.end));
  const gross = sum(delivered, "price");
  const taxable = sum(delivered, "taxable");
  const nrv = sum(delivered, "nrv");
  const tcs = sum(delivered, "tcs");
  const gst = sum(delivered, "gst");
  const commissionExGst = Math.round((taxable - nrv) * 100) / 100;
  return {
    period: { value: p.value, label: p.label },
    stats: {
      gross,
      taxable,
      commissionExGst,
      tcs,
      gst,
      payable: Math.round((nrv - tcs) * 100) / 100,
      pendingPayouts: sum(s.payouts.filter((x) => x.status === "Pending"), "bsa"),
      onHold: sum(s.payouts.filter((x) => x.status === "On Hold"), "bsa"),
      refundsPending: sum(s.refunds.filter((r) => r.status !== "Processed"), "amount"),
      codPending: sum(s.codRecon, "pending"),
      holdLedgerOpen: s.holdLedger.filter((h) => !["RELEASED"].includes(h.status)).length,
    },
    trend: buckets(p).map((b) => {
      const bl = s.orderItems.filter((l) => l.status === "Delivered" && l.deliveryDate && inWindow(l.deliveryDate, b.from, b.to));
      return { label: b.label, gross: Math.round(sum(bl, "price")), commission: Math.round(sum(bl, "taxable") - sum(bl, "nrv")) };
    }),
    expenseCaps: s.expenseCaps,
    payoutQueue: s.payouts
      .filter((x) => x.status !== "Paid")
      .slice(0, 6)
      .map((x) => ({ id: x.id, vendor: x.vendor, cycle: x.cycle, bsa: x.bsa, status: x.status })),
  };
}

/* ------------------------------------------------------------- Vendors */

export async function getVendorDashboard() {
  await mockLatency();
  const s = getStore();
  const scored = s.vendors.filter((v) => v.score != null).sort((a, b) => b.score - a.score);
  return {
    stats: {
      total: s.vendors.length,
      active: s.vendors.filter((v) => v.status === "Active").length,
      pending: s.vendors.filter((v) => v.status === "Pending").length,
      suspended: s.vendors.filter((v) => v.status === "Suspended").length,
      avgScore: scored.length ? round1(scored.reduce((a, v) => a + v.score, 0) / scored.length) : 0,
      payoutAccessOff: s.vendors.filter((v) => !v.payoutAccess).length,
    },
    top: scored.slice(0, 10).map((v) => ({ id: v.id, name: v.name, city: v.city, score: v.score, gmv: Math.round(v.gmv), orders: v.orders, parts: v.scoreParts })),
    bottom: scored.slice(-5).reverse().map((v) => ({ id: v.id, name: v.name, score: v.score, penaltyRate: v.scoreParts?.penaltyRate ?? 0 })),
    byState: Object.entries(countBy(s.vendors, "state")).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
  };
}
