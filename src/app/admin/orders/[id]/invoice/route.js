import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/** Opens the PHP-style seller invoice (generate_invoice.php) for this order. */
export async function GET(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentAdmin();
  if (!user) return new Response("Sign in to open this invoice.", { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const response = await fetch(`${apiBase()}/admin/orders/${encodeURIComponent(decodeURIComponent(id))}/invoice`, {
    headers: { Authorization: `Bearer ${user.token}`, Accept: "text/html" },
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "text/html; charset=utf-8" },
  });
}
