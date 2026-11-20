import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * SEO & AI Command Center (task #104) in the API:
 *   GET /admin/seo/dashboard?from&to
 *   GET /admin/seo/search-performance | ai-visibility | organic-commerce | website-health | product-quality ?from&to
 *   GET /admin/seo/integrations/status | tasks | milestones | settings
 * The API checks the admin's permission (menu link seo_command_center.php) on every call.
 * No mock fallback: a number is shown only when the API returned one.
 */

const notConnected = () => new ApiError("The admin API session is missing.", { status: 0 });
const asApiError = (error) => (error instanceof ApiError ? error : new ApiError("The admin API is not reachable.", { status: 0 }));

/** One GET: { data, error }; never throws, so a page can show the parts that loaded. */
export async function loadSeo(user, path, query) {
  if (!user?.token) return { data: null, error: notConnected() };
  try {
    const { data } = await api(`admin/seo/${path}`, { token: user.token, query });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: asApiError(error) };
  }
}

/** One write: { ok: true, data } or { ok: false, message, code }. */
export async function writeSeo(user, path, { method = "POST", body } = {}) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/seo/${path}`, { token: user.token, method, body });
    return { ok: true, data };
  } catch (error) {
    const e = asApiError(error);
    return { ok: false, message: e.message, code: e.code ?? null };
  }
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The ?from&to of a page, only when both look like dates (the API validates the rest). */
export function rangeParams(searchParams) {
  const from = DAY.test(searchParams?.from ?? "") ? searchParams.from : undefined;
  const to = DAY.test(searchParams?.to ?? "") ? searchParams.to : undefined;
  return { from, to };
}
