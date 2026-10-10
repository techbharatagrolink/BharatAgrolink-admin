import "server-only";
import { api, apiForm, ApiError } from "@/lib/api";

const BASE = "admin/b2b/catalog-generator";

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message || fallback };
}

/** Boot data for the page: branding, sales contact, sellers, every active product, mode and preselection. */
export async function getCatalogueOptions(query, user) {
  const { data } = await api(`${BASE}/options`, { token: user.token, query });
  return data;
}

export async function generateCatalogue(body, user) {
  try {
    const { data } = await api(`${BASE}/generate`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The catalogue could not be generated.");
  }
}

export async function searchCatalogueBuyers(q, user) {
  try {
    const { data } = await api(`${BASE}/buyers`, { token: user.token, query: { q } });
    return { ok: true, buyers: data || [] };
  } catch (error) {
    return { ...failure(error, "Search failed."), buyers: [] };
  }
}

export async function sendCatalogue(formData, user) {
  try {
    const { data } = await apiForm(`${BASE}/send`, { token: user.token, formData });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "Could not send the catalogue.");
  }
}
