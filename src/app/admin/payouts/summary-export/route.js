import { proxyFileDownload } from "@/lib/admin-file-proxy";

/*
 * Vendor Payout Summary "Export" as a file with the admin session token:
 * /admin/payouts/summary-export?q&status&sort&cycleMonth&cycle&orderIds&format=xlsx|csv -> /admin/payouts/export.
 */
const PARAMS = ["q", "status", "sort", "cycleMonth", "cycle", "orderIds", "format"];

export function GET(request) {
  return proxyFileDownload(request, "admin/payouts/export", PARAMS);
}
