/**
 * Admin coverage map: every active PHP admin menu page (admin_menus) -> Node API -> /admin route.
 *
 * Writes docs/admin-coverage.md (and docs/admin-coverage.json). Run from the admin repo root:
 *   node docs/tools/build-coverage.mjs
 * Env: API_DIR (default ../BharatAgrolink-api-backend; its .env decides the database, read-only),
 *      PHP_ADMIN_DIR (default C:/xampp/htdocs/AMPL.BAadmin).
 *
 * Status of a menu page:
 *  - live:          the sidebar opens a Next screen that reads the admin API, and the API guards
 *                   that PHP page (a resource or an adminCan() route)
 *  - partial:       live, but the php-port audit (docs/php-port/inventory.json) flags known gaps,
 *                   or no API route checks this exact PHP page
 *  - not connected: a Next route renders but is not wired to the API (shows a notice)
 *  - missing:       no Next route (sidebar falls back to /admin/not-ported) or the route 404s
 */
import { register } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

register("../php-port/tools/alias-hooks.mjs", import.meta.url);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SRC = path.join(ROOT, "src");
const API = path.resolve(process.env.API_DIR || path.join(ROOT, "../BharatAgrolink-api-backend"));
const PHP = (process.env.PHP_ADMIN_DIR || "C:/xampp/htdocs/AMPL.BAadmin").replace(/\\/g, "/");
const imp = (p) => import(pathToFileURL(p).href);

const { navigation, flattenNavigation } = await imp(path.join(SRC, "lib/content/admin/navigation.js"));
const { resourceRoutes } = await imp(path.join(SRC, "lib/content/admin/resources/index.js"));
const { isLiveAdminPath } = await imp(path.join(SRC, "lib/services/admin/live-catalog.js"));
const sidebarSrc = fs.readFileSync(path.join(SRC, "lib/content/admin/sidebar.js"), "utf8");
const pending = new Set([...(sidebarSrc.match(/PENDING_ROUTES = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]));

/* ---------------------------------------------------------- Next routes */
const pageRoutes = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === "page.js" || f.name === "page.jsx") {
      const rel = path.relative(path.join(SRC, "app/admin/(panel)"), path.dirname(p)).split(path.sep).join("/");
      if (rel.includes("[...")) continue;
      const route = "/admin" + (rel ? `/${rel}` : "");
      pageRoutes.push({ route, re: new RegExp("^" + route.replace(/\[[^\]]+\]/g, "[^/]+") + "$"), dynamic: route.includes("[") });
    }
  }
})(path.join(SRC, "app/admin/(panel)"));

