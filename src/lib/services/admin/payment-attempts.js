import "server-only";
import { api, ApiError } from "@/lib/api";
import { mockLatency } from "./_query";
import { getStore } from "@/lib/mock/admin/store";

function demoAttempts() {
  return [
    { id: 1, pendingOrderId: "BAO-PEND-001", adminId: "admin1", paymentMode: "online", amount: 5000, razorpayOrderId: "order_ABC123", razorpayPaymentId: "pay_XYZ789", status: "Payment Pending", failureReason: null, createdAt: "2026-10-10T10:30:00Z", updatedAt: "2026-10-10T10:30:00Z" },
    { id: 2, pendingOrderId: "BAO-PEND-002", adminId: "admin1", paymentMode: "online", amount: 12000, razorpayOrderId: "order_DEF456", razorpayPaymentId: "pay_UVW012", status: "Payment Captured - Order Pending", failureReason: null, createdAt: "2026-10-11T14:22:00Z", updatedAt: "2026-10-11T14:25:00Z" },
    { id: 3, pendingOrderId: "BAO-PEND-003", adminId: "admin2", paymentMode: "upi", amount: 3500, razorpayOrderId: "order_GHI789", razorpayPaymentId: null, status: "Payment Failed", failureReason: "Insufficient funds", createdAt: "2026-10-12T09:15:00Z", updatedAt: "2026-10-12T09:16:00Z" },
    { id: 4, pendingOrderId: "BAO-PEND-004", adminId: "admin1", paymentMode: "card", amount: 8750, razorpayOrderId: "order_JKL012", razorpayPaymentId: null, status: "Payment Expired", failureReason: "Payment was not completed within the allowed time.", createdAt: "2026-10-13T16:45:00Z", updatedAt: "2026-10-13T17:00:00Z" },
    { id: 5, pendingOrderId: "BAO-PEND-005", adminId: "admin3", paymentMode: "online", amount: 22000, razorpayOrderId: "order_MNO345", razorpayPaymentId: "pay_PQR678", status: "Placed", failureReason: null, createdAt: "2026-10-14T11:00:00Z", updatedAt: "2026-10-14T11:02:00Z" },
    { id: 6, pendingOrderId: "BAO-PEND-006", adminId: "admin2", paymentMode: "netbanking", amount: 1500, razorpayOrderId: "order_STU678", razorpayPaymentId: null, status: "Payment Failed", failureReason: "Bank declined transaction", createdAt: "2026-10-14T15:30:00Z", updatedAt: "2026-10-14T15:31:00Z" },
  ];
}

export async function listPaymentAttempts(user, filters = {}) {
  if (user?.token) {
    try {
      const query = new URLSearchParams();
      if (filters.status) query.set("status", filters.status);
      const { data } = await api(`admin/orders/payment-attempts?${query}`, { token: user.token });
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return { rows: [], total: 0 };
      throw error;
    }
  }

  await mockLatency();
  let rows = demoAttempts();

  if (filters.status) {
    rows = rows.filter((r) => r.status === filters.status);
  }

  return { rows, total: rows.length };
}