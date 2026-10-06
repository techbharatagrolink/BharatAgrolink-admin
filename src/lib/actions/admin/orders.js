"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { changeLineStatus, createManualOrder } from "@/lib/services/admin/orders";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

export async function changeLineStatusAction(orderId, lineId, status, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (typeof orderId !== "string" || typeof status !== "string") return { ok: false, message: "Invalid request." };
  const result = await changeLineStatus({ orderId, lineId, status, reason: typeof reason === "string" ? reason : "" }, user);
  if (result.ok) revalidatePath(`/admin/orders/${orderId}`);
  return result;
}

export async function createManualOrderAction(input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (!input || typeof input !== "object") return { ok: false, message: "Invalid request." };
  return createManualOrder(
    {
      customerId: String(input.customerId ?? ""),
      paymentMode: String(input.paymentMode ?? ""),
      salesman: input.salesman ? String(input.salesman) : null,
      items: Array.isArray(input.items) ? input.items.map((i) => ({ productId: String(i?.productId ?? ""), qty: i?.qty })) : [],
    },
    user,
  );
}
