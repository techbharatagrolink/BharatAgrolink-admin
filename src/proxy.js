import { NextResponse } from "next/server";

const SESSION_COOKIE = "ba_admin_session";

/**
 * Fast gate only: sends visitors without a session cookie to the login page.
 * The signature, expiry, user status and permissions are verified on the
 * server in lib/auth/session.js for every page and action.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname !== "/admin" && pathname !== "/admin/dashboard" ? `?next=${encodeURIComponent(pathname + search)}` : "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
