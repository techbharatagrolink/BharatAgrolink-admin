import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Inventory Management (live central inventory in the API, SRS v1.0):
 *   GET   /admin/stock/summary | sellers | categories | items | items/{id} | items/{id}/movements
 *   GET   /admin/stock/movements | alerts | not-configured | exceptions | shortfalls | export.csv
 *   POST  /admin/stock/adjustments  { balanceId, action, quantity, reason, note, idempotencyKey }
 *   PATCH /admin/stock/items/{id}/settings  { lowStockThreshold, criticalThreshold, safetyStockQty }
 *   POST  /admin/stock/configure | bulk | shortfalls/{id}/resolve
 * The API checks the admin's permission again on every call. No mock fallback: without the API
 * the screens show "Not connected".
 */

const notConnected = () => new ApiError("The admin API session is missing.", { status: 0 });
const asApiError = (error) => (error instanceof ApiError ? error : new ApiError("The admin API is not reachable.", { status: 0 }));

/** One GET: { data, meta, error }; never throws, so a page can show the parts that loaded. */
export async function loadStock(user, path, query) {
  if (!user?.token) return { data: null, meta: null, error: notConnected() };
  try {
    const { data, meta } = await api(`admin/stock/${path}`, { token: user.token, query });
    return { data, meta, error: null };
  } catch (error) {
    return { data: null, meta: null, error: asApiError(error) };
  }
}

/** One write: { ok: true, data } or { ok: false, message, code, details }. */
export async function writeStock(user, path, { method = "POST", body } = {}) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/stock/${path}`, { token: user.token, method, body });
    return { ok: true, data };
  } catch (error) {
    const e = asApiError(error);
    return { ok: false, message: e.message, code: e.code ?? null, details: e.details ?? null };
  }
}

const FILTER_KEYS = ["status", "search", "category", "pool", "sellerId", "sort", "page"];

/** Stock list filters from the URL (strings only). */
export function stockFilters(searchParams = {}) {
  const out = {};
  for (const key of FILTER_KEYS) {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value != null && String(value).trim() !== "") out[key] = String(value).trim();
  }
  return out;
}
