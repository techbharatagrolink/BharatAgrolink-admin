import { buildCommerce } from "./commerce";
import { buildBackoffice } from "./backoffice";
import { buildRoles, buildStaff } from "./access";
import { daysAgo, createRandom } from "./seed";

/**
 * In-memory demo database (server only). Changes made through services last
 * until the server process restarts, so demo actions feel real without a DB.
 */
function buildStore() {
  const commerce = buildCommerce();
  const backoffice = buildBackoffice(commerce);
  const roles = buildRoles();
  const staff = buildStaff().map((s) => ({ ...s, roleName: roles.find((r) => r.id === s.roleId)?.name ?? "—" }));
  const rand = createRandom(8642);
  const auditLog = Array.from({ length: 40 }, (_, i) => {
    const actor = rand.pick(staff);
    const [module, action, entity] = rand.pick([
      ["Auth", "Login", "Session"],
      ["Products", "Approved product", commerce.products[i % commerce.products.length].id],
      ["Orders", "Changed status to Accepted", commerce.orders[i % commerce.orders.length].id],
      ["Payouts", "Marked payout paid", "PO-00012"],
      ["Refunds", "Initiated refund", "RET-2026-0003"],
      ["Roles", "Updated permissions", "Operations Agent"],
      ["Vendors", "Verified KYC", commerce.vendors[i % commerce.vendors.length].id],
      ["Finance", "Released hold ledger note", "CN-2627-0004"],
    ]);
    return { id: `AUD-${String(1000 + i)}`, actorId: actor.id, actor: actor.name, module, action, entity, ip: `10.0.${rand.int(0, 9)}.${rand.int(2, 250)}`, before: null, after: null, reason: null, at: daysAgo(rand.int(0, 30), rand) };
  }).sort((a, b) => (a.at < b.at ? 1 : -1));
  const stockMovements = buildStockMovements(commerce, rand);
  return { ...commerce, ...backoffice, ...buildCatalogMasters(commerce), roles, staff, auditLog, stockMovements };
}

function buildStockMovements({ products, orderItems }, rand) {
  const rows = [];
  const types = [["Order placed", -1], ["Seller restock", 1], ["Return received", 1], ["Manual adjustment", 0]];
  products.slice(0, 60).forEach((p) => {
    let level = p.stock;
    for (let k = 0; k < rand.int(1, 3); k++) {
      const [type, sign] = rand.pick(types);
      const qty = rand.int(1, type === "Seller restock" ? 120 : 6);
      const change = sign === 0 ? (rand.chance(0.5) ? qty : -qty) : sign * qty;
      const before = Math.max(0, level - change);
      rows.push({
        id: `MOV-${String(rows.length + 1).padStart(5, "0")}`,
        productId: p.id, product: p.name, sku: p.sku, vendorId: p.vendorId, vendor: p.vendor,
        type, before, after: level, change: level - before,
        reference: type === "Order placed" ? orderItems.find((l) => l.productId === p.id)?.orderId ?? null : null,
        reason: type === "Manual adjustment" ? rand.pick(["Physical count correction", "Damaged units written off"]) : null,
        actor: type === "Manual adjustment" ? "Rahul Dubey" : type === "Seller restock" ? p.vendor : "System",
        at: daysAgo(rand.int(0, 40), rand),
      });
      level = before;
    }
  });
  return rows.sort((a, b) => (a.at < b.at ? 1 : -1));
}

/** Append to the stock ledger whenever stock changes (orders, returns, manual edits). */
export function recordStockMovement(product, before, type, reason, actor, reference = null) {
  const store = getStore();
  store.stockMovements.unshift({
    id: `MOV-${Date.now()}`,
    productId: product.id, product: product.name, sku: product.sku, vendorId: product.vendorId, vendor: product.vendor,
    type, before, after: product.stock, change: product.stock - before, reference, reason: reason || null, actor,
    at: new Date().toISOString(),
  });
}

function buildCatalogMasters({ products, orderItems, returns, returnReasons, vendors }) {
  const attributes = [
    ["Pack size", "Select", "100 ml, 250 ml, 500 ml, 1 L, 5 L", "Liquids"],
    ["Net weight", "Select", "250 g, 500 g, 1 kg, 5 kg, 25 kg, 50 kg", "Solids"],
    ["Formulation", "Select", "EC, SC, WP, WG, SL, Granules", "Crop Protection"],
    ["Seed variety", "Text", "", "Seeds"],
    ["Germination %", "Number", "", "Seeds"],
    ["Power (HP)", "Number", "", "Farm Equipment"],
  ].map(([name, type, values, set], i) => ({ id: i + 1, name, type, values, set, approval: i === 5 ? "Pending" : "Approved" }));
  const taxClasses = [0, 5, 12, 18, 28].map((rate, i) => ({ id: i + 1, name: rate ? `GST ${rate}%` : "Exempt (0%)", rate, products: products.filter((p) => p.gstPercent === rate).length, approval: "Approved", status: "Active" }));
  const hsnCodes = [
    ["38089199", "Insecticides, other", 18],
    ["38089290", "Fungicides, other", 18],
    ["38089340", "Herbicides", 18],
    ["31052000", "Fertilisers with N, P and K", 5],
    ["31021000", "Urea", 5],
    ["12099190", "Vegetable seeds for sowing", 0],
    ["84248100", "Agricultural sprayers", 12],
    ["84243000", "Drip irrigation systems", 12],
  ].map(([code, description, gst], i) => ({ id: i + 1, code, description, gst, status: "Active" }));
  const returnPolicies = [
    ["No return (agro-chemicals, opened)", "No return", 0, false],
    ["7-day damage / wrong item", "Refund", 7, true],
    ["10-day replacement (equipment)", "Replacement", 10, false],
    ["15-day refund (seeds, sealed)", "Refund", 15, true],
  ].map(([name, type, validityDays, refundAllowed], i) => ({ id: i + 1, name, type, validityDays, refundAllowed, approval: "Approved" }));
  const returnReasonRows = returnReasons.map((reason, i) => ({ id: i + 1, reason, count: returns.filter((r) => r.reason === reason).length, status: "Active" }));
  const vendorReportRows = vendors.map((v) => {
    const lines = orderItems.filter((l) => l.vendorId === v.id);
    const delivered = lines.filter((l) => l.status === "Delivered");
    const rto = lines.filter((l) => l.status.startsWith("RTO")).length;
    return {
      id: v.id,
      vendor: v.name,
      orders: lines.length,
      delivered: delivered.length,
      rto,
      rtoPct: lines.length ? Math.round((rto / lines.length) * 1000) / 10 : 0,
      gmv: Math.round(delivered.reduce((s, l) => s + l.price, 0)),
      bsa: Math.round(delivered.reduce((s, l) => s + l.nrv - l.tcs, 0)),
    };
  });
  return { attributes, taxClasses, hsnCodes, returnPolicies, returnReasonRows, vendorReportRows };
}

/** Bump when the store shape changes so a running dev server rebuilds it. */
const STORE_VERSION = 4;

export function getStore() {
  if (!globalThis.__baAdminStore || globalThis.__baAdminStoreVersion !== STORE_VERSION) {
    globalThis.__baAdminStore = buildStore();
    globalThis.__baAdminStoreVersion = STORE_VERSION;
  }
  return globalThis.__baAdminStore;
}

export function appendAudit(entry) {
  const store = getStore();
  store.auditLog.unshift({ id: `AUD-${Date.now()}`, ip: "server", before: null, after: null, reason: null, ...entry, at: new Date().toISOString() });
}
