import { api, ApiError } from "@/lib/api";
import { canShip } from "@/lib/services/admin/shipping";

/*
 * Courier charges sync panel (/admin/shipping/charges-sync):
 *   GET  /admin/shipping/charges-sync        jobs with their schedule and last run
 *   POST /admin/shipping/charges-sync/:job   start one in the background (202)
 */

export const CHARGE_SYNC_JOBS = ["shiprocket", "delhivery", "delhivery-ledger", "order-cost"];

const message = (error, fallback) => (error instanceof ApiError ? error.message : fallback);

export async function getChargesSync(user) {
  if (!canShip(user)) return { ok: false, message: "You do not have permission to view this." };
  if (!user?.token) return { ok: false, message: "The admin API is not connected." };
  try {
    const { data } = await api("admin/shipping/charges-sync", { token: user.token });
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { ok: false, message: message(error, "The admin API could not load the sync status.") };
  }
}

/** range: optional { from, to } (YYYY-MM-DD) narrowing/widening the job's default window; ignored by jobs that don't take one. */
export async function startChargesSync(job, user, range) {
  if (!CHARGE_SYNC_JOBS.includes(job)) return { ok: false, message: "Unknown sync." };
  if (!canShip(user, "edit")) return { ok: false, message: "You do not have permission to run a sync." };
  try {
    const body = range?.from || range?.to ? { from: range.from || undefined, to: range.to || undefined } : undefined;
    await api(`admin/shipping/charges-sync/${job}`, { method: "POST", token: user.token, body });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: message(error, "The admin API could not start the sync.") };
  }
}

/** { rangedJobs, earliest }: which jobs the range picker applies to, and the floor date for "All time" / the custom picker. */
export async function getChargesSyncRange(user) {
  if (!canShip(user)) return { rangedJobs: [], earliest: null };
  try {
    const { data } = await api("admin/shipping/charges-sync/range", { token: user.token });
    return { rangedJobs: Array.isArray(data?.rangedJobs) ? data.rangedJobs : [], earliest: data?.earliest ?? null };
  } catch {
    return { rangedJobs: [], earliest: null };
  }
}
