"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { previewRefund, processReturn } from "@/lib/services/admin/returns";
import { payoutAction } from "@/lib/services/admin/payouts";
import { addTicketMessage, updateTicket } from "@/lib/services/admin/support";
import { logLeadActivity } from "@/lib/services/admin/pipeline";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

export async function previewRefundAction(id, flags) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!can(user, "returns")) return { ok: false, message: "You do not have permission to view returns." };
  const amount = previewRefund(str(id), { refundShipping: Boolean(flags?.refundShipping), deductPlatformFee: Boolean(flags?.deductPlatformFee) });
  return amount == null ? { ok: false, message: "Return not found." } : { ok: true, amount };
}

export async function processReturnAction(id, action, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await processReturn(str(id), str(action), { pickupService: str(input?.pickupService), refundShipping: Boolean(input?.refundShipping), deductPlatformFee: Boolean(input?.deductPlatformFee), reason: str(input?.reason) }, user);
  if (result.ok) revalidatePath(`/admin/returns/${id}`);
  return result;
}

export async function payoutActionAction(id, action, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await payoutAction(str(id), str(action), { reason: str(input?.reason), transactionId: str(input?.transactionId), proofName: str(input?.proofName) }, user);
  if (result.ok) revalidatePath(`/admin/payouts/${id}`);
  return result;
}

export async function ticketMessageAction(id, message, internal) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await addTicketMessage(str(id), str(message), Boolean(internal), user);
  if (result.ok) revalidatePath(`/admin/support/${id}`);
  return result;
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
