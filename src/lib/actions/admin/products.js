"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { adjustStock, calculatePricingLive, createProduct, setProductStatus, updateProductPricing, validateImport } from "@/lib/services/admin/products";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const plain = (input, keys) => Object.fromEntries(keys.map((k) => [k, input && typeof input[k] !== "object" ? String(input[k] ?? "") : ""]));
const PRICE_KEYS = ["mrp", "nrv", "takeRate", "gstPercent"];

export async function calculatePricingAction(input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!can(user, "pricing") && !can(user, "products")) return { ok: false, message: "You do not have permission to use the pricing calculator." };
  return calculatePricingLive(plain(input, PRICE_KEYS), user);
}

export async function updatePricingAction(id, input, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await updateProductPricing(String(id), plain(input, PRICE_KEYS), String(reason ?? ""), user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function adjustStockAction(id, stock, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await adjustStock(String(id), stock, String(reason ?? ""), user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function setProductStatusAction(id, action, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await setProductStatus(String(id), String(action), String(reason ?? ""), user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function createProductAction(input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const v = input && typeof input.variations === "object" && input.variations ? input.variations : {};
  const variations = {
    enabled: v.enabled === true,
    ...plain(v, ["attribute", "baseLabel"]),
    rows: Array.isArray(v.rows) ? v.rows.slice(0, 11).map((row) => plain(row, ["label", "mrp", "nrv", "stock", "weightKg"])) : [],
  };
  const result = await createProduct({ ...plain(input, ["name", "vendorId", "categoryId", "brandId", "hsn", "stock", "weightKg", "returnPolicy", ...PRICE_KEYS]), variations }, user);
  if (result.ok) revalidatePath("/admin/products");
  return result;
}

export async function validateImportAction(text) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return validateImport(typeof text === "string" ? text : "", user);
}
