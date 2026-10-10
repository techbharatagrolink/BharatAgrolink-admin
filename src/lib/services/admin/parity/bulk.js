import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Bulk order screens ported from PHP bulk_orders/ (API /admin/parity/bulk):
 *   dashboard, all orders + order view, bulk shipments, quotations.
 * The products list is the bulk.products resource (/admin/bulk-orders/products).
 */

const BASE = "admin/parity/bulk";

async function get(path, user, query) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, query });
  return data;
}

async function send(path, user, method, body) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, method, body });
  return data;
}

/** For mutations and on-demand reads called from server actions: never throws. */
async function attempt(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, status: error.status };
    return { ok: false, message: "The bulk orders service could not be reached." };
  }
}

const enc = encodeURIComponent;

export const getBulkDashboard = (range, user) => get("dashboard", user, range);

export const getBulkOrders = (filters, user) => get("orders", user, filters);
export const getBulkOrderOptions = (user) => get("orders/options", user);
export const getBulkOrder = (orderId, user) => get(`orders/${enc(orderId)}`, user);
export const exportBulkOrders = (filters, user) => attempt(() => get("orders/export", user, filters));
export const getBulkOrderTracking = (orderId, user) => attempt(() => get(`orders/${enc(orderId)}/tracking`, user));
export const getBulkOrderLabel = (orderId, user) => attempt(() => get(`orders/${enc(orderId)}/label`, user));
export const updateBulkOrderStatus = (orderId, input, user) => attempt(() => send(`orders/${enc(orderId)}/status`, user, "PATCH", input));
export const updateBulkOrderAgent = (orderId, salesmanId, user) => attempt(() => send(`orders/${enc(orderId)}/sales-agent`, user, "PATCH", { salesmanId }));
export const addBulkOrderRemark = (orderId, input, user) => attempt(() => send(`orders/${enc(orderId)}/remarks`, user, "POST", input));
export const deleteBulkOrder = (id, user) => attempt(() => send(`orders/${enc(id)}`, user, "DELETE"));

export const getBulkShipments = (filters, user) => get("shipments", user, filters);
export const updateBulkWaybill = (orderId, waybillNo, user) => attempt(() => send(`shipments/${enc(orderId)}/waybill`, user, "PATCH", { waybillNo }));

export const getBulkQuotations = (filters, user) => get("quotations", user, filters);
export const getBulkQuotation = (id, user) => get(`quotations/${enc(id)}`, user);
export const deleteBulkQuotation = (id, user) => attempt(() => send(`quotations/${enc(id)}`, user, "DELETE"));
export const convertBulkQuotation = (id, user) => attempt(() => send(`quotations/${enc(id)}/convert`, user, "POST", {}));
