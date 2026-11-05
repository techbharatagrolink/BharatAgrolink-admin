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

export async function startChargesSync(job, user) {
  if (!CHARGE_SYNC_JOBS.includes(job)) return { ok: false, message: "Unknown sync." };
  if (!canShip(user, "edit")) return { ok: false, message: "You do not have permission to run a sync." };
  try {
    await api(`admin/shipping/charges-sync/${job}`, { method: "POST", token: user.token });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: message(error, "The admin API could not start the sync.") };
  }
}
