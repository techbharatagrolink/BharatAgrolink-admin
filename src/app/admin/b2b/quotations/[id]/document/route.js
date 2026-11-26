import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/**
 * Opens the buyer-facing quotation (printable HTML; the browser's "Save as PDF" makes the PDF).
 * The API returns buyer-safe fields only and watermarks a quotation that is not a live offer.
 */
export async function GET(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentAdmin();
  if (!user) return new Response("Sign in to open this quotation.", { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  if (!/^\d+$/.test(String(id))) return new Response("Quotation not found.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const response = await fetch(`${apiBase()}/admin/b2b/quotations/${encodeURIComponent(id)}/document`, {
    headers: { Authorization: `Bearer ${user.token}`, Accept: "text/html" },
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
