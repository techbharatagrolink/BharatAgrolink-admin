"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { deleteLeadImage, syncAisensy, uploadLeadImage } from "@/lib/services/admin/crm-sheet";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function syncAisensyAction() {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await syncAisensy(user);
  if (result.ok && ((result.created || 0) > 0 || (result.updated || 0) > 0)) revalidatePath("/admin/crm/leads");
  return result;
}

export async function uploadLeadImageAction(id, formData) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await uploadLeadImage(id, formData, user);
  if (result.ok) revalidatePath(`/admin/crm/leads/${id}`);
  return result;
}

export async function deleteLeadImageAction(id, attachmentId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await deleteLeadImage(id, attachmentId, user);
  if (result.ok) revalidatePath(`/admin/crm/leads/${id}`);
  return result;
}
