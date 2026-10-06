import "server-only";
import { getStore, appendAudit, recordStockMovement } from "@/lib/mock/admin/store";
import { nrvPricing, listingEconomics, stockStatus } from "@/lib/mock/admin/engines";
import { can } from "@/lib/auth/permissions";
import { validateForm, validateReason } from "@/lib/validation/admin/forms";
import { validateVariations } from "@/lib/validation/admin/product-variations";
import { mockLatency } from "./_query";

/**
 * Products. Planned APIs:
 *   GET   /api/admin/products/{id}
 *   POST  /api/admin/products                         (create, goes to approval)
 *   PATCH /api/admin/products/{id}/pricing            { mrp, nrv, takeRate, gstPercent, reason }
 *   PATCH /api/admin/products/{id}/stock              { stock, reason }
 *   POST  /api/admin/products/{id}/approve | reject
 *   POST  /api/admin/products/import/validate         (CSV)
 *   POST  /api/admin/pricing/calculate                (NRV calculator)
 * Selling price, TCS, BSA and commission always come from the pricing engine.
 */

export const GST_RATES = [0, 5, 12, 18, 28];

export const pricingFields = [
  { name: "mrp", label: "MRP (₹)", type: "number", required: true, min: 1, max: 1000000 },
  { name: "nrv", label: "NRV (₹)", type: "number", required: true, min: 1, max: 1000000 },
  { name: "takeRate", label: "Take rate %", type: "number", required: true, min: 25, max: 45 },
  { name: "gstPercent", label: "GST %", type: "select", options: GST_RATES.map(String), required: true },
];

export function calculatePricing(input) {
  const { ok, values, errors } = validateForm(pricingFields, input);
  if (!ok) return { ok: false, fieldErrors: errors, message: "Please fix the highlighted fields." };
  const gstPercent = Number(values.gstPercent);
  const price = nrvPricing({ nrv: values.nrv, mrp: values.mrp, gstPercent, takeRate: values.takeRate });
  const econ = listingEconomics({ display: price.display, nrv: values.nrv, gstPercent });
  const econCod = listingEconomics({ display: price.display, nrv: values.nrv, gstPercent, paymentMode: "cod" });
  return { ok: true, input: { ...values, gstPercent }, price, economics: { prepaid: econ, cod: econCod } };
}

export async function getProduct(id) {
  await mockLatency();
  const s = getStore();
  const product = s.products.find((p) => p.id === id);
  if (!product) return null;
  const lines = s.orderItems.filter((l) => l.productId === id);
  const delivered = lines.filter((l) => l.status === "Delivered");
  return {
    product: { ...product, variations: (product.variations ?? []).map((v) => ({ ...v })) },
    vendor: s.vendors.find((v) => v.id === product.vendorId) ?? null,
    pricing: calculatePricing({ mrp: product.mrp, nrv: product.nrv, takeRate: product.takeRate, gstPercent: String(product.gstPercent) }),
    sales: {
      lines: lines.length,
      deliveredUnits: delivered.reduce((a, l) => a + l.qty, 0),
      deliveredValue: Math.round(delivered.reduce((a, l) => a + l.price, 0)),
      returns: s.returns.filter((r) => lines.some((l) => l.id === r.lineId)).length,
    },
    reviews: s.reviews.filter((r) => r.productId === id).slice(0, 5),
    history: s.auditLog.filter((a) => a.entity === id).slice(0, 15),
    movements: s.stockMovements.filter((m) => m.productId === id).slice(0, 8),
  };
}

