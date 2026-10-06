import "server-only";
import { getStore, appendAudit, recordStockMovement } from "@/lib/mock/admin/store";
import { statusPriority } from "@/lib/mock/admin/commerce";
import { stockStatus } from "@/lib/mock/admin/engines";
import { NOW, DAY } from "@/lib/mock/admin/seed";
import { can } from "@/lib/auth/permissions";
import { validateReason } from "@/lib/validation/admin/forms";
import { mockLatency } from "./_query";

/**
 * Orders. Planned APIs:
 *   GET   /api/admin/orders/{id}
 *   PATCH /api/admin/orders/{id}/lines/{lineId}/status   { status, reason }
 *   POST  /api/admin/orders                              (manual order)
 * Line status is the source of truth; the parent order status is recomputed
 * on the server after every change (highest-priority line wins).
 */

export const LINE_TRANSITIONS = {
  Placed: ["Accepted", "Rejected", "Cancelled"],
  Accepted: ["Packed", "Cancelled"],
  Packed: ["Pending Pickup", "Cancelled"],
  "Pending Pickup": ["Shipped", "Cancelled"],
  Shipped: ["In Transit"],
  "In Transit": ["Out for Delivery", "Undelivered"],
  "Out for Delivery": ["Delivered", "Undelivered"],
  Undelivered: ["Out for Delivery", "RTO"],
  RTO: ["RTO Delivered"],
  Delivered: ["Return Requested"],
  "Return Requested": ["Return Completed"],
};

const REASON_REQUIRED = new Set(["Cancelled", "Rejected", "RTO", "Return Requested"]);

export function transitionsFor(line) {
  const next = LINE_TRANSITIONS[line.status] ?? [];
  if (line.status === "Delivered" && line.returnLastDate && new Date(line.returnLastDate).getTime() < NOW) return [];
  return next.map((status) => ({ status, requireReason: REASON_REQUIRED.has(status) }));
}

export function parentStatus(lines) {
  return statusPriority.find((s) => lines.some((l) => l.status === s)) ?? lines[0]?.status ?? "Placed";
}

