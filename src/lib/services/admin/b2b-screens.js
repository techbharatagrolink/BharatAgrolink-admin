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

const quoteId = (id) => encodeURIComponent(String(Number(id) || 0));

/** Quotation detail: header, lines, economics (by role), approval reasons, versions, timeline, allowed actions. Null when not found. */
export async function getQuotationDetail(id, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/detail`, { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** New version of a quotation (spec C6): the old one becomes superseded. */
export async function reviseQuotation(id, body, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/revise`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The revised quotation could not be saved.");
  }
}

export async function recalculateQuotation(id, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/recalculate`, { token: user.token, method: "POST", body: {} });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The quotation could not be recalculated.");
  }
}

export async function cancelQuotation(id, body, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/cancel`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The quotation could not be cancelled.");
  }
}

/** Buyer link (spec C6): the raw URL comes back once; a new link revokes the earlier one. */
export async function createQuotationLink(id, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/share-link`, { token: user.token, method: "POST", body: {} });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The buyer link could not be created.");
  }
}

export async function resolveQuotationChange(id, changeId, body, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/change-requests/${quoteId(changeId)}`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The change request could not be updated.");
  }
}

export async function getOrderForm(user) {
  const { data } = await api("admin/b2b/orders/form", { token: user.token });
  return data;
}

export async function searchOrderBuyers(q, user) {
  try {
    const { data } = await api("admin/b2b/orders/buyers", { token: user.token, query: { q } });
    return { ok: true, buyers: data || [] };
  } catch (error) {
    return { ...failure(error, "Buyer search failed."), buyers: [] };
  }
}

export async function searchOrderProducts(q, user) {
  try {
    const { data } = await api("admin/b2b/orders/products", { token: user.token, query: { q } });
    return { ok: true, products: data || [] };
  } catch (error) {
    return { ...failure(error, "Product search failed."), products: [] };
  }
}

export async function startOrderPayment(body, user) {
  try {
    const { data } = await api("admin/b2b/orders/payment", { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "Could not start the payment.");
  }
}

export async function createOrder(body, user) {
  try {
    const { data } = await api("admin/b2b/orders", { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The order could not be booked.");
  }
}
