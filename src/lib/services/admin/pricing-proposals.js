import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Variation pricing proposals with vendor consent (backend module pricing-proposals).
 * The parent product groups; each variation is priced on its own. A proposal never changes active
 * pricing: a variation goes live only after the vendor accepts it, on the effective date.
 *   GET  admin/pricing/proposals/products?q          find a product by name, SKU, vendor or category
 *   GET  admin/pricing/proposals/options?productId   variations + offered services
 *   POST admin/pricing/proposals/preview             per-variation impact, nothing saved
 *   POST admin/pricing/proposals                     create (vendor notified)
 *   GET  admin/pricing/proposals?status&open&page    list
 *   GET  admin/pricing/proposals/{id}                detail
 *   POST admin/pricing/proposals/{id}/withdraw       { reason }
 *   POST admin/pricing/proposals/items/{itemId}/reply  { reply }
 */

const BASE = "admin/pricing/proposals";

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  const details = error.details && !Array.isArray(error.details) ? error.details : {};
  return { ok: false, code: error.code, status: error.status, message: error.message || fallback, skipped: details.skipped ?? [] };
}

export async function searchProposalProducts(q, user) {
  try {
    const { data } = await api(`${BASE}/products`, { token: user.token, query: { q } });
    return { ok: true, products: data ?? [] };
  } catch (error) {
    return { ...failure(error, "Could not search products."), products: [] };
  }
}

export async function getProposalOptions(productId, user) {
  try {
    const { data } = await api(`${BASE}/options`, { token: user.token, query: { productId } });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "Could not load this product's variations.");
  }
}

export async function previewProposal(body, user) {
  try {
    const { data } = await api(`${BASE}/preview`, { token: user.token, method: "POST", body });
    return { ok: true, preview: data };
  } catch (error) {
    return failure(error, "Could not preview the proposal.");
  }
}

export async function createProposal(body, user) {
  try {
    const { data } = await api(BASE, { token: user.token, method: "POST", body });
    return { ok: true, proposal: data };
  } catch (error) {
    return failure(error, "Could not create the proposal.");
  }
}

export async function listProposals(query, user) {
  try {
    const { data } = await api(BASE, { token: user.token, query });
    return { ok: true, ...data };
  } catch (error) {
    return { ...failure(error, "Could not load pricing proposals."), rows: [], total: 0 };
  }
}

export async function getProposal(id, user) {
  try {
    const { data } = await api(`${BASE}/${encodeURIComponent(id)}`, { token: user.token });
    return { ok: true, proposal: data };
  } catch (error) {
    return failure(error, "Could not load this proposal.");
  }
}

export async function withdrawProposal(id, reason, user) {
  try {
    const { data } = await api(`${BASE}/${encodeURIComponent(id)}/withdraw`, { token: user.token, method: "POST", body: { reason } });
    return { ok: true, proposal: data };
  } catch (error) {
    return failure(error, "Could not withdraw the proposal.");
  }
}

export async function replyToClarification(itemId, reply, user) {
  try {
    const { data } = await api(`${BASE}/items/${encodeURIComponent(itemId)}/reply`, { token: user.token, method: "POST", body: { reply } });
    return { ok: true, proposal: data };
  } catch (error) {
    return failure(error, "Could not send the answer.");
  }
}
