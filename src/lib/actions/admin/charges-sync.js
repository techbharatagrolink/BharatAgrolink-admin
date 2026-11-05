"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { getChargesSync, startChargesSync } from "@/lib/services/admin/charges-sync";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function chargesSyncStatusAction() {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return getChargesSync(user);
}

export async function startChargesSyncAction(job) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (typeof job !== "string") return { ok: false, message: "Invalid request." };
  return startChargesSync(job, user);
}
