import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/** CSV of product data issues (GET /admin/seo/product-quality.csv); the API checks the permission and logs the export. */
export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return new Response("Sign in to download this list.", { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  for (const key of ["rule", "severity", "category", "status"]) {
    const value = incoming.get(key);
    if (value) params.set(key, value);
  }
  const response = await fetch(`${apiBase()}/admin/seo/product-quality.csv?${params}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const message = (await response.json().catch(() => null))?.message || "The list could not be created.";
    return new Response(message, { status: response.status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": response.headers.get("content-disposition") || 'attachment; filename="product-data-issues.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
