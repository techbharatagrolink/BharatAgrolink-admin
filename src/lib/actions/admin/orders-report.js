"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { saveOrderReportOverride } from "@/lib/services/admin/orders-report";

const str = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function amount(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return undefined;
  return number;
}

export async function saveOrderReportOverrideAction(input) {
  const gate = await assertPermission("orders.transactions", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const body = {
    orderId: str(input?.orderId, 80),
    productId: str(input?.productId, 80),
    sku: str(input?.sku, 120),
    vendorId: str(input?.vendorId, 100),
    commissionPct: amount(input?.commissionPct),
    adPct: amount(input?.adPct),
    officePct: amount(input?.officePct),
    profitPct: amount(input?.profitPct),
    totalNrv: amount(input?.totalNrv),
    gross: amount(input?.gross),
  };
  if (!body.orderId || !body.productId || !body.vendorId) return { ok: false, message: "Choose a delivered order line." };
  if (Object.values(body).includes(undefined)) return { ok: false, message: "Amounts must be zero or greater." };
  const result = await saveOrderReportOverride(body, gate.user);
  if (result.ok) revalidatePath("/admin/orders/report");
  return result.ok ? { ok: true, message: result.data?.message || "Manual override saved." } : result;
}
