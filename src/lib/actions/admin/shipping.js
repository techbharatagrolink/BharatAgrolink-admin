"use server";

import { revalidatePath } from "next/cache";
import { assertExport, getCurrentAdmin } from "@/lib/auth/session";
import { collectPages } from "@/lib/services/admin/_export";
import {
  SHIPMENT_TABS,
  listShipments,
  listShiprocketOrders,
  availableCouriers,
  bulkCouriers,
  bulkCreate,
  cancelShipments,
  createShipment,
  markCancelled,
  openLabel,
  regenerateLabel,
  shiprocketDocument,
  syncStatus,
  updateShiprocketOrder,
  cancelShiprocketOrders,
  cancelShiprocketShipments,
  shiprocketOrderDetails,
  shiprocketReportDocument,
  trackShiprocketAwbs,
  trackShiprocketShipment,
} from "@/lib/services/admin/shipping";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const invalid = { ok: false, message: "Invalid request." };
const COMPANIES = new Set(["nimbus", "shiprocket", "delhivery"]);
const DOCS = new Set(["manifest", "pickup", "invoice"]);

const str = (v, max = 100) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const ids = (list, max) => (Array.isArray(list) ? [...new Set(list.map((v) => str(v)).filter(Boolean))].slice(0, max) : []);
const couriers = (map) => {
  const out = {};
  if (map && typeof map === "object") for (const [vendorId, courier] of Object.entries(map)) if (courier && typeof courier === "object") out[str(vendorId)] = courier;
  return out;
};

function refresh(orderIds = []) {
  revalidatePath("/admin/shipping");
  for (const id of orderIds) revalidatePath(`/admin/orders/${id}`);
}

export async function availableCouriersAction(orderId, company) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(orderId) || !COMPANIES.has(company)) return invalid;
  return availableCouriers(str(orderId), company, user);
}

export async function createShipmentAction(orderId, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const id = str(orderId);
  if (!id || !input || !COMPANIES.has(input.company)) return invalid;
  const pickupDate = /^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate ?? "") ? input.pickupDate : undefined;
  const result = await createShipment(id, { company: input.company, selectedCouriers: couriers(input.selectedCouriers), excludedVendors: ids(input.excludedVendors, 50), ...(pickupDate ? { pickupDate } : {}) }, user);
  if (result.ok) refresh([id]);
  return result;
}

export async function updateShiprocketOrderAction(orderId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(orderId)) return invalid;
  const result = await updateShiprocketOrder(str(orderId), user);
  if (result.ok) refresh([str(orderId)]);
  return result;
}

export async function bulkCouriersAction(orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(orderIds, 50);
  if (!list.length) return { ok: false, message: "Select at least one order." };
  return bulkCouriers(list, user);
}

export async function bulkCreateAction(orders) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = Array.isArray(orders) ? orders.slice(0, 50).map((o) => ({ orderId: str(o?.orderId), selectedCouriers: couriers(o?.selectedCouriers) })).filter((o) => o.orderId) : [];
  if (!list.length) return { ok: false, message: "Select at least one order." };
  const result = await bulkCreate(list, user);
  if (result.ok) refresh(list.map((o) => o.orderId));
  return result;
}

export async function openLabelAction(orderId, vendorId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(orderId)) return invalid;
  return openLabel(str(orderId), str(vendorId) || undefined, user);
}

export async function regenerateLabelAction(orderId, awb, vendorId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(orderId) || !str(awb)) return invalid;
  const result = await regenerateLabel(str(orderId), str(awb), str(vendorId), user);
  if (result.ok) refresh([str(orderId)]);
  return result;
}

export async function shiprocketDocumentAction(orderId, vendorId, doc) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(orderId) || !str(vendorId) || !DOCS.has(doc)) return invalid;
  return shiprocketDocument(str(orderId), str(vendorId), doc, user);
}

export async function cancelShipmentsAction(awbs, orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(awbs, 2000);
  if (!list.length) return { ok: false, message: "Select at least one shipment with an AWB." };
  const result = await cancelShipments(list, user);
  if (result.ok) refresh(ids(orderIds, 200));
  return result;
}

export async function markCancelledAction(awbs, orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(awbs, 2000);
  if (!list.length) return { ok: false, message: "Select at least one shipment with an AWB." };
  const result = await markCancelled(list, user);
  if (result.ok) refresh(ids(orderIds, 200));
  return result;
}

