import "server-only";
import { api, apiBase, ApiError } from "@/lib/api";

const BASE = "admin/cms/home-editor";

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message, status: error.status, code: error.code };
}

async function attempt(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return failure(error, "The homepage editor could not be reached.");
  }
}

const send = (path, method, body, user) => attempt(async () => (await api(`${BASE}${path}`, { token: user.token, method, body })).data);

async function upload(path, method, formData, user) {
  return attempt(async () => {
    const response = await fetch(`${apiBase()}/${BASE}${path}`, {
      method,
      cache: "no-store",
      headers: { Accept: "application/json", Authorization: `Bearer ${user.token}` },
      body: formData,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false) {
      throw new ApiError(payload?.message || `Request failed (${response.status})`, { code: payload?.code, status: response.status, details: payload?.details });
    }
    return payload?.data;
  });
}

export function getHomeEditor(user) {
  return attempt(async () => (await api(BASE, { token: user.token })).data);
}

export function getHomeCopy(user) {
  return attempt(async () => (await api(`${BASE}/copy`, { token: user.token })).data);
}

export function getHeroBoard(user) {
  return attempt(async () => (await api(`${BASE}/hero`, { token: user.token })).data);
}

export const saveSectionOrder = (order, user) => send("/section-order", "PUT", { order }, user);
export const resetSectionOrder = (user) => send("/section-order/reset", "POST", {}, user);
export const saveHeroOrder = (order, user) => send("/hero-order", "PUT", { order }, user);
export const resetHeroOrder = (user) => send("/hero-order/reset", "POST", {}, user);
export const saveBanner = (type, formData, user) => upload(`/banners/${encodeURIComponent(type)}`, "PUT", formData, user);
export const deleteBanner = (type, user) => send(`/banners/${encodeURIComponent(type)}`, "DELETE", undefined, user);
export const saveOffer = (id, formData, user) => upload(`/offers/${id}`, "PUT", formData, user);
export const saveSectionTitle = (key, title, user) => send(`/sections/${encodeURIComponent(key)}/title`, "PUT", { title }, user);
export const searchSectionProducts = (key, q, user) => attempt(async () => (await api(`${BASE}/sections/${encodeURIComponent(key)}/products`, { token: user.token, query: { q } })).data);
export const addSectionItem = (key, productId, user) => send(`/sections/${encodeURIComponent(key)}/items`, "POST", { productId }, user);
export const deleteSectionItem = (key, id, user) => send(`/sections/${encodeURIComponent(key)}/items/${id}`, "DELETE", undefined, user);
export const saveHomeSettings = (body, user) => send("/settings", "PUT", body, user);
export const saveHomeContent = (body, user) => send("/content", "PUT", body, user);
export const addPromoBanners = (formData, user) => upload("/promo", "POST", formData, user);
export const updatePromoBanner = (id, formData, user) => upload(`/promo/${id}`, "PUT", formData, user);
export const deletePromoBanner = (id, user) => send(`/promo/${id}`, "DELETE", undefined, user);
export const saveHomeFooter = (categories, user) => send("/footer", "PUT", { categories }, user);
