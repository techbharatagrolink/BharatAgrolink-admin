"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { getPayoutItemTimeline, payPayoutItems, setPayoutItemPaymentStop, updatePayoutItem } from "@/lib/services/admin/payout-items";

const EXPIRED = { ok: false, message: "Your session has expired. Please log in again." };
const ID = /^\d{1,12}$/;

/** formData: transactionId, itemIds (JSON array), file (invoice proof). */
export async function payPayoutItemsAction(id, formData) {
  const user = await getCurrentAdmin();
  if (!user) return EXPIRED;
  if (!ID.test(String(id)) || !(formData instanceof FormData)) return { ok: false, message: "Invalid payment request." };
  return payPayoutItems(String(id), formData, user);
}

/** action: "stop" | "resume"; reason is kept with a stop only. */
export async function payoutItemPaymentStopAction(id, action, itemIds, reason = "") {
  const user = await getCurrentAdmin();
  if (!user) return EXPIRED;
  const ids = Array.isArray(itemIds) ? itemIds.filter((v) => ID.test(String(v))).map(Number) : [];
  if (!ID.test(String(id)) || !["stop", "resume"].includes(action) || !ids.length || ids.length > 500) return { ok: false, message: "Invalid request." };
  return setPayoutItemPaymentStop(String(id), { action, itemIds: ids, reason: action === "stop" ? String(reason ?? "").slice(0, 255) : "" }, user);
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
