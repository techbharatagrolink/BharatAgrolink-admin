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

/** URL / API filter keys with their max length (pincode is checked separately: 6 digits). */
export const GEO_FILTER_KEYS = [["q", 100], ["state", 150], ["district", 150], ["type", 150], ["block", 200], ["city", 255], ["subdistrict", 200], ["village", 255]];

/** The filters of a request (URL search params or export params), trimmed, empty ones dropped. */
export function geoFilters(source) {
  const one = (v) => (Array.isArray(v) ? v[0] : v);
  const str = (v, max) => (typeof one(v) === "string" ? one(v).trim().slice(0, max) : "");
  const query = {};
  for (const [key, max] of GEO_FILTER_KEYS) if (str(source?.[key], max)) query[key] = str(source[key], max);
  if (/^\d{6}$/.test(str(source?.pincode, 6))) query.pincode = str(source.pincode, 6);
  return query;
}

export const getGeo = (kind, query, user) => get(kind, user, query);
/** Dropdown values: states, districts of `state`, types, and the tab's place list (block / city / sub-district). */
export const getGeoOptions = (kind, { state, district } = {}, user) => {
  const query = {};
  if (state) query.state = state;
  if (state && district) query.district = district;
  return get(`${kind}/options`, user, Object.keys(query).length ? query : undefined);
};

/** Called from a server action: never throws. */
export async function exportGeo(kind, query, user) {
  try {
    return { ok: true, data: await get(`${kind}/export`, user, query) };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message, status: error.status };
    return { ok: false, message: "The geographical data service could not be reached." };
  }
}
