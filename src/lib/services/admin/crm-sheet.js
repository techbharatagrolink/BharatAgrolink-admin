import "server-only";
import { api, apiForm, ApiError } from "@/lib/api";

async function read(user, path) {
  if (!user?.token) return null;
  try {
    const { data } = await api(path, { token: user.token });
    return data ?? null;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

export function mySalesTarget(user) {
  return read(user, "admin/crm/my-target");
}

export function leadChat(id, user) {
  return read(user, `admin/crm/leads/${encodeURIComponent(id)}/chat`);
}

export function leadAttachments(id, user) {
  return read(user, `admin/crm/leads/${encodeURIComponent(id)}/attachments`);
}

export async function syncAisensy(user) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api("admin/crm/aisensy/sync", { token: user.token, method: "POST", body: {} });
    return { ok: true, ...(data || {}) };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "AiSensy sync failed." };
  }
}

export async function uploadLeadImage(id, formData, user) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await apiForm(`admin/crm/leads/${encodeURIComponent(id)}/attachments`, { token: user.token, formData });
    return { ok: true, attachment: data, message: "Image uploaded." };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "Could not upload the image." };
  }
}

export async function deleteLeadImage(id, attachmentId, user) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    await api(`admin/crm/leads/${encodeURIComponent(id)}/attachments/${encodeURIComponent(attachmentId)}`, { token: user.token, method: "DELETE" });
    return { ok: true, message: "Image removed." };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "Could not remove the image." };
  }
}
