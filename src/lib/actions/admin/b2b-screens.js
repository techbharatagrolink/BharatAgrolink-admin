"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  cancelQuotation,
  createOrder,
  createQuotation,
  completeQuotationFollowup,
  createQuotationLink,
  recordOrderSeller,
  transitionOrder,
  bookOrderShipment,
  getShipmentOptions,
  recordShipmentFreight,
  setShipmentProof,
  updateShipment,
  resolveQuotationChange,
  sendQuotationWhatsApp,
  recalculateQuotation,
  reviseQuotation,
  searchOrderBuyers,
  searchOrderProducts,
  searchQuotationBuyers,
  searchQuotationProducts,
  startOrderPayment,
  allocateReceipt,
  decideBuyerCredit,
  recordReceipt,
  recordRefund,
  requestBuyerCredit,
  reverseReceipt,
  setBuyerCreditStatus,
  settlementAction,
} from "@/lib/services/admin/b2b-screens";

const quotePaths = (...ids) => {
  revalidatePath("/admin/b2b/quotations");
  for (const id of ids) if (id) revalidatePath(`/admin/b2b/quotations/${id}`);
};

export async function searchB2bBuyers(q) {
  const gate = await assertPermission("b2b.quotations", "add");
  if (!gate.ok) return { ok: false, message: gate.message, buyers: [] };
  return searchQuotationBuyers(q, gate.user);
}

export async function searchB2bQuoteProducts(q) {
  const gate = await assertPermission("b2b.quotations", "add");
  if (!gate.ok) return { ok: false, message: gate.message, products: [] };
  return searchQuotationProducts(q, gate.user);
}

/** Creates a quotation, or with reviseOf a new version of that quotation (the API re-checks everything). */
export async function saveB2bQuotation(body, reviseOf = null) {
  const gate = await assertPermission("b2b.quotations", "add");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = reviseOf ? await reviseQuotation(reviseOf, body, gate.user) : await createQuotation(body, gate.user);
  if (result.ok) quotePaths(reviseOf, result.id);
  return result;
}

