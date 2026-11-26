"use server";

import { assertExport } from "@/lib/auth/session";
import { exportSellerAgreements } from "@/lib/services/admin/seller-agreements";

/** Seller agreements CSV rows for the current filters. Super admins only. */
export async function sellerAgreementsExportAction(params) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  const clean = {};
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) if (typeof k === "string" && k.length <= 40 && typeof v === "string") clean[k] = v.slice(0, 120);
  }
  return exportSellerAgreements(clean, auth.user);
}
