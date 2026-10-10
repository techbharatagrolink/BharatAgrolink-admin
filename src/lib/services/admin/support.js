import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { NOW } from "@/lib/mock/admin/seed";
import { api, apiForm, ApiError } from "@/lib/api";
import { mockLatency } from "./_query";

function liveError(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message };
}

/**
 * Helpdesk (PHP support/admin_ticket_details.php + admin_api_chat.php). APIs:
 *   GET   /api/admin/support/{id}            ticket, requester profile, messages, realtime (Pusher) settings
 *   POST  /api/admin/support/{id}/messages   multipart: message, internal, image (optional)
 *   PATCH /api/admin/support/{id}            { status, department } - notifies the ticket creator
 * Internal notes are stored with is_internal=1; the customer/vendor chat pages skip them.
 */

export const TICKET_STATUSES = ["Open", "In-Progress", "Awaiting Response", "Resolved", "Closed", "Rejected"];
export const DEPARTMENTS = ["Finance", "Logistics", "Tech", "Vendor Support", "Unassigned"];
export const PRIORITIES = ["Normal", "Urgent"];
export const ASSIGNEES = ["Kunal (Support)", "Ayesha (Support)", "Finance Desk", "Logistics Desk"];

/** The choices of the PHP "Admin Controls" form, in its order. */
export const CONTROL_STATUSES = ["Open", "In-Progress", "Resolved", "Closed"];
export const CONTROL_DEPARTMENTS = ["Vendor Support", "Logistics", "Finance", "Tech"];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function getTicket(id, user) {
  if (user?.token) {
    try {
      const { data } = await api(`admin/support/${encodeURIComponent(id)}`, { token: user.token });
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }
  await mockLatency();
  const s = getStore();
  const t = s.tickets.find((x) => x.id === id);
  if (!t) return null;
  const order = t.orderId ? s.orders.find((o) => o.id === t.orderId) : null;
  return {
    ticket: { ...t, description: t.description ?? "", slaBreached: !["Resolved", "Closed", "Rejected"].includes(t.status) && new Date(t.slaDeadline).getTime() < NOW },
    requester: { type: t.userType, name: t.user, phone: null, email: null, gstNumber: null, address: null, joinedAt: null },
    messages: s.ticketMessages
      .filter((m) => m.ticketId === id)
      .sort((a, b) => (a.at < b.at ? -1 : 1))
      .map((m) => ({ ...m, senderId: m.senderType === "admin" ? user?.id : 0, attachmentUrl: m.attachmentUrl ?? null })),
    order: order ? { id: order.id, status: order.status, total: order.total } : null,
    viewer: { id: user?.id, type: "admin" },
    realtime: null,
  };
}

/** input: { message, internal, image (File | null) }. Returns { ok, message, item } - item is the stored message. */
export async function addTicketMessage(id, input, user) {
  if (!can(user, "support", "edit") && !can(user, "support", "add")) return { ok: false, message: "You do not have permission to reply to tickets." };
  const message = typeof input?.message === "string" ? input.message.trim() : "";
  const internal = Boolean(input?.internal);
  const image = input?.image ?? null;
  if (!message) return { ok: false, message: "Write a message first." };
  if (message.length > 4000) return { ok: false, message: "Message is too long (max 4000 characters)." };
  if (image && image.size > MAX_IMAGE_BYTES) return { ok: false, message: "The image must be 5 MB or smaller." };
  if (user?.token) {
    const formData = new FormData();
    formData.set("message", message);
    formData.set("internal", internal ? "1" : "0");
    if (image) formData.set("image", image, image.name || "image");
    try {
      const { data } = await apiForm(`admin/support/${encodeURIComponent(id)}/messages`, { token: user.token, formData });
      return data;
    } catch (error) {
      return liveError(error, "Could not send the message.");
    }
  }
  const s = getStore();
  const t = s.tickets.find((x) => x.id === id);
  if (!t) return { ok: false, message: "Ticket not found." };
  await mockLatency(150);
  const item = { id: `${id}-${Date.now()}`, ticketId: id, senderId: user.id, senderType: "admin", sender: user.name, message, internal, attachmentUrl: null, at: new Date().toISOString() };
  s.ticketMessages.push(item);
  appendAudit({ actorId: user.id, actor: user.name, module: "Support", action: internal ? "Added internal note" : "Replied to requester", entity: id });
  return { ok: true, message: internal ? "Internal note added." : "Reply sent.", item };
}

export async function updateTicket(id, input, user) {
  if (!can(user, "support", "edit")) return { ok: false, message: "You do not have permission to update tickets." };
  if (user?.token) {
    try {
      const { data } = await api(`admin/support/${encodeURIComponent(id)}`, { method: "PATCH", token: user.token, body: input });
      return data;
    } catch (error) {
      return liveError(error, "Could not update the ticket.");
    }
  }
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
