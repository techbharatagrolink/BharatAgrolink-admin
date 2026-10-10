"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { getPayoutItemTimeline, payPayoutItems, updatePayoutItem } from "@/lib/services/admin/payout-items";

const EXPIRED = { ok: false, message: "Your session has expired. Please log in again." };
const ID = /^\d{1,12}$/;

/** formData: transactionId, itemIds (JSON array), file (invoice proof). */
export async function payPayoutItemsAction(id, formData) {
  const user = await getCurrentAdmin();
  if (!user) return EXPIRED;
  if (!ID.test(String(id)) || !(formData instanceof FormData)) return { ok: false, message: "Invalid payment request." };
  return payPayoutItems(String(id), formData, user);
}

export async function updatePayoutItemAction(id, itemId, input) {
  const user = await getCurrentAdmin();
  if (!user) return EXPIRED;
  if (!ID.test(String(id)) || !ID.test(String(itemId)) || !input || typeof input !== "object") return { ok: false, message: "Invalid edit request." };
  return updatePayoutItem(String(id), String(itemId), input, user);
}

export async function payoutItemTimelineAction(id, itemId) {
  const user = await getCurrentAdmin();
  if (!user) return EXPIRED;
  if (!ID.test(String(id)) || !ID.test(String(itemId))) return { ok: false, message: "Invalid item." };
  return getPayoutItemTimeline(String(id), String(itemId), user);
}
