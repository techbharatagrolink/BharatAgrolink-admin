"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
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