export async function getOrder(id, user) {
  await mockLatency();
  const s = getStore();
  const order = s.orders.find((o) => o.id === id);
  if (!order) return null;
  const lines = s.orderItems.filter((l) => l.orderId === id);
  const canEdit = can(user, "orders", "edit");
  const audit = s.auditLog.filter((a) => a.entity === id || lines.some((l) => a.entity === `${id}#${l.id}`));
  const timeline = [
    { id: "placed", title: "Order placed", description: `${order.channel} · ${order.paymentMode}`, at: order.createdAt },
    ...lines.flatMap((l) =>
      [
        l.statusDate && l.status !== "Placed" ? { id: `s-${l.id}`, title: `${l.productName.slice(0, 48)} → ${l.status}`, description: l.vendor, at: l.statusDate, tone: ["Cancelled", "Rejected", "RTO", "RTO Delivered", "Undelivered"].includes(l.status) ? "danger" : undefined } : null,
      ].filter(Boolean),
    ),
    ...audit.map((a) => ({ id: a.id, title: a.action, description: a.reason ? `Reason: ${a.reason}` : a.actor, at: a.at, actor: a.actor })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  const byVendor = new Map();
  for (const l of lines) {
    if (!byVendor.has(l.vendorId)) byVendor.set(l.vendorId, { vendorId: l.vendorId, vendor: l.vendor, sellerInvoice: l.sellerInvoice, lines: [] });
    byVendor.get(l.vendorId).lines.push({ ...l, transitions: canEdit ? transitionsFor(l) : [] });
  }

  return {
    order: { ...order },
    customer: s.customers.find((c) => c.id === order.customerId) ?? null,
    groups: [...byVendor.values()],
    totals: {
      taxable: round2(lines.reduce((a, l) => a + l.taxable, 0)),
      cgst: round2(lines.reduce((a, l) => a + l.cgst, 0)),
      sgst: round2(lines.reduce((a, l) => a + l.sgst, 0)),
      igst: round2(lines.reduce((a, l) => a + l.igst, 0)),
      tcs: round2(lines.reduce((a, l) => a + l.tcs, 0)),
      nrv: round2(lines.reduce((a, l) => a + l.nrv, 0)),
      commission: round2(lines.reduce((a, l) => a + l.commission, 0)),
    },
    returns: s.returns.filter((r) => r.orderId === id),
    refunds: s.refunds.filter((r) => r.orderId === id),
    tickets: s.tickets.filter((t) => t.orderId === id).map((t) => ({ id: t.id, subject: t.subject, status: t.status })),
    timeline,
    canEdit,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export async function changeLineStatus({ orderId, lineId, status, reason }, user) {
  if (!can(user, "orders", "edit")) return { ok: false, message: "You do not have permission to change order status." };
  const s = getStore();
  const order = s.orders.find((o) => o.id === orderId);
  const line = s.orderItems.find((l) => l.orderId === orderId && String(l.id) === String(lineId));
  if (!order || !line) return { ok: false, message: "Order line not found." };

  const allowed = transitionsFor(line).find((t) => t.status === status);
  if (!allowed) return { ok: false, message: `A line in “${line.status}” cannot move to “${status}”.` };
  const reasonCheck = validateReason(reason, allowed.requireReason);
  if (!reasonCheck.ok) return { ok: false, message: reasonCheck.error };

  if (user.role?.scope === "own" && !user.role.superAdmin) {
    const assigned = s.opsTracker.find((t) => t.lineId === line.id);
    if (!assigned || assigned.agent !== user.name) return { ok: false, message: "This order line is assigned to another agent." };
  }

  await mockLatency(200);
  const before = line.status;
  const nowIso = new Date().toISOString();
  line.status = status;
  line.statusDate = nowIso;
  if (status === "Delivered") {
    line.deliveryDate = nowIso;
    line.returnLastDate = new Date(Date.now() + 7 * DAY).toISOString();
  }
  if (status === "Shipped" && !line.awb) {
    line.courier = line.courier ?? "NimbusPost";
    line.awb = `NMB${Math.floor(100000000 + Math.random() * 899999999)}`;
  }
  const lines = s.orderItems.filter((l) => l.orderId === orderId);
  order.status = parentStatus(lines);
  const tracker = s.opsTracker.find((t) => t.lineId === line.id);
  if (tracker) tracker.status = status;
  const shipment = s.shipments.find((x) => x.lineId === line.id);
  if (shipment) {
    shipment.status = status;
    shipment.awb = line.awb;
    shipment.courier = line.courier;
  }

  appendAudit({ actorId: user.id, actor: user.name, module: "Orders", action: `Line ${line.id}: ${before} → ${status}`, entity: orderId, before: { status: before }, after: { status, parent: order.status }, reason: reasonCheck.reason || null });
  return { ok: true, message: `Line moved to ${status}. Order status is now ${order.status}.` };
}

/* ------------------------------------------------------------ Manual order */

export function manualOrderOptions() {
  const s = getStore();
  return {
    customers: s.customers.filter((c) => c.status === "Active").slice(0, 60).map((c) => ({ value: c.id, label: `${c.name} · ${c.city}` })),
    products: s.products.filter((p) => p.statusCode === 1 && p.stock > 0).slice(0, 120).map((p) => ({ value: p.id, label: `${p.name} — ₹${p.display}`, price: p.display, stock: p.stock })),
    salesmen: s.salesTeam.filter((m) => m.roleId === 56).map((m) => m.name),
  };
}

/**
 * Price, GST split, shipping and totals are recalculated here from the
 * product master; client-sent prices are ignored.
 */
export async function createManualOrder(input, user) {
  if (!can(user, "orders", "add")) return { ok: false, message: "You do not have permission to create orders." };
  const s = getStore();
  const customer = s.customers.find((c) => c.id === input.customerId && c.status === "Active");
  if (!customer) return { ok: false, fieldErrors: { customerId: "Choose a customer." }, message: "Please fix the highlighted fields." };
  const paymentMode = ["COD", "Prepaid", "Partial"].includes(input.paymentMode) ? input.paymentMode : null;
  if (!paymentMode) return { ok: false, fieldErrors: { paymentMode: "Choose a payment mode." }, message: "Please fix the highlighted fields." };
  const items = Array.isArray(input.items) ? input.items.slice(0, 20) : [];
  const resolved = [];
  const wanted = new Map();
  for (const item of items) {
    const product = s.products.find((p) => p.id === item.productId && p.statusCode === 1);
    const qty = Number.parseInt(item.qty, 10);
    if (!product) return { ok: false, message: "One of the products is no longer available." };
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) return { ok: false, message: `Quantity for ${product.name} must be 1–50.` };
    const total = (wanted.get(product.id) ?? 0) + qty;
    if (total > product.stock) return { ok: false, message: `Only ${product.stock} units of ${product.name} are in stock.` };
    wanted.set(product.id, total);
    resolved.push({ product, qty });
  }
  if (!resolved.length) return { ok: false, message: "Add at least one product." };
  const salesman = input.salesman && s.salesTeam.some((m) => m.name === input.salesman) ? input.salesman : null;

  await mockLatency(250);
  const subtotal = round2(resolved.reduce((a, r) => a + r.product.display * r.qty, 0));
  const shippingFee = paymentMode === "COD" && subtotal < 3000 ? (subtotal < 500 ? 79 : subtotal < 1000 ? 99 : 149) : 0;
  const handling = paymentMode === "COD" && subtotal < 3000 ? 30 : 0;
  const n = s.orders.length + 1;
  const orderId = `BAO-${String(9000 + n).slice(-4)}-2026-27-MN${String(n).padStart(4, "0")}`;
  const createdAt = new Date().toISOString();
  let nextLineId = Math.max(...s.orderItems.map((l) => l.id)) + 1;
  const lines = resolved.map(({ product, qty }) => {
    const vendor = s.vendors.find((v) => v.id === product.vendorId);
    const price = round2(product.display * qty);
    const taxable = round2((price * 100) / (100 + product.gstPercent));
    const gst = round2(price - taxable);
    const intra = vendor.state === customer.state;
    const stockBefore = product.stock;
    product.stock -= qty;
    product.stockStatus = stockStatus(product.stock);
    recordStockMovement(product, stockBefore, "Order placed", null, user.name, orderId);
    return {
      id: nextLineId++, orderId, productId: product.id, productName: product.name, sku: product.sku, vendorId: vendor.id, vendor: vendor.name, qty, price, taxable, gst,
      gstPercent: product.gstPercent, cgst: intra ? round2(gst / 2) : 0, sgst: intra ? round2(gst / 2) : 0, igst: intra ? 0 : gst, tcs: round2(taxable * 0.01), tds: round2(taxable * 0.01),
      nrv: product.nrv * qty, commission: round2((taxable * product.commissionPercent) / 100), status: "Placed", sellerInvoice: null, platformInvoice: null, courier: null, awb: null,
      weightKg: round2(product.weightKg * qty), createdAt, statusDate: createdAt, deliveryDate: null, returnLastDate: null, paymentMode, customerId: customer.id, customer: customer.name,
      city: customer.city, state: customer.state, pincode: customer.pincode, zone: "rest_of_india",
    };
  });
  const order = {
    id: orderId, customerId: customer.id, customer: customer.name, mobile: customer.mobile, city: customer.city, state: customer.state, pincode: customer.pincode,
    channel: "Manual (Admin)", paymentMode, paymentId: null, advance: paymentMode === "Partial" ? Math.round(subtotal * (subtotal >= 10000 ? 0.15 : 0.1)) : 0,
    status: "Placed", items: lines.length, vendors: new Set(lines.map((l) => l.vendorId)).size, subtotal, shippingFee, handling, discount: 0,
    total: round2(subtotal + shippingFee + handling), couponCode: null, salesman, platformInvoice: null, createdAt,
  };
  s.orders.unshift(order);
  s.orderItems.push(...lines);
  customer.orders++;
  appendAudit({ actorId: user.id, actor: user.name, module: "Orders", action: "Created manual order", entity: orderId, after: { total: order.total, lines: lines.length, paymentMode } });
  return { ok: true, message: `Order ${orderId} created.`, id: orderId };
}
