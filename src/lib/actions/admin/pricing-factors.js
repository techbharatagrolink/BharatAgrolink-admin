"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import {
  getProductPricingFactors,
  previewProductPricingFactors,
  removeCostFactor,
  resetProductActualsFactors,
  saveCostFactor,
  savePricingConfig,
  saveProductPricingFactors,
} from "@/lib/services/admin/pricing-factors";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const denied = { ok: false, message: "You do not have permission to do this." };
const PRODUCT_PAGE = "manage_product.php";
const COST_PAGE = "product_cost_management.php";

const text = (value, max = 100) => (value == null ? undefined : String(value).trim().slice(0, max));

/** Only the inputs the API accepts; a display price or any computed amount is never forwarded. */
function pricingBody(input = {}) {
  const body = { variantId: Number(input.variantId) || 0 };
  if (input.mode === "TAKE_RATE" || input.mode === "FROM_ACTUALS") body.mode = input.mode;
  for (const key of ["takeRate", "nrv", "mrp"]) if (input[key] !== undefined && input[key] !== "") body[key] = text(input[key], 20);
  if (input.targetMarginBps !== undefined && input.targetMarginBps !== "") body.targetMarginBps = Math.round(Number(input.targetMarginBps));
  if (input.gstPercent !== undefined && input.gstPercent !== "") body.gstPercent = Number(input.gstPercent);
  if (input.hsn !== undefined) body.hsn = text(input.hsn);
  if (Array.isArray(input.factors)) {
    body.factors = input.factors.slice(0, 50).map((f) => ({
      code: text(f.code, 40),
      overridden: Boolean(f.overridden),
      actual: f.overridden && f.actual !== "" && f.actual != null ? text(f.actual, 20) : null,
      notes: text(f.notes ?? "", 500),
    }));
  }
  if (input.reason) body.reason = text(input.reason, 500);
  return body;
}

export async function loadProductPricingAction(id, variantId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, PRODUCT_PAGE, "view")) return denied;
  return getProductPricingFactors(String(id), Number(variantId) || 0, user);
}

export async function previewProductPricingAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, PRODUCT_PAGE, "view")) return denied;
  return previewProductPricingFactors(String(id), pricingBody(input), user);
}

export async function saveProductPricingAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, PRODUCT_PAGE, "edit")) return denied;
  const result = await saveProductPricingFactors(String(id), pricingBody(input), user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function resetProductActualsAction(id, variantId, codes, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, PRODUCT_PAGE, "edit")) return denied;
  const body = { variantId: Number(variantId) || 0, ...(Array.isArray(codes) && codes.length ? { codes: codes.map((c) => text(c, 40)) } : {}), ...(reason ? { reason: text(reason, 500) } : {}) };
  const result = await resetProductActualsFactors(String(id), body, user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function saveCostFactorAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, COST_PAGE, id ? "edit" : "add")) return denied;
  const body = {
    label: text(input.label, 120),
    description: text(input.description ?? "", 255),
    defaultTargetBps: Math.round(Number(input.defaultTargetBps)),
    sortOrder: input.sortOrder === "" || input.sortOrder == null ? undefined : Math.round(Number(input.sortOrder)),
    active: input.active !== false,
    ...(id ? {} : { code: text(input.code, 40) }),
  };
  const result = await saveCostFactor(id ? Number(id) : null, body, user);
  if (result.ok) revalidatePath("/admin/pricing/cost-management");
  return result;
}

export async function deleteCostFactorAction(id) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, COST_PAGE, "delete")) return denied;
  const result = await removeCostFactor(Number(id), user);
  if (result.ok) revalidatePath("/admin/pricing/cost-management");
  return result;
}

const CONFIG_KEYS = ["scGstBps", "tcsBps", "defaultTakeRateBps", "minTakeRateBps", "maxTakeRateBps", "minMarginBps", "defaultTargetMarginBps", "minDenominatorBps"];

export async function savePricingConfigAction(input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!canPage(user, COST_PAGE, "edit")) return denied;
  const body = Object.fromEntries(CONFIG_KEYS.map((key) => [key, Math.round(Number(input[key]))]));
  body.roundingMode = input.roundingMode === "RUPEE" ? "RUPEE" : "PAISE";
  body.fromActualsFixed = input.fromActualsFixed === "ALL" ? "ALL" : "OVERRIDDEN";
  if (input.notes) body.notes = text(input.notes, 500);
  const result = await savePricingConfig(body, user);
  if (result.ok) revalidatePath("/admin/pricing/cost-management");
  return result;
}
