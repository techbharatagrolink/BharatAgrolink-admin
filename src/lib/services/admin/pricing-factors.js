import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Product pricing factors (PRICING_FACTORS_V1). The API computes every amount;
 * the admin only sends inputs (take rate / mode / edited actuals) and never a
 * display price.
 *   GET  admin/products/{id}/pricing?variantId=
 *   POST admin/products/{id}/pricing/preview
 *   PUT  admin/products/{id}/pricing
 *   POST admin/products/{id}/pricing/reset-actuals
 *   GET  admin/pricing/features | cost-management/summary | cost-factors | config
 */

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  const details = error.details && !Array.isArray(error.details) ? error.details : {};
  return {
    ok: false,
    code: error.code,
    status: error.status,
    message: error.message || fallback,
    errors: details.errors ?? (Array.isArray(error.details) ? error.details : []),
    warnings: details.warnings ?? [],
    result: details.result ?? null,
  };
}

const productPath = (id) => `admin/products/${encodeURIComponent(id)}/pricing`;

export async function pricingFactorsEnabled(user) {
  if (!user?.token) return false;
  try {
    const { data } = await api("admin/pricing/features", { token: user.token });
    return Boolean(data?.pricingFactorsV1);
  } catch {
    return false;
  }
}

/** Verdict snapshot for every Active, priced product — polled by the background alert hook. */
export async function getProfitabilityAlerts(user) {
  try {
    const { data } = await api("admin/pricing/profitability-alerts", { token: user.token });
    return { ok: true, products: data?.products ?? [] };
  } catch (error) {
    return { ok: false, products: [], message: error instanceof ApiError ? error.message : "Could not load profitability alerts." };
  }
}

/** Per-vendor contribution totals and verdict counts, priced Active products only. */
export async function getVendorProfitability(user, { limit } = {}) {
  try {
    const { data } = await api("admin/pricing/vendor-profitability", { token: user.token, query: limit ? { limit } : undefined });
    return { ok: true, rows: data?.rows ?? [] };
  } catch (error) {
    return { ok: false, rows: [], message: error instanceof ApiError ? error.message : "Could not load the vendor profitability report." };
  }
}

/** Revenue split: Base (take rate) vs Sales-service vs Marketing-service vs Other, priced Active products only. */
export async function getServiceRevenueAllocation(user) {
  try {
    const { data } = await api("admin/pricing/service-revenue", { token: user.token });
    return { ok: true, allocation: data?.allocation ?? [] };
  } catch (error) {
    return { ok: false, allocation: [], message: error instanceof ApiError ? error.message : "Could not load the service revenue split." };
  }
}

export async function getProductPricingFactors(id, variantId, user) {
  try {
    const { data } = await api(productPath(id), { token: user.token, query: variantId ? { variantId } : undefined });
    return { ok: true, pricing: data };
  } catch (error) {
    return failure(error, "Could not load pricing.");
  }
}

export async function previewProductPricingFactors(id, body, user) {
  try {
    const { data } = await api(`${productPath(id)}/preview`, { method: "POST", token: user.token, body });
    return { ok: true, pricing: data };
  } catch (error) {
    return failure(error, "Could not calculate pricing.");
  }
}

export async function getDraftPricingFactors(user) {
  try {
    const { data } = await api("admin/pricing/draft", { token: user.token });
    return { ok: true, pricing: data };
  } catch (error) {
    return failure(error, "Could not load pricing.");
  }
}

export async function previewDraftPricingFactors(body, user) {
  try {
    const { data } = await api("admin/pricing/draft/preview", { method: "POST", token: user.token, body });
    return { ok: true, pricing: data };
  } catch (error) {
    return failure(error, "Could not calculate pricing.");
  }
}

export async function saveProductPricingFactors(id, body, user) {
  try {
    const { data } = await api(productPath(id), { method: "PUT", token: user.token, body });
    return { ok: true, message: data.message, warnings: data.warnings ?? [], pricing: data.pricing };
  } catch (error) {
    return failure(error, "Could not save pricing.");
  }
}

export async function resetProductActualsFactors(id, body, user) {
  try {
    const { data } = await api(`${productPath(id)}/reset-actuals`, { method: "POST", token: user.token, body });
    return { ok: true, message: "Actuals reset to their targets.", pricing: data.pricing };
  } catch (error) {
    return failure(error, "Could not reset actuals.");
  }
}

export async function getCostManagement({ q = "", status = "all", page = 1 } = {}, user) {
  try {
    const [{ data: summary, meta }, { data: factors }, { data: config }] = await Promise.all([
      api("admin/pricing/cost-management/summary", { token: user.token, query: { q, status, page, limit: 25 } }),
      api("admin/pricing/cost-factors", { token: user.token }),
      api("admin/pricing/config", { token: user.token }),
    ]);
    return { ok: true, summary, meta: summary?.meta ?? meta, factors, config };
  } catch (error) {
    return failure(error, "Could not load cost management.");
  }
}

export async function saveCostFactor(id, body, user) {
  try {
    const { data } = await api(id ? `admin/pricing/cost-factors/${id}` : "admin/pricing/cost-factors", { method: id ? "PUT" : "POST", token: user.token, body });
    return { ok: true, message: data?.message ?? "Saved." };
  } catch (error) {
    return failure(error, "Could not save the cost factor.");
  }
}

export async function removeCostFactor(id, user) {
  try {
    const { data } = await api(`admin/pricing/cost-factors/${id}`, { method: "DELETE", token: user.token });
    return { ok: true, message: data?.message ?? "Deleted." };
  } catch (error) {
    return failure(error, "Could not delete the cost factor.");
  }
}

export async function savePricingConfig(body, user) {
  try {
    const { data } = await api("admin/pricing/config", { method: "PUT", token: user.token, body });
    return { ok: true, message: data?.message ?? "Saved.", config: data?.config };
  } catch (error) {
    return failure(error, "Could not save the pricing configuration.");
  }
}
