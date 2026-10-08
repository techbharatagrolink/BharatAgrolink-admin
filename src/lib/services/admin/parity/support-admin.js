import "server-only";
import { api, apiBase, ApiError } from "@/lib/api";

/** Admin API calls for the support / hiring / staff / settings parity screens. */

const BASE = "admin/parity/support-admin";

function fail(error) {
  const field = error instanceof ApiError ? error.details?.field : undefined;
  const message = error instanceof ApiError ? error.message : "The admin API could not complete that request.";
  return { ok: false, message, fieldErrors: field ? { [field]: message } : undefined };
}

/** Reads return `{ data }` or a plain `{ error: { status, message } }` so pages can render ApiUnavailable. */
async function read(path, user) {
  try {
    const { data } = await api(path, { token: user.token });
    return { data };
  } catch (error) {
    return { error: error instanceof ApiError ? { status: error.status, message: error.message } : { status: undefined, message: "" } };
  }
}

export const getChatConversation = (sessionId, user) => read(`${BASE}/chat-logs/${encodeURIComponent(sessionId)}`, user);
export const getRequirement = (id, user) => read(`admin/support-desk/requirements/${encodeURIComponent(id)}`, user);
export const getPendingReview = (id, user) => read(`admin/reviews/pending/${encodeURIComponent(id)}`, user);
export const getApplication = (id, user) => read(`admin/hiring/applications/${encodeURIComponent(id)}`, user);
export const getHiringSummary = (user) => read(`${BASE}/hiring/summary`, user);
export const getStaffRoles = (user) => read(`${BASE}/staff/roles`, user);
export const getLoginModal = (user) => read(`${BASE}/login-modal`, user);
export const getScripts = (user) => read(`${BASE}/scripts`, user);

export async function saveChatReview(sessionId, { conversation, feedback }, user) {
  try {
    const { data } = await api(`${BASE}/chat-logs/${encodeURIComponent(sessionId)}`, { method: "PUT", token: user.token, body: { conversation, feedback } });
    return { ok: true, message: data?.message || "Conversation review saved." };
  } catch (error) {
    return fail(error);
  }
}

export async function createStaff(values, user) {
  try {
    const { data } = await api(`${BASE}/staff`, { method: "POST", token: user.token, body: values });
    return { ok: true, message: data?.message || "User Added Successfully.", id: data?.id };
  } catch (error) {
    return fail(error);
  }
}

export async function saveScripts(values, user) {
  try {
    const { data } = await api(`${BASE}/scripts`, { method: "PUT", token: user.token, body: values });
    return { ok: true, message: data?.message || "Scripts Setting Updated Successfully.", values: data?.values };
  } catch (error) {
    return fail(error);
  }
}

/** Multipart pass-through (title, subtitle, optional image) to the login-modal endpoint. */
export async function saveLoginModal(formData, user) {
  const body = new FormData();
  body.set("title", String(formData.get("title") ?? ""));
  body.set("subtitle", String(formData.get("subtitle") ?? ""));
  const image = formData.get("image");
  if (image && typeof image === "object" && image.size > 0) body.set("image", image, image.name || "image");
  try {
    const response = await fetch(`${apiBase()}/${BASE}/login-modal`, {
      method: "POST",
      cache: "no-store",
      headers: { Accept: "application/json", Authorization: `Bearer ${user.token}` },
      body,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false) {
      throw new ApiError(payload?.message || `Request failed (${response.status})`, { code: payload?.code, status: response.status, details: payload?.details });
    }
    return { ok: true, ...payload.data };
  } catch (error) {
    return fail(error);
  }
}
