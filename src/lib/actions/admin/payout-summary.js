"use server";

import { ApiError } from "@/lib/api";
import { assertPermission, getCurrentAdmin } from "@/lib/auth/session";
import { exportPayoutSummary, listPayoutSummary } from "@/lib/services/admin/payout-summary";

/** Plain string params only, capped like the URL filters. */
function cleanParams(params) {
  const clean = {};
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) if (typeof k === "string" && k.length <= 40 && typeof v === "string") clean[k] = v.slice(0, k === "orderIds" ? 5000 : 120);
  }
  return clean;
}

/** The Vendor Payout Summary rows for new filters, fetched by the page without a server render. */
export async function payoutSummaryListAction(params) {
  const check = await assertPermission("payouts", "view");
  if (!check.ok) return { ok: false, message: check.message };
  try {
    return { ok: true, data: await listPayoutSummary(cleanParams(params), check.user) };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "Vendor payouts could not be loaded." };
  }
}

export async function payoutSummaryExportAction(params) {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: "Your session has expired. Please log in again." };
  return exportPayoutSummary(cleanParams(params), user);
}
