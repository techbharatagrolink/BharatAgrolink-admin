import "server-only";
import { api, ApiError } from "@/lib/api";

/** Delivered-order finance report (API /admin/orders/report). */

function failure(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  return { ok: false, message: error.message, status: error.status };
}

async function attempt(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return failure(error, "The order report could not be reached.");
  }
}

export const getOrderReport = (query, user) => api("admin/orders/report", { token: user.token, query }).then((res) => res.data);
export const getOrderReportVendors = (user) => api("admin/orders/report/vendors", { token: user.token }).then((res) => res.data);
export const exportOrderReport = (query, user) => attempt(async () => (await api("admin/orders/report/export", { token: user.token, query })).data);
export const saveOrderReportOverride = (body, user) => attempt(async () => (await api("admin/orders/report/override", { token: user.token, method: "POST", body })).data);
