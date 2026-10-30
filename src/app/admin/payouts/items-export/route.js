import { proxyFileDownload } from "@/lib/admin-file-proxy";

/*
 * Vendor Payout Summary "Export items" (PHP payout_new.php Export with vendors ticked) with the
 * admin session token: /admin/payouts/items-export?payoutIds&q&status&cycleMonth&cycle&orderIds&format
 * -> /admin/payouts/items-export (.xlsx, or .csv with format=csv). Without payoutIds every vendor
 * matching the filters is exported; status, cycle and order IDs also narrow the items.
 */
const PARAMS = ["payoutIds", "q", "status", "cycleMonth", "cycle", "orderIds", "format"];

export function GET(request) {
  return proxyFileDownload(request, "admin/payouts/items-export", PARAMS);
}
