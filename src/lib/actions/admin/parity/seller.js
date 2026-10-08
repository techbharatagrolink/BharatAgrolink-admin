"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  assignCatalogUrl,
  clearCatalogUrl,
  convertQuotation,
  createFeatureCategory,
  createSeller,
  createShopTopic,
  decideQuotation,
  deleteB2bProduct,
  deleteFeatureCategory,
  deleteShopTopic,
  getAddSellerCities,
  getAddSellerStates,
  getProductCards,
  getProductDetail,
  getProductTimeline,
  getRecentCatalogs,
  getVendorCatalog,
  loadProductTimelineFeed,
  reorderFeatureCategories,
  reorderShopTopics,
  searchCropTopics,
  searchProducts,
  updateFeatureCategory,
  updateShopTopic,
  verifyGst,
} from "@/lib/services/admin/parity/seller";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 5 * 1024 * 1024;
const positiveId = (v) => (/^\d+$/.test(String(v ?? "")) && Number(v) > 0 ? Number(v) : null);
const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");

/** Copies text fields and image files from the browser FormData into a fresh one for the API. */
function rebuild(formData, textFields, fileFields, multiFileFields = []) {
  const body = new FormData();
  for (const [name, max] of textFields) body.set(name, str(formData.get(name), max));
  for (const name of [...fileFields, ...multiFileFields]) {
    const files = multiFileFields.includes(name) ? formData.getAll(name) : [formData.get(name)];
    for (const file of files) {
      if (!file || typeof file !== "object" || !file.size) continue;
      if (!IMAGE_TYPES.includes(file.type)) return { error: "Only JPG, PNG or WEBP images are allowed." };
      if (file.size > MAX_IMAGE) return { error: "Each image must be 5 MB or smaller." };
      body.append(name, file, file.name || name);
    }
  }
  return { body };
}

const idList = (ids) => (Array.isArray(ids) ? ids.map(positiveId) : []);

/* ---------------------------------------------------------------- Add Seller */

