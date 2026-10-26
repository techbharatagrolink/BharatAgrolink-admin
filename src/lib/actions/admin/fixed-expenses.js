"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { runFixedExpenseAction, saveFixedExpense } from "@/lib/services/admin/fixed-expenses";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const PATH = "/admin/finance/fixed-expenses";

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
