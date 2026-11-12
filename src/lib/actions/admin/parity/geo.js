"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { exportGeo, GEO_KINDS } from "@/lib/services/admin/parity/geo";

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** CSV export of the current Geographical Data tab and filters (DataTable onExport: { ok, rows }). */
export async function exportGeoAction(kind, filters) {
  // every logged-in admin may export (same as the page)
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: "Your session has expired. Please log in again." };
  if (!GEO_KINDS.includes(kind)) return { ok: false, message: "Invalid table." };
  const query = {};
  for (const [key, max] of [["q", 100], ["state", 150], ["district", 150], ["type", 150]]) if (str(filters?.[key], max)) query[key] = str(filters[key], max);
  if (/^\d{6}$/.test(str(filters?.pincode, 6))) query.pincode = filters.pincode.trim();
  const result = await exportGeo(kind, query, user);
  if (!result.ok) return result;
  return { ok: true, rows: result.data.rows };
}
