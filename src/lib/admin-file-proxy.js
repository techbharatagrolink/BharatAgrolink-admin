import "server-only";
import { assertExport } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

/** 401 / 403 response when the signed-in admin may not export (super admins only), else null. */
export async function exportDenied() {
  const auth = await assertExport();
  return auth.ok ? null : text(auth.status === 401 ? "Sign in to download this file." : auth.message, auth.status);
}

/** Streams an API export (xlsx / csv) to the browser with the admin session token, passing only `params`. Super admins only. */
export async function proxyFileDownload(request, apiPath, params) {
  const auth = await assertExport();
  if (!auth.ok) return text(auth.status === 401 ? "Sign in to download this file." : auth.message, auth.status);
  const { user } = auth;
  const search = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const key of params) {
    const value = search.get(key);
    if (value) query.set(key, value.slice(0, 5000));
  }

  const response = await fetch(`${apiBase()}/${apiPath}?${query.toString()}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }
  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "application/octet-stream", "Cache-Control": "no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) out.set("Content-Disposition", disposition);
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