function applyPricing(product, pricing) {
  Object.assign(product, {
    mrp: pricing.input.mrp,
    nrv: pricing.input.nrv,
    takeRate: pricing.input.takeRate,
    gstPercent: pricing.input.gstPercent,
    display: pricing.price.display,
    sale: pricing.price.sale,
    bsa: pricing.price.bsa,
    tcs: pricing.price.tcs,
    commissionPercent: pricing.price.commissionPercent,
    contributionPct: pricing.economics.prepaid.contributionPct,
    verdict: pricing.economics.prepaid.verdict,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateProductPricing(id, input, rawReason, user) {
  if (!can(user, "products", "edit")) return { ok: false, message: "You do not have permission to change prices." };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error };
  const product = getStore().products.find((p) => p.id === id);
  if (!product) return { ok: false, message: "Product not found." };
  const pricing = calculatePricing(input);
  if (!pricing.ok) return pricing;
  if (!pricing.price.ok) return { ok: false, message: pricing.price.errors.join(" ") };
  await mockLatency(200);
  const before = { mrp: product.mrp, nrv: product.nrv, takeRate: product.takeRate, gstPercent: product.gstPercent, display: product.display };
  applyPricing(product, pricing);
  appendAudit({ actorId: user.id, actor: user.name, module: "Pricing", action: "Changed product price", entity: id, before, after: { ...pricing.input, display: pricing.price.display }, reason: reason.reason });
  return { ok: true, message: `Price updated. New display price ₹${pricing.price.display}.` };
}

export async function adjustStock(id, rawStock, rawReason, user) {
  if (!can(user, "products", "edit")) return { ok: false, message: "You do not have permission to change stock." };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error };
  const stock = Number(rawStock);
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) return { ok: false, message: "Stock must be a whole number between 0 and 100,000." };
  const product = getStore().products.find((p) => p.id === id);
  if (!product) return { ok: false, message: "Product not found." };
  await mockLatency(150);
  const before = product.stock;
  if (before === stock) return { ok: false, message: "Stock is unchanged." };
  product.stock = stock;
  product.stockStatus = stockStatus(stock);
  product.updatedAt = new Date().toISOString();
  recordStockMovement(product, before, "Manual adjustment", reason.reason, user.name);
  appendAudit({ actorId: user.id, actor: user.name, module: "Products", action: `Stock ${before} → ${stock}`, entity: id, before: { stock: before }, after: { stock }, reason: reason.reason });
  return { ok: true, message: `Stock set to ${stock}.` };
}

const STATUS_ACTIONS = {
  approve: { from: [0, 2], to: 1, label: "Active", permission: "products.approval", reason: false },
  reject: { from: [0, 2], to: 3, label: "Draft / Rejected", permission: "products.approval", reason: true },
  deactivate: { from: [1], to: 2, label: "Pending", permission: "products", reason: true },
};

