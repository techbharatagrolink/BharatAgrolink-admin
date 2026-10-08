/**
 * Same-origin proxy for the browser: /api/v1/* -> <API_URL>/*.
 * The target is read on every request (not baked in at build time), so the
 * deployment only needs API_URL / NEXT_PUBLIC_API_URL as a runtime variable.
 */

export const dynamic = "force-dynamic";

const HOP_BY_HOP = ["connection", "keep-alive", "transfer-encoding", "upgrade", "host", "content-length", "accept-encoding"];

function target() {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
}

async function proxy(request, { params }) {
  const { path = [] } = await params;
  const url = `${target()}/${path.map(encodeURIComponent).join("/")}${new URL(request.url).search}`;

  const headers = new Headers(request.headers);
  for (const h of HOP_BY_HOP) headers.delete(h);
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip");
  if (ip && !headers.has("x-forwarded-for")) headers.set("x-forwarded-for", ip);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  let upstream;
  try {
    upstream = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch (error) {
    const reason = error?.cause?.code || error?.cause?.message || error?.message || "unknown";
    console.error(`[api proxy] ${request.method} ${url} failed:`, reason);
    // 503, not 502: Cloudflare replaces origin 502 responses with its own page and hides this message.
    return Response.json(
      { success: false, code: "API_UNREACHABLE", message: "The admin API is not reachable. Please try again shortly.", detail: { target: new URL(url).origin, reason } },
      { status: 503 }
    );
  }

  const out = new Headers(upstream.headers);
  for (const h of ["content-encoding", "content-length", "transfer-encoding", "connection"]) out.delete(h);
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: out });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as OPTIONS };
