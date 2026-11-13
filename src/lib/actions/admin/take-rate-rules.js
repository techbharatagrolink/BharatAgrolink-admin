"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { applyTakeRateRule, applyTakeRateRuleBatch, scanTakeRateRuleCandidates } from "@/lib/services/admin/take-rate-rules";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const denied = { ok: false, message: "You do not have permission to do this." };
const PRODUCT_PAGE = "manage_product.php";

export async function scanTakeRateRuleCandidatesAction() {
  const user = await getCurrentAdmin();
  if (!user) return { rows: [], scanned: 0, totalCatalog: 0, truncated: false, message: expired.message };
  if (!canPage(user, PRODUCT_PAGE, "view")) return { rows: [], scanned: 0, totalCatalog: 0, truncated: false, message: denied.message };
  return scanTakeRateRuleCandidates(user);
}

export async function applyTakeRateRuleAction(id, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, PRODUCT_PAGE, "edit")) return denied;
  const trimmedReason = String(reason ?? "").trim().slice(0, 500);
  if (!trimmedReason) return { ok: false, message: "A reason is required." };
  const result = await applyTakeRateRule(String(id), trimmedReason, user);
  if (result.ok) {
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin/pricing/take-rate-services");
  }
  return result;
}

/** One round trip for the whole selection instead of one per product — that extra browser hop per item was most of the wait. */
export async function applyTakeRateRuleBatchAction(ids, reason) {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: expired.message, results: [] };
  if (!canPage(user, PRODUCT_PAGE, "edit")) return { ok: false, message: denied.message, results: [] };
  const trimmedReason = String(reason ?? "").trim().slice(0, 500);
  if (!trimmedReason) return { ok: false, message: "A reason is required.", results: [] };
  const idList = Array.isArray(ids) ? [...new Set(ids.map((id) => String(id)))].slice(0, 200) : [];
  if (!idList.length) return { ok: false, message: "Select at least one row.", results: [] };
  const results = await applyTakeRateRuleBatch(idList, trimmedReason, user);
  if (results.some((r) => r.ok)) {
    for (const r of results) if (r.ok) revalidatePath(`/admin/products/${r.id}`);
    revalidatePath("/admin/pricing/take-rate-services");
  }
  return { ok: true, results };
}
