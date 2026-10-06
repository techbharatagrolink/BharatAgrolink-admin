import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { NOW } from "@/lib/mock/admin/seed";
import { mockLatency } from "./_query";

/**
 * Helpdesk. Planned APIs:
 *   GET   /api/admin/support/tickets/{id}
 *   POST  /api/admin/support/tickets/{id}/messages   { message, internal }
 *   PATCH /api/admin/support/tickets/{id}            { status, department, priority, assignee }
 * Internal notes are stored with internal=true and are never returned to the
 * customer/vendor apps.
 */

export const TICKET_STATUSES = ["Open", "In-Progress", "Awaiting Response", "Resolved", "Closed", "Rejected"];
export const DEPARTMENTS = ["Finance", "Logistics", "Tech", "Vendor Support", "Unassigned"];
export const PRIORITIES = ["Normal", "Urgent"];
export const ASSIGNEES = ["Kunal (Support)", "Ayesha (Support)", "Finance Desk", "Logistics Desk"];

export async function getTicket(id) {
  await mockLatency();
  const s = getStore();
  const t = s.tickets.find((x) => x.id === id);
  if (!t) return null;
  const order = t.orderId ? s.orders.find((o) => o.id === t.orderId) : null;
  return {
    ticket: { ...t, slaBreached: !["Resolved", "Closed", "Rejected"].includes(t.status) && new Date(t.slaDeadline).getTime() < NOW },
    messages: s.ticketMessages.filter((m) => m.ticketId === id).sort((a, b) => (a.at < b.at ? -1 : 1)),
    order: order ? { id: order.id, status: order.status, total: order.total } : null,
  };
}

export async function addTicketMessage(id, rawMessage, internal, user) {
  if (!can(user, "support", "edit") && !can(user, "support", "add")) return { ok: false, message: "You do not have permission to reply to tickets." };
  const s = getStore();
  const t = s.tickets.find((x) => x.id === id);
  if (!t) return { ok: false, message: "Ticket not found." };
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
  if (message.length < 2) return { ok: false, message: "Write a message first." };
  if (message.length > 4000) return { ok: false, message: "Message is too long (max 4000 characters)." };
  if (["Closed", "Rejected"].includes(t.status) && !internal) return { ok: false, message: "Reopen the ticket before replying to the requester." };
  await mockLatency(150);
  s.ticketMessages.push({ id: `${id}-${Date.now()}`, ticketId: id, senderType: "admin", sender: user.name, message, internal: Boolean(internal), at: new Date().toISOString() });
  if (!internal && t.status === "Open") t.status = "In-Progress";
  appendAudit({ actorId: user.id, actor: user.name, module: "Support", action: internal ? "Added internal note" : "Replied to requester", entity: id });
  return { ok: true, message: internal ? "Internal note added." : "Reply sent." };
}

export async function updateTicket(id, input, user) {
  if (!can(user, "support", "edit")) return { ok: false, message: "You do not have permission to update tickets." };
  const s = getStore();
  const t = s.tickets.find((x) => x.id === id);
  if (!t) return { ok: false, message: "Ticket not found." };
  const patch = {};
  if (input.status != null) {
    if (!TICKET_STATUSES.includes(input.status)) return { ok: false, message: "Invalid status." };
    patch.status = input.status;
  }
  if (input.department != null) {
    if (!DEPARTMENTS.includes(input.department)) return { ok: false, message: "Invalid department." };
    patch.department = input.department;
  }
  if (input.priority != null) {
    if (!PRIORITIES.includes(input.priority)) return { ok: false, message: "Invalid priority." };
    patch.priority = input.priority;
  }
  if (input.assignee != null) {
    if (input.assignee !== "" && !ASSIGNEES.includes(input.assignee)) return { ok: false, message: "Invalid assignee." };
    patch.assignee = input.assignee || null;
  }
  if (!Object.keys(patch).length) return { ok: false, message: "Nothing to update." };
  if (patch.status === "Rejected" && String(input.reason ?? "").trim().length < 5) return { ok: false, message: "Give a reason for rejecting the ticket." };
  await mockLatency(150);
  const before = { status: t.status, department: t.department, priority: t.priority, assignee: t.assignee };
  Object.assign(t, patch);
  appendAudit({ actorId: user.id, actor: user.name, module: "Support", action: `Updated ticket (${Object.keys(patch).join(", ")})`, entity: id, before, after: patch, reason: input.reason ? String(input.reason).slice(0, 500) : null });
  return { ok: true, message: "Ticket updated." };
}
