"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import {
  completePaymentAttempt,
  failPaymentAttempt,
  listPaymentAttempts,
  retryPaymentAttempt,
  syncPaymentAttempt,
} from "@/lib/services/admin/payment-attempts";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function listPaymentAttemptsAction(filters = {}) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return listPaymentAttempts(user, filters);
}

export async function syncPaymentAttemptAction(pendingOrderId, body) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  try {
    return await syncPaymentAttempt(user, pendingOrderId, body);
  } catch (err) {
    return { ok: false, message: err?.message ?? "Sync failed." };
  }
}

export async function retryPaymentAttemptAction(pendingOrderId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  try {
    return await retryPaymentAttempt(user, pendingOrderId);
  } catch (err) {
    return { ok: false, message: err?.message ?? "Retry failed." };
  }
}

export async function completePaymentAttemptAction(pendingOrderId, body) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  try {
    return await completePaymentAttempt(user, pendingOrderId, body);
  } catch (err) {
    return { ok: false, message: err?.message ?? "Could not complete payment." };
  }
}

export async function failPaymentAttemptAction(pendingOrderId, body) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  try {
    return await failPaymentAttempt(user, pendingOrderId, body);
  } catch (err) {
    return { ok: false, message: err?.message ?? "Could not mark as failed." };
  }
}
