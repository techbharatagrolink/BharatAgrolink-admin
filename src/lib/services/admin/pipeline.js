import "server-only";
import { api, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

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
/** Call Status list from api/crm_leads/call_log.php. */
export const DISPOSITIONS = [
  "Blocked Our No.",
  "Busy – Call Later",
  "Call Rejected",
  "Dealer/Distributor Enquiry",
  "Do Not Call",
  "Follow-up Required",
  "Highly Interested",
  "Incoming Call Is Suspended",
  "Interested",
  "Language Issue",
  "Need Later",
  "No Answer",
  "No Crop has been Planted",
  "No Farming / False Lead",
  "No Requirement",
  "Not Available at Home",
  "Not Interested",
  "Not Reachable",
  "Order Confirmed",
  "Payment Pending",
  "Phone's Switchoff",
  "Product & Price Enquiry",
  "Product Suggested",
  "Purchase From Competitor/Marketplace",
  "Refused to Pay Partial / Prepaid",
  "Requested To Call Back Later",
  "Wrong / Invalid No.",
];

const ownOnly = (user) => user.role.scope === "own" && !user.role.superAdmin;

export async function getLead(id, user) {
  if (!user?.token) return null;
  try {
    const { data } = await api(`admin/crm/leads/${encodeURIComponent(id)}`, { token: user.token });
    if (!data?.lead) return null;
    return { lead: data.lead, activities: data.activities || [] };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

export async function logLeadActivity(id, input, user) {
  if (!can(user, "crm.leads", "edit")) return { ok: false, message: "You do not have permission to update leads." };
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/crm/leads/${encodeURIComponent(id)}/activities`, {
      method: "POST",
      token: user.token,
      body: {
        disposition: String(input?.disposition ?? ""),
        status: String(input?.status ?? ""),
        note: String(input?.note ?? "").trim(),
        nextFollowUp: String(input?.nextFollowUp ?? ""),
        durationSec: Number(input?.durationSec ?? 0),
      },
    });
    return { ok: true, message: data?.message || "Call logged." };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, fieldErrors: error.details?.fieldErrors };
    return { ok: false, message: "The admin API could not log that call." };
  }
}

export async function getBuyer(id, user) {
  if (!user?.token) return null;
  try {
    const { data } = await api(`admin/b2b/buyers/${encodeURIComponent(id)}`, { token: user.token });
    if (!data?.buyer || (ownOnly(user) && data.buyer.owner !== user.name)) return null;
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getB2BOrder(id, user) {
  if (!user?.token) return null;
  try {
    const { data } = await api(`admin/b2b/orders/${encodeURIComponent(id)}`, { token: user.token });
    if (!data?.order || (ownOnly(user) && data.order.owner && data.order.owner !== user.name)) return null;
    // Margin follows the role's B2B margin rights (the API also withholds it); settlements need B2B finance.
    const showFinance = Boolean(user.b2b?.canViewMargin);
    const showSettlements = can(user, "b2b.finance");
    return {
      ...data,
      showFinance,
      order: showFinance ? data.order : { ...data.order, sellerCost: null, platformRevenue: null, contribution: null },
      quotation: data.quotation && !showFinance ? { ...data.quotation, takeRate: null, cmPercent: null } : data.quotation,
      settlements: showSettlements ? data.settlements : [],
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
