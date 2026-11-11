import { proxyFileDownload } from "@/lib/admin-file-proxy";

/**
 * Order Report export as a file with the admin session token:
 * /admin/orders/report-export?orderId&vendorId&status&dateType&from&to&cycle&month&format=xlsx|csv&columns=... -> /admin/orders/report/export
 */
const PARAMS = ["orderId", "vendorId", "status", "dateType", "from", "to", "cycle", "month", "format", "columns"];

export function GET(request) {
  return proxyFileDownload(request, "admin/orders/report/export", PARAMS);
}