export async function addSellerStatesAction(countryId) {
  const gate = await assertPermission("vendors.add", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = positiveId(countryId);
  if (!id) return { ok: true, data: [] };
  return getAddSellerStates(id, gate.user);
}

export async function addSellerCitiesAction(stateId) {
  const gate = await assertPermission("vendors.add", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = positiveId(stateId);
  if (!id) return { ok: true, data: [] };
  return getAddSellerCities(id, gate.user);
}

export async function verifyGstAction(gst) {
  const gate = await assertPermission("vendors.add", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const value = str(gst, 20).trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value)) return { ok: false, message: "Enter a valid 15-character GSTIN." };
  return verifyGst(value, gate.user);
}

const SELLER_TEXT = [
  ["sellerName", 80],
  ["companyName", 100],
  ["groupId", 10],
  ["address", 250],
  ["description", 5000],
  ["countryId", 10],
  ["stateId", 10],
  ["state", 255],
  ["cityId", 10],
  ["city", 255],
  ["pincode", 6],
  ["phone", 10],
  ["email", 60],
  ["password", 100],
  ["website", 500],
  ["gst", 20],
];

export async function createSellerAction(formData) {
  const gate = await assertPermission("vendors.add", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const { body, error } = rebuild(formData, SELLER_TEXT, ["seller_logo", "pan_card", "aadhar_card", "business_proof"]);
  if (error) return { ok: false, message: error };
  const result = await createSeller(body, gate.user);
  if (result.ok) revalidatePath("/admin/vendors");
  return result;
}

/* ---------------------------------------------------------- Product search */

export async function searchProductsAction(q, permission = "catalog.featureCategories") {
  if (!["catalog.featureCategories", "catalog.cropMenu"].includes(permission)) return { ok: false, message: "Unknown screen." };
  const gate = await assertPermission(permission, "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const term = str(q, 120).trim();
  if (!term) return { ok: true, data: [] };
  return searchProducts(term, gate.user);
}

/* -------------------------------------------------------- Feature Category */

const FEATURE_TEXT = [
  ["name", 255],
  ["description", 5000],
  ["products", 60000],
  ["metaTitle", 500],
  ["metaKeywords", 1000],
  ["metaDescription", 2000],
];
const FEATURE_CREATE_TEXT = [...FEATURE_TEXT, ["catType", 1], ["mainCategory", 1], ["parentCategory", 10], ["categoryId", 10], ["chemicalFormulaTitle", 500], ["chemicalFormulaProducts", 60000]];
const FEATURE_IMAGES = ["cat_img", "banner_img_desktop", "banner_img_mobile", "banner_img_desktop2", "banner_img_mobile2"];

export async function createFeatureCategoryAction(formData) {
  const gate = await assertPermission("catalog.featureCategories", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const { body, error } = rebuild(formData, FEATURE_CREATE_TEXT, FEATURE_IMAGES, ["product_image"]);
  if (error) return { ok: false, message: error };
  const result = await createFeatureCategory(body, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/feature-categories");
  return result;
}

export async function updateFeatureCategoryAction(id, formData) {
  const gate = await assertPermission("catalog.featureCategories", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key) return { ok: false, message: "Invalid category." };
  const { body, error } = rebuild(formData, FEATURE_TEXT, ["cat_img", "banner_img_desktop", "banner_img_mobile"]);
  if (error) return { ok: false, message: error };
  const result = await updateFeatureCategory(key, body, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/feature-categories");
  return result;
}

export async function deleteFeatureCategoryAction(id) {
  const gate = await assertPermission("catalog.featureCategories", "delete");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key) return { ok: false, message: "Invalid category." };
  const result = await deleteFeatureCategory(key, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/feature-categories");
  return result;
}

export async function reorderFeatureCategoriesAction(ids) {
  const gate = await assertPermission("catalog.featureCategories", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const list = idList(ids);
  if (!list.length || list.length > 500 || list.includes(null)) return { ok: false, message: "Invalid order." };
  const result = await reorderFeatureCategories(list, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/feature-categories");
  return result;
}

/* ---------------------------------------------------------------- Crop Menu */

const TOPIC_TEXT = [
  ["name", 150],
  ["nameHi", 150],
  ["link", 500],
  ["products", 60000],
  ["cropIds", 5000],
];

export async function searchCropsAction(q) {
  const gate = await assertPermission("catalog.cropMenu", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return searchCropTopics(str(q, 120).trim(), gate.user);
}

export async function createShopTopicAction(formData) {
  const gate = await assertPermission("catalog.cropMenu", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const { body, error } = rebuild(formData, [...TOPIC_TEXT, ["type", 10]], ["topic_img"]);
  if (error) return { ok: false, message: error };
  const result = await createShopTopic(body, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/crop-menu");
  return result;
}

export async function updateShopTopicAction(id, formData) {
  const gate = await assertPermission("catalog.cropMenu", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key) return { ok: false, message: "Invalid item." };
  const { body, error } = rebuild(formData, TOPIC_TEXT, ["topic_img"]);
  if (error) return { ok: false, message: error };
  const result = await updateShopTopic(key, body, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/crop-menu");
  return result;
}

export async function deleteShopTopicAction(id) {
  const gate = await assertPermission("catalog.cropMenu", "delete");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key) return { ok: false, message: "Invalid item." };
  const result = await deleteShopTopic(key, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/crop-menu");
  return result;
}

export async function reorderShopTopicsAction(ids) {
  const gate = await assertPermission("catalog.cropMenu", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const list = idList(ids);
  if (!list.length || list.length > 500 || list.includes(null)) return { ok: false, message: "Invalid order." };
  const result = await reorderShopTopics(list, gate.user);
  if (result.ok) revalidatePath("/admin/catalog/crop-menu");
  return result;
}

/* -------------------------------------------------------- Product Dashboard */

const DASH_KEYS = ["start", "end", "compareStart", "compareEnd", "vendorId", "catId", "brandId", "stock", "search"];
const pick = (input, keys) => Object.fromEntries(keys.map((k) => [k, typeof input?.[k] === "string" || typeof input?.[k] === "number" ? String(input[k]).slice(0, 120) : undefined]));

export async function productCardsAction(input) {
  const gate = await assertPermission("dashboard.productOverview", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return getProductCards(pick(input, [...DASH_KEYS, "card", "page", "limit"]), gate.user);
}

export async function productDetailAction(prodId) {
  const gate = await assertPermission("dashboard.productOverview", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = str(prodId, 100).trim();
  if (!id) return { ok: false, message: "Product not found." };
  return getProductDetail(id, gate.user);
}

export async function productTimelineAction(prodId, input) {
  const gate = await assertPermission("dashboard.productOverview", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = str(prodId, 100).trim();
  if (!id) return { ok: false, message: "Product not found." };
  return getProductTimeline(id, pick(input, ["category", "limit", "offset"]), gate.user);
}

export async function timelineFeedAction(input) {
  const gate = await assertPermission("dashboard.productOverview", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return loadProductTimelineFeed(pick(input, ["start", "end", "userId", "action", "search", "limit", "offset"]), gate.user);
}

/* -------------------------------------------------------------- B2B Catalog */

export async function b2bCatalogAction(actionId, ids, extra = {}) {
  const action = { delete: "delete", "assign-url": "edit", "clear-url": "edit" }[actionId];
  if (!action) return { ok: false, message: "Unknown action." };
  const gate = await assertPermission("b2b.catalog", action);
  if (!gate.ok) return { ok: false, message: gate.message };
  const list = idList(ids);
  if (!list.length || list.length > 500 || list.includes(null)) return { ok: false, message: "No products selected." };
  let result;
  if (actionId === "delete") {
    if (list.length !== 1) return { ok: false, message: "Delete one product at a time." };
    result = await deleteB2bProduct(list[0], gate.user);
  } else if (actionId === "assign-url") {
    result = await assignCatalogUrl({ url: str(extra.url, 500).trim(), title: str(extra.title, 255).trim(), ids: list }, gate.user);
  } else {
    result = await clearCatalogUrl(list, gate.user);
  }
  if (result.ok) revalidatePath("/admin/b2b/catalog");
  return result;
}

export async function vendorCatalogAction(vendorId) {
  const gate = await assertPermission("b2b.catalog", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = str(vendorId, 100).trim();
  if (!id) return { ok: false, message: "Vendor ID is required." };
  const [vendor, recent] = await Promise.all([getVendorCatalog(id, gate.user), getRecentCatalogs(id, gate.user)]);
  if (!vendor.ok) return vendor;
  return { ok: true, data: { vendor: vendor.data, recent: recent.ok ? recent.data : [] } };
}

/* ------------------------------------------------------------- Approvals */

export async function decideQuotationAction(id, decision, reason) {
  const gate = await assertPermission("b2b.approvals", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key || !["approved", "rejected"].includes(decision)) return { ok: false, message: "Invalid decision." };
  const note = str(reason, 1000).trim();
  if (!note) return { ok: false, message: "A reason is required on every approval decision." };
  const result = await decideQuotation(key, decision, note, gate.user);
  if (result.ok) revalidatePath("/admin/b2b/approvals");
  return result;
}

export async function convertQuotationAction(id, poNumber) {
  const gate = await assertPermission("b2b.approvals", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const key = positiveId(id);
  if (!key) return { ok: false, message: "Invalid quotation." };
  const result = await convertQuotation(key, str(poNumber, 100).trim(), gate.user);
  if (result.ok) revalidatePath("/admin/b2b/approvals");
  return result;
}
