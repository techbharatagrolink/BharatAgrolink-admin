"use server";

import { assertPermission } from "@/lib/auth/session";
import { generateCatalogue, searchCatalogueBuyers, sendCatalogue } from "@/lib/services/admin/b2b-catalog-generator";

export async function generateB2bCatalogue(body) {
  const gate = await assertPermission("b2b.catalog", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return generateCatalogue(body, gate.user);
}

export async function searchB2bCatalogueBuyers(q) {
  const gate = await assertPermission("b2b.catalog", "view");
  if (!gate.ok) return { ok: false, message: gate.message, buyers: [] };
  return searchCatalogueBuyers(String(q || "").trim().slice(0, 80), gate.user);
}

/** formData: pdf (Blob), buyer_phone, buyer_name. */
export async function sendB2bCatalogue(formData) {
  const gate = await assertPermission("b2b.catalog", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return sendCatalogue(formData, gate.user);
}
