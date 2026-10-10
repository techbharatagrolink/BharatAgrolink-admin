import fs from "node:fs";
import path from "node:path";

export const SESSION_COOKIE = "ba_admin_session";
export const AUTH_FILE = path.resolve("e2e/.auth/admin.json");
export const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3058";
export const API_URL = (process.env.E2E_API_URL || process.env.API_URL || "http://localhost:5058/api/v1").replace(/\/$/, "");

export const SKIP_MESSAGE =
  "Admin E2E needs a session: set ADMIN_E2E_EMAIL + ADMIN_E2E_PASSWORD (logs in via /admin/login) " +
  "or ADMIN_E2E_TOKEN (an admin API bearer token, used as the ba_admin_session cookie).";

export function authMode() {
  if (process.env.ADMIN_E2E_EMAIL && process.env.ADMIN_E2E_PASSWORD) return "login";
  if (process.env.ADMIN_E2E_TOKEN) return "token";
  return null;
}

export const hasAuth = () => authMode() !== null;

/** The bearer token behind the saved session (the cookie value is the API token). */
export function sessionToken() {
  if (process.env.ADMIN_E2E_TOKEN) return process.env.ADMIN_E2E_TOKEN;
  try {
    const state = JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"));
    return state.cookies.find((c) => c.name === SESSION_COOKIE)?.value || null;
  } catch {
    return null;
  }
}

export function writeStorageState(cookies = []) {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, origins: [] }, null, 2));
}

export function tokenCookie(token) {
  return {
    name: SESSION_COOKIE,
    value: token,
    domain: new URL(BASE_URL).hostname,
    path: "/",
    expires: Math.floor(Date.now() / 1000) + 12 * 3600,
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  };
}
