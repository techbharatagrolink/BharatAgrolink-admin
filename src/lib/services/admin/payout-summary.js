import "server-only";
import { api, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

/**
 * Vendor Payout Summary (PHP payout_new.php):
 *   GET /api/admin/payouts?page&pageSize&q&status&sort&cycleMonth&cycle
 *   GET /api/admin/payouts/export?...   (same filters, up to 5000 rows)
 *   GET /api/admin/payouts/cycles       (cycles that have payout items)
 * Read only: payout cycles are viewed and selected here, never shifted.
 */

export const PAYOUT_STATUSES = ["Pending", "Paid", "On Hold"];
export const PAYOUT_SORTS = ["vendor", "vendorId", "orders", "gross", "taxable", "net", "paidBsa", "pendingBsa", "status", "id"];
const PAGE_SIZES = [10, 25, 50, 100];

const one = (v) => (Array.isArray(v) ? v[0] : v);

/** URL search params -> the API query, dropping anything the API would reject. */
export function payoutQuery(searchParams = {}) {
  const get = (k) => String(one(searchParams[k]) ?? "").trim();
  const page = Math.max(1, Number.parseInt(get("page") || "1", 10) || 1);
  const pageSize = PAGE_SIZES.includes(Number(get("pageSize"))) ? Number(get("pageSize")) : 25;
  const status = PAYOUT_STATUSES.includes(get("status")) ? get("status") : "";
  const [sf, sd] = get("sort").split(":");
  const sort = PAYOUT_SORTS.includes(sf) && ["asc", "desc"].includes(sd) ? `${sf}:${sd}` : "";
  const cycleMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(get("cycleMonth")) ? get("cycleMonth") : "";
  const cycle = cycleMonth && ["first", "second"].includes(get("cycle")) ? get("cycle") : "";
  return { page, pageSize, q: get("q").slice(0, 120), status, sort, cycleMonth, cycle };
}

const strip = (query) => Object.fromEntries(Object.entries(query).filter(([, v]) => v !== "" && v != null));

export async function getPayoutSummary(searchParams, user) {
  const query = payoutQuery(searchParams);
  const [list, cycles] = await Promise.all([
    api("admin/payouts", { token: user.token, query: strip(query) }),
    api("admin/payouts/cycles", { token: user.token }).catch(() => ({ data: [] })),
  ]);
  return { ...list.data, query, cycles: Array.isArray(cycles.data) ? cycles.data : [] };
}

export async function exportPayoutSummary(searchParams, user) {
  if (!can(user, "payouts", "view")) return { ok: false, message: "You do not have permission to export payouts." };
  const { q, status, sort, cycleMonth, cycle } = payoutQuery(searchParams);
  try {
    const { data } = await api("admin/payouts/export", { token: user.token, query: strip({ q, status, sort, cycleMonth, cycle }) });
    return { ok: true, rows: data?.rows ?? [] };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "The export could not be created." };
  }
}
