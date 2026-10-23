import "server-only";
import { api, ApiError } from "@/lib/api";

export const PAYMENT_ATTEMPT_PERMISSION = "orders.paymentAttempts";

export const ATTEMPT_STATUSES = [
  { value: "Payment Pending", label: "Payment Pending" },
  { value: "Payment Failed", label: "Payment Failed" },
  { value: "Payment Expired", label: "Payment Expired" },
  { value: "Payment Captured - Order Pending", label: "Captured – Order Pending" },
  { value: "Placed", label: "Placed" },
];

const BASE = "admin/orders/payment-attempts";

export async function listPaymentAttempts(user, filters = {}) {
  if (!user?.token) return { rows: [], statusCounts: {} };
  const q = new URLSearchParams();
  if (filters.status) q.set("status", filters.status);
  try {
    const { data } = await api(`${BASE}?${q}`, { token: user.token });
    return { rows: data?.rows ?? [], statusCounts: data?.statusCounts ?? {} };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return { rows: [], statusCounts: {} };
    throw err;
  }
}

export async function syncPaymentAttempt(user, pendingOrderId, body) {
  const { data } = await api(`${BASE}/${encodeURIComponent(pendingOrderId)}/sync`, {
    method: "POST",
    token: user.token,
    body,
  });
  return data;
}

export async function retryPaymentAttempt(user, pendingOrderId) {
  const { data } = await api(`${BASE}/${encodeURIComponent(pendingOrderId)}/retry`, {
    method: "POST",
    token: user.token,
  });
  return data;
}

export async function completePaymentAttempt(user, pendingOrderId, body) {
  const { data } = await api(`${BASE}/${encodeURIComponent(pendingOrderId)}/complete`, {
    method: "POST",
    token: user.token,
    body,
  });
  return data;
}

export async function failPaymentAttempt(user, pendingOrderId, body) {
  const { data } = await api(`${BASE}/${encodeURIComponent(pendingOrderId)}/fail`, {
    method: "POST",
    token: user.token,
    body,
  });
  return data;
}
