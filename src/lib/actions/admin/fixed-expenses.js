"use server";

import { revalidatePath } from "next/cache";
import { assertExport, getCurrentAdmin } from "@/lib/auth/session";
import { getFixedExpenses, runFixedExpenseAction, saveFixedExpense } from "@/lib/services/admin/fixed-expenses";
import { collectPages } from "@/lib/services/admin/_export";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const PATH = "/admin/finance/fixed-expenses";

/** Every fixed expense of the month / filters on screen (DataTable onExport). Super admins only. */
export async function exportFixedExpensesAction(params) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  const filters = {};
  for (const key of ["month", "q", "category"]) if (typeof params?.[key] === "string") filters[key] = params[key].slice(0, 120);
  return collectPages(async (page, pageSize) => {
    const result = await getFixedExpenses({ ...filters, page: String(page), pageSize: String(pageSize) }, auth.user);
    return result.ok ? { rows: result.data?.rows, total: result.data?.total } : result;
  });
}

export async function saveFixedExpenseAction(id, values, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!values || typeof values !== "object") return { ok: false, message: "Invalid request." };
  const recordId = typeof id === "string" || typeof id === "number" ? id : null;
  const result = await saveFixedExpense(recordId, values, typeof reason === "string" ? reason : "", user);
  if (result.ok) revalidatePath(PATH);
  return result;
}

export async function fixedExpenseAction(actionId, ids, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (typeof actionId !== "string") return { ok: false, message: "Invalid request." };
  const idList = Array.isArray(ids) ? ids.filter((id) => typeof id === "string" || typeof id === "number") : [];
  const result = await runFixedExpenseAction(actionId, idList, typeof reason === "string" ? reason : "", user);
  if (result.ok) revalidatePath(PATH);
  return result;
}
