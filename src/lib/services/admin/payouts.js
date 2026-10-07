import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { validateReason } from "@/lib/validation/admin/forms";
import { maskAccount } from "@/lib/format";
import { api, ApiError } from "@/lib/api";
import { mockLatency, sum } from "./_query";

function liveError(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message };
}

/**
 * Vendor payouts. Planned APIs:
 *   GET  /api/admin/payouts/{id}
 *   POST /api/admin/payouts/{id}/hold | release
 *   POST /api/admin/payouts/{id}/mark-paid   { transactionId, proofFile, reason }
 * The payable amount is the sum of item BSA computed on the server; the
 * client never sends an amount. Only users with payouts:edit can pay.
 */

const UTR = /^[A-Z0-9]{10,22}$/;

export async function getPayout(id, user) {
  if (user?.token) {
    try {
      const { data } = await api(`admin/payouts/${encodeURIComponent(id)}`, { token: user.token });
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }
  await mockLatency();
  const s = getStore();
  const p = s.payouts.find((x) => x.id === id);
  if (!p) return null;
  const items = s.payoutItems.filter((i) => i.payoutId === id);
  const vendor = s.vendors.find((v) => v.id === p.vendorId);
  return {
    payout: { ...p },
    vendor: vendor ? { id: vendor.id, name: vendor.name, bank: `${maskAccount(vendor.bankAccount)} · ${vendor.ifsc}`, kyc: vendor.kyc, status: vendor.status } : null,
    items: items.map((i) => ({ ...i })),
    totals: { gross: sum(items, "gross"), taxable: sum(items, "taxable"), nrv: sum(items, "nrv"), tcs: sum(items, "tcs"), bsa: sum(items, "bsa"), serviceExGst: sum(items, "serviceExGst") },
    history: s.auditLog.filter((a) => a.entity === id),
  };
}

export async function payoutAction(id, action, input, user) {
  if (!can(user, "payouts", "edit")) return { ok: false, message: "You do not have permission to change payouts." };
  const reason = validateReason(input?.reason, true);
  if (!reason.ok) return { ok: false, message: reason.error };
  if (user?.token) {
    try {
      const { data } = await api(`admin/payouts/${encodeURIComponent(id)}/actions`, {
        method: "POST",
        token: user.token,
        body: { action, reason: reason.reason || "", transactionId: String(input?.transactionId ?? "").trim(), proofName: String(input?.proofName ?? "").trim() },
      });
      return data;
    } catch (error) {
      return liveError(error, "Could not update the payout.");
    }
  }
  const s = getStore();
  const p = s.payouts.find((x) => x.id === id);
  if (!p) return { ok: false, message: "Payout not found." };
  const items = s.payoutItems.filter((i) => i.payoutId === id);
  const vendor = s.vendors.find((v) => v.id === p.vendorId);

  if (action === "hold") {
    if (p.status !== "Pending") return { ok: false, message: "Only pending payouts can be put on hold." };
    p.status = "On Hold";
    items.forEach((i) => i.status !== "Paid" && (i.status = "On Hold"));
  } else if (action === "release") {
    if (p.status !== "On Hold") return { ok: false, message: "This payout is not on hold." };
    p.status = "Pending";
    items.forEach((i) => i.status === "On Hold" && (i.status = "Pending"));
  } else if (action === "pay") {
    if (p.status !== "Pending") return { ok: false, message: "Only pending payouts can be marked paid. Release the hold first." };
    if (!vendor || vendor.status !== "Active" || vendor.kyc !== "Verified") return { ok: false, message: "Vendor must be active with verified KYC before payment." };
    const utr = String(input?.transactionId ?? "").trim().toUpperCase();
    if (!UTR.test(utr)) return { ok: false, message: "Enter a valid bank UTR / transaction ID (10–22 letters or digits)." };
    if (s.payouts.some((x) => x.transactionId === utr && x.id !== id)) return { ok: false, message: "This transaction ID is already used on another payout." };
    const proof = String(input?.proofName ?? "").trim();
    if (!/\.(pdf|png|jpe?g)$/i.test(proof)) return { ok: false, message: "Attach the payment proof (PDF or image)." };
    p.status = "Paid";
    p.transactionId = utr;
    p.paidAt = new Date().toISOString();
    p.proof = proof;
    items.forEach((i) => {
      i.status = "Paid";
      i.transactionId = utr;
    });
  } else return { ok: false, message: "Unknown action." };

  await mockLatency(200);
  appendAudit({ actorId: user.id, actor: user.name, module: "Payouts", action: action === "pay" ? `Marked payout paid (₹${p.bsa})` : action === "hold" ? "Put payout on hold" : "Released payout hold", entity: id, after: { status: p.status, transactionId: p.transactionId }, reason: reason.reason });
  return { ok: true, message: action === "pay" ? `Payout ${id} marked paid with UTR ${p.transactionId}.` : action === "hold" ? "Payout put on hold." : "Hold released." };
}
