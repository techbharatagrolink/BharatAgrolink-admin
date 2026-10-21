import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/*
 * Vendor Payout Summary "Export items" (PHP payout_new.php Export with vendors ticked) with the
 * admin session token: /admin/payouts/items-export?payoutIds&q&status&cycleMonth&cycle&orderIds
 * -> /admin/payouts/items-export (.xlsx). Without payoutIds every vendor matching the filters is exported.
 */
const PARAMS = ["payoutIds", "q", "status", "cycleMonth", "cycle", "orderIds"];
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return text("Sign in to download this file.", 401);
  const search = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const key of PARAMS) {
    const value = search.get(key);
    if (value) query.set(key, value.slice(0, 5000));
  }

  const response = await fetch(`${apiBase()}/admin/payouts/items-export?${query.toString()}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }
  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "application/octet-stream", "Cache-Control": "no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) out.set("Content-Disposition", disposition);
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
