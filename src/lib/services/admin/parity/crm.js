import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * CRM lead pages and sales performance screens ported from PHP (API /admin/parity/crm):
 *   add lead + sheet import, engagement / bulk-inquiry conversion, my leads, unassigned,
 *   dead and report-requested leads, customer search tracking, my / team sales performance.
 */

const BASE = "admin/parity/crm";

async function get(path, user, query) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, query });
  return data;
}

async function send(path, user, method, body) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, method, body });
  return data;
}

/** For mutations and on-demand reads called from server actions: never throws. */
async function attempt(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, status: error.status };
    return { ok: false, message: "The CRM service could not be reached." };
  }
}

export const getAddLeadOptions = (user) => get("add-lead/options", user);
export const addLead = (input, user) => attempt(() => send("add-lead", user, "POST", input));
export const importLeads = (input, user) => attempt(() => send("add-lead/import", user, "POST", input));

export const getEngagement = (query, user) => get("convert/engagement", user, query);
export const convertEngagement = (items, user) => attempt(() => send("convert/engagement", user, "POST", { items }));
export const getBulkInquiries = (query, user) => get("convert/bulk", user, query);
export const convertBulkInquiries = (input, user) => attempt(() => send("convert/bulk", user, "POST", input));

export const getAgentLeads = (query, user) => get("agent-leads", user, query);
export const agentLeadAction = (input, user) => attempt(() => send("agent-leads/action", user, "POST", input));
export const saveAgentZones = (zones, user) => attempt(() => send("agent-leads/zones", user, "PUT", { zones }));

export const getUnassignedLeads = (query, user) => get("unassigned", user, query);
export const unassignedLeadAction = (input, user) => attempt(() => send("unassigned/action", user, "POST", input));
export const getDeadLeads = (query, user) => get("dead", user, query);
export const deadLeadAction = (input, user) => attempt(() => send("dead/action", user, "POST", input));
export const getRequestedLeads = (query, user) => get("requested", user, query);
export const requestedLeadAction = (input, user) => attempt(() => send("requested/action", user, "POST", input));

export const getLeadReports = (id, user) => attempt(() => get(`leads/${id}/reports`, user));
export const getLeadTimeline = (id, user) => attempt(() => get(`leads/${id}/timeline`, user));
export const getCustomerReport = (mobile, user) => attempt(() => get("customer-report", user, { mobile }));

export const getTracking = (query, user) => get("tracking", user, query);
export const exportTracking = (query, user) => attempt(() => get("tracking/export", user, query));
export const getTrackingCustomers = (query, user) => attempt(() => get("tracking/customers", user, query));

export const getMyPerformance = (query, user) => get("my-performance", user, query);
export const getTeamPerformance = (user) => get("team-performance", user);
export const getAgentPerformance = (id, user) => attempt(() => get(`team-performance/agents/${id}`, user));
export const getSalesByLeads = (query, user) => attempt(() => get("team-performance/sales-by-leads", user, query));
