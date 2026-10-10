import "server-only";
import { api, apiForm, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

/**
 * Vendor Payout Items (PHP payout_new_items.php):
 *   GET   /api/admin/payouts/{id}/items?page&pageSize&sort&cycleMonth&cycle&orderIds&f_*
 *   GET   /api/admin/payouts/{id}/items/export?...        (.xlsx, proxied by the documents route)
 *   GET   /api/admin/payouts/{id}/documents/{doc}?...     (invoice, order-summary, payment-receipt, order-report)
 *   POST  /api/admin/payouts/{id}/items/pay                (multipart: transactionId, itemIds, file)
 *   PATCH /api/admin/payouts/{id}/items/{itemId}
 *   GET   /api/admin/payouts/{id}/items/{itemId}/timeline | /proof
 * Cycles are only filtered here; there is no shift or reset.
 */

export const ITEM_PAGE_SIZES = [25, 50, 100, 200];
export const ITEM_STATUSES = ["Paid", "Pending", "On Hold"];
export const ITEM_FILTER_KEYS = [
  "id", "payoutId", "orderId", "invoiceNumber", "balInvoiceNumber", "status", "cycleMovement", "product", "productSku",
  "variantId", "vendorId", "qty", "gross", "taxable", "cgst", "sgst", "igst", "transactionId", "transactionDate", "deliveryDate",
];
const NUMBER_FILTERS = new Set(["id", "qty", "gross", "taxable", "cgst", "sgst", "igst"]);
const DATE_FILTERS = new Set(["transactionDate", "deliveryDate"]);
export const ITEM_SORTS = [
  "id", "payoutId", "orderId", "invoiceNumber", "balInvoiceNumber", "status", "cycleMovement", "productSku", "variantId",
  "qty", "gross", "taxable", "cgst", "sgst", "igst", "transactionId", "transactionDate", "deliveryDate",
];

const one = (v) => (Array.isArray(v) ? v[0] : v);
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** URL search params -> the API query, dropping anything the API would reject. */
export function itemsQuery(searchParams = {}) {
  const get = (k) => String(one(searchParams[k]) ?? "").trim();
  const page = Math.max(1, Number.parseInt(get("page") || "1", 10) || 1);
  const pageSize = ITEM_PAGE_SIZES.includes(Number(get("pageSize"))) ? Number(get("pageSize")) : 50;
  const [sf, sd] = get("sort").split(":");
  const sort = ITEM_SORTS.includes(sf) && ["asc", "desc"].includes(sd) ? `${sf}:${sd}` : "";
  const cycleMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(get("cycleMonth")) ? get("cycleMonth") : "";
  const cycle = cycleMonth && ["first", "second"].includes(get("cycle")) ? get("cycle") : "";
  const orderIds = [...new Set(get("orderIds").split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 300).join(",");
  const query = { page, pageSize, sort, cycleMonth, cycle, orderIds };
  for (const key of ITEM_FILTER_KEYS) {
    const v = get(`f_${key}`).slice(0, 120);
    if (!v) continue;
    if (key === "status" && !ITEM_STATUSES.includes(v)) continue;
    if (NUMBER_FILTERS.has(key) && !/^-?\d+(\.\d+)?$/.test(v)) continue;
    if (DATE_FILTERS.has(key) && !DATE.test(v)) continue;
    query[`f_${key}`] = v;
  }
  return query;
}

export const stripQuery = (query) => Object.fromEntries(Object.entries(query).filter(([, v]) => v !== "" && v != null));

export async function getPayoutItems(id, searchParams, user) {
  const query = itemsQuery(searchParams);
  const path = `admin/payouts/${encodeURIComponent(id)}`;
  try {
    const [items, detail, cycles] = await Promise.all([
      api(`${path}/items`, { token: user.token, query: stripQuery(query) }),
      api(path, { token: user.token }).catch(() => ({ data: null })),
      api("admin/payouts/cycles", { token: user.token }).catch(() => ({ data: [] })),
    ]);
    return { ...items.data, query, history: detail.data?.history ?? [], cycles: Array.isArray(cycles.data) ? cycles.data : [] };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

const fail = (error, fallback) => ({ ok: false, message: error instanceof ApiError ? error.message : fallback, details: error instanceof ApiError ? error.details : undefined });

export async function payPayoutItems(id, formData, user) {
  if (!can(user, "payouts", "edit")) return { ok: false, message: "You do not have permission to pay vendor payouts." };
  try {
    const { data } = await apiForm(`admin/payouts/${encodeURIComponent(id)}/items/pay`, { token: user.token, formData });
    return { ok: true, ...data };
  } catch (error) {
    return fail(error, "The payment could not be saved.");
  }
}

export async function updatePayoutItem(id, itemId, input, user) {
  if (!can(user, "payouts", "edit")) return { ok: false, message: "You do not have permission to edit payout items." };
  try {
    const { data } = await api(`admin/payouts/${encodeURIComponent(id)}/items/${encodeURIComponent(itemId)}`, { method: "PATCH", token: user.token, body: input });
    return { ok: true, ...data };
  } catch (error) {
    return fail(error, "The payout item could not be updated.");
  }
}

export async function getPayoutItemTimeline(id, itemId, user) {
  try {
    const { data } = await api(`admin/payouts/${encodeURIComponent(id)}/items/${encodeURIComponent(itemId)}/timeline`, { token: user.token });
    return { ok: true, ...data };
  } catch (error) {
    return fail(error, "The item history could not be loaded.");
  }
}