export async function recalculateB2bQuotation(id) {
  const gate = await assertPermission("b2b.quotations", "add");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await recalculateQuotation(id, gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

export async function cancelB2bQuotation(id, reason) {
  const gate = await assertPermission("b2b.quotations", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await cancelQuotation(id, { reason: String(reason ?? "").trim() }, gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

export async function createB2bQuotationLink(id) {
  const gate = await assertPermission("b2b.quotations", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await createQuotationLink(id, gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

export async function sendB2bQuotationWhatsApp(id) {
  const gate = await assertPermission("b2b.quotations", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await sendQuotationWhatsApp(id, gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

export async function completeB2bQuotationFollowup(id, taskId, outcome) {
  const gate = await assertPermission("b2b.quotations", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await completeQuotationFollowup(id, taskId, String(outcome ?? "").trim(), gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

export async function resolveB2bQuotationChange(id, changeId, status, note) {
  const gate = await assertPermission("b2b.quotations", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await resolveQuotationChange(id, changeId, { status, note: String(note ?? "").trim() }, gate.user);
  if (result.ok) quotePaths(id);
  return result;
}

const orderPaths = (id) => {
  revalidatePath("/admin/b2b/orders");
  revalidatePath("/admin/b2b/ops-queue");
  if (id) revalidatePath(`/admin/b2b/orders/${id}`);
};

/** Order transition (subtask 8). The API checks the state, the B2B capability and the guards. */
export async function transitionB2bOrder(id, action, body = {}) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await transitionOrder(id, action, body, gate.user);
  if (result.ok) orderPaths(id);
  return result;
}

/** Logistics (subtask 10). Capabilities (logistics.book / shipment.edit / logistics.freight) are checked by the API. */
export async function loadB2bShipmentOptions(id, packageIds) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  return getShipmentOptions(id, packageIds, gate.user);
}

export async function bookB2bShipment(id, body) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await bookOrderShipment(id, body, gate.user);
  if (result.ok) orderPaths(id);
  return result;
}

export async function updateB2bShipment(orderId, shipmentId, action, body = {}) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await updateShipment(shipmentId, action, body, gate.user);
  if (result.ok) orderPaths(orderId);
  return result;
}

export async function recordB2bShipmentFreight(orderId, shipmentId, amount, invoiceRef) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await recordShipmentFreight(shipmentId, { amount: Number(amount), invoiceRef: String(invoiceRef ?? "").trim() }, gate.user);
  if (result.ok) orderPaths(orderId);
  return result;
}

export async function setB2bShipmentProof(orderId, shipmentId, podUrl) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await setShipmentProof(shipmentId, { podUrl: String(podUrl ?? "").trim() }, gate.user);
  if (result.ok) orderPaths(orderId);
  return result;
}

export async function recordB2bOrderSeller(id, sellerId, decision, note) {
  const gate = await assertPermission("b2b.orders", "edit");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await recordOrderSeller(id, sellerId, { decision, note: String(note ?? "").trim() }, gate.user);
  if (result.ok) orderPaths(id);
  return result;
}

// --- Payment, credit and settlement (subtask 11). Finance capabilities are checked by the API. ---

const buyerPaths = (buyerId) => {
  revalidatePath("/admin/b2b/buyers");
  if (buyerId) revalidatePath(`/admin/b2b/buyers/${buyerId}`);
  revalidatePath("/admin/b2b/credit-requests");
};
const financePaths = (orderId) => {
  orderPaths(orderId);
  revalidatePath("/admin/b2b/payments");
  revalidatePath("/admin/b2b/receivables");
  revalidatePath("/admin/b2b/settlements");
};
const deny = (gate) => ({ ok: false, message: gate.message, details: [] });

export async function requestB2bCredit(buyerId, body) {
  const gate = await assertPermission("b2b.buyers", "view");
  if (!gate.ok) return deny(gate);
  const result = await requestBuyerCredit(buyerId, body, gate.user);
  if (result.ok) buyerPaths(buyerId);
  return result;
}

export async function decideB2bCredit(buyerId, requestId, body) {
  const gate = await assertPermission("b2b.buyers", "view");
  if (!gate.ok) return deny(gate);
  const result = await decideBuyerCredit(requestId, body, gate.user);
  if (result.ok) buyerPaths(buyerId);
  return result;
}

export async function setB2bCreditStatus(buyerId, body) {
  const gate = await assertPermission("b2b.buyers", "view");
  if (!gate.ok) return deny(gate);
  const result = await setBuyerCreditStatus(buyerId, body, gate.user);
  if (result.ok) buyerPaths(buyerId);
  return result;
}

export async function recordB2bReceipt(orderId, body) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return deny(gate);
  const result = await recordReceipt(body, gate.user);
  if (result.ok) financePaths(orderId);
  return result;
}

export async function allocateB2bReceipt(orderId, paymentId, body) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return deny(gate);
  const result = await allocateReceipt(paymentId, body, gate.user);
  if (result.ok) financePaths(orderId);
  return result;
}

export async function reverseB2bReceipt(orderId, paymentId, reason) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return deny(gate);
  const result = await reverseReceipt(paymentId, { reason: String(reason ?? "").trim() }, gate.user);
  if (result.ok) financePaths(orderId);
  return result;
}

export async function recordB2bRefund(orderId, body) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return deny(gate);
  const result = await recordRefund(body, gate.user);
  if (result.ok) financePaths(orderId);
  return result;
}

export async function updateB2bSettlement(orderId, settlementId, action, body = {}) {
  const gate = await assertPermission("b2b.orders", "view");
  if (!gate.ok) return deny(gate);
  const result = await settlementAction(settlementId, action, body, gate.user);
  if (result.ok) financePaths(orderId);
  return result;
}

export async function searchB2bOrderBuyers(q) {
  const gate = await assertPermission("b2b.orders", "add");
  if (!gate.ok) return { ok: false, message: gate.message, buyers: [] };
  return searchOrderBuyers(q, gate.user);
}

export async function searchB2bOrderProducts(q) {
  const gate = await assertPermission("b2b.orders", "add");
  if (!gate.ok) return { ok: false, message: gate.message, products: [] };
  return searchOrderProducts(q, gate.user);
}

export async function startB2bOrderPayment(body) {
  const gate = await assertPermission("b2b.orders", "add");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  return startOrderPayment(body, gate.user);
}

export async function saveB2bOrder(body) {
  const gate = await assertPermission("b2b.orders", "add");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await createOrder(body, gate.user);
  if (result.ok) revalidatePath("/admin/b2b/orders");
  return result;
}
