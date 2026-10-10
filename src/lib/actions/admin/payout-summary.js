"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { exportPayoutSummary } from "@/lib/services/admin/payout-summary";

export async function payoutSummaryExportAction(params) {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: "Your session has expired. Please log in again." };
  const clean = {};
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) if (typeof k === "string" && k.length <= 40 && typeof v === "string") clean[k] = v.slice(0, 120);
  }
  return exportPayoutSummary(clean, user);
}
