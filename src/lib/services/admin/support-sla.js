import "server-only";
import { can } from "@/lib/auth/permissions";
import { api, ApiError } from "@/lib/api";

/**
 * Support SLA tracking (support/admin_dashboard.php + calculateSLA()):
 *   GET   /admin/support/sla                        overview by team / priority / agent
 *   GET   /admin/support/sla/tickets                breached / at-risk list with filters
 *   GET   /admin/support/sla/teams                  Operations (operations_agents) and Sales rosters
 *   POST  /admin/support/sla/tickets/{id}/assign    { team, agentId, department, reason }
 *   POST  /admin/support/sla/tickets/{id}/escalate  { reason, team, agentId }
 *   PATCH /admin/support/sla/tickets/{id}/deadline  { deadline | recalculate, reason }
 * There is no mock fallback: without the API the page shows "Not connected".
 */

export const SLA_STATES = [
  { value: "attention", label: "Breached + at risk" },
  { value: "breached", label: "Breached" },
  { value: "at_risk", label: "At risk" },
  { value: "on_track", label: "On track" },
  { value: "no_sla", label: "No deadline" },
  { value: "open", label: "All open" },
  { value: "met", label: "Closed within SLA" },
  { value: "missed", label: "Closed late" },
  { value: "closed", label: "All closed" },
  { value: "all", label: "All tickets" },
];

const FILTER_KEYS = ["state", "team", "department", "priority", "status", "agentId", "q", "from", "to", "page", "limit"];

export function slaFilters(searchParams = {}) {
  const out = {};
  for (const key of FILTER_KEYS) {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value != null && String(value).trim() !== "") out[key] = String(value).trim();
  }
  return out;
}

const notConnected = (user) => (user?.token ? null : new ApiError("The admin API session is missing.", { status: 0 }));

export async function getSlaScreen(user, filters) {
  const missing = notConnected(user);
  if (missing) return { error: missing };
  const range = { from: filters.from, to: filters.to };
  try {
    const [overview, tickets, teams] = await Promise.all([
      api("admin/support/sla", { token: user.token, query: range }),
      api("admin/support/sla/tickets", { token: user.token, query: filters }),
      api("admin/support/sla/teams", { token: user.token }),
    ]);
    return { overview: overview.data, tickets: tickets.data ?? [], meta: tickets.meta, teams: teams.data };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new ApiError("The admin API is not reachable.", { status: 0 }) };
  }
}

/** Assignee choices shared by the SLA page and the ticket detail screen: "operations:<id>" / "sales:<id>". */
export async function getTicketAssignees(user) {
  if (!user?.token) return null;
  try {
    const { data } = await api("admin/support/sla/teams", { token: user.token });
    return {
      enabled: Boolean(data?.assignmentsEnabled),
      options: (data?.teams ?? []).flatMap((team) => [
        { value: team.key, label: `${team.label} team (no agent)` },
        ...team.members.map((m) => ({ value: `${team.key}:${m.id}`, label: `${m.name} · ${team.label}` })),
      ]),
    };
  } catch {
    return null;
  }
}

async function send(path, method, body, user, fallback) {
  if (!can(user, "support.settings", "edit")) return { ok: false, message: "You do not have permission to change ticket SLA." };
  if (!user?.token) return { ok: false, message: "The admin API is not connected." };
  try {
    const { data } = await api(path, { method, token: user.token, body });
    return { ok: true, message: data?.message || "Saved.", ticket: data?.ticket ?? null };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : fallback };
  }
}

export function assignSlaTicket(id, input, user) {
  return send(`admin/support/sla/tickets/${encodeURIComponent(id)}/assign`, "POST", input, user, "Could not reassign the ticket.");
}

export function escalateSlaTicket(id, input, user) {
  return send(`admin/support/sla/tickets/${encodeURIComponent(id)}/escalate`, "POST", input, user, "Could not escalate the ticket.");
}

export function updateSlaDeadline(id, input, user) {
  return send(`admin/support/sla/tickets/${encodeURIComponent(id)}/deadline`, "PATCH", input, user, "Could not change the SLA deadline.");
}
