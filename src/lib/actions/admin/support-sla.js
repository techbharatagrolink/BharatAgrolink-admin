"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { assignSlaTicket, escalateSlaTicket, updateSlaDeadline } from "@/lib/services/admin/support-sla";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));

function refresh(id, result) {
  if (result.ok) {
    revalidatePath("/admin/support/sla");
    revalidatePath(`/admin/support/${id}`);
  }
  return result;
}

export async function assignSlaTicketAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const body = { reason: str(input?.reason) };
  if (input?.team !== undefined) body.team = str(input.team);
  if (input?.agentId !== undefined) body.agentId = str(input.agentId);
  if (input?.department) body.department = str(input.department);
  return refresh(id, await assignSlaTicket(str(id), body, user));
}

export async function escalateSlaTicketAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const body = { reason: str(input?.reason) };
  if (input?.team) body.team = str(input.team);
  if (input?.agentId) body.agentId = str(input.agentId);
  return refresh(id, await escalateSlaTicket(str(id), body, user));
}

export async function updateSlaDeadlineAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const body = { reason: str(input?.reason), recalculate: Boolean(input?.recalculate) };
  if (!body.recalculate) body.deadline = str(input?.deadline);
  return refresh(id, await updateSlaDeadline(str(id), body, user));
}
