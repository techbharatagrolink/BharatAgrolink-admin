const DEFAULT_API_URL = "http://localhost:5000/api/v1";

/**
 * Server calls the API directly. The browser uses the same-origin `/api/v1`
 * rewrite (see next.config.mjs) unless NEXT_PUBLIC_API_URL already points at
 * this page's origin, so the admin port is not blocked by API CORS.
 */
export function apiBase() {
  const configured = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, "");
  if (typeof window === "undefined") {
    // Computed keys so the runtime value is used, not one inlined at build time.
    const env = (name) => process.env[name];
    return (env("API_URL") || env("NEXT_PUBLIC_API_URL") || DEFAULT_API_URL).replace(/\/$/, "");
  }
  try {
    if (new URL(configured).origin === window.location.origin) return configured;
  } catch {
    /* relative or empty */
  }
  return "/api/v1";
}

export class ApiError extends Error {
  constructor(message, { code, status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function resolveUrl(path, query) {
  const base = apiBase();
  const origin = typeof window === "undefined" ? "http://127.0.0.1" : window.location.origin;
  const absolute = /^https?:\/\//i.test(base) ? base : new URL(base, origin).href;
  const url = new URL(path.replace(/^\//, ""), absolute.endsWith("/") ? absolute : `${absolute}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export async function api(path, { token, method = "GET", body, query, signal } = {}) {
  const response = await fetch(resolveUrl(path, query), {
    method,
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || `Request failed (${response.status})`, {
      code: payload?.code,
      status: response.status,
      details: payload?.details,
    });
  }

  return { data: payload?.data, meta: payload?.meta ?? null };
}

export async function apiDownload(path, { token, query } = {}) {
  const response = await fetch(resolveUrl(path, query), {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
    throw new ApiError(payload?.message || `Download failed (${response.status})`, {
      code: payload?.code,
      status: response.status,
      details: payload?.details,
    });
  }
  return response.blob();
}
