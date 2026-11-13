"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { exportGeo, GEO_KINDS, geoFilters } from "@/lib/services/admin/parity/geo";

/** CSV export of the current Geographical Data tab and filters (DataTable onExport: { ok, rows }). */
export async function exportGeoAction(kind, filters) {
  // every logged-in admin may export (same as the page)
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: "Your session has expired. Please log in again." };
  if (!GEO_KINDS.includes(kind)) return { ok: false, message: "Invalid table." };
  const result = await exportGeo(kind, geoFilters(filters), user);
  if (!result.ok) return result;
  return { ok: true, rows: result.data.rows };
}
