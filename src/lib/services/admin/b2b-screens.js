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

/** Pricing rules (spec C3): rule discount and suggested rate per line for the buyer / type / payment mode. */
export async function calculateQuotePricing(body, user) {
  try {
    const { data } = await api("admin/b2b/pricing/calculate", { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The pricing rules could not be applied.");
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

/** WhatsApp (spec C6): a new buyer link + the approved template. The link is returned even if sending fails. */
export async function sendQuotationWhatsApp(id, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/send-whatsapp`, { token: user.token, method: "POST", body: {} });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The quotation could not be sent on WhatsApp.");
  }
}

export async function completeQuotationFollowup(id, taskId, outcome, user) {
  try {
    const { data } = await api(`admin/b2b/quotations/${quoteId(id)}/followups/${quoteId(taskId)}`, { token: user.token, method: "POST", body: { outcome } });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The follow-up could not be updated.");
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

const orderRef = (id) => encodeURIComponent(String(id ?? "").trim().slice(0, 80));

/** Order detail with lifecycle (subtask 8): lines, sellers, stages, history, allowed actions. null on 404. */
export async function getOrderLifecycle(id, user) {
  try {
    const { data } = await api(`admin/b2b/orders/${orderRef(id)}/detail`, { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function transitionOrder(id, action, body, user) {
  try {
    const { data } = await api(`admin/b2b/orders/${orderRef(id)}/actions/${encodeURIComponent(action)}`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The order could not be updated.");
  }
}

export async function recordOrderSeller(id, sellerId, body, user) {
  try {
    const { data } = await api(`admin/b2b/orders/${orderRef(id)}/sellers/${quoteId(sellerId)}`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The seller answer could not be saved.");
  }
}

/** Logistics (subtask 10): rate options for the order's unshipped (or chosen) packages. */
export async function getShipmentOptions(id, packageIds, user, { live = false, fromPincode = "" } = {}) {
  try {
    const query = packageIds?.length ? { packageIds: packageIds.join(",") } : {};
    // Live carrier quotes (Shiprocket Cargo, Delhivery B2B, parcel couriers) only on request.
    if (live) query.live = "1";
    if (/^\d{6}$/.test(String(fromPincode))) query.fromPincode = String(fromPincode);
    const { data } = await api(`admin/b2b/orders/${orderRef(id)}/shipment-options`, { token: user.token, query });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "Rate options could not be loaded.");
  }
}

export async function bookOrderShipment(id, body, user) {
  try {
    const { data } = await api(`admin/b2b/orders/${orderRef(id)}/shipments`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The shipment could not be booked.");
  }
}

export async function updateShipment(shipmentId, action, body, user) {
  try {
    const { data } = await api(`admin/b2b/shipments/${quoteId(shipmentId)}/actions/${encodeURIComponent(action)}`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The shipment could not be updated.");
  }
}

export async function recordShipmentFreight(shipmentId, body, user) {
  try {
    const { data } = await api(`admin/b2b/shipments/${quoteId(shipmentId)}/freight`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The freight could not be saved.");
  }
}

export async function setShipmentProof(shipmentId, body, user) {
  try {
    const { data } = await api(`admin/b2b/shipments/${quoteId(shipmentId)}/proof`, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The proof could not be saved.");
  }
}

// --- Payment, credit and settlement (subtask 11). Finance capabilities are checked by the API. ---

/** The buyer's credit account, position, requests and history; null on 404 / no access. */
export async function getBuyerCredit(buyerId, user) {
  try {
    const { data } = await api(`admin/b2b/buyers/${quoteId(buyerId)}/credit`, { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

const post = async (path, body, user, fallback) => {
  try {
    const { data } = await api(path, { token: user.token, method: "POST", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, fallback);
  }
};

export const requestBuyerCredit = (buyerId, body, user) => post(`admin/b2b/buyers/${quoteId(buyerId)}/credit-requests`, body, user, "The credit request could not be sent.");
export const decideBuyerCredit = (requestId, body, user) => post(`admin/b2b/credit-requests/${quoteId(requestId)}/decision`, body, user, "The credit request could not be decided.");
export const setBuyerCreditStatus = (buyerId, body, user) => post(`admin/b2b/buyers/${quoteId(buyerId)}/credit-status`, body, user, "The credit status could not be changed.");
export const recordReceipt = (body, user) => post("admin/b2b/finance/receipts", body, user, "The payment could not be recorded.");
export const allocateReceipt = (paymentId, body, user) => post(`admin/b2b/finance/receipts/${quoteId(paymentId)}/allocate`, body, user, "The payment could not be allocated.");
export const reverseReceipt = (paymentId, body, user) => post(`admin/b2b/finance/receipts/${quoteId(paymentId)}/reverse`, body, user, "The payment could not be reversed.");
export const recordRefund = (body, user) => post("admin/b2b/finance/refunds", body, user, "The refund could not be recorded.");
export const settlementAction = (id, action, body, user) =>
  post(`admin/b2b/finance/settlements/${quoteId(id)}/actions/${encodeURIComponent(action)}`, body, user, "The settlement could not be updated.");

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

// --- Buyer & lead management (task #107 subtask 2): CRM fields, activities, follow-ups, sales workspace.
export async function getCrmOptions(user) {
  try {
    const { data } = await api("admin/b2b/crm/options", { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

export async function getSalesWorkspace(user, scope) {
  const { data } = await api(`admin/b2b/crm/workspace${scope === "team" ? "?scope=team" : ""}`, { token: user.token });
  return data;
}

export async function updateBuyerCrm(buyerId, body, user) {
  try {
    const { data } = await api(`admin/b2b/buyers/${quoteId(buyerId)}`, { token: user.token, method: "PATCH", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The buyer could not be updated.");
  }
}

export const logBuyerActivity = (buyerId, body, user) => post(`admin/b2b/buyers/${quoteId(buyerId)}/activities`, body, user, "The activity could not be saved.");
export const completeFollowupTask = (taskId, body, user) => post(`admin/b2b/followups/${quoteId(taskId)}/done`, body, user, "The follow-up could not be closed.");

// --- Buyer RFQ, seller sourcing (task #107 subtask 4; spec §7, §8, A2).
const rfqPath = (id) => `admin/b2b/rfqs/${quoteId(id)}`;

export async function getRfqForm(user) {
  const { data } = await api("admin/b2b/rfqs/form", { token: user.token });
  return data;
}

/** RFQ detail: header, lines, invites, quotations, timeline, allowed actions. Null when not found. */
export async function getRfqDetail(id, user) {
  try {
    const { data } = await api(`${rfqPath(id)}/detail`, { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getRfqComparison(id, user) {
  const { data } = await api(`${rfqPath(id)}/comparison`, { token: user.token });
  return data;
}

export async function getRfqSellerMatches(id, user) {
  const { data } = await api(`${rfqPath(id)}/seller-matches`, { token: user.token });
  return data;
}

/** Quotation form values from the RFQ sourcing; { error } when the RFQ is not ready for a quotation. */
export async function getRfqQuotationDraft(id, user) {
  try {
    const { data } = await api(`${rfqPath(id)}/quotation-draft`, { token: user.token });
    return { data };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500) return { error: error.message };
    throw error;
  }
}

export async function searchRfqBuyers(q, user) {
  try {
    const { data } = await api("admin/b2b/rfqs/buyers", { token: user.token, query: { q } });
    return { ok: true, buyers: data || [] };
  } catch (error) {
    return { ...failure(error, "Buyer search failed."), buyers: [] };
  }
}

export async function searchRfqProducts(q, user) {
  try {
    const { data } = await api("admin/b2b/rfqs/products", { token: user.token, query: { q } });
    return { ok: true, products: data || [] };
  } catch (error) {
    return { ...failure(error, "Product search failed."), products: [] };
  }
}

export async function searchRfqSellerListings(id, sellerId, q, user) {
  try {
    const { data } = await api(`${rfqPath(id)}/sellers/${quoteId(sellerId)}/listings`, { token: user.token, query: { q } });
    return { ok: true, listings: data || [] };
  } catch (error) {
    return { ...failure(error, "Listing search failed."), listings: [] };
  }
}

export const createRfq = (body, user) => post("admin/b2b/rfqs", body, user, "The RFQ could not be saved.");

export async function updateRfq(id, body, user) {
  try {
    const { data } = await api(rfqPath(id), { token: user.token, method: "PATCH", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The RFQ could not be updated.");
  }
}

export const openRfq = (id, user) => post(`${rfqPath(id)}/open`, {}, user, "The RFQ could not be opened.");
export const inviteRfqSellers = (id, sellerIds, user) => post(`${rfqPath(id)}/seller-invites`, { sellerIds }, user, "The sellers could not be invited.");
export const saveRfqSourcing = (id, body, user) => post(`${rfqPath(id)}/sourcing`, body, user, "The sourcing could not be saved.");
export const setRfqOfferListing = (id, quoteItemId, body, user) =>
  post(`${rfqPath(id)}/offers/${quoteId(quoteItemId)}/listing`, body, user, "The listing could not be set.");

// --- Supplier procurement RFQ and authorizations (task #107 subtask 4 part 2; spec C1, C9, A2).
const procPath = (id) => `admin/b2b/procurement/rfqs/${quoteId(id)}`;

export async function getProcurementOptions(user) {
  const { data } = await api("admin/b2b/procurement/options", { token: user.token });
  return data;
}

export async function listSupplierRfqs(query, user) {
  const { data } = await api("admin/b2b/procurement/rfqs", { token: user.token, query });
  return data;
}

export async function getSupplierRfq(id, user) {
  try {
    const { data } = await api(procPath(id), { token: user.token });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getProcurementSellers(user) {
  const { data } = await api("admin/b2b/procurement/sellers", { token: user.token });
  return data;
}

export async function searchProcurementListings(sellerId, q, user) {
  try {
    const { data } = await api(`admin/b2b/procurement/sellers/${quoteId(sellerId)}/listings`, { token: user.token, query: { q } });
    return { ok: true, listings: data || [] };
  } catch (error) {
    return { ...failure(error, "Listing search failed."), listings: [] };
  }
}

export const createSupplierRfq = (body, user) => post("admin/b2b/procurement/rfqs", body, user, "The supplier RFQ could not be saved.");
export const moveSupplierRfq = (id, action, user) => post(`${procPath(id)}/actions/${encodeURIComponent(action)}`, {}, user, "That did not work.");
export const inviteSupplierSellers = (id, sellerIds, user) => post(`${procPath(id)}/invite`, { sellerIds }, user, "The suppliers could not be invited.");
export const recordSupplierResponse = (id, body, user) => post(`${procPath(id)}/responses`, body, user, "The response could not be saved.");
export const mapSupplierResponseListing = (id, responseId, itemId, body, user) =>
  post(`${procPath(id)}/responses/${quoteId(responseId)}/items/${quoteId(itemId)}/listing`, body, user, "The listing could not be set.");
export const reviewSupplierResponse = (id, responseId, body, user) => post(`${procPath(id)}/responses/${quoteId(responseId)}/review`, body, user, "The review could not be saved.");
export const activateSupplierRates = (id, responseId, user) => post(`${procPath(id)}/responses/${quoteId(responseId)}/activate-rates`, {}, user, "The rates could not be activated.");

export async function listSupplierAuthorizations(query, user) {
  const { data } = await api("admin/b2b/authorizations", { token: user.token, query });
  return data;
}

export const createSupplierAuthorization = (body, user) => post("admin/b2b/authorizations", body, user, "The authorization could not be saved.");
export const decideSupplierAuthorization = (id, body, user) => post(`admin/b2b/authorizations/${quoteId(id)}/decision`, body, user, "The decision could not be saved.");

// Customer case price slabs 1 / 2 / 4 / 8+ (task #107 subtask 3).
const caseSlabPath = (sourceType, sourceId) => `admin/b2b/case-slabs/${encodeURIComponent(sourceType)}/${quoteId(sourceId)}`;

export async function getCaseSlabs(sourceType, sourceId, user) {
  const { data } = await api(caseSlabPath(sourceType, sourceId), { token: user.token });
  return data;
}

export async function saveCaseSlabs(sourceType, sourceId, body, user) {
  try {
    const { data } = await api(caseSlabPath(sourceType, sourceId), { token: user.token, method: "PUT", body });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "The case rates could not be saved.");
  }
}

/** Live carrier tracking of a B2B shipment booked at a live quote (read-only). */
export async function getShipmentTracking(shipmentId, user) {
  try {
    const { data } = await api(`admin/b2b/shipments/${quoteId(shipmentId)}/tracking`, { token: user.token });
    return { ok: true, ...data };
  } catch (error) {
    return failure(error, "Tracking could not be loaded.");
  }
}