export async function setProductStatus(id, action, rawReason, user) {
  const rule = STATUS_ACTIONS[action];
  if (!rule) return { ok: false, message: "Unknown action." };
  if (!can(user, rule.permission, "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  const reason = validateReason(rawReason, rule.reason);
  if (!reason.ok) return { ok: false, message: reason.error };
  const product = getStore().products.find((p) => p.id === id);
  if (!product) return { ok: false, message: "Product not found." };
  if (!rule.from.includes(product.statusCode)) return { ok: false, message: `This product is “${product.status}” and cannot be ${action}d.` };
  if (action === "approve") {
    const check = nrvPricing({ nrv: product.nrv, mrp: product.mrp, gstPercent: product.gstPercent, takeRate: product.takeRate });
    if (!check.ok) return { ok: false, message: `Cannot approve: ${check.errors.join(" ")}` };
  }
  await mockLatency(150);
  const before = product.status;
  product.statusCode = rule.to;
  product.status = rule.label;
  product.rejectReason = action === "reject" ? reason.reason : product.rejectReason;
  product.updatedAt = new Date().toISOString();
  appendAudit({ actorId: user.id, actor: user.name, module: "Products", action: `Product ${action}d`, entity: id, before: { status: before }, after: { status: rule.label }, reason: reason.reason || null });
  return { ok: true, message: action === "approve" ? "Product approved and live." : action === "reject" ? "Product rejected. The vendor will be notified." : "Listing deactivated." };
}

/* --------------------------------------------------------------- Create */

export function productFormOptions() {
  const s = getStore();
  return {
    vendors: s.vendors.filter((v) => v.status === "Active").map((v) => ({ value: v.id, label: v.name })),
    categories: s.categories.filter((c) => c.level === 2).map((c) => ({ value: String(c.id), label: `${c.parent} › ${c.name}` })),
    brands: s.brands.filter((b) => b.status === "Active").map((b) => ({ value: String(b.id), label: b.name })),
    hsn: s.hsnCodes.map((h) => ({ value: h.code, label: `${h.code} · ${h.description}` })),
    returnPolicies: s.returnPolicies.map((r) => r.name),
  };
}

export function productFields(options) {
  return [
    { name: "name", label: "Product name", type: "text", required: true, maxLength: 150 },
    { name: "vendorId", label: "Vendor", type: "select", options: options.vendors, required: true },
    { name: "categoryId", label: "Category", type: "select", options: options.categories, required: true },
    { name: "brandId", label: "Brand", type: "select", options: options.brands, required: true },
    { name: "hsn", label: "HSN code", type: "select", options: options.hsn, required: true },
    { name: "stock", label: "Opening stock", type: "number", min: 0, max: 100000, required: true },
    { name: "weightKg", label: "Weight after packing (kg)", type: "number", min: 0.01, max: 100, required: true },
    { name: "returnPolicy", label: "Return policy", type: "select", options: options.returnPolicies, required: true },
    ...pricingFields,
  ];
}

function priceVariations(rows, values) {
  const errors = {};
  const priced = rows.map((row, i) => {
    const pricing = calculatePricing({ mrp: row.mrp, nrv: row.nrv, takeRate: values.takeRate, gstPercent: String(values.gstPercent) });
    if (!pricing.ok) Object.entries(pricing.fieldErrors).forEach(([k, m]) => (errors[`variations.${i}.${k}`] = m));
    else if (!pricing.price.ok) errors[`variations.${i}.nrv`] = pricing.price.errors.join(" ");
    return { row, pricing };
  });
  return { errors, priced };
}

export async function createProduct(input, user) {
  if (!can(user, "products", "add")) return { ok: false, message: "You do not have permission to add products." };
  const s = getStore();
  const options = productFormOptions();
  const { ok, values, errors } = validateForm(productFields(options), input);
  const variations = validateVariations(input.variations);
  if (!ok || !variations.ok) return { ok: false, fieldErrors: { ...errors, ...variations.errors }, message: "Please fix the highlighted fields." };
  if (!Number.isInteger(values.stock)) return { ok: false, fieldErrors: { stock: "Opening stock must be a whole number." }, message: "Please fix the highlighted fields." };
  const pricing = calculatePricing(values);
  if (!pricing.price.ok) return { ok: false, message: pricing.price.errors.join(" ") };
  const { errors: variationPriceErrors, priced } = priceVariations(variations.values?.rows ?? [], values);
  if (Object.keys(variationPriceErrors).length) return { ok: false, fieldErrors: variationPriceErrors, message: "Some variations have invalid pricing." };
  await mockLatency(250);
  const vendor = s.vendors.find((v) => v.id === values.vendorId);
  const category = s.categories.find((c) => String(c.id) === values.categoryId);
  const brand = s.brands.find((b) => String(b.id) === values.brandId);
  const n = s.products.length + 1;
  const id = `P${String(n).padStart(5, "0")}`;
  const product = {
    id, uniqueId: `BAP${String(n * 37).padStart(7, "0")}`, name: values.name, sku: `BA-${category.name.slice(0, 3).toUpperCase()}-${String(n).padStart(4, "0")}`,
    brand: brand.name, brandId: brand.id, category: category.name, parentCategory: category.parent, categoryId: category.id, vendorId: vendor.id, vendor: vendor.name,
    statusCode: 0, status: "Pending", stock: values.stock, stockStatus: stockStatus(values.stock),
    hsn: values.hsn, weightKg: values.weightKg, returnPolicy: values.returnPolicy, toxicity: null, createdAt: new Date().toISOString(), rejectReason: null,
    variationAttribute: variations.values?.attribute ?? null,
    baseLabel: variations.values?.baseLabel ?? null,
  };
  product.variations = priced.map(({ row, pricing: vp }, i) => ({
    id: `${id}-V${i + 1}`, label: row.label, sku: `${product.sku}-V${i + 1}`, mrp: vp.input.mrp, nrv: vp.input.nrv,
    display: vp.price.display, sale: vp.price.sale, stock: row.stock, stockStatus: stockStatus(row.stock), weightKg: row.weightKg,
  }));
  product.variants = 1 + product.variations.length;
  applyPricing(product, pricing);
  s.products.unshift(product);
  vendor.products++;
  appendAudit({
    actorId: user.id, actor: user.name, module: "Products", action: "Created product (pending approval)", entity: id,
    after: { name: values.name, display: pricing.price.display, variations: product.variations.map((v) => `${v.label} · ₹${v.display}`) },
  });
  const extra = product.variations.length ? ` with ${product.variations.length} variation${product.variations.length > 1 ? "s" : ""}` : "";
  return { ok: true, message: `Product created${extra} and sent to the approval queue.`, id };
}

/* --------------------------------------------------------------- Import */

const IMPORT_COLUMNS = ["name", "vendor_id", "category", "brand", "hsn", "mrp", "nrv", "take_rate", "gst_percent", "stock", "weight_kg"];
const MAX_IMPORT_BYTES = 200_000;
const MAX_IMPORT_ROWS = 500;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell.trim()); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim()); cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

