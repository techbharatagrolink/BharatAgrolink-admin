"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { createQuotation, searchQuotationBuyers, searchQuotationProducts } from "@/lib/services/admin/b2b-screens";

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

export async function saveB2bQuotation(body) {
  const gate = await assertPermission("b2b.quotations", "add");
  if (!gate.ok) return { ok: false, message: gate.message, details: [] };
  const result = await createQuotation(body, gate.user);
  if (result.ok) revalidatePath("/admin/b2b/quotations");
  return result;
}
