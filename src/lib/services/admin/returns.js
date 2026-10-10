import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { refundAmount } from "@/lib/mock/admin/engines";
import { can } from "@/lib/auth/permissions";
import { validateReason } from "@/lib/validation/admin/forms";
import { api, apiForm, ApiError } from "@/lib/api";
import { mockLatency } from "./_query";

function liveError(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message };
}

/**
 * Returns. Planned APIs:
 *   GET  /api/admin/returns/{id}
 *   POST /api/admin/returns/{id}/approve   { pickupService, refundShipping, deductPlatformFee }
 *   POST /api/admin/returns/{id}/pickup | received | refund | replace | reject
 * The refund amount is always computed here from the order line; the client
 * only sends the two policy flags.
 */

/** The pickup cards of manage_returns.php's process modal (value = what PHP stores in pickup_service). */
export const PICKUP_SERVICES = [
  { value: "BlueDart", label: "BlueDart Pickup" },
  { value: "Delhivery", label: "Delhivery Pickup" },
  { value: "Internal", label: "Internal Courier" },
  { value: "Customer Drop-off", label: "Customer Drop-off" },
];

/** The "Add Return Request" reasons of manage_returns.php. */
export const RETURN_REASONS = ["Wrong Product", "Damaged in Transit", "Customer Didn't Like", "Exchange Requested", "Quality Issue", "Other"];

async function live(user, path, options, fallback) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(path, { token: user.token, ...options });
    return { ok: true, data };
  } catch (error) {
    return liveError(error, fallback);
  }
}

/** manage_returns.php counters (Pending, Awaiting Pickup, In Transit, Refunded). */
export async function getReturnStats(user) {
  const r = await live(user, "admin/returns/stats", {}, "Could not load the return counters.");
  return r.ok ? r.data : null;
}

export function searchReturnCustomers(search, user) {
  if (!can(user, "returns", "add")) return { ok: false, message: "You do not have permission to perform this action." };
  return live(user, "admin/returns/customers", { query: { search } }, "Could not search customers.");
}

export function returnCustomerOrders(userId, user) {
  if (!can(user, "returns", "add")) return { ok: false, message: "You do not have permission to perform this action." };
  return live(user, `admin/returns/customers/${encodeURIComponent(userId)}/orders`, {}, "Error loading orders. Please try again.");
}

/** create_return: `form` is FormData (userId, items JSON, reason, detail, attachments files). */
export async function createReturnRequest(form, user) {
  if (!can(user, "returns", "add")) return { ok: false, message: "You do not have permission to perform this action." };
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await apiForm("admin/returns", { token: user.token, formData: form });
    return { ok: true, data, message: data?.message || "Return request created successfully" };
  } catch (error) {
    return liveError(error, "Could not create the return request.");
  }
}

