"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { listPaymentAttempts } from "@/lib/services/admin/payment-attempts";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function listPaymentAttemptsAction(filters = {}) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return listPaymentAttempts(user, filters);
}