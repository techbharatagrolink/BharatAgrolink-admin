"use server";

import { assertExport } from "@/lib/auth/session";
import { exportGeo, GEO_KINDS, geoFilters } from "@/lib/services/admin/parity/geo";

/** CSV export of the current Geographical Data tab and filters (DataTable onExport: { ok, rows }). Super admins only. */
export async function exportGeoAction(kind, filters) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  if (!GEO_KINDS.includes(kind)) return { ok: false, message: "Invalid table." };
  const result = await exportGeo(kind, geoFilters(filters), auth.user);
  if (!result.ok) return result;
  return { ok: true, rows: result.data.rows };
}