export function importTemplate() {
  return `${IMPORT_COLUMNS.join(",")}\n"KrishiGold NPK 19:19:19 1 kg",SEL01001,Water Soluble,KrishiGold,31052000,599,330,35,5,120,1.1\n`;
}

/** Validates a CSV import on the server. Nothing is written in this step. */
export async function validateImport(text, user) {
  if (!can(user, "products.import", "add")) return { ok: false, message: "You do not have permission to import products." };
  if (typeof text !== "string" || !text.trim()) return { ok: false, message: "The file is empty." };
  if (text.length > MAX_IMPORT_BYTES) return { ok: false, message: "File is larger than 200 KB. Split it into smaller files." };
  await mockLatency(250);
  const s = getStore();
  const [header, ...rows] = parseCsv(text.replace(/^\ufeff/, ""));
  const cols = header.map((h) => h.toLowerCase());
  const missing = IMPORT_COLUMNS.filter((c) => !cols.includes(c));
  if (missing.length) return { ok: false, message: `Missing columns: ${missing.join(", ")}.` };
  if (rows.length > MAX_IMPORT_ROWS) return { ok: false, message: `At most ${MAX_IMPORT_ROWS} rows per file.` };
  const idx = Object.fromEntries(IMPORT_COLUMNS.map((c) => [c, cols.indexOf(c)]));
  const results = rows.map((r, i) => {
    const get = (c) => r[idx[c]] ?? "";
    const problems = [];
    const vendor = s.vendors.find((v) => v.id === get("vendor_id") && v.status === "Active");
    if (!vendor) problems.push("Unknown or inactive vendor");
    if (!s.categories.some((c) => c.level === 2 && c.name.toLowerCase() === get("category").toLowerCase())) problems.push("Unknown category");
    if (!s.brands.some((b) => b.name.toLowerCase() === get("brand").toLowerCase())) problems.push("Unknown brand");
    if (!get("name") || get("name").length > 150) problems.push("Name is required (max 150)");
    if (!/^[0-9]{4,8}$/.test(get("hsn"))) problems.push("HSN must be 4–8 digits");
    const stock = Number(get("stock"));
    if (!Number.isInteger(stock) || stock < 0) problems.push("Stock must be a whole number");
    const pricing = calculatePricing({ mrp: get("mrp"), nrv: get("nrv"), takeRate: get("take_rate"), gstPercent: get("gst_percent") });
    if (!pricing.ok) problems.push(...Object.values(pricing.fieldErrors));
    else if (!pricing.price.ok) problems.push(...pricing.price.errors);
    return { row: i + 2, name: get("name") || "—", vendor: vendor?.name ?? get("vendor_id"), display: pricing.ok ? pricing.price.display : null, verdict: pricing.ok ? pricing.economics.prepaid.verdict : null, problems };
  });
  appendAudit({ actorId: user.id, actor: user.name, module: "Products", action: "Validated product import", entity: `${results.length} rows` });
  return { ok: true, total: results.length, valid: results.filter((r) => !r.problems.length).length, results: results.slice(0, 200) };
}