const pathOf = (href) => String(href ?? "").split(/[?#]/)[0];
function nextScreen(href) {
  const p = pathOf(href);
  const page = pageRoutes.find((r) => !r.dynamic && r.route === p) ?? (resourceRoutes[p] ? { route: p, generic: true } : null) ?? pageRoutes.find((r) => r.dynamic && r.re.test(p));
  return page ? { exists: true, kind: page.generic ? "resource" : "page", live: isLiveAdminPath(p) } : { exists: false, kind: null, live: false };
}

const norm = (l) => String(l ?? "").trim().replace(/^\/+/, "");
const leafByLink = new Map();
for (const leaf of flattenNavigation(navigation)) if (leaf.page) leafByLink.set(norm(leaf.page), leaf);
const routeFor = (link) => leafByLink.get(norm(link)) ?? leafByLink.get(norm(link).split(/[?#]/)[0]) ?? null;

/* ------------------------------------------------------------- Node API */
const walkJs = (d, acc = []) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walkJs(p, acc);
    else if (f.name.endsWith(".js")) acc.push(p);
  }
  return acc;
};
const guards = new Map(); // php page -> Set(api file)
for (const file of walkJs(path.join(API, "src/modules/admin"))) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(path.join(API, "src/modules/admin"), file).split(path.sep).join("/");
  // Any quoted PHP page in code (adminCan('x.php'), const PAGE = 'x.php', { php: 'x.php' }, arrays).
  const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  for (const m of code.matchAll(/['"`]([\w\-/]+\.php(?:[?#][^'"`]*)?)['"`]/g)) (guards.get(m[1]) ?? guards.set(m[1], new Set()).get(m[1])).add(rel);
}
const cwd = process.cwd();
process.chdir(API);
const { resources: apiResources } = await imp(path.join(API, "src/modules/admin/resources/index.js"));
const { query, closePool } = await imp(path.join(API, "src/db/pool.js"));
const { env } = await imp(path.join(API, "src/config/env.js"));
process.chdir(cwd);

const base = (l) => norm(l).split(/[?#]/)[0];
function apiFor(link) {
  const exact = norm(link);
  const files = new Set([...(guards.get(exact) ?? []), ...(guards.get(base(link)) ?? []), ...(guards.get(base(link).split("/").pop()) ?? [])]);
  const res = apiResources.filter((r) => [exact, base(link), base(link).split("/").pop()].includes(norm(r.page))).map((r) => `/admin${r.path}`);
  return { files: [...files].sort(), resources: res };
}

/* ------------------------------------------------------------ PHP + audit */
const inventoryPath = path.join(ROOT, "docs/php-port/inventory.json");
const audit = new Map();
// php-port audit notes verified obsolete since the audit ran (e.g. the screen now reads the API).
const KNOWN_DONE = new Set(["b2b_orders/index.php"]);
if (fs.existsSync(inventoryPath)) for (const p of JSON.parse(fs.readFileSync(inventoryPath, "utf8")).pages) audit.set(p.file, p);

const menus = await query("SELECT id, parent_id, menu_name, menu_link, menu_order, status FROM admin_menus ORDER BY parent_id, menu_order, id");
await closePool();
const byId = new Map(menus.map((m) => [m.id, m]));
const active = (m, seen = new Set()) => !!m && Number(m.status) === 1 && !seen.has(m.id) && (seen.add(m.id), m.parent_id ? active(byId.get(m.parent_id), seen) : true);
const groupOf = (m) => {
  const names = [];
  for (let p = byId.get(m.parent_id), g = 0; p && g < 10; p = byId.get(p.parent_id), g++) names.unshift(p.menu_name);
  return names.join(" › ");
};

const rows = [];
for (const m of menus) {
  const link = String(m.menu_link ?? "").trim();
  if (!active(m) || !link || (link.startsWith("#") && !link.startsWith("#dashboard_"))) continue;
  const leaf = routeFor(link);
  const href = leaf?.href ?? null;
  const screen = href ? nextScreen(href) : { exists: false, live: false };
  const isPending = href && pending.has(pathOf(href));
  const api = apiFor(link);
  const phpFile = base(link);
  const auditRec = audit.get(phpFile);
  const hasApi = api.files.length > 0 || api.resources.length > 0;
  let status;
  let reason = "";
  if (!href || isPending || !screen.exists) {
    status = "missing";
    reason = !href ? "No Next route mapped; sidebar opens /admin/not-ported." : isPending ? "Route listed as pending in sidebar.js; sidebar opens /admin/not-ported." : "Mapped route has no page (404).";
  } else if (!screen.live) {
    status = "not connected";
    reason = "Route renders but is not in the live (API-backed) route list.";
  } else if (!hasApi) {
    status = "partial";
    reason = "No API route checks this PHP page directly (screen uses another page's permission).";
  } else if (auditRec && ["PARTIAL", "MOCK"].includes(auditRec.status) && auditRec.note && !KNOWN_DONE.has(phpFile)) {
    status = "partial";
    reason = `php-port audit: ${auditRec.note}`.slice(0, 220);
  } else {
    status = "live";
    const gaps = auditRec ? auditRec.colGap.length + auditRec.fieldGap.length : 0;
    if (gaps) reason = `Verify: ${gaps} PHP column/field names not matched by name in the Next resource (heuristic, php-port audit).`;
  }
  rows.push({
    id: m.id,
    group: groupOf(m),
    name: m.menu_name,
    link,
    phpExists: link.startsWith("#") || fs.existsSync(path.join(PHP, phpFile)),
    route: href ? pathOf(href) + (href.includes("#") ? `#${href.split("#")[1]}` : "") : null,
    screen: screen.kind ?? null,
    apiResources: api.resources,
    apiFiles: api.files,
    status,
    reason,
  });
}

const nextOnly = flattenNavigation(navigation)
  .filter((l) => l.href && !l.page)
  .map((l) => ({ label: l.label, route: pathOf(l.href), ...nextScreen(l.href) }));

/* --------------------------------------------------------------- output */
const STATUSES = ["live", "partial", "not connected", "missing"];
const count = (s) => rows.filter((r) => r.status === s).length;
const esc = (s) => String(s ?? "").replace(/\|/g, "/");
let md = `# Admin coverage: PHP menu -> Node API -> /admin

Generated by \`node docs/tools/build-coverage.mjs\` on ${new Date().toISOString().slice(0, 10)} from \`admin_menus\` in \`${env.db.database}\` (active rows whose parents are active; group rows "#..." skipped).
Do not edit by hand; re-run the tool. Detailed per-page checklists: \`docs/php-port/PAGE_INVENTORY.md\`.

**Status**
- **live**: sidebar opens a Next screen backed by the admin API, and an API route/resource checks this PHP page's permission.
- **partial**: live, but the php-port audit flags known gaps, or the API guards it under another page.
- **not connected**: a Next route renders but is not wired to the API.
- **missing**: no Next route (sidebar opens /admin/not-ported) or the route 404s.

## Summary

| Status | Menu pages |
| --- | --: |
${STATUSES.map((s) => `| ${s} | ${count(s)} |`).join("\n")}
| **total** | **${rows.length}** |

## Menu pages

| # | Group | Menu | PHP link | /admin route | API (resource or module) | Status | Note |
| --: | --- | --- | --- | --- | --- | --- | --- |
${rows
  .map(
    (r) =>
      `| ${r.id} | ${esc(r.group)} | ${esc(r.name)} | \`${esc(r.link)}\`${r.phpExists ? "" : " (file not found)"} | ${r.route ? `\`${r.route}\`` : "—"} | ${esc([...r.apiResources.map((x) => `\`${x}\``), ...r.apiFiles.slice(0, 3)].join(", ") || "—")}${r.apiFiles.length > 3 ? ` +${r.apiFiles.length - 3}` : ""} | ${r.status} | ${esc(r.reason)} |`
  )
  .join("\n")}

## Next-only screens (no admin_menus row)

| Screen | Route | Renders | API-backed |
| --- | --- | --- | --- |
${nextOnly.map((n) => `| ${esc(n.label)} | \`${n.route}\` | ${n.exists ? "yes" : "**404**"} | ${n.live ? "yes" : "no"} |`).join("\n")}
`;
fs.writeFileSync(path.join(ROOT, "docs/admin-coverage.md"), md);
fs.writeFileSync(path.join(ROOT, "docs/admin-coverage.json"), JSON.stringify({ generatedAt: new Date().toISOString(), counts: Object.fromEntries(STATUSES.map((s) => [s, count(s)])), rows, nextOnly }, null, 1));
console.log(Object.fromEntries(STATUSES.map((s) => [s, count(s)])), "total", rows.length, "| next-only", nextOnly.length, "404:", nextOnly.filter((n) => !n.exists).map((n) => n.route).join(", "));
process.exit(0);
