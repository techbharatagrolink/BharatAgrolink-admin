"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { adjustStock, calculatePricingLive, createProduct, deleteProductVariation, removeProductImage, saveProduct, saveProductVariation, setProductStatus, updateProductPricing, uploadProductImages, validateImport } from "@/lib/services/admin/products";

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

const amount = (value) => {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export async function saveProductAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await saveProduct(String(id), {
    name: String(input.name ?? "").trim(),
    description: String(input.description ?? ""),
    details: String(input.details ?? ""),
    toxicity: String(input.toxicity ?? ""),
    chemicalName: String(input.chemicalName ?? ""),
    usage: String(input.usage ?? ""),
    specifications: Array.isArray(input.specifications)
      ? input.specifications.slice(0, 40).map((row) => ({ name: String(row?.name ?? "").trim(), value: String(row?.value ?? "").trim() })).filter((row) => row.name || row.value)
      : [],
    faqs: Array.isArray(input.faqs)
      ? input.faqs.slice(0, 40).map((row) => ({ id: Number(row?.id) || undefined, question: String(row?.question ?? "").trim(), answer: String(row?.answer ?? "").trim() })).filter((row) => row.question && row.answer)
      : [],
    offerTitle: String(input.offerTitle ?? ""),
    offerShort: String(input.offerShort ?? ""),
    videoUrl: String(input.videoUrl ?? ""),
    webUrl: String(input.webUrl ?? ""),
    hsn: String(input.hsn ?? ""),
    brandId: amount(input.brandId) || undefined,
    categoryId: amount(input.categoryId) || undefined,
    categoryIds: Array.isArray(input.categoryIds) ? input.categoryIds.map((id) => amount(id)).filter((id) => id > 0) : undefined,
    purchaseLimit: amount(input.purchaseLimit),
    relatedProducts: String(input.relatedProducts ?? ""),
    upsellProducts: String(input.upsellProducts ?? ""),
    commission: amount(input.commission),
    adExpense: amount(input.adExpense),
    officeExpense: amount(input.officeExpense),
    profit: amount(input.profit),
    selfShip: Boolean(input.selfShip),
    chemicalFormula: String(input.chemicalFormula ?? ""),
    courierZone: String(input.courierZone ?? ""),
    returnPolicyId: amount(input.returnPolicyId),
    weightKg: amount(input.weightKg),
    lengthCm: amount(input.lengthCm),
    widthCm: amount(input.widthCm),
    heightCm: amount(input.heightCm),
    heavy: Boolean(input.heavy),
    shipping: amount(input.shipping),
    nrv: amount(input.nrv),
    msp: amount(input.msp),
    tcs: amount(input.tcs),
    tcsValue: amount(input.tcsValue),
    otherExpenses: amount(input.otherExpenses),
    gstOther: amount(input.gstOther),
    productType: String(input.productType ?? "simple"),
    countryOfOrigin: String(input.countryOfOrigin ?? ""),
    mrp: amount(input.mrp) || undefined,
    salePrice: amount(input.salePrice),
    stock: amount(input.stock) == null ? undefined : Math.round(amount(input.stock)),
    gstPercent: amount(input.gstPercent) == null ? undefined : amount(input.gstPercent),
  }, user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function uploadProductImagesAction(id, formData) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await uploadProductImages(String(id), formData, user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function removeProductImageAction(id, url) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await removeProductImage(String(id), String(url), user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function saveVariationAction(id, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await saveProductVariation(String(id), {
    id: input.id || undefined,
    label: String(input.label ?? "").trim(),
    mrp: amount(input.mrp),
    display: amount(input.display),
    stock: amount(input.stock) == null ? 0 : Math.round(amount(input.stock)),
    weightKg: amount(input.weightKg),
    lengthCm: amount(input.lengthCm),
    widthCm: amount(input.widthCm),
    heightCm: amount(input.heightCm),
    nrv: amount(input.nrv),
    gstPercent: amount(input.gstPercent),
    saleExGst: amount(input.saleExGst),
    commission: amount(input.commission),
    courier: String(input.courier ?? ""),
  }, user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function deleteVariationAction(id, variationId) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await deleteProductVariation(String(id), variationId, user);
  if (result.ok) revalidatePath(`/admin/products/${id}`);
  return result;
}

export async function validateImportAction(text) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  return validateImport(typeof text === "string" ? text : "", user);
}
