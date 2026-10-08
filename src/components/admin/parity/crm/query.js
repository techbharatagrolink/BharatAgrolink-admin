const YMD = /^\d{4}-\d{2}-\d{2}$/;
const PAGE_SIZES = [10, 20, 25, 50, 100];

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Common list params (page, pageSize, q, from, to) plus any extra string keys, empty values dropped. */
export function listQuery(params, extra = [], { pageSize = 10 } = {}) {
  const page = Math.max(1, Number.parseInt(one(params.page), 10) || 1);
  const size = Number(one(params.pageSize));
  const query = { page, pageSize: PAGE_SIZES.includes(size) ? size : pageSize };
  const q = one(params.q).trim().slice(0, 100);
  if (q) query.q = q;
  for (const key of ["from", "to"]) if (YMD.test(one(params[key]))) query[key] = one(params[key]);
  for (const key of extra) {
    const value = one(params[key]).trim().slice(0, 200);
    if (value) query[key] = value;
  }
  return query;
}

export const LEAD_SEARCH = "Search Mobile, Lead Name, or Lead Code...";

export const leadName = { key: "name", label: "Lead Name", sub: "code", emphasis: true };
export const leadMobile = { key: "mobile", label: "Mobile" };
export const leadStatus = { key: "status", label: "Status", type: "status" };
