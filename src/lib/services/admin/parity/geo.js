import "server-only";
import { api, ApiError } from "@/lib/api";

/**
 * Sales > Geographical Data (API /admin/parity/geo, read only): the pincode_mapping database's
 * development blocks, urban local bodies and villages, each with the pincode's farm profile.
 */

const BASE = "admin/parity/geo";
export const GEO_KINDS = ["blocks", "urban", "villages"];

async function get(path, user, query) {
  const { data } = await api(`${BASE}/${path}`, { token: user.token, query });
  return data;
}

export const getGeo = (kind, query, user) => get(kind, user, query);
export const getGeoOptions = (kind, state, user) => get(`${kind}/options`, user, state ? { state } : undefined);

/** Called from a server action: never throws. */
export async function exportGeo(kind, query, user) {
  try {
    return { ok: true, data: await get(`${kind}/export`, user, query) };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, status: error.status };
    return { ok: false, message: "The geographical data service could not be reached." };
  }
}
