import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/** CSV download of the banner ad performance report (GET /admin/monetization/analytics.csv); the API checks the permission. */
export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return new Response("Sign in to download this report.", { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  for (const key of ["from", "to", "groupBy", "sellerId", "placementId"]) {
    const value = incoming.get(key);
    if (value) params.set(key, value);
  }
  const response = await fetch(`${apiBase()}/admin/monetization/analytics.csv?${params}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const message = (await response.json().catch(() => null))?.message || "The report could not be created.";
    return new Response(message, { status: response.status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": response.headers.get("content-disposition") || 'attachment; filename="banner-ad-performance.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
