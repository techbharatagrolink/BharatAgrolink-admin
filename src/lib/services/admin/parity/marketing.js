import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Marketing screens ported from PHP (API /admin/parity/marketing, plus /admin/pages for meta.php):
 *   social media dashboard, marketing expenses, engagement panel, CEO matrix,
 *   business dashboard, fraud analysis and the dashboard.php visitor cards.
 */

const BASE = "admin/parity/marketing";

async function get(path, user, query) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, query });
  return data;
}

/** For mutations and on-demand reads called from server actions: never throws. */
async function attempt(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, status: error.status };
    return { ok: false, message: "The marketing service could not be reached." };
  }
}

const send = (path, method, body, user) => attempt(async () => (await api(path, { token: user.token, method, body })).data);

export const getTrendReportHistory = (user) => get("social/trend-reports", user, { limit: 20 });
export const getLatestTrendReport = (user) => get("social/trend-reports/latest", user);
export const getTrendReport = (id, user) => attempt(() => get(`social/trend-reports/${encodeURIComponent(id)}`, user));
export const scheduleTrendReport = (input, user) => send(`${BASE}/social/trend-reports`, "POST", input, user);

export const getVideoScriptHistory = (user) => get("social/video-scripts", user, { limit: 20 });
export const getLatestVideoScript = (user) => get("social/video-scripts/latest", user);
export const getVideoScript = (id, user) => attempt(() => get(`social/video-scripts/${encodeURIComponent(id)}`, user));
export const scheduleVideoScript = (input, user) => send(`${BASE}/social/video-scripts`, "POST", input, user);
export const refreshSocial = (user) =>
  attempt(async () => {
    const [latestReport, reports, latestScript, scripts] = await Promise.all([getLatestTrendReport(user), getTrendReportHistory(user), getLatestVideoScript(user), getVideoScriptHistory(user)]);
    return { latestReport, reports, latestScript, scripts };
  });

export const getCalendarEvents = (user) => get("social/calendar-events", user);
export const createCalendarEvent = (input, user) => send(`${BASE}/social/calendar-events`, "POST", input, user);
export const updateCalendarEvent = (id, input, user) => send(`${BASE}/social/calendar-events/${encodeURIComponent(id)}`, "PUT", input, user);
export const deleteCalendarEvent = (id, user) => send(`${BASE}/social/calendar-events/${encodeURIComponent(id)}`, "DELETE", undefined, user);

export const getMarketingExpenses = (query, user) => get("expenses", user, query);
export const createMarketingExpense = (input, user) => send(`${BASE}/expenses`, "POST", input, user);
export const updateMarketingExpense = (id, input, user) => send(`${BASE}/expenses/${encodeURIComponent(id)}`, "PUT", input, user);
export const deleteMarketingExpense = (id, user) => send(`${BASE}/expenses/${encodeURIComponent(id)}`, "DELETE", undefined, user);

export const getEngagement = (kind, query, user) => get(`engagement/${kind}`, user, query);
export const exportEngagement = (kind, query, user) => attempt(() => get(`engagement/${kind}/export`, user, query));
export const previewEngagementWhatsApp = (kind, id, language, user) => attempt(() => get(`engagement/${kind}/whatsapp`, user, { id, language }));
export const sendEngagementWhatsApp = (kind, id, language, user) => send(`${BASE}/engagement/${kind}/whatsapp`, "POST", { id, language }, user);

export const getBusinessDashboard = (query, user) => get("business-dashboard", user, query);
export const getCeoMatrix = (query, user) => get("ceo-matrix", user, query);
export const getFraudAnalysis = (user) => get("fraud", user);
export const getDashboardVisitors = (query, user) => get("dashboard-visitors", user, query);

export const getSeoPages = (query, user) => api("admin/pages", { token: user.token, query }).then((r) => ({ items: r.data, meta: r.meta }));
export const getSeoPage = (id, user) => attempt(async () => (await api(`admin/pages/${encodeURIComponent(id)}`, { token: user.token })).data);
export const createSeoPage = (input, user) => send("admin/pages", "POST", input, user);
export const updateSeoPage = (id, input, user) => send(`admin/pages/${encodeURIComponent(id)}`, "PUT", input, user);
export const deleteSeoPage = (id, user) => send(`admin/pages/${encodeURIComponent(id)}`, "DELETE", undefined, user);
