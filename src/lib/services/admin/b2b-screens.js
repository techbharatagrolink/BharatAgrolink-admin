import "server-only";
import { api, ApiError } from "@/lib/api";

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback, details: [] };
  const details = (Array.isArray(error.details) ? error.details : []).map((issue) => issue?.message).filter(Boolean);
  return { ok: false, message: error.message || fallback, details };
}

export async function getCatalogBatch(query, user) {
  const { data } = await api("admin/b2b/catalog-generator", { token: user.token, query });
  return data;
}

export async function getQuotationForm(user) {
  const { data } = await api("admin/b2b/quotations/form", { token: user.token });
  return data;
}

export async function searchQuotationBuyers(q, user) {
  try {
    const { data } = await api("admin/b2b/quotations/buyers", { token: user.token, query: { q } });
    return { ok: true, buyers: data || [] };
  } catch (error) {
    return { ...failure(error, "Buyer search failed."), buyers: [] };
  }
}

export async function searchQuotationProducts(q, user) {
  try {
    const { data } = await api("admin/b2b/quotations/products", { token: user.token, query: { q } });
    return { ok: true, products: data || [] };
  } catch (error) {
    return { ...failure(error, "Product search failed."), products: [] };
  }
}

export async function createQuotation(body, user) {
  try {
    const { data } = await api("admin/b2b/quotations", { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The quotation could not be saved.");
  }
}
