import "server-only";
import { api, ApiError } from "@/lib/api";
import { canPage } from "@/lib/auth/permissions";
import { mockLatency, parseListParams, queryRows } from "./_query";

/**
 * Seller agreement acceptances (PHP seller_agreements.php):
 *   GET /api/admin/vendors/agreements?page&pageSize&q&sort&from&to&status
 *   GET /api/admin/vendors/agreements/export?q&sort&from&to&status
 * A 404 means the API does not serve this screen yet: the list comes back
 * empty with `unavailable` set instead of failing the page.
 */

/* The PHP page, or a Menu Master row linking admin/vendors/agreements (the API keys its grants "agreements"). */
const AGREEMENT_PAGES = ["seller_agreements.php", "admin/vendors/agreements"];
export const canViewAgreements = (user) => AGREEMENT_PAGES.some((page) => canPage(user, page, "view"));
const SELLER_AGREEMENT_VERSION = "2.0";
const STATUSES = ["accepted", "pending", "outdated"];
const NOT_CONNECTED = "The admin API does not serve seller agreements yet, so no acceptances can be shown.";

function demoAcceptances() {
  return [
    { vendorId: "SEL01001", vendorName: "Shree Agro Kendra", accepted: true, version: "2.0", acceptedAt: "2026-10-10T10:30:00Z", signatory: "Rajesh Kumar", designation: "Proprietor", ipAddress: "103.45.12.78" },
    { vendorId: "SEL01002", vendorName: "Jai Krishi Agencies", accepted: true, version: "2.0", acceptedAt: "2026-10-11T14:22:00Z", signatory: "Amit Sharma", designation: "Director", ipAddress: "117.220.45.91" },
    { vendorId: "SEL01003", vendorName: "Maa Beej Bhandar", accepted: false, version: "1.0", acceptedAt: null, signatory: "Sunita Devi", designation: "Owner", ipAddress: null },
    { vendorId: "SEL01004", vendorName: "Navkar Agritech Pvt Ltd", accepted: true, version: "2.0", acceptedAt: "2026-10-09T09:15:00Z", signatory: "Vikram Singh", designation: "Manager", ipAddress: "49.207.33.112" },
    { vendorId: "SEL01005", vendorName: "Om Fertichem Enterprises", accepted: false, version: "1.0", acceptedAt: null, signatory: "Priya Patel", designation: "Partner", ipAddress: null },
    { vendorId: "SEL01006", vendorName: "Gayatri Traders", accepted: true, version: "2.0", acceptedAt: "2026-10-12T16:45:00Z", signatory: "Mohan Lal", designation: "Proprietor", ipAddress: "182.73.156.201" },
    { vendorId: "SEL01007", vendorName: "Sai Krishi Kendra", accepted: false, version: "1.0", acceptedAt: null, signatory: "Kavita Joshi", designation: "Owner", ipAddress: null },
    { vendorId: "SEL01008", vendorName: "Kisan Agro Agencies", accepted: true, version: "2.0", acceptedAt: "2026-10-08T11:00:00Z", signatory: "Ramesh Chandra", designation: "Director", ipAddress: "27.60.88.45" },
  ];
}

function toRow(a) {
  return {
    id: a.vendorId,
    vendorName: a.vendorName,
    vendorId: a.vendorId,
    version: a.version,
    status: a.accepted ? "Accepted" : "Pending",
    acceptedAt: a.acceptedAt,
    signatory: a.signatory,
    designation: a.designation,
    ipAddress: a.ipAddress,
    currentVersion: SELLER_AGREEMENT_VERSION,
    needsUpdate: a.version !== SELLER_AGREEMENT_VERSION,
  };
}

function matchesStatus(row, status) {
  if (status === "accepted") return row.status === "Accepted";
  if (status === "pending") return row.status === "Pending";
  if (status === "outdated") return row.needsUpdate;
  return true;
}

/** URL search params -> list params, keeping only a known status filter. */
function agreementsQuery(searchParams) {
  const params = parseListParams(searchParams);
  const status = STATUSES.includes(params.filters.status) ? params.filters.status : "";
  return { ...params, filters: status ? { status } : {}, status };
}

const strip = (query) => Object.fromEntries(Object.entries(query).filter(([, v]) => v !== "" && v != null));

function demoRows(params) {
  const rows = demoAcceptances().map(toRow).filter((row) => matchesStatus(row, params.status));
  return queryRows(rows, params, { searchFields: ["vendorName", "vendorId", "signatory"], dateField: "acceptedAt", defaultSort: "vendorName:asc" });
}

/** Returns the shared list contract: { rows, total, page, pageSize, pageCount, unavailable? }. */
export async function listSellerAgreements(searchParams, user) {
  const params = agreementsQuery(searchParams);

  if (user?.token) {
    const { page, pageSize, q, sort, from, to, status } = params;
    try {
      const { data } = await api("admin/vendors/agreements", { token: user.token, query: strip({ page, pageSize, q, sort, from, to, status }) });
      const rows = Array.isArray(data?.rows) ? data.rows : [];
      const total = Number(data?.total ?? rows.length) || 0;
      return {
        rows,
        total,
        page: Number(data?.page) || page,
        pageSize: Number(data?.pageSize) || pageSize,
        pageCount: Number(data?.pageCount) || Math.max(1, Math.ceil(total / pageSize)),
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return { rows: [], total: 0, page: 1, pageSize, pageCount: 1, unavailable: NOT_CONNECTED };
      }
      throw error;
    }
  }

  await mockLatency();
  const { rows, total, page, pageSize, pageCount } = demoRows(params);
  return { rows, total, page, pageSize, pageCount };
}

/** Every row matching the current filters, for CSV export: { ok, rows } or { ok: false, message }. */
export async function exportSellerAgreements(searchParams, user) {
  if (!canViewAgreements(user)) return { ok: false, message: "You do not have permission to export seller agreements." };
  const params = agreementsQuery(searchParams);
  const { q, sort, from, to, status } = params;

  if (user?.token) {
    try {
      const { data } = await api("admin/vendors/agreements/export", { token: user.token, query: strip({ q, sort, from, to, status }) });
      return { ok: true, rows: Array.isArray(data?.rows) ? data.rows : [] };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return { ok: false, message: NOT_CONNECTED };
      return { ok: false, message: error instanceof ApiError ? error.message : "The export could not be created." };
    }
  }

  await mockLatency();
  return { ok: true, rows: demoRows(params).all };
}
