import { flattenNavigation } from "../src/lib/content/admin/navigation.js";
import { resourceRoutes } from "../src/lib/content/admin/resources/index.js";
import { API_URL } from "./auth.mjs";

export const VIEWPORTS = [
  { name: "1600", width: 1600, height: 900 },
  { name: "1200", width: 1200, height: 900 },
  { name: "768", width: 768, height: 900 },
  { name: "480", width: 480, height: 900 },
  { name: "375", width: 375, height: 900 },
];

/** Matches admin-shell.jsx: the sidebar is fixed from Tailwind `md` (768px) up and a drawer below it. */
export const SIDEBAR_MIN_WIDTH = 768;

const DOWNLOAD_RE = /(\/download|\/export|\/invoice|\/print|\.(csv|xlsx?|pdf|zip))(\/|$)/i;

export const pathOf = (href) => (href || "").split("#")[0];

function isTestable(href) {
  return href.startsWith("/admin/") && !DOWNLOAD_RE.test(href) && !/\[|:/.test(href);
}

/** Every sidebar leaf and every generic resource route, read from the app's own config at run time. */
export function staticRoutes() {
  const set = new Set();
  for (const item of flattenNavigation()) if (item.href) set.add(pathOf(item.href));
  for (const route of Object.keys(resourceRoutes)) set.add(pathOf(route));
  set.add("/admin/account");
  set.add("/admin/help");
  set.add("/admin/not-ported?link=x.php&name=X");
  return [...set].filter(isTestable).sort();
}

const rowsOf = (data) => (Array.isArray(data) ? data : data?.rows || data?.items || data?.data || []);

/**
 * Detail screens: `api` lists records (first row's id is used), `list` is the screen whose
 * rendered links are crawled when the API gives nothing usable.
 */
export const DETAIL_ROUTES = [
  { route: "/admin/orders/[id]", api: "admin/orders", list: "/admin/orders", pick: (r) => r.orderId ?? r.id },
  { route: "/admin/products/[id]", api: "admin/lists/products", list: "/admin/products" },
  { route: "/admin/vendors/[id]", api: "admin/vendors", list: "/admin/vendors" },
  { route: "/admin/vendors/[id]/bank", api: "admin/vendors", list: "/admin/vendors" },
  { route: "/admin/customers/[id]", api: "admin/customers", list: "/admin/customers" },
  { route: "/admin/returns/[id]", api: "admin/returns", list: "/admin/returns" },
  { route: "/admin/payouts/[id]", api: "admin/payouts", list: "/admin/payouts" },
  { route: "/admin/support/[id]", api: "admin/support/tickets", list: "/admin/support" },
  { route: "/admin/crm/leads/[id]", api: "admin/crm/leads", list: "/admin/crm/leads" },
  { route: "/admin/b2b/buyers/[id]", api: "admin/b2b/buyers", list: "/admin/b2b/buyers" },
  { route: "/admin/b2b/orders/[id]", api: "admin/b2b/orders", list: "/admin/b2b/orders" },
  { route: "/admin/roles/[id]", api: "admin/access/roles", list: "/admin/roles" },
  { route: "/admin/catalog/feature-categories/[id]", api: "admin/parity/seller/feature-categories", list: "/admin/catalog/feature-categories" },
];

export async function resolveIdFromApi(spec, token) {
  const url = `${API_URL}/${spec.api}?pageSize=5`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal: AbortSignal.timeout(60_000) });
    if (!res.ok) return { id: null, note: `GET ${url} -> ${res.status} ${(await res.text()).slice(0, 300)}` };
    const body = await res.json();
    const row = rowsOf(body.data)[0];
    const id = row ? (spec.pick ? spec.pick(row) : row.id) : null;
    return { id: id == null ? null : String(id), note: row ? null : `GET ${url} returned no rows` };
  } catch (error) {
    return { id: null, note: `GET ${url} failed: ${error.message}` };
  }
}

/** Fallback: first link on the list screen that matches the detail route. */
export async function resolveIdFromList(page, spec) {
  const prefix = spec.route.split("/[id]")[0];
  const known = new Set(staticRoutes());
  await page.goto(spec.list, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  const hrefs = await page.locator(`main a[href^="${prefix}/"]`).evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  const re = new RegExp(`^${prefix.replace(/[/-]/g, "\\$&")}/([^/?#]+)(?:[?#]|$)`);
  for (const href of hrefs) {
    const m = href.match(re);
    if (m && m[1] !== "new" && !known.has(`${prefix}/${m[1]}`)) return decodeURIComponent(m[1]);
  }
  return null;
}

export const fillId = (route, id) => route.replace("[id]", encodeURIComponent(id));
