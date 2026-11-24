import { proxyFileDownload } from "@/lib/admin-file-proxy";

/**
 * Order status analytics export (Super Admin; the API enforces it and logs every export):
 * /admin/dashboard-exports/order-status?<dashboard filters>&view&bucket&metric&q&format=xlsx|csv
 *   -> /admin/panel-dashboards/order-status/export
 */
const PARAMS = ["preset", "from", "to", "fy", "season", "cycle", "vendor", "type", "q", "view", "bucket", "metric", "format"];

export function GET(request) {
  return proxyFileDownload(request, "admin/panel-dashboards/order-status/export", PARAMS);
}