export function getReturnShipmentForm(id, user) {
  if (!can(user, "returns", "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  return live(user, `admin/returns/${encodeURIComponent(id)}/shipment`, {}, "Failed to load shipment data");
}

export function createReturnShipment(id, payload, user) {
  if (!can(user, "returns", "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  return live(user, `admin/returns/${encodeURIComponent(id)}/shipment`, { method: "POST", body: { payload } }, "Failed to create return shipment");
}

const NEXT = {
  Pending: ["approve", "reject"],
  "Awaiting Pickup": ["pickup", "reject"],
  "In Transit": ["received"],
  Received: ["refund", "replace"],
};

export async function getReturn(id, user) {
  if (user?.token) {
    try {
      const { data } = await api(`admin/returns/${encodeURIComponent(id)}`, { token: user.token });
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }
  await mockLatency();
  const s = getStore();
  const r = s.returns.find((x) => x.id === id);
  if (!r) return null;
  const line = s.orderItems.find((l) => l.id === r.lineId);
  const order = s.orders.find((o) => o.id === r.orderId);
  return {
    ret: { ...r },
    line: line ? { id: line.id, productId: line.productId, product: line.productName, qty: line.qty, price: line.price, taxable: line.taxable, gst: line.gst, deliveryDate: line.deliveryDate, returnLastDate: line.returnLastDate, sellerInvoice: line.sellerInvoice } : null,
    order: order ? { id: order.id, shippingFee: order.shippingFee, paymentMode: order.paymentMode } : null,
    refund: s.refunds.find((x) => x.returnId === id) ?? null,
    actions: NEXT[r.status] ?? [],
    history: s.auditLog.filter((a) => a.entity === id),
  };
}

export async function previewRefund(id, { refundShipping, deductPlatformFee }, user) {
  if (user?.token) {
    try {
      const { data } = await api(`admin/returns/${encodeURIComponent(id)}/preview`, {
        token: user.token,
        query: { refundShipping: refundShipping ? "1" : "0", deductPlatformFee: deductPlatformFee ? "1" : "0" },
      });
      return data?.amount ?? null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }
  const s = getStore();
  const r = s.returns.find((x) => x.id === id);
  const line = r && s.orderItems.find((l) => l.id === r.lineId);
  const order = r && s.orders.find((o) => o.id === r.orderId);
  if (!line) return null;
  return refundAmount({ price: line.taxable, gst: line.gst, shipping: order?.shippingFee ?? 0, refundShipping: Boolean(refundShipping), deductPlatformFee: Boolean(deductPlatformFee) });
}

export async function processReturn(id, action, input, user) {
  const permission = action === "refund" ? "refunds" : "returns";
  if (!can(user, permission, "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  if (user?.token) {
    try {
      const { data } = await api(`admin/returns/${encodeURIComponent(id)}/actions`, {
        method: "POST",
        token: user.token,
        body: {
          action,
          refundShipping: Boolean(input?.refundShipping),
          deductPlatformFee: Boolean(input?.deductPlatformFee),
          reason: input?.reason || "",
          pickupService: input?.pickupService || "",
          pickupAddress: input?.pickupAddress || "",
          expectedPickupDate: input?.expectedPickupDate || "",
          courierTrackingId: input?.courierTrackingId || "",
          internalNotes: input?.internalNotes || "",
          transactionId: input?.transactionId || "",
        },
      });
      return data;
    } catch (error) {
      return liveError(error, "Could not update the return.");
    }
  }
  const s = getStore();
  const r = s.returns.find((x) => x.id === id);
  if (!r) return { ok: false, message: "Return not found." };
  if (!(NEXT[r.status] ?? []).includes(action)) return { ok: false, message: `A return in “${r.status}” cannot be ${action}d.` };
  const needsReason = ["reject", "refund"].includes(action);
  const reason = validateReason(input?.reason, needsReason);
  if (!reason.ok) return { ok: false, message: reason.error };

  await mockLatency(200);
  const before = r.status;
  let message;
  if (action === "approve") {
    if (!PICKUP_SERVICES.some((p) => p.value === input?.pickupService)) return { ok: false, message: "Choose a pickup service." };
    r.pickupService = input.pickupService;
    r.refundShipping = Boolean(input.refundShipping);
    r.deductPlatformFee = Boolean(input.deductPlatformFee);
    r.refundAmount = await previewRefund(id, r);
    r.status = "Awaiting Pickup";
    message = `Return approved. Pickup booked with ${r.pickupService}. Refund on completion: ₹${r.refundAmount}.`;
  } else if (action === "pickup") {
    r.status = "In Transit";
    message = "Marked as picked up.";
  } else if (action === "received") {
    r.status = "Received";
    message = "Marked as received at the vendor.";
  } else if (action === "refund") {
    const existing = s.refunds.find((x) => x.returnId === id);
    if (existing) return { ok: false, message: `Refund ${existing.id} already exists for this return.` };
    const prepaid = r.paymentMode !== "COD";
    const refund = {
      id: prepaid ? `rfnd_${Date.now().toString().slice(-8)}` : `BANK-TRF-${String(s.refunds.length + 5001).padStart(6, "0")}`,
      returnId: r.id, orderId: r.orderId, customer: r.customer, amount: r.refundAmount,
      method: prepaid ? "Razorpay refund" : "Bank transfer (manual)", status: prepaid ? "Initiated" : "Pending Manual Transfer", createdAt: new Date().toISOString(),
    };
    s.refunds.unshift(refund);
    r.status = "Refunded";
    const line = s.orderItems.find((l) => l.id === r.lineId);
    if (line) line.status = "Return Completed";
    message = prepaid ? `Razorpay refund of ₹${refund.amount} initiated.` : `Manual bank transfer of ₹${refund.amount} queued for finance.`;
  } else if (action === "replace") {
    r.status = "Replacement Shipped";
    message = "Replacement order created for the vendor to ship.";
  } else if (action === "reject") {
    r.status = "Rejected";
    message = "Return rejected. The customer will be notified.";
  }
  appendAudit({ actorId: user.id, actor: user.name, module: action === "refund" ? "Refunds" : "Returns", action: `Return ${action}`, entity: id, before: { status: before }, after: { status: r.status, refundAmount: r.refundAmount }, reason: reason.reason || null });
  return { ok: true, message };
}
