"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { exportSellerAgreements } from "@/lib/services/admin/seller-agreements";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function sellerAgreementsExportAction(params) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const clean = {};
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) if (typeof k === "string" && k.length <= 40 && typeof v === "string") clean[k] = v.slice(0, 120);
  }
  return exportSellerAgreements(clean, user);
}
