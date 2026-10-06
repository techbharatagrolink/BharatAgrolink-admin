import { sleep } from "@/lib/utils";

/**
 * Server-side list contract shared by every admin service:
 *   input  { page, pageSize, q, sort: "field:asc|desc", from, to, ...filters }
 *   output { rows, total, page, pageSize, pageCount }
 * The real API is expected to accept the same query parameters.
 */

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZES = [10, 25, 50, 100];

export async function mockLatency(ms = 120) {
  if (process.env.NODE_ENV !== "production") await sleep(ms);
}

export function parseListParams(searchParams = {}) {
  const get = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const pageSize = PAGE_SIZES.includes(Number(get("pageSize"))) ? Number(get("pageSize")) : DEFAULT_PAGE_SIZE;
  const page = Math.max(1, Number.parseInt(get("page") || "1", 10) || 1);
  const filters = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (["page", "pageSize", "q", "sort", "from", "to"].includes(key)) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v != null && v !== "") filters[key] = String(v).slice(0, 120);
  }
  return {
    page,
    pageSize,
    q: (get("q") || "").toString().trim().slice(0, 120),
    sort: (get("sort") || "").toString(),
    from: get("from") || "",
    to: get("to") || "",
    filters,
  };
}

function compare(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "en-IN", { numeric: true });
}

export function queryRows(rows, params, { searchFields = [], filterFields = [], dateField, defaultSort } = {}) {
  let result = rows;
  if (params.q) {
    const needle = params.q.toLowerCase();
    result = result.filter((row) => searchFields.some((field) => String(row[field] ?? "").toLowerCase().includes(needle)));
  }
  for (const field of filterFields) {
    const value = params.filters?.[field];
    if (value == null || value === "") continue;
    result = result.filter((row) => String(row[field]) === value);
  }
  if (dateField && (params.from || params.to)) {
    const from = params.from ? new Date(`${params.from}T00:00:00+05:30`).getTime() : -Infinity;
    const to = params.to ? new Date(`${params.to}T23:59:59+05:30`).getTime() : Infinity;
    result = result.filter((row) => {
      const t = new Date(row[dateField]).getTime();
      return t >= from && t <= to;
    });
  }
  const [sortField, sortDir] = (params.sort || defaultSort || "").split(":");
  if (sortField) {
    result = [...result].sort((a, b) => (sortDir === "asc" ? 1 : -1) * compare(a[sortField], b[sortField]));
  }
  const total = result.length;
  const pageCount = Math.max(1, Math.ceil(total / params.pageSize));
  const page = Math.min(params.page, pageCount);
  const start = (page - 1) * params.pageSize;
  return { rows: result.slice(start, start + params.pageSize), total, page, pageSize: params.pageSize, pageCount, all: result };
}

export function countBy(rows, field) {
  const counts = {};
  for (const row of rows) counts[row[field]] = (counts[row[field]] || 0) + 1;
  return counts;
}

export function sum(rows, field) {
  return Math.round(rows.reduce((s, r) => s + (Number(r[field]) || 0), 0) * 100) / 100;
}
