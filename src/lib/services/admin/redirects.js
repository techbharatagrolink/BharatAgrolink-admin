import "server-only";
import { can } from "@/lib/auth/permissions";
import { api, apiForm, ApiError } from "@/lib/api";

/**
 * 301 URL Redirects (PHP redirects.php / redirects_process.php). The website
 * applies the rules in its proxy, before any page loads.
 *   GET    /admin/cms/redirects?page&limit&q&status   rules + metrics
 *   POST   /admin/cms/redirects                       create
 *   PUT    /admin/cms/redirects/{id}                  update
 *   PATCH  /admin/cms/redirects/{id}/status           { isActive }
 *   DELETE /admin/cms/redirects/{id}
 *   POST   /admin/cms/redirects/delete-all            { confirm: "DELETE_ALL_CONFIRMED" }
 *   POST   /admin/cms/redirects/check                 { sourceUrl, targetUrl, excludeId }
 *   POST   /admin/cms/redirects/test                  { url }
 *   GET    /admin/cms/redirects/logs
 *   POST   /admin/cms/redirects/import/preview        multipart file
 *   POST   /admin/cms/redirects/import                multipart file, updateExisting
 *   GET    /admin/cms/redirects/export | /sample      .csv (see cms/redirects/download)
 */

export const REDIRECTS_PERMISSION = "cms.redirects";
export const REDIRECTS_PAGE_SIZE = 25;
const BASE = "admin/cms/redirects";

export const REDIRECT_STATUSES = [
  { value: "active", label: "Active only" },
  { value: "inactive", label: "Inactive only" },
];

export function redirectFilters(searchParams = {}) {
  const first = (key) => {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value == null ? "" : String(value).trim();
  };
  const page = Number.parseInt(first("page"), 10);
  const status = first("status");
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    q: first("q").slice(0, 200),
    status: REDIRECT_STATUSES.some((s) => s.value === status) ? status : "",
  };
}

export async function getRedirectsScreen(user, filters) {
  if (!user?.token) return { error: new ApiError("The admin API session is missing.", { status: 0 }) };
  try {
    const { data, meta } = await api(BASE, { token: user.token, query: { page: filters.page, limit: REDIRECTS_PAGE_SIZE, q: filters.q, status: filters.status } });
    return { items: data?.items ?? [], metrics: data?.metrics ?? { total: 0, active: 0, inactive: 0, totalHits: 0 }, meta };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new ApiError("The admin API is not reachable.", { status: 0 }) };
  }
}

const DENIED = {
  view: "You do not have permission to view URL redirects.",
  add: "You do not have permission to add URL redirects.",
  edit: "You do not have permission to change URL redirects.",
  delete: "You do not have permission to delete URL redirects.",
};

/** Calls the API and returns { ok, message, data } (never throws). */
async function call(path, { method = "GET", body, formData, action = "view", fallback }, user) {
  if (!can(user, REDIRECTS_PERMISSION, action)) return { ok: false, message: DENIED[action] };
  if (!user?.token) return { ok: false, message: "The admin API is not connected." };
  try {
    const { data } = formData ? await apiForm(path, { token: user.token, formData }) : await api(path, { method, token: user.token, body });
    return { ok: true, message: data?.message ?? null, data: data ?? null };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : fallback };
  }
}

const rulePath = (id) => `${BASE}/${encodeURIComponent(id)}`;

export const createRedirect = (input, user) => call(BASE, { method: "POST", body: input, action: "add", fallback: "Could not save the redirect." }, user);

export const updateRedirect = (id, input, user) => call(rulePath(id), { method: "PUT", body: input, action: "edit", fallback: "Could not save the redirect." }, user);

export const setRedirectActive = (id, isActive, user) =>
  call(`${rulePath(id)}/status`, { method: "PATCH", body: { isActive }, action: "edit", fallback: "Could not change the redirect status." }, user);

export const deleteRedirect = (id, user) => call(rulePath(id), { method: "DELETE", action: "delete", fallback: "Could not delete the redirect." }, user);

export const deleteAllRedirects = (confirm, user) => call(`${BASE}/delete-all`, { method: "POST", body: { confirm }, action: "delete", fallback: "Could not delete the redirects." }, user);

export const checkRedirect = (input, user) => call(`${BASE}/check`, { method: "POST", body: input, fallback: "Could not check the redirect." }, user);

export const testRedirect = (url, user) => call(`${BASE}/test`, { method: "POST", body: { url }, fallback: "Could not test the URL." }, user);

export const redirectLogs = (user) => call(`${BASE}/logs`, { fallback: "Could not load the audit log." }, user);

export const previewRedirectImport = (formData, user) => call(`${BASE}/import/preview`, { formData, action: "add", fallback: "Could not read the file." }, user);

export function importRedirects(formData, user) {
  if (formData.get("updateExisting") && !can(user, REDIRECTS_PERMISSION, "edit")) return { ok: false, message: DENIED.edit };
  return call(`${BASE}/import`, { formData, action: "add", fallback: "Could not import the file." }, user);
}
