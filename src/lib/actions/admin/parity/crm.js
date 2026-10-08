"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  addLead,
  agentLeadAction,
  convertBulkInquiries,
  convertEngagement,
  deadLeadAction,
  exportTracking,
  getAgentPerformance,
  getCustomerReport,
  getLeadReports,
  getLeadTimeline,
  getSalesByLeads,
  getTrackingCustomers,
  importLeads,
  requestedLeadAction,
  saveAgentZones,
  unassignedLeadAction,
} from "@/lib/services/admin/parity/crm";

const invalid = (message = "Invalid request.") => ({ ok: false, message });
const str = (v, max = 200) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const ids = (list) => (Array.isArray(list) ? list.map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 500) : []);
const YMD = /^\d{4}-\d{2}-\d{2}$/;

/* Pages whose lead tables open the reports / timeline / customer report modals. */
const LEAD_PERMISSIONS = ["crm.agentLeads", "crm.unassigned", "crm.dead", "crm.requested"];

/** Unwraps a service result into { ok, message, ...data } for the client. */
function done(result, fallback) {
  if (!result.ok) return result;
  return { ok: true, message: result.data?.message || fallback, ...result.data };
}

export async function addLeadAction(input) {
  const auth = await assertPermission("crm.addLead", "add");
  if (!auth.ok) return auth;
  const body = { name: str(input?.name, 150), mobile: str(input?.mobile, 10), source: str(input?.source, 100), agentId: str(input?.agentId, 20) || undefined };
  if (!body.name || !body.mobile || !body.source) return invalid("Please fill all required fields.");
  if (!/^\d{10}$/.test(body.mobile)) return invalid("Phone number must be exactly 10 digits.");
  const result = done(await addLead(body, auth.user), "Lead added successfully!");
  if (result.ok) revalidatePath("/admin/crm");
  return result;
}

export async function importLeadsAction({ header, rows, rowOffset }) {
  const auth = await assertPermission("crm.addLead", "add");
  if (!auth.ok) return auth;
  if (!Array.isArray(header) || !Array.isArray(rows)) return invalid("The sheet could not be read.");
  const clean = (row) => (Array.isArray(row) ? row.slice(0, 100).map((c) => String(c ?? "").slice(0, 1000)) : []);
  return done(await importLeads({ header: clean(header), rows: rows.slice(0, 1000).map(clean), rowOffset: Math.max(0, Number(rowOffset) || 0) }, auth.user));
}

export async function convertEngagementAction(items) {
  const auth = await assertPermission("crm.convert", "add");
  if (!auth.ok) return auth;
  const list = (Array.isArray(items) ? items : [])
    .map((it) => ({ id: Number(it?.id), type: it?.type }))
    .filter((it) => Number.isInteger(it.id) && it.id > 0 && ["cart", "viewed"].includes(it.type))
    .slice(0, 500);
  if (!list.length) return invalid("No items selected");
  const result = done(await convertEngagement(list, auth.user));
  if (result.ok) revalidatePath("/admin/crm/convert");
  return result;
}

export async function convertBulkAction(idList, agentId) {
  const auth = await assertPermission("crm.convert", "add");
  if (!auth.ok) return auth;
  const list = ids(idList);
  if (!list.length) return invalid("No items selected");
  const result = done(await convertBulkInquiries({ ids: list, agentId: str(agentId, 20) || undefined }, auth.user));
  if (result.ok) revalidatePath("/admin/crm/convert");
  return result;
}

const SCOPES = {
  agent: { permission: "crm.agentLeads", call: agentLeadAction, path: "/admin/crm/agent-leads" },
  unassigned: { permission: "crm.unassigned", call: unassignedLeadAction, path: "/admin/crm/unassigned" },
  dead: { permission: "crm.dead", call: deadLeadAction, path: "/admin/crm/dead" },
  requested: { permission: "crm.requested", call: requestedLeadAction, path: "/admin/crm/requested" },
};

