"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  addBulkOrderRemark,
  convertBulkQuotation,
  deleteBulkOrder,
  deleteBulkQuotation,
  exportBulkOrders,
  getBulkOrderLabel,
  getBulkOrderTracking,
  updateBulkOrderAgent,
  updateBulkOrderStatus,
  updateBulkWaybill,
} from "@/lib/services/admin/parity/bulk";

const invalid = (message = "Invalid request.") => ({ ok: false, message });
const str = (v, max = 120) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const RESPONSIBLE = ["", "customer", "vendor", "admin", "courier"];
const ORDER_STATUSES = ["created", "confirmed", "processing", "shipped", "delivered", "cancelled", "rejected", "returned", "rto"];

function refresh(orderId) {
  revalidatePath("/admin/bulk-orders/orders");
  revalidatePath("/admin/bulk-orders/shipments");
  if (orderId) revalidatePath(`/admin/bulk-orders/orders/${encodeURIComponent(orderId)}`);
}

export async function exportBulkOrdersAction(filters) {
  const auth = await assertPermission("bulk.orders", "view");
  if (!auth.ok) return auth;
  const query = {};
  for (const key of ["orderId", "customer", "status"]) if (str(filters?.[key])) query[key] = str(filters[key]);
  for (const key of ["from", "to"]) if (YMD.test(str(filters?.[key], 10))) query[key] = str(filters[key], 10);
  return exportBulkOrders(query, auth.user);
}

export async function bulkOrderTrackingAction(orderId) {
  const auth = await assertPermission("bulk.orders", "view");
  if (!auth.ok) return auth;
  if (!str(orderId)) return invalid("Order ID is required.");
  return getBulkOrderTracking(str(orderId), auth.user);
}

export async function bulkOrderLabelAction(orderId) {
  const auth = await assertPermission("bulk.orders", "view");
  if (!auth.ok) return auth;
  if (!str(orderId)) return invalid("Order ID is required.");
  return getBulkOrderLabel(str(orderId), auth.user);
}

export async function updateBulkOrderStatusAction(orderId, input) {
  const auth = await assertPermission("bulk.orders", "edit");
  if (!auth.ok) return auth;
  const status = str(input?.status, 30);
  const responsible = str(input?.responsible, 20);
  if (!ORDER_STATUSES.includes(status)) return invalid("Choose a valid status.");
  if (!RESPONSIBLE.includes(responsible)) return invalid("Choose a valid responsible party.");
  const result = await updateBulkOrderStatus(str(orderId), { status, responsible }, auth.user);
  if (result.ok) refresh(str(orderId));
  return result;
}

export async function updateBulkOrderAgentAction(orderId, salesmanId) {
  const auth = await assertPermission("bulk.orders", "edit");
  if (!auth.ok) return auth;
  if (!str(salesmanId, 40)) return invalid("Choose a sales agent.");
  const result = await updateBulkOrderAgent(str(orderId), str(salesmanId, 40), auth.user);
  if (result.ok) refresh(str(orderId));
  return result;
}

export async function addBulkOrderRemarkAction(orderId, input) {
  const auth = await assertPermission("bulk.orders", "edit");
  if (!auth.ok) return auth;
  const remark = str(input?.remark, 1000);
  const responsible = str(input?.responsible, 20);
  if (!remark) return invalid("Remark is required.");
  if (!RESPONSIBLE.includes(responsible)) return invalid("Choose a valid responsible party.");
  const result = await addBulkOrderRemark(str(orderId), { remark, responsible }, auth.user);
  if (result.ok) refresh(str(orderId));
  return result;
}

export async function deleteBulkOrderAction(id) {
  const auth = await assertPermission("bulk.orders", "delete");
  if (!auth.ok) return auth;
  if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid order.");
  const result = await deleteBulkOrder(str(id, 20), auth.user);
  if (result.ok) refresh();
  return result;
}

export async function updateBulkWaybillAction(orderId, waybillNo) {
  const auth = await assertPermission("bulk.shipments", "edit");
  if (!auth.ok) return auth;
  if (!str(waybillNo, 100)) return invalid("Waybill number is required.");
  const result = await updateBulkWaybill(str(orderId), str(waybillNo, 100), auth.user);
  if (result.ok) refresh(str(orderId));
  return result;
}

export async function deleteBulkQuotationAction(id) {
  const auth = await assertPermission("bulk.quotations", "delete");
  if (!auth.ok) return auth;
  if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid quotation.");
  const result = await deleteBulkQuotation(str(id, 20), auth.user);
  if (result.ok) revalidatePath("/admin/bulk-orders/quotations");
  return result;
}

export async function convertBulkQuotationAction(id) {
  const auth = await assertPermission("bulk.quotations", "edit");
  if (!auth.ok) return auth;
  if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid quotation.");
  const result = await convertBulkQuotation(str(id, 20), auth.user);
  if (result.ok) {
    revalidatePath("/admin/bulk-orders/quotations");
    revalidatePath("/admin/bulk-orders/orders");
  }
  return result;
}