/* Shiprocket orders report (shiprocket_orders_report.php). Ids are Shiprocket's own order / shipment ids. */

const SR_DOCS = new Set(["label", "manifest", "invoice"]);
const srIds = (list, max) => ids(list, max).filter((v) => /^\d{1,20}$/.test(v));

export async function shiprocketOrderAction(srOrderId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const [id] = srIds([srOrderId], 1);
  if (!id) return invalid;
  return shiprocketOrderDetails(id, user);
}

export async function trackShiprocketAction(shipmentId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const [id] = srIds([shipmentId], 1);
  if (!id) return invalid;
  return trackShiprocketShipment(id, user);
}

export async function trackShiprocketAwbsAction(awbs) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(awbs, 51);
  if (!list.length) return { ok: false, message: "No shipments with AWB codes selected. Please select shipments that have AWB codes." };
  if (list.length > 50) return { ok: false, message: "Maximum 50 shipments with AWB codes can be tracked at once. Please select 50 or fewer shipments." };
  return trackShiprocketAwbs(list, user);
}

export async function shiprocketReportDocumentAction(doc, idList) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = srIds(idList, 200);
  if (!SR_DOCS.has(doc) || !list.length) return invalid;
  return shiprocketReportDocument(doc, list, user);
}

export async function cancelShiprocketOrdersAction(orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = srIds(orderIds, 200);
  if (!list.length) return { ok: false, message: "No valid order IDs found in selected shipments." };
  const result = await cancelShiprocketOrders(list, user);
  if (result.ok) refresh();
  return result;
}

export async function cancelShiprocketShipmentsAction(awbs) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(awbs, 2001);
  if (!list.length) return { ok: false, message: "No valid AWB codes found in selected shipments." };
  if (list.length > 2000) return { ok: false, message: "Maximum 2000 shipments can be cancelled at once. Please select 2000 or fewer shipments." };
  const result = await cancelShiprocketShipments(list, user);
  if (result.ok) refresh();
  return result;
}

export async function syncStatusAction(orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(orderIds, 50);
  if (!list.length) return { ok: false, message: "Select at least one order." };
  const result = await syncStatus({ orderIds: list }, user);
  if (result.ok) refresh(list);
  return result;
}

/** manage_orders.php syncVisibleCourierStatuses: the orders currently on screen, at most 20. */
export async function syncVisibleOrdersAction(orderIds) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const list = ids(orderIds, 20);
  if (!list.length) return { ok: true, changed: 0 };
  const result = await syncStatus({ orderIds: list }, user);
  const updates = Array.isArray(result.data?.updates) ? result.data.updates : [];
  const nimbus = Array.isArray(result.data?.nimbus?.updated) ? result.data.nimbus.updated : [];
  const changed = updates.length + nimbus.length;
  if (result.ok && changed > 0) {
    revalidatePath("/admin/orders");
    refresh(list);
  }
  return { ok: result.ok, changed, message: result.message };
}

const YMD = /^\d{4}-\d{2}-\d{2}$/;
// Shiprocket rows come from Shiprocket's own API (rate-limited), so its export stops earlier.
const SHIPROCKET_EXPORT_MAX = 2000;

/** Every parcel (or Shiprocket order) of the Shipments tab and filters on screen. Super admins only. */
export async function exportShipmentsAction(input) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  const tab = SHIPMENT_TABS.some((t) => t.value === input?.tab) ? input.tab : "to_ship";
  const q = str(input?.q, 100);
  const from = YMD.test(str(input?.from, 10)) ? str(input.from, 10) : undefined;
  const to = YMD.test(str(input?.to, 10)) ? str(input.to, 10) : undefined;
  if (tab === "shiprocket") {
    const filters = { from, to, search: q || undefined, status: str(input?.status, 50) || undefined, pickupLocation: str(input?.pickup, 100) || undefined, sort: input?.sort === "ASC" ? "ASC" : "DESC" };
    return collectPages(
      async (page) => {
        const result = await listShiprocketOrders({ ...filters, page, perPage: "100" }, auth.user);
        return result.ok ? { rows: result.data?.rows, total: result.data?.total } : result;
      },
      { pageSize: 100, maxRows: SHIPROCKET_EXPORT_MAX },
    );
  }
  return collectPages(async (page, limit) => {
    const result = await listShipments({ tab, q, dateFrom: from, dateTo: to, page, limit }, auth.user);
    return result.ok ? { rows: result.data, total: result.meta?.total } : result;
  });
}
