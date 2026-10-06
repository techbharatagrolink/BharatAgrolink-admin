import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { NOW } from "@/lib/mock/admin/seed";
import { mockLatency, sum } from "./_query";

/**
 * CRM lead and B2B record detail. Planned APIs:
 *   GET  /api/admin/crm/leads/{id}
 *   POST /api/admin/crm/leads/{id}/activities   { disposition, status, note, nextFollowUp, durationSec }
 *   GET  /api/admin/b2b/buyers/{id}
 *   GET  /api/admin/b2b/orders/{id}
 * "Own" roles only resolve records they own; anything else is reported as
 * not found so record ids cannot be probed.
 */

export const LEAD_STATUSES = ["New", "Called", "Interested", "Follow Up", "Not Interested", "Converted"];
export const DISPOSITIONS = ["Connected - Interested", "Requirement shared", "Call back later", "Not reachable", "Switched off", "Wrong number", "Order placed"];

const ownOnly = (user) => user.role.scope === "own" && !user.role.superAdmin;

export async function getLead(id, user) {
  await mockLatency();
  const s = getStore();
  const lead = s.leads.find((l) => l.id === id);
  if (!lead || (ownOnly(user) && lead.assignedTo !== user.name)) return null;
  return {
    lead: { ...lead, overdue: Boolean(lead.nextFollowUp) && new Date(lead.nextFollowUp).getTime() < NOW },
    activities: s.leadActivities.filter((a) => a.leadId === id).sort((a, b) => (a.at < b.at ? 1 : -1)),
  };
}

export async function logLeadActivity(id, input, user) {
  if (!can(user, "crm.leads", "edit")) return { ok: false, message: "You do not have permission to update leads." };
  const s = getStore();
  const lead = s.leads.find((l) => l.id === id);
  if (!lead || (ownOnly(user) && lead.assignedTo !== user.name)) return { ok: false, message: "Lead not found." };

  const errors = {};
  const disposition = String(input?.disposition ?? "");
  const status = String(input?.status ?? "");
  const note = String(input?.note ?? "").trim();
  const duration = Number(input?.durationSec ?? 0);
  const followRaw = String(input?.nextFollowUp ?? "");
  if (!DISPOSITIONS.includes(disposition)) errors.disposition = "Choose a call outcome.";
  if (!LEAD_STATUSES.includes(status)) errors.status = "Choose a lead status.";
  if (note.length > 1000) errors.note = "Keep notes under 1000 characters.";
  if (!Number.isInteger(duration) || duration < 0 || duration > 7200) errors.durationSec = "Duration must be 0–7200 seconds.";
  let nextFollowUp = null;
  if (["Follow Up", "Interested"].includes(status)) {
    const t = new Date(followRaw).getTime();
    if (!followRaw || Number.isNaN(t)) errors.nextFollowUp = "Set the next follow-up date.";
    else if (t < NOW - 60000) errors.nextFollowUp = "Follow-up must be in the future.";
    else nextFollowUp = new Date(t).toISOString();
  }
  if (status === "Converted" && disposition !== "Order placed") errors.disposition = "Converted leads need the “Order placed” outcome.";
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errors };

  await mockLatency(150);
  const before = { status: lead.status, nextFollowUp: lead.nextFollowUp };
  s.leadActivities.push({ id: `${id}-A${Date.now()}`, leadId: id, type: "Call", disposition, durationSec: duration, note, by: user.name, at: new Date().toISOString() });
  lead.status = status;
  lead.nextFollowUp = nextFollowUp;
  lead.attempts += 1;
  lead.lastCallAt = new Date().toISOString();
  appendAudit({ actorId: user.id, actor: user.name, module: "CRM", action: `Logged call (${disposition})`, entity: id, before, after: { status, nextFollowUp } });
  return { ok: true, message: "Call logged." };
}

export async function getBuyer(id, user) {
  await mockLatency();
  const s = getStore();
  const buyer = s.b2bBuyers.find((b) => b.id === id);
  if (!buyer || (ownOnly(user) && buyer.owner !== user.name)) return null;
  const rfqs = s.rfqs.filter((r) => r.buyerId === id);
  const orders = s.b2bOrders.filter((o) => o.buyerId === id);
  const orderIds = new Set(orders.map((o) => o.id));
  const payments = s.b2bPayments.filter((p) => orderIds.has(p.orderId));
  return {
    buyer: { ...buyer, availableCredit: Math.max(0, buyer.creditLimit - buyer.outstanding) },
    rfqs,
    quotations: s.quotations.filter((q) => rfqs.some((r) => r.id === q.rfqId)),
    orders,
    payments,
    claims: s.claims.filter((c) => orderIds.has(c.orderId)),
    totals: { orderValue: sum(orders, "value"), paid: sum(payments.filter((p) => p.status === "Paid"), "amount"), overdue: sum(payments.filter((p) => p.status === "Overdue"), "amount") },
  };
}

export async function getB2BOrder(id, user) {
  await mockLatency();
  const s = getStore();
  const order = s.b2bOrders.find((o) => o.id === id);
  if (!order || (ownOnly(user) && order.owner !== user.name)) return null;
  const showFinance = can(user, "b2b.finance");
  return {
    order: showFinance ? { ...order } : { ...order, sellerCost: null, platformRevenue: null, contribution: null },
    showFinance,
    buyer: s.b2bBuyers.find((b) => b.id === order.buyerId) ?? null,
    quotation: s.quotations.find((q) => q.id === order.quotationId) ?? null,
    payments: s.b2bPayments.filter((p) => p.orderId === id),
    settlements: showFinance ? s.b2bSettlements.filter((x) => x.orderId === id) : [],
    claims: s.claims.filter((c) => c.orderId === id),
  };
}
