import "server-only";
import { getStore } from "@/lib/mock/admin/store";
import { NOW, DAY, couriers } from "@/lib/mock/admin/seed";
import { mockLatency, countBy, sum } from "./_query";

/**
 * Main dashboard. Planned API:
 *   GET /api/admin/dashboards/main?preset=&from=&to=&fy=&season=&cycle=&vendor=&type=
 * Every filter is parsed and validated here; unknown values fall back to defaults.
 */

const IST = 5.5 * 3600000;
const PG_RATE = 0.02 * 1.18;
const COURIER_COST_PER_SHIPMENT = 70;

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
export const SEASONS = [
  { value: "kharif", label: "Kharif (Jun–Oct)", months: [5, 6, 7, 8, 9] },
  { value: "rabi", label: "Rabi (Nov–Mar)", months: [10, 11, 0, 1, 2] },
  { value: "zaid", label: "Zaid (Apr–May)", months: [3, 4] },
];
export const CYCLES = [
  { value: "1", label: "1st cycle (1–15)" },
  { value: "2", label: "2nd cycle (16–end)" },
];
export const ORDER_TYPES = [
  { value: "all", label: "All orders (B2C + B2B)" },
  { value: "b2c", label: "B2C only" },
  { value: "b2b", label: "B2B only" },
];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const istDayStart = (t) => Math.floor((t + IST) / DAY) * DAY - IST;
const istParts = (t) => {
  const d = new Date(t + IST);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate() };
};
const istDate = (y, m, day = 1) => Date.UTC(y, m, day) - IST;
const parseDay = (v) => (typeof v === "string" && DATE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00+05:30`)) ? Date.parse(`${v}T00:00:00+05:30`) : null);
const fmtDay = (t) => new Date(t + IST).toISOString().slice(0, 10);

function presetWindow(preset, earliest) {
  const today = istDayStart(NOW);
  const { y, m } = istParts(NOW);
  switch (preset) {
    case "today": return { start: today, end: today + DAY };
    case "yesterday": return { start: today - DAY, end: today };
    case "7d": return { start: NOW - 7 * DAY, end: NOW };
    case "mtd": return { start: istDate(y, m), end: today + DAY };
    case "lastmonth": return { start: istDate(y, m - 1), end: istDate(y, m) };
    case "90d": return { start: NOW - 90 * DAY, end: NOW };
    case "all": return { start: earliest, end: today + DAY, noCompare: true };
    default: return { start: NOW - 30 * DAY, end: NOW };
  }
}

function financialYears(earliest) {
  const out = [];
  const first = istParts(earliest);
  const now = istParts(NOW);
  for (let fy = first.m >= 3 ? first.y : first.y - 1; fy <= (now.m >= 3 ? now.y : now.y - 1); fy++) out.unshift({ value: String(fy), label: `FY ${fy}-${String(fy + 1).slice(2)}` });
  return out;
}

export function resolveDashboardFilters(params = {}, s = getStore()) {
  const earliest = istDayStart(Math.min(...s.orders.map((o) => new Date(o.createdAt).getTime())));
  const fys = financialYears(earliest);
  const pick = (value, list) => (list.some((x) => x.value === value) ? value : "");
  const vendor = s.vendors.find((v) => v.id === params.vendor) ?? null;
  const from = parseDay(params.from);
  const to = parseDay(params.to);
  const fy = pick(params.fy, fys);
  const legacyRange = { "7d": "7d", "30d": "30d", "90d": "90d" }[params.range];
  let preset = pick(params.preset, PRESETS) || legacyRange || "";

  let window;
  let label;
  const custom = from != null && to != null && to >= from && to - from <= 800 * DAY;
  if (custom) {
    window = { start: from, end: to + DAY };
    label = `${fmtDay(from)} to ${fmtDay(to)}`;
    preset = "";
  } else if (fy) {
    window = { start: istDate(Number(fy), 3), end: istDate(Number(fy) + 1, 3), noCompare: true };
    label = fys.find((x) => x.value === fy).label;
    preset = "";
  } else {
    preset = preset || "30d";
    window = presetWindow(preset, earliest);
    label = PRESETS.find((x) => x.value === preset).label;
  }

  const season = SEASONS.find((x) => x.value === params.season) ?? null;
  const cycle = pick(params.cycle, CYCLES);
  const type = pick(params.type, ORDER_TYPES) || "all";
  const extra = (t) => {
    const { m, day } = istParts(t);
    if (season && !season.months.includes(m)) return false;
    if (cycle === "1" && day > 15) return false;
    if (cycle === "2" && day <= 15) return false;
    return true;
  };
  const make = (start, end) => (iso) => {
    const t = new Date(iso).getTime();
    return t >= start && t < end && extra(t);
  };
  const length = window.end - window.start;

  return {
    values: { preset, from: custom ? fmtDay(from) : "", to: custom ? fmtDay(to) : "", fy: custom ? "" : fy, season: season?.value ?? "", cycle, vendor: vendor?.id ?? "", type },
    label: [label, season?.label, CYCLES.find((c) => c.value === cycle)?.label, vendor?.name, type !== "all" ? ORDER_TYPES.find((t) => t.value === type).label : null].filter(Boolean).join(" · "),
    window,
    vendor,
    type,
    inWindow: make(window.start, window.end),
    inPrevious: window.noCompare ? null : make(window.start - length, window.start),
    options: {
      presets: PRESETS,
      seasons: SEASONS.map(({ value, label: l }) => ({ value, label: l })),
      cycles: CYCLES,
      orderTypes: ORDER_TYPES,
      financialYears: fys,
      vendors: s.vendors.filter((v) => v.status === "Active").map((v) => ({ value: v.id, label: v.name })),
    },
  };
}

const PROCESSING = ["Accepted", "Packed", "Pending Pickup"];
const IN_TRANSIT = ["Shipped", "In Transit", "Out for Delivery", "Undelivered"];
const RETURNED = ["Return Requested", "Return Completed"];
const NOT_ACCEPTED = ["Placed", "Cancelled", "Rejected"];
const DEAD = ["Cancelled", "Rejected"];
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const round = (n) => Math.round(n * 100) / 100;
const delta = (cur, prev) => (prev ? ((cur - prev) / prev) * 100 : null);

function compute(s, f, inRange, firstOrderAt) {
  const withB2C = f.type !== "b2b";
  const withB2B = f.type !== "b2c";
  const lines = withB2C ? s.orderItems.filter((l) => inRange(l.createdAt) && (!f.vendor || l.vendorId === f.vendor.id)) : [];
  const lineTotal = {};
  for (const l of lines) lineTotal[l.orderId] = (lineTotal[l.orderId] || 0) + l.price;
  const orders = s.orders.filter((o) => lineTotal[o.id] != null);
  const share = (o) => (o.subtotal ? Math.min(1, lineTotal[o.id] / o.subtotal) : 1);
  const orderSum = (rows, fn) => round(rows.reduce((acc, o) => acc + fn(o) * share(o), 0));
  const b2b = withB2B ? s.b2bOrders.filter((o) => inRange(o.createdAt) && o.status !== "cancelled" && (!f.vendor || o.seller === f.vendor.name)) : [];
  const b2bDelivered = b2b.filter((o) => o.status === "delivered");

  const live = lines.filter((l) => !DEAD.includes(l.status));
  const delivered = lines.filter((l) => l.status === "Delivered");
  const shipped = lines.filter((l) => l.courier);
  const rto = lines.filter((l) => l.status.startsWith("RTO"));
  const deliveredOrders = new Set(delivered.map((l) => l.orderId)).size;

  const salesB2C = sum(live, "price");
  const salesB2B = sum(b2b, "value");
  const sellerPayout = round(sum(delivered, "nrv") - sum(delivered, "tcs") + sum(b2bDelivered, "sellerCost"));
  const platformRevenue = round(sum(delivered, "taxable") - sum(delivered, "nrv") + sum(b2bDelivered, "platformRevenue"));
  const shippingCharges = orderSum(orders, (o) => o.shippingFee + o.handling);
  const onlineOrders = orders.filter((o) => o.paymentMode !== "COD");
  const pgCharges = orderSum(onlineOrders, (o) => (o.paymentMode === "Prepaid" ? o.total : o.advance) * PG_RATE);
  const discounts = orderSum(orders, (o) => o.discount);
  const deliveredGross = sum(delivered, "price");
  const deliveredRevenue = round(deliveredGross + sum(b2bDelivered, "value"));
  const courierCost = (shipped.length + rto.length) * COURIER_COST_PER_SHIPMENT;
  const variableCost = round(sellerPayout + pgCharges + courierCost + discounts);
  const contribution = round(deliveredRevenue + shippingCharges - variableCost);

  const customers = new Set(orders.map((o) => o.customerId));
  const newOrders = orders.filter((o) => firstOrderAt.get(o.customerId) === o.createdAt).length;
  const repeatCustomers = [...customers].filter((id) => orders.some((o) => o.customerId === id && firstOrderAt.get(id) !== o.createdAt)).length;

  const units = {};
  for (const l of live) units[l.productId] = (units[l.productId] || 0) + l.qty;
  const [topProductId, topUnits] = Object.entries(units).sort((a, b) => b[1] - a[1])[0] ?? [];
  const cityOrders = countBy(orders, "city");
  const [topCity, topCityOrders] = Object.entries(cityOrders).sort((a, b) => b[1] - a[1])[0] ?? [];
  const deliveredByMode = (mode) => delivered.filter((l) => l.paymentMode === mode);
  const deliveryDays = delivered.filter((l) => l.deliveryDate).map((l) => (new Date(l.deliveryDate) - new Date(l.createdAt)) / DAY);
  const feeOrders = orders.filter((o) => o.shippingFee > 0);

  return {
    sales: {
      salesB2C, salesB2B, totalRevenue: round(salesB2C + salesB2B), sellerPayout, platformRevenue, shippingCharges, pgCharges,
      prepaidPartial: orderSum(onlineOrders, (o) => o.total),
      prepaidPct: pct(orders.filter((o) => o.paymentMode === "Prepaid").length, orders.length),
      partialPct: pct(orders.filter((o) => o.paymentMode === "Partial").length, orders.length),
      tcs: sum(delivered, "tcs"),
      liveLines: live.length,
      b2bCount: b2b.length,
    },
    orders: {
      total: orders.length + b2b.length,
      b2c: orders.length,
      accepted: lines.filter((l) => !NOT_ACCEPTED.includes(l.status)).length,
      rejected: lines.filter((l) => l.status === "Rejected").length,
      subOrders: lines.length,
      processing: lines.filter((l) => PROCESSING.includes(l.status)).length,
      shipped: lines.filter((l) => IN_TRANSIT.includes(l.status)).length,
      delivered: delivered.length,
      deliveredGross,
      aovDelivered: deliveredOrders ? Math.round(deliveredGross / deliveredOrders) : 0,
      cancelled: lines.filter((l) => l.status === "Cancelled").length,
      cancellationRate: pct(lines.filter((l) => l.status === "Cancelled").length, lines.length),
      rto: rto.length,
      rtoRate: pct(rto.length, shipped.length),
      returned: lines.filter((l) => RETURNED.includes(l.status)).length,
      newOrderPct: pct(newOrders, orders.length),
      repeatOrders: orders.length - newOrders,
      repeatCustomerPct: pct(repeatCustomers, customers.size),
    },
    shipping: {
      couriers: couriers.map((c) => ({ name: c, shipments: shipped.filter((l) => l.courier === c).length, delivered: delivered.filter((l) => l.courier === c).length })),
      avgDays: deliveryDays.length ? round(deliveryDays.reduce((a, b) => a + b, 0) / deliveryDays.length) : 0,
      avgAmount: feeOrders.length ? Math.round(sum(feeOrders, "shippingFee") / feeOrders.length) : 0,
      feeOrders: feeOrders.length,
    },
    marketplace: {
      topProduct: topProductId ? { name: s.products.find((p) => p.id === topProductId)?.name ?? topProductId, units: topUnits } : null,
      topLocation: topCity ? { city: topCity, state: orders.find((o) => o.city === topCity)?.state, orders: topCityOrders } : null,
    },
    customers: {
      registrations: s.customers.filter((c) => inRange(c.createdAt)).length,
      ordering: customers.size,
    },
    finance: {
      gmv: round(orderSum(orders, (o) => o.total) + salesB2B),
      deliveredRevenue, variableCost, courierCost, discounts, contribution,
      contributionPct: pct(contribution, deliveredRevenue),
    },
    paymentModes: ["Partial", "Prepaid", "COD"].map((mode) => {
      const rows = deliveredByMode(mode);
      return { mode, count: rows.length, value: sum(rows, "price"), pct: pct(sum(rows, "price"), deliveredGross) };
    }),
    statusMix: Object.entries(countBy(lines, "status")).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    lines,
    orderRows: orders,
  };
}

function alerts(s) {
  const shippedStatuses = [...IN_TRANSIT, "Delivered", "RTO", "RTO Delivered", ...RETURNED];
  const byVendor = new Map();
  for (const l of s.orderItems) {
    const v = byVendor.get(l.vendorId) ?? { rto: 0, shipped: 0 };
    if (shippedStatuses.includes(l.status)) v.shipped++;
    if (l.status.startsWith("RTO")) v.rto++;
    byVendor.set(l.vendorId, v);
  }
  const highRto = s.vendors
    .filter((v) => (byVendor.get(v.id)?.shipped ?? 0) >= 3 && byVendor.get(v.id).rto / byVendor.get(v.id).shipped > 0.1)
    .map((v) => ({ name: v.name, rtoPct: pct(byVendor.get(v.id).rto, byVendor.get(v.id).shipped) }))
    .sort((a, b) => b.rtoPct - a.rtoPct);
  const pendingPickup = s.orderItems.filter((l) => PROCESSING.includes(l.status) && NOW - new Date(l.createdAt).getTime() > DAY).length;
  const delayed = s.orderItems.filter((l) => IN_TRANSIT.includes(l.status) && NOW - new Date(l.createdAt).getTime() > 7 * DAY).length;
  return [
    { id: "pickup", tone: "danger", title: "Pending pickup over 24 hours", count: pendingPickup, href: "/admin/shipping", hint: "Accepted, packed or awaiting pickup for more than a day" },
    { id: "rto", tone: "danger", title: "Vendors with RTO above 10%", count: highRto.length, href: "/admin/vendors/scores", hint: highRto.slice(0, 2).map((v) => `${v.name} (${v.rtoPct}%)`).join(", ") },
    { id: "delayed", tone: "warning", title: "Shipments delayed over 7 days", count: delayed, href: "/admin/orders?status=In+Transit", hint: "Still in transit a week after the order" },
    { id: "vendors", tone: "info", title: "New vendors awaiting verification", count: s.vendors.filter((v) => v.status === "Pending").length, href: "/admin/vendors/verification", hint: "KYC, GST and bank checks" },
    { id: "stock", tone: "warning", title: "Products with stock below 50 units", count: s.products.filter((x) => [1, 3].includes(x.statusCode) && x.stock > 0 && x.stock < 50).length, href: "/admin/inventory?reorder=below50", hint: "Out-of-stock products are counted separately in Inventory" },
  ];
}

function trend(s, f, cur) {
  const { start, end } = f.window;
  const step = Math.max(1, Math.ceil((end - start) / DAY / 45)) * DAY;
  const out = [];
  for (let t = start; t < end; t += step) {
    const to = Math.min(end, t + step);
    const inBucket = (iso) => {
      const x = new Date(iso).getTime();
      return x >= t && x < to;
    };
    const bucketLines = cur.lines.filter((l) => inBucket(l.createdAt));
    out.push({
      label: new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }),
      orders: cur.orderRows.filter((o) => inBucket(o.createdAt)).length,
      sales: Math.round(sum(bucketLines.filter((l) => l.status === "Delivered"), "price")),
    });
  }
  return out;
}

export async function getMainDashboard(params) {
  await mockLatency();
  const s = getStore();
  const f = resolveDashboardFilters(params, s);
  const firstOrderAt = new Map();
  for (const o of s.orders) if (!firstOrderAt.has(o.customerId) || o.createdAt < firstOrderAt.get(o.customerId)) firstOrderAt.set(o.customerId, o.createdAt);
  const cur = compute(s, f, f.inWindow, firstOrderAt);
  const prev = f.inPrevious ? compute(s, f, f.inPrevious, firstOrderAt) : null;

  const days = Math.max(1, (f.window.end - f.window.start) / DAY);
  const fixedMonthly = sum(s.fixedExpenses.filter((x) => x.status === "Active"), "amount");
  const fixedExpenses = Math.round((fixedMonthly * days) / 30);
  const catOf = new Map(s.products.map((p) => [p.id, p.parentCategory]));
  const categorySales = {};
  const vendorSales = {};
  for (const l of cur.lines) {
    if (l.status !== "Delivered") continue;
    categorySales[catOf.get(l.productId)] = (categorySales[catOf.get(l.productId)] || 0) + l.price;
    vendorSales[l.vendor] = (vendorSales[l.vendor] || 0) + l.price;
  }
  const top = (obj, n) => Object.entries(obj).map(([label, value]) => ({ label, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, n);
  const mix = cur.statusMix.slice(0, 4);
  const other = cur.statusMix.slice(4).reduce((a, x) => a + x.value, 0);
  if (other) mix.push({ label: "Other", value: other });

  const { lines, orderRows, ...metrics } = cur;
  return {
    filters: { values: f.values, label: f.label, options: f.options, compare: Boolean(prev) },
    ...metrics,
    deltas: prev
      ? {
          totalOrders: delta(cur.orders.total, prev.orders.total),
          salesB2C: delta(cur.sales.salesB2C, prev.sales.salesB2C),
          salesB2B: delta(cur.sales.salesB2B, prev.sales.salesB2B),
          totalRevenue: delta(cur.sales.totalRevenue, prev.sales.totalRevenue),
          deliveredGross: delta(cur.orders.deliveredGross, prev.orders.deliveredGross),
          gmv: delta(cur.finance.gmv, prev.finance.gmv),
        }
      : {},
    marketplace: {
      ...cur.marketplace,
      sellers: s.vendors.filter((v) => v.status === "Active").length,
      pendingSellers: s.vendors.filter((v) => v.status === "Pending").length,
      totalSku: s.products.reduce((a, p) => a + 1 + (p.variations?.length ?? 0), 0),
      liveSku: s.products.filter((p) => p.statusCode === 1).reduce((a, p) => a + 1 + (p.variations?.length ?? 0), 0),
    },
    customers: { ...cur.customers, totalRegistered: s.customers.length },
    finance: { ...cur.finance, fixedExpenses, fixedMonthly, netProfit: round(cur.finance.contribution - fixedExpenses) },
    revenueMix: [
      { label: "B2C sales", value: Math.round(cur.sales.salesB2C) },
      { label: "B2B sales", value: Math.round(cur.sales.salesB2B) },
      { label: "Platform revenue", value: Math.round(cur.sales.platformRevenue) },
      { label: "Shipping & handling fees", value: Math.round(cur.sales.shippingCharges) },
    ],
    statusMix: mix,
    trend: trend(s, f, cur),
    topCategories: top(categorySales, 6),
    topVendors: top(vendorSales, 5),
    alerts: alerts(s),
    recentOrders: orderRows.slice(0, 8).map((o) => ({ id: o.id, customer: o.customer, total: o.total, status: o.status, paymentMode: o.paymentMode, createdAt: o.createdAt })),
  };
}
