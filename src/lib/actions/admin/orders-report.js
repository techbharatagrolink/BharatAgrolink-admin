"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { exportOrderReport, saveOrderReportOverride } from "@/lib/services/admin/orders-report";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const str = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function reportQuery(input) {
  const query = {};
  const orderId = str(input?.orderId, 80);
  const vendorId = str(input?.vendorId, 100);
  const from = str(input?.from, 10);
  const to = str(input?.to, 10);
  const month = str(input?.month, 7);
  if (orderId) query.orderId = orderId;
  if (vendorId) query.vendorId = vendorId;
  if (DATE.test(from)) query.from = from;
  if (DATE.test(to)) query.to = to;
  if (input?.cycle === "first" || input?.cycle === "second") query.cycle = input.cycle;
  if (MONTH.test(month)) query.month = month;
  return query;
}

function amount(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return undefined;
  return number;
}

export async function exportOrderReportAction(input) {
  const gate = await assertPermission("orders.transactions", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  return exportOrderReport(reportQuery(input), gate.user);
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
