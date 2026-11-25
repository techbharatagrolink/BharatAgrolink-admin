"use server";

import { assertExport } from "@/lib/auth/session";
import { getDashboardCard } from "@/lib/services/admin/main-dashboard";
import { collectPages } from "@/lib/services/admin/_export";

/**
 * Every row of a main-dashboard card drill-down (/admin/dashboard/cards/<slug>) for the filters on
 * screen, read 100 at a time (DataTable onExport, bound to the slug). Super admins only.
 */
export async function exportDashboardCardAction(slug, params) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,40}$/.test(slug)) return { ok: false, message: "Invalid request." };
  const filters = {};
  if (params && typeof params === "object") {
    for (const [key, value] of Object.entries(params)) {
      if (key !== "page" && key !== "pageSize" && key.length <= 40 && typeof value === "string") filters[key] = value.slice(0, 120);
    }
  }
  return collectPages(async (page, pageSize) => {
    const data = await getDashboardCard(slug, { ...filters, page: String(page), pageSize: String(pageSize) }, auth.user);
    return { rows: data?.rows, total: data?.total };
  });
}
