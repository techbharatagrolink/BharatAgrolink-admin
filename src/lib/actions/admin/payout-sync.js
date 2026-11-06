"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { getPayoutSync, startPayoutSync } from "@/lib/services/admin/payout-sync";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function payoutSyncStatusAction() {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return getPayoutSync(user);
}

export async function startPayoutSyncAction(job) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (typeof job !== "string") return { ok: false, message: "Invalid request." };
  return startPayoutSync(job, user);
}
