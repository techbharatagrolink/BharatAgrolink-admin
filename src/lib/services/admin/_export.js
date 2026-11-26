import "server-only";
import { ApiError } from "@/lib/api";
import { EXPORT_MAX_ROWS } from "@/lib/csv";

/**
 * Every row of a paged list (up to EXPORT_MAX_ROWS), for screens whose API has no /export endpoint.
 * `fetchPage(page, pageSize)` resolves to { rows, total? } and throws (or returns ok: false) on failure.
 * Resolves to { ok: true, rows, truncated } or the first failure.
 */
export async function collectPages(fetchPage, { pageSize = 100, maxRows = EXPORT_MAX_ROWS } = {}) {
  const rows = [];
  for (let page = 1; ; page += 1) {
    let result;
    try {
      result = await fetchPage(page, pageSize);
    } catch (error) {
      return { ok: false, message: error instanceof ApiError ? error.message : "The export could not be loaded from the admin API." };
    }
    if (result?.ok === false) return result;
    const batch = Array.isArray(result?.rows) ? result.rows : [];
    const total = Number(result?.total);
    rows.push(...batch);
    if (rows.length >= maxRows) return { ok: true, rows: rows.slice(0, maxRows), truncated: rows.length > maxRows || !(total <= maxRows) };
    if (batch.length < pageSize || (Number.isFinite(total) && rows.length >= total)) return { ok: true, rows, truncated: false };
  }
}