export async function leadAction(scope, input) {
  const target = SCOPES[scope];
  if (!target) return invalid();
  const auth = await assertPermission(target.permission, "edit");
  if (!auth.ok) return auth;
  const body = {
    ids: ids(input?.ids),
    action: str(input?.action, 30),
    remark: str(input?.remark, 2000),
    agentId: str(input?.agentId, 20) || undefined,
    reportContent: str(input?.reportContent, 5000) || undefined,
    nextFollowUp: str(input?.nextFollowUp, 25) || undefined,
  };
  if (!body.ids.length) return invalid("No leads selected");
  if (!body.action) return invalid("Please select an action.");
  if (!body.remark) return invalid("Remark is required.");
  const result = done(await target.call(body, auth.user));
  if (result.ok) revalidatePath(target.path);
  return result;
}

export async function saveZonesAction(zones) {
  const auth = await assertPermission("crm.agentLeads", "view");
  if (!auth.ok) return auth;
  const list = (Array.isArray(zones) ? zones : []).map((z) => str(z, 5)).filter(Boolean);
  if (!list.length) return invalid("Select at least one Zone");
  const result = done(await saveAgentZones(list, auth.user));
  if (result.ok) revalidatePath("/admin/crm/agent-leads");
  return result;
}

async function leadModalAuth(permission) {
  if (!LEAD_PERMISSIONS.includes(permission)) return invalid();
  return assertPermission(permission, "view");
}

export async function leadReportsAction(permission, leadId) {
  const auth = await leadModalAuth(permission);
  if (!auth.ok) return auth;
  const [id] = ids([leadId]);
  if (!id) return invalid("Invalid Lead ID");
  return getLeadReports(id, auth.user);
}

export async function leadTimelineAction(permission, leadId) {
  const auth = await leadModalAuth(permission);
  if (!auth.ok) return auth;
  const [id] = ids([leadId]);
  if (!id) return invalid("Invalid Lead ID");
  return getLeadTimeline(id, auth.user);
}

export async function customerReportAction(permission, mobile) {
  const auth = await leadModalAuth(permission);
  if (!auth.ok) return auth;
  const value = str(mobile, 20);
  if (!value) return invalid("Invalid Mobile Number");
  return getCustomerReport(value, auth.user);
}

const TRACKING_KEYS = ["view", "sort", "activity", "term", "product", "sku", "phone", "name", "userType", "source", "device", "city", "minTimes", "from", "to"];

export async function exportTrackingAction(params) {
  const auth = await assertPermission("crm.tracking", "view");
  if (!auth.ok) return auth;
  const query = Object.fromEntries(TRACKING_KEYS.map((k) => [k, str(params?.[k], 200)]).filter(([, v]) => v));
  const result = await exportTracking(query, auth.user);
  return result.ok ? { ok: true, rows: result.data.rows } : result;
}

export async function trackingCustomersAction({ productId, term }) {
  const auth = await assertPermission("crm.tracking", "view");
  if (!auth.ok) return auth;
  const query = productId ? { productId: str(productId, 100) } : { term: str(term, 200) };
  if (!query.productId && !query.term) return invalid("product_id or search_term is required");
  return getTrackingCustomers(query, auth.user);
}

export async function agentPerformanceAction(agentId) {
  const auth = await assertPermission("sales.teamPerformance", "view");
  if (!auth.ok) return auth;
  const [id] = ids([agentId]);
  if (!id) return invalid("Agent ID required");
  return getAgentPerformance(id, auth.user);
}

export async function salesByLeadsAction({ type, from, to }) {
  const auth = await assertPermission("sales.teamPerformance", "view");
  if (!auth.ok) return auth;
  const query = { type: type === "today" ? "today" : "total" };
  if (query.type === "total" && YMD.test(from || "") && YMD.test(to || "")) Object.assign(query, { from, to });
  return getSalesByLeads(query, auth.user);
}
