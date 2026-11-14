import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Monetization Center (standalone prepaid banner ads, task #100) in the API:
 *   GET   /admin/monetization/overview?from&to | sections | config-logs
 *   GET   /admin/monetization/services | placements | packages  (+ /:id)
 *   POST  /admin/monetization/services | placements | packages
 *   PATCH /admin/monetization/services/:id | placements/:id | packages/:id
 * The API checks the admin's permission (menu link monetization_center.php) on every call.
 * No mock fallback: without the API the screens show "Not connected".
 */

const notConnected = () => new ApiError("The admin API session is missing.", { status: 0 });
const asApiError = (error) => (error instanceof ApiError ? error : new ApiError("The admin API is not reachable.", { status: 0 }));

/** One GET: { data, meta, error }; never throws, so a page can show the parts that loaded. */
export async function loadMonetization(user, path, query) {
  if (!user?.token) return { data: null, meta: null, error: notConnected() };
  try {
    const { data, meta } = await api(`admin/monetization/${path}`, { token: user.token, query });
    return { data, meta, error: null };
  } catch (error) {
    return { data: null, meta: null, error: asApiError(error) };
  }
}

/** One write: { ok: true, data } or { ok: false, message, code, details }. */
export async function writeMonetization(user, path, { method = "POST", body } = {}) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/monetization/${path}`, { token: user.token, method, body });
    return { ok: true, data };
  } catch (error) {
    const e = asApiError(error);
    return { ok: false, message: e.message, code: e.code ?? null, details: e.details ?? null };
  }
}
