import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Ops screens ported from PHP (API /admin/parity/ops):
 *   Delhivery labels, tracking, serviceability and cost; pickup addresses;
 *   master delivered orders; B2B queue/logistics stats and labels; operations overall report.
 */

const BASE = "admin/parity/ops";

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
    return { ok: false, message: "The operations service could not be reached." };
  }
}

export const getDelhiveryLabel = (waybill, user) => attempt(() => get(`delhivery/label/${encodeURIComponent(waybill)}`, user));
export const getDelhiveryTracking = (id, user) => attempt(() => get(`delhivery/track/${encodeURIComponent(id)}`, user));

export const checkServiceability = (input, user) => attempt(async () => (await api(`${BASE}/delhivery/serviceability`, { token: user.token, method: "POST", body: input })).data);
export const checkPincode = (pincode, user) => attempt(() => get("delhivery/pincode", user, { pincode }));
export const calculateCost = (input, user) => attempt(async () => (await api(`${BASE}/delhivery/cost`, { token: user.token, method: "POST", body: input })).data);

export const getPickupAddresses = (user) => get("pickup-addresses", user);
export const createPickupAddress = (input, user) => attempt(async () => (await api(`${BASE}/pickup-addresses`, { token: user.token, method: "POST", body: input })).data);

export const getPickupRequestStats = (user) => get("pickup-requests/stats", user);

export const getDeliveredOptions = (user) => get("delivered/options", user);
export const getDeliveredSummary = (filters, user) => get("delivered/summary", user, filters);
export const getDeliveredCharts = (filters, user) => get("delivered/charts", user, filters);
export const getDeliveredTable = (filters, user) => get("delivered/table", user, filters);
export const exportDelivered = (filters, user) => attempt(() => get("delivered/export", user, filters));

export const getOpsQueueStats = (user) => get("b2b/ops-queue/stats", user);
export const getB2bLabel = (order, user) => attempt(() => get(`b2b/ops-queue/label/${encodeURIComponent(order)}`, user));
export const getLogisticsStats = (user) => get("b2b/logistics/stats", user);

export const getOverallReport = (range, user) => get("overall", user, range);
export const exportOverall = (range, user) => attempt(() => get("overall/export", user, range));
export const exportAllAgents = (range, user) => attempt(() => get("overall/export-agents", user, range));
