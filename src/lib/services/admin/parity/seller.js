import "server-only";
import { api, apiBase, ApiError } from "@/lib/api";

/**
 * Seller-group screens ported from PHP (API /admin/parity/seller):
 *   add seller, feature categories, crop menu, product dashboard,
 *   B2B catalog, approvals and reports.
 */

const BASE = "admin/parity/seller";

async function get(path, user, query) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, query });
  return data;
}

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  const fieldErrors = {};
  for (const issue of Array.isArray(error.details) ? error.details : []) {
    if (issue?.path && !fieldErrors[issue.path]) fieldErrors[issue.path] = issue.message || error.message;
  }
  return { ok: false, message: error.message, status: error.status, code: error.code, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined };
}

/** For mutations and on-demand reads called from server actions: never throws. */
async function attempt(fn) {
  try {
    const data = await fn();
    return { ok: true, message: data?.message, data };
  } catch (error) {
    return failure(error, "The seller admin service could not be reached.");
  }
}

const send = (path, method, body, user) => attempt(async () => (await api(`${BASE}/${path}`, { token: user.token, method, body })).data);

/** Multipart pass-through: `api` is JSON-only. */
const upload = (path, method, body, user) =>
  attempt(async () => {
    const response = await fetch(`${apiBase()}/${BASE}/${path}`, {
      method,
      cache: "no-store",
      headers: { Accept: "application/json", Authorization: `Bearer ${user.token}` },
      body,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false) {
      throw new ApiError(payload?.message || `Request failed (${response.status})`, { code: payload?.code, status: response.status, details: payload?.details });
    }
    return payload?.data;
  });

/* Add Seller */
export const getAddSellerOptions = (user) => get("add-seller/options", user);
export const getAddSellerStates = (countryId, user) => attempt(() => get("add-seller/states", user, { countryId }));
export const getAddSellerCities = (stateId, user) => attempt(() => get("add-seller/cities", user, { stateId }));
export const verifyGst = (gst, user) => send("add-seller/verify-gst", "POST", { gst }, user);
export const createSeller = (formData, user) => upload("add-seller", "POST", formData, user);

export const searchProducts = (q, user) => attempt(() => get("products/search", user, { q }));

/* Feature Category */
export const getFeatureCategories = (user) => get("feature-categories", user);
export const getFeatureCategoryOptions = (user) => get("feature-categories/options", user);
export const getFeatureCategory = (id, user) => get(`feature-categories/${encodeURIComponent(id)}`, user);
export const createFeatureCategory = (formData, user) => upload("feature-categories", "POST", formData, user);
export const updateFeatureCategory = (id, formData, user) => upload(`feature-categories/${encodeURIComponent(id)}`, "PUT", formData, user);
export const deleteFeatureCategory = (id, user) => send(`feature-categories/${encodeURIComponent(id)}`, "DELETE", undefined, user);
export const reorderFeatureCategories = (ids, user) => send("feature-categories/reorder", "POST", { ids }, user);

/* Crop Menu */
export const getShopTopics = (type, user) => get("crop-menu", user, { type });
export const getShopTopic = (id, user) => get(`crop-menu/${encodeURIComponent(id)}`, user);
export const searchCropTopics = (q, user) => attempt(() => get("crop-menu/crops", user, { q }));
export const createShopTopic = (formData, user) => upload("crop-menu", "POST", formData, user);
export const updateShopTopic = (id, formData, user) => upload(`crop-menu/${encodeURIComponent(id)}`, "PUT", formData, user);
export const deleteShopTopic = (id, user) => send(`crop-menu/${encodeURIComponent(id)}`, "DELETE", undefined, user);
export const reorderShopTopics = (ids, user) => send("crop-menu/reorder", "POST", { ids }, user);

/* Product Dashboard */
export const getProductDashboard = (filters, user) => get("product-dashboard", user, filters);
export const getProductDashboardOptions = (user) => get("product-dashboard/options", user);
export const getProductCards = (query, user) => attempt(() => get("product-dashboard/cards", user, query));
export const getProductTimelineFeed = (query, user) => get("product-dashboard/timeline", user, query);
export const loadProductTimelineFeed = (query, user) => attempt(() => get("product-dashboard/timeline", user, query));
export const getProductDetail = (prodId, user) => attempt(() => get(`product-dashboard/products/${encodeURIComponent(prodId)}`, user));
export const getProductTimeline = (prodId, query, user) => attempt(() => get(`product-dashboard/products/${encodeURIComponent(prodId)}/timeline`, user, query));

/* B2B Catalog */
export const getB2bCatalog = (query, user) => get("b2b/catalog", user, query);
export const getB2bCatalogOptions = (user) => get("b2b/catalog/options", user);
export const getVendorCatalog = (vendorId, user) => attempt(() => get("b2b/catalog/vendor-catalog", user, { vendorId }));
export const getRecentCatalogs = (vendorId, user) => attempt(() => get("b2b/catalog/recent-catalogs", user, { vendorId }));
export const assignCatalogUrl = (input, user) => send("b2b/catalog/assign-url", "POST", input, user);
export const clearCatalogUrl = (ids, user) => send("b2b/catalog/clear-url", "POST", { ids }, user);
export const deleteB2bProduct = (id, user) => send(`b2b/catalog/${encodeURIComponent(id)}`, "DELETE", undefined, user);

/* B2B Approvals & Reports */
export const getApprovals = (query, user) => get("b2b/approvals", user, query);
export const decideQuotation = (id, decision, reason, user) => send(`b2b/approvals/${encodeURIComponent(id)}/decide`, "POST", { decision, reason }, user);
export const convertQuotation = (id, poNumber, user) => send(`b2b/approvals/${encodeURIComponent(id)}/convert`, "POST", { poNumber }, user);
export const getB2bReport = (range, user) => get("b2b/reports", user, range);
