import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { apiBase } from "@/lib/api";

/* Stock CSV (GET /admin/stock/export.csv) with the admin session token, for the All Stock filters. */
const ALLOWED = ["status", "search", "category", "pool", "sellerId", "sort"];
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return text("Sign in to download this file.", 401);
  if (!can(user, "inventory")) return text("You do not have permission to download stock.", 403);
  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams(ALLOWED.filter((k) => incoming.get(k)).map((k) => [k, incoming.get(k)]));
  const response = await fetch(`${apiBase()}/admin/stock/export.csv?${query}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }
  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "text/csv; charset=utf-8", "Cache-Control": "no-store" });
  out.set("Content-Disposition", response.headers.get("content-disposition") || 'attachment; filename="inventory.csv"');
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
