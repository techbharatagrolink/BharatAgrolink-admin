import "server-only";
import { can } from "@/lib/auth/permissions";
import { api, ApiError } from "@/lib/api";

/**
 * Shipments: courier booking, labels, cancellation and status sync
 * (API /admin/shipping, ported from the PHP create_shipment / bulk_action /
 * shiprocket_orders_report screens). Courier calls only happen on the API.
 */

export const SHIPMENT_TABS = [
  { value: "to_ship", label: "To ship" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "rto", label: "RTO" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
  { value: "shiprocket", label: "Shiprocket" },
];

/** shiprocket_orders_report.php "entries per page". */
export const SHIPROCKET_PAGE_SIZES = ["10", "20", "50", "100"];

export const COURIER_COMPANIES = [
  { value: "nimbus", label: "NimbusPost" },
  { value: "shiprocket", label: "Shiprocket" },
  { value: "delhivery", label: "Delhivery" },
];

/** The API allows either the orders page or the shipping report page (manage_orders.php / shiprocket_orders_report.php). */
export function canShip(user, action = "view") {
  return can(user, "shipping", action) || can(user, "orders", action);
}

const denied = { ok: false, message: "You do not have permission to do this." };
const noSession = { ok: false, message: "Your session has expired. Please log in again." };

async function call(user, action, path, options = {}) {
  if (!user?.token) return noSession;
  if (!canShip(user, action)) return denied;
  try {
    const { data, meta } = await api(path, { token: user.token, ...options });
    return { ok: true, data, meta };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, code: error.code, status: error.status };
    return { ok: false, message: "The shipping service could not be reached." };
  }
}

const enc = encodeURIComponent;

export function listShipments({ tab, q, dateFrom, dateTo, page, limit }, user) {
  return call(user, "view", "admin/shipping/shipments", { query: { tab, q, dateFrom, dateTo, page, limit } });
}

export function orderShipments(orderId, user) {
  return call(user, "view", `admin/shipping/orders/${enc(orderId)}/shipments`);
}

export function availableCouriers(orderId, company, user) {
  return call(user, "view", `admin/shipping/orders/${enc(orderId)}/couriers`, { query: { company } });
}

export function createShipment(orderId, body, user) {
  return call(user, "add", `admin/shipping/orders/${enc(orderId)}/shipments`, { method: "POST", body });
}

export function updateShiprocketOrder(orderId, user) {
  return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/shiprocket-update`, { method: "POST", body: {} });
}

export function openLabel(orderId, vendorId, user) {
  return call(user, "view", `admin/shipping/orders/${enc(orderId)}/label`, { query: { vendorId } });
}

export function regenerateLabel(orderId, awb, vendorId, user) {
  return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/label`, { method: "POST", body: { awb, ...(vendorId ? { vendorId } : {}) } });
}

export function shiprocketDocument(orderId, vendorId, doc, user) {
  return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/documents/${enc(doc)}`, { method: "POST", body: { vendorId } });
}

export function bulkCouriers(orderIds, user) {
  return call(user, "view", "admin/shipping/bulk/couriers", { method: "POST", body: { orderIds } });
}

export function bulkCreate(orders, user) {
  return call(user, "add", "admin/shipping/bulk/shipments", { method: "POST", body: { orders } });
}

export function cancelShipments(awbs, user) {
  return call(user, "edit", "admin/shipping/cancel", { method: "POST", body: { awbs } });
}

export function markCancelled(awbs, user) {
  return call(user, "edit", "admin/shipping/mark-cancelled", { method: "POST", body: { awbs } });
}

export function syncStatus({ orderIds = [], awbs = [] }, user) {
  return call(user, "edit", "admin/shipping/sync", { method: "POST", body: { orderIds, awbs } });
}

/* shiprocket_orders_report.php: the Shiprocket account's orders, via the ship microservice. */

export function listShiprocketOrders({ page, perPage, from, to, search, status, pickupLocation, sort }, user) {
  return call(user, "view", "admin/shipping/shiprocket/orders", { query: { page, perPage, from, to, search, status, pickupLocation, sort } });
}

export function shiprocketOrderDetails(srOrderId, user) {
  return call(user, "view", `admin/shipping/shiprocket/orders/${enc(srOrderId)}`);
}

export function trackShiprocketShipment(shipmentId, user) {
  return call(user, "view", `admin/shipping/shiprocket/tracking/${enc(shipmentId)}`);
}

export function trackShiprocketAwbs(awbs, user) {
  return call(user, "view", "admin/shipping/shiprocket/tracking", { method: "POST", body: { awbs } });
}

export function shiprocketReportDocument(doc, ids, user) {
  return call(user, "edit", `admin/shipping/shiprocket/documents/${enc(doc)}`, { method: "POST", body: { ids } });
}

export function cancelShiprocketOrders(orderIds, user) {
  return call(user, "edit", "admin/shipping/shiprocket/cancel/orders", { method: "POST", body: { orderIds } });
}

export function cancelShiprocketShipments(awbs, user) {
  return call(user, "edit", "admin/shipping/shiprocket/cancel/shipments", { method: "POST", body: { awbs } });
}
