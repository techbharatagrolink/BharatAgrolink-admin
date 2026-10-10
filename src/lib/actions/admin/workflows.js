"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { createReturnRequest, createReturnShipment, getReturnShipmentForm, previewRefund, processReturn, returnCustomerOrders, searchReturnCustomers } from "@/lib/services/admin/returns";
import { payoutAction } from "@/lib/services/admin/payouts";
import { addTicketMessage, updateTicket } from "@/lib/services/admin/support";
import { logLeadActivity } from "@/lib/services/admin/pipeline";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

export async function previewRefundAction(id, flags) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!can(user, "returns")) return { ok: false, message: "You do not have permission to view returns." };
  const amount = await previewRefund(str(id), { refundShipping: Boolean(flags?.refundShipping), deductPlatformFee: Boolean(flags?.deductPlatformFee) }, user);
  return amount == null ? { ok: false, message: "Return not found." } : { ok: true, amount };
}

export async function processReturnAction(id, action, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await processReturn(
    str(id),
    str(action),
    {
      pickupService: str(input?.pickupService),
      refundShipping: Boolean(input?.refundShipping),
      deductPlatformFee: Boolean(input?.deductPlatformFee),
      reason: str(input?.reason),
      // manage_returns.php "Save" (update_return) and the refund's bank transfer transaction id.
      pickupAddress: str(input?.pickupAddress),
      expectedPickupDate: str(input?.expectedPickupDate),
      courierTrackingId: str(input?.courierTrackingId),
      internalNotes: str(input?.internalNotes),
      transactionId: str(input?.transactionId),
    },
    user,
  );
  if (result.ok) revalidatePath(`/admin/returns/${id}`);
  return result;
}

/* manage_returns.php "Add Return Request" and "Create Return Shipment". */

export async function searchReturnCustomersAction(search) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const q = str(search).trim().slice(0, 100);
  if (q.length < 3) return { ok: true, data: [] };
  return searchReturnCustomers(q, user);
}

export async function returnCustomerOrdersAction(userId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!str(userId).trim()) return { ok: false, message: "Select a customer." };
  return returnCustomerOrders(str(userId).trim().slice(0, 100), user);
}

export async function createReturnRequestAction(formData) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!(formData instanceof FormData)) return { ok: false, message: "Invalid request." };
  const form = new FormData();
  for (const key of ["userId", "items", "reason", "detail"]) form.set(key, str(formData.get(key)));
  const files = formData.getAll("attachments").filter((f) => f && typeof f === "object" && f.size > 0);
  if (files.length > 5) return { ok: false, message: "Maximum 5 images allowed" };
  for (const file of files) form.append("attachments", file, file.name || "attachment");
  const result = await createReturnRequest(form, user);
  if (result.ok) revalidatePath("/admin/returns");
  return result;
}

export async function returnShipmentFormAction(id) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return getReturnShipmentForm(str(id), user);
}

export async function createReturnShipmentAction(id, payload) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!payload || typeof payload !== "object") return { ok: false, message: "Invalid request." };
  const result = await createReturnShipment(str(id), payload, user);
  if (result.ok) {
    revalidatePath("/admin/returns");
    revalidatePath(`/admin/returns/${id}`);
  }
  return result;
}

export async function payoutActionAction(id, action, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await payoutAction(str(id), str(action), { reason: str(input?.reason), transactionId: str(input?.transactionId), proofName: str(input?.proofName) }, user);
  if (result.ok) revalidatePath(`/admin/payouts/${id}`);
  return result;
}

/** FormData fields as the PHP chat form: message, is_internal (checkbox), image (optional file). */
export async function ticketMessageAction(id, formData) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const image = formData?.get("image");
  return addTicketMessage(
    str(id),
    {
      message: str(formData?.get("message")),
      internal: ["1", "on", "true"].includes(str(formData?.get("is_internal"))),
      image: image && typeof image === "object" && image.size > 0 ? image : null,
    },
    user,
  );
}

export async function logLeadActivityAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await logLeadActivity(str(id), { disposition: str(input?.disposition), status: str(input?.status), note: str(input?.note), nextFollowUp: str(input?.nextFollowUp), durationSec: Number(input?.durationSec ?? 0) }, user);
  if (result.ok) revalidatePath(`/admin/crm/leads/${id}`);
  return result;
}

export async function updateTicketAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const patch = {};
  for (const key of ["status", "department", "priority", "assignee", "reason"]) if (input && input[key] != null) patch[key] = str(input[key]);
  const result = await updateTicket(str(id), patch, user);
  if (result.ok) revalidatePath(`/admin/support/${id}`);
  return result;
}
