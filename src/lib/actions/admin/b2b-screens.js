"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  cancelQuotation,
  createOrder,
  createQuotation,
  completeQuotationFollowup,
  createQuotationLink,
  resolveQuotationChange,
  sendQuotationWhatsApp,
  recalculateQuotation,
  reviseQuotation,
  searchOrderBuyers,
  searchOrderProducts,
  searchQuotationBuyers,
  searchQuotationProducts,
  startOrderPayment,
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
