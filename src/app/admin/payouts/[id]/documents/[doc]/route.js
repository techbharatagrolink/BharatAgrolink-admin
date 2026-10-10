import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/*
 * Vendor Payout Items downloads with the admin session token:
 *   export                      -> /admin/payouts/:id/items/export (.xlsx)
 *   invoice | order-summary | payment-receipt | order-report -> /admin/payouts/:id/documents/:doc
 *   proof?item=<itemId>         -> redirects to the item's invoice proof URL
 */
const DOCS = new Set(["invoice", "order-summary", "payment-receipt", "order-report"]);
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request, { params }) {
  const { id, doc } = await params;
  if (!/^\d{1,12}$/.test(id)) return text("Payout not found.", 404);
  const user = await getCurrentAdmin();
  if (!user) return text("Sign in to download this file.", 401);
  const search = new URL(request.url).searchParams;
  const headers = { Authorization: `Bearer ${user.token}` };

  if (doc === "proof") {
    const item = search.get("item") ?? "";
    if (!/^\d{1,12}$/.test(item)) return text("Payout item not found.", 404);
    const response = await fetch(`${apiBase()}/admin/payouts/${id}/items/${item}/proof`, { headers: { ...headers, Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.data?.url) return text(payload?.message || "No invoice proof is attached to this item.", response.ok ? 404 : response.status);
    return Response.redirect(payload.data.url, 302);
  }

  let path;
  if (doc === "export") path = `admin/payouts/${id}/items/export`;
  else if (DOCS.has(doc)) path = `admin/payouts/${id}/documents/${doc}`;
  else return text("Unknown document.", 404);

  const response = await fetch(`${apiBase()}/${path}?${search.toString()}`, { headers, cache: "no-store", redirect: "manual" });
  const location = response.headers.get("location");
  if (response.status >= 300 && response.status < 400 && location) return Response.redirect(location, 302);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }
  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "application/octet-stream", "Cache-Control": "no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) out.set("Content-Disposition", disposition);
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
