import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/**
 * Same-origin copy of an allowlisted catalogue image (api/img_proxy.php), so
 * "Send on WhatsApp" can draw R2 product photos on a canvas without tainting it.
 */
export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return new Response("Not authorised", { status: 401 });
  const u = new URL(request.url).searchParams.get("u") || "";
  const upstream = await fetch(`${apiBase()}/admin/b2b/catalog-generator/image?u=${encodeURIComponent(u)}`, {
    headers: { Authorization: `Bearer ${user.token}` },
    cache: "no-store",
  });
  if (!upstream.ok) return new Response("Image unavailable", { status: upstream.status });
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
