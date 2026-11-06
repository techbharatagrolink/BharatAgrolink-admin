import { api, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

/*
 * Payout items sync panel (/admin/payouts/sync):
 *   GET  /admin/payouts/sync        the job with its schedule and last run
 *   POST /admin/payouts/sync/:job   start it in the background (202)
 */

export const PAYOUT_SYNC_JOBS = ["payout-items"];

const message = (error, fallback) => (error instanceof ApiError ? error.message : fallback);

export async function getPayoutSync(user) {
  if (!can(user, "payouts")) return { ok: false, message: "You do not have permission to view this." };
  if (!user?.token) return { ok: false, message: "The admin API is not connected." };
  try {
    const { data } = await api("admin/payouts/sync", { token: user.token });
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { ok: false, message: message(error, "The admin API could not load the sync status.") };
  }
}

export async function startPayoutSync(job, user) {
  if (!PAYOUT_SYNC_JOBS.includes(job)) return { ok: false, message: "Unknown sync." };
  if (!can(user, "payouts", "edit")) return { ok: false, message: "You do not have permission to run a sync." };
  try {
    await api(`admin/payouts/sync/${job}`, { method: "POST", token: user.token });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: message(error, "The admin API could not start the sync.") };
  }
}
