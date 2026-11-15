import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/** Printable BAN tax invoice (GET /admin/monetization/invoices/:id/html); the API checks the permission. */
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return new Response("Unknown invoice.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const user = await getCurrentAdmin();
  if (!user) return new Response("Sign in to open this invoice.", { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const response = await fetch(`${apiBase()}/admin/monetization/invoices/${id}/html`, {
    headers: { Authorization: `Bearer ${user.token}`, Accept: "text/html" },
    cache: "no-store",
  });
  if (!response.ok) {
    const message = (await response.json().catch(() => null))?.message || "This invoice could not be opened.";
    return new Response(message, { status: response.status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(await response.text(), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
}
