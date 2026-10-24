import { getCurrentAdmin } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/*
 * 301 URL Redirects CSV files with the admin session token:
 *   /admin/cms/redirects/download?file=export  -> every rule (PHP redirects_process.php?action=export)
 *   /admin/cms/redirects/download?file=sample  -> import template (action=sample)
 */
const FILES = { export: "export", sample: "sample" };
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return text("Sign in to download this file.", 401);
  const file = FILES[new URL(request.url).searchParams.get("file")];
  if (!file) return text("Unknown file.", 404);

  const response = await fetch(`${apiBase()}/admin/cms/redirects/${file}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }
  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "text/csv; charset=utf-8", "Cache-Control": "no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) out.set("Content-Disposition", disposition);
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
