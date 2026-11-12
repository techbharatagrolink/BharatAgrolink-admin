"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { applyTakeRateRule, scanTakeRateRuleCandidates } from "@/lib/services/admin/take-rate-rules";

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
