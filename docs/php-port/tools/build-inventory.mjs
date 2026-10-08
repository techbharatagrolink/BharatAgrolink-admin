/**
 * PHP admin -> Next.js admin port inventory.
 *
 * Scans the legacy PHP admin (AMPL.BAadmin), the Node admin API and this Next.js
 * app, and writes:
 *   docs/php-port/PAGE_INVENTORY.md      every PHP page: Next route, status, size, and its functionality checklist
 *   docs/php-port/ENDPOINT_MAP.md        every PHP endpoint (get_*, *_process, api/...) with the pages that call it
 *   docs/php-port/BACKEND_ADMIN_ROUTES.md every route the Node API serves under /admin
 *   docs/php-port/inventory.json          the same data for scripts
 *
 * Run from the admin repo root:  node docs/php-port/tools/build-inventory.mjs
 * Paths: PHP_ADMIN_DIR (default C:/xampp/htdocs/AMPL.BAadmin), API_DIR (default ../BharatAgrolink-api-backend).
 *
 * Status is a starting point, not a verdict: "AUDIT" still needs the per-page parity
 * check in IMPLEMENTATION_PLAN.md, and "LEGACY?" pages must be confirmed against
 * admin_menus before they are dropped.
 */
import { register } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

register("./alias-hooks.mjs", import.meta.url);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_ROOT = path.resolve(HERE, "../../..");
const SRC = path.join(ADMIN_ROOT, "src");
const OUT = path.resolve(HERE, "..");
const PHP = (process.env.PHP_ADMIN_DIR || "C:/xampp/htdocs/AMPL.BAadmin").replace(/\\/g, "/");
const API = path.resolve(process.env.API_DIR || path.join(ADMIN_ROOT, "../BharatAgrolink-api-backend"));

const read = (p) => {
  try {
    return fs.readFileSync(p, "latin1");
  } catch {
    return "";
  }
};
const uniq = (a) => [...new Set(a.filter(Boolean))];
const rel = (p) => p.split(path.sep).join("/");

/* ------------------------------------------------------------------ PHP scan */

const MODULE_DIRS = ["", "b2b_orders", "bulk_orders", "operations_center", "operations_team", "support", "pages", "api"];
const SUB_DIRS = MODULE_DIRS.filter(Boolean);
const SKIP_INCLUDE = /header|footer|session|db\.php|config|common_function|init\.php|panel_init|_nav\.php|functions|helpers?\.php|aisensy|r2_storage/i;
const SKIP_JS = /jquery|bootstrap|datatables|select2|chart|moment|sweetalert|toastr|summernote|ckeditor|vendor|plugins|libs?\/|ag-grid|flatpickr|daterangepicker/i;
const ENDPOINT_NAME = /^(get_|server_|delete_|verify_|verfiy_|update_|change_|check_|ajax_|fetch_|cron|install_|test|debug|export_|download_)|_process\.php$|_api\.php$|_ajax\.php$|_cron\.php$/i;

function listPhp() {
  const files = [];
  for (const d of MODULE_DIRS) {
    const abs = path.join(PHP, d);
    if (!fs.existsSync(abs)) continue;
    const walkApi = (dir) => {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory() && d === "api") walkApi(p);
        else if (f.isFile() && f.name.endsWith(".php")) files.push(rel(path.relative(PHP, p)));
      }
    };
    if (d === "api") walkApi(abs);
    else for (const f of fs.readdirSync(abs)) if (f.endsWith(".php")) files.push(d ? `${d}/${f}` : f);
  }
  // module api and cron folders (b2b_orders/api, b2b_orders/cron, bulk_orders/api, operations_*/api)
  for (const d of ["b2b_orders", "bulk_orders", "operations_center", "operations_team"]) {
    for (const sub of ["api", "cron"]) {
      const subDir = path.join(PHP, d, sub);
      if (!fs.existsSync(subDir)) continue;
      const walk = (dir) => {
        for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, f.name);
          if (f.isDirectory()) walk(p);
          else if (f.name.endsWith(".php")) files.push(rel(path.relative(PHP, p)));
        }
      };
      walk(subDir);
    }
  }
  return uniq(files);
}

/** Page source plus module-local includes (modals, list runtimes) and its own JS files. */
function expandedSource(file) {
  const abs = path.join(PHP, file);
  const dir = path.dirname(abs);
  let src = read(abs);
  for (const m of src.matchAll(/(?:include|require)(?:_once)?\s*\(?\s*(?:__DIR__\s*\.\s*)?['"]\/?([\w\-\/.]+\.php)['"]/g)) {
    if (SKIP_INCLUDE.test(m[1])) continue;
    src += "\n" + read(path.join(dir, m[1]));
  }
  for (const m of src.matchAll(/<script[^>]+src=['"](?!https?:|\/\/)([^'"?]+\.js)/g)) {
    if (SKIP_JS.test(m[1])) continue;
    src += "\n" + read(path.join(dir, m[1]));
  }
  return src;
}

const strip = (h) => h.replace(/<\?(php|=)[\s\S]*?\?>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;|&times;/g, " ").replace(/\s+/g, " ").trim();
const clean = (s) => s.replace(/[|`]/g, "/").replace(/[^\x20-\x7e₹]/g, "").trim();

function features(src) {
  const th = uniq([...src.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => clean(strip(m[1])).slice(0, 40)));
  const gridCols = uniq([...src.matchAll(/headerName\s*:\s*['"]([^'"]{1,40})['"]/g)].map((m) => clean(m[1])));
  const columns = uniq([...th, ...gridCols]).filter((c) => c && !/^(#|s\.?\s?no\.?|sr\.?( no\.?)?|action|actions)$/i.test(c) && !/[<>{}$+]/.test(c));
  const inputs = uniq([...src.matchAll(/<(?:input|select|textarea)\b[^>]*\bname=['"]([\w\[\]\-]+)['"]/gi)].map((m) => m[1])).filter((n) => !/^(csrf|_token|token|draw|length|start)$/i.test(n));
  const filters = uniq([...src.matchAll(/<(?:input|select)\b[^>]*\b(?:id|name)=['"]([\w\-]*(?:filter|search|from_?date|to_?date|date_?from|date_?to|start_?date|end_?date|daterange|date_range|month|year)[\w\-]*)['"]/gi)].map((m) => m[1]));
  const modals = uniq([...src.matchAll(/<div\b[^>]*class=['"][^'"]*\bmodal\b(?!-)[^'"]*['"][^>]*\bid=['"]([\w\-]+)['"]|<div\b[^>]*\bid=['"]([\w\-]+)['"][^>]*class=['"][^'"]*\bmodal\b(?!-)/gi)].map((m) => m[1] || m[2]));
  const buttons = uniq([...src.matchAll(/<(?:button|a)\b[^>]*(?:btn|button)[^>]*>([\s\S]{1,160}?)<\/(?:button|a)>/gi)].map((m) => clean(strip(m[1])).slice(0, 40))).filter((t) => t.length > 1 && !/^[\d\W]+$/.test(t) && !/^(close|cancel|x|no)$/i.test(t) && !/["'+]/.test(t));
  const ajax = uniq([...src.matchAll(/(?:url\s*:\s*|fetch\(\s*|\$\.(?:post|get|ajax|getJSON)\(\s*|action=|href=|location(?:\.href)?\s*=\s*|window\.open\(\s*)['"`](?:\.\.\/|\.\/)?([\w\-\/]+\.php)/g)].map((m) => m[1]));
  const exports = /export|excel|csv|xlsx/i.test(src);
  const prints = /window\.print|tcpdf|dompdf|mpdf|\.pdf['"]|print\(/i.test(src);
  const uploads = /type=['"]file['"]/i.test(src);
  const charts = /new Chart\(|ApexCharts|Highcharts|google\.visualization|echarts/i.test(src);
  return { columns, inputs, filters, modals, buttons, ajax, exports, prints, uploads, charts };
}

function phpTables(src) {
  const t = new Set();
  for (const m of src.matchAll(/\b(?:FROM|JOIN|INTO|UPDATE)\s+`?([a-z_][a-z0-9_]{2,})`?/gi)) {
    const name = m[1].toLowerCase();
    if (name.includes("_") || /^(orders|category|brand|payment|leads|tax|faq|settings|country|state|city|currency|language|events|banners|coupons|tickets|courier|pincodes|pages|roles|seometa|sellerlogin)$/.test(name)) t.add(name);
  }
  return [...t].filter((n) => !/^(information_schema|current_timestamp)$/.test(n));
}

function phpRefs(src) {
  const refs = new Set();
  for (const m of src.matchAll(/['"`(=]\s*(?:\.\.\/|\.\/)?((?:api\/|b2b_orders\/|bulk_orders\/|operations_center\/|operations_team\/|support\/|pages\/)?[\w\-\/]+\.php)(?:\?[^'"`\s]*)?/g)) {
    if (!m[1].includes("includes/")) refs.add(m[1]);
  }
  return [...refs];
}

const phpFiles = listPhp();
const php = new Map();
for (const file of phpFiles) {
  const own = read(path.join(PHP, file));
  const name = file.split("/").pop();
  const isPageSrc = /(header\.php|panel_header\.php|panel_simple_list\.php|includes\/header\.php)['")]/.test(own) || /<!DOCTYPE html|<html/i.test(own);
  const kind = isPageSrc && !ENDPOINT_NAME.test(name) && !file.includes("/api/") && !file.startsWith("api/") ? "PAGE" : "ENDPOINT";
  const src = kind === "PAGE" ? expandedSource(file) : own;
  php.set(file, { file, kind, lines: own.split("\n").length, refs: phpRefs(src).filter((r) => r !== name), tables: phpTables(src), ...(kind === "PAGE" ? features(src) : {}) });
}

function resolveRef(from, ref) {
  const dir = from.includes("/") ? from.split("/").slice(0, -1).join("/") : "";
  const cands = [];
  if (SUB_DIRS.some((d) => ref.startsWith(d + "/"))) cands.push(ref);
  if (dir) cands.push(`${dir}/${ref}`, `${dir.split("/")[0]}/${ref}`);
  cands.push(ref);
  return cands.find((c) => php.has(c)) ?? null;
}
for (const f of php.values()) f.links = uniq(f.refs.map((r) => resolveRef(f.file, r)));

/* --------------------------------------------------------------- Next admin */

const { navigation } = await import(pathToFileURL(path.join(SRC, "lib/content/admin/navigation.js")).href);
const { resources: nextResources, resourceRoutes } = await import(pathToFileURL(path.join(SRC, "lib/content/admin/resources/index.js")).href);
const liveCatalog = await import(pathToFileURL(path.join(SRC, "lib/services/admin/live-catalog.js")).href);
const parity = await import(pathToFileURL(path.join(SRC, "lib/content/admin/resources/parity/index.js")).href);

const navLeaves = [];
const walkNav = (items, section, group) => {
  for (const it of items ?? []) {
    if (it.href) navLeaves.push({ section, group, label: it.label, href: it.href, page: it.page ?? null, permission: it.permission });
    if (it.children) walkNav(it.children, section, it.label);
  }
};
for (const s of navigation) walkNav(s.items, s.section ?? "", null);

const isLive = (route) => {
  const r = route.split("#")[0].split("?")[0];
  return liveCatalog.isLiveAdminPath(r);
};
const liveSpecs = { ...liveCatalog.LIVE_RESOURCES, ...parity.parityLive };
const keyRoutes = {};
for (const [route, key] of Object.entries(resourceRoutes)) (keyRoutes[key] ??= []).push(route);

const appPages = [];
const walkApp = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walkApp(p);
    else if (f.name === "page.js") appPages.push({ file: rel(path.relative(ADMIN_ROOT, p)), route: "/admin/" + rel(path.relative(path.join(SRC, "app/admin/(panel)"), path.dirname(p))).replace(/^\.$/, "") });
  }
};
walkApp(path.join(SRC, "app/admin/(panel)"));
const appText = Object.fromEntries(appPages.map((a) => [a.file, fs.readFileSync(path.join(ADMIN_ROOT, a.file), "utf8")]));

/* ------------------------------------------------------------ Node admin API */

const walkJs = (d, acc = []) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name === "node_modules" || f.name.startsWith(".")) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walkJs(p, acc);
    else if (/\.(m?js)$/.test(f.name)) acc.push(p);
  }
  return acc;
};
const apiText = walkJs(path.join(API, "src")).map((p) => fs.readFileSync(p, "utf8")).join("\n");
const apiLower = apiText.toLowerCase();
const apiHasTable = (t) => new RegExp("(^|[^a-z0-9_])" + t + "([^a-z0-9_]|$)").test(apiLower);
const apiMentions = (file) => apiText.includes(file) || apiText.includes(file.split("/").pop());

// Backend resources (config-driven lists) and every mounted route.
const cwd = process.cwd();
process.chdir(API);
const expressMod = (await import(pathToFileURL(path.join(API, "node_modules/express/index.js")).href)).default;
const routerProto = Object.getPrototypeOf(Object.getPrototypeOf(expressMod.Router()));
const meta = new WeakMap();
const metaOf = (r) => (meta.has(r) ? meta.get(r) : meta.set(r, { mounts: [], routes: [] }).get(r));
const origUse = routerProto.use;
routerProto.use = function (...args) {
  const hasPath = typeof args[0] === "string";
  for (const fn of (hasPath ? args.slice(1) : args).flat()) if (typeof fn === "function" && fn.stack) metaOf(this).mounts.push({ path: hasPath ? args[0] : "/", router: fn });
  return origUse.apply(this, args);
};
for (const m of ["get", "post", "put", "patch", "delete"]) {
  const orig = routerProto[m];
  routerProto[m] = function (p, ...rest) {
    if (typeof p === "string") metaOf(this).routes.push({ method: m.toUpperCase(), path: p });
    return orig.call(this, p, ...rest);
  };
}
const { adminRouter } = await import(pathToFileURL(path.join(API, "src/routes/admin.js")).href);
const { resources: apiResources } = await import(pathToFileURL(path.join(API, "src/modules/admin/resources/index.js")).href);
process.chdir(cwd);
const apiRoutes = [];
const join = (a, b) => (a + "/" + b).replace(/\/+/g, "/").replace(/(.)\/$/, "$1");
const walkRouter = (router, prefix, seen = new Set()) => {
  if (seen.has(router)) return;
  seen.add(router);
  const m = meta.get(router);
  if (!m) return;
  for (const r of m.routes) apiRoutes.push(`${r.method} ${join(prefix, r.path)}`);
  for (const mt of m.mounts) walkRouter(mt.router, join(prefix, mt.path), new Set(seen));
};
walkRouter(adminRouter(), "/admin");
const apiRouteList = uniq(apiRoutes);
const apiResourceByPage = {};
for (const r of apiResources) (apiResourceByPage[r.page] ??= []).push(r);

/* ----------------------------------------------------------- reachability */

const navPages = uniq(navLeaves.map((l) => l.page?.split("?")[0].split("#")[0]).filter((p) => p?.endsWith(".php")));
const moduleNavFiles = { b2b_orders: ["includes/panel_init.php", "includes/panel_header.php"], bulk_orders: ["includes/header.php"], operations_center: ["_nav.php"] };
const roots = [...navPages, "index.php", "header.php", "support/admin_dashboard.php"];
for (const [dir, navFiles] of Object.entries(moduleNavFiles)) {
  for (const nf of navFiles) {
    for (const m of read(path.join(PHP, dir, nf)).matchAll(/['"]((?:\.\.\/)?[\w\-\/]+\.php)(?:\?[^'"]*)?['"]/g)) {
      const ref = m[1].replace(/^\.\.\//, "");
      const c = php.has(`${dir}/${ref}`) ? `${dir}/${ref}` : php.has(ref) ? ref : null;
      if (c && php.get(c).kind === "PAGE") roots.push(c);
    }
  }
}
const header = php.get("header.php");
if (header) header.links = uniq([...header.links, ...phpRefs(read(path.join(PHP, "header.php"))).map((r) => resolveRef("header.php", r))]);
const reachable = new Set();
const queue = roots.filter((r) => php.has(r));
while (queue.length) {
  const f = queue.shift();
  if (reachable.has(f) || f === "header_old.php") continue;
  reachable.add(f);
  for (const l of php.get(f).links) if (!reachable.has(l) && l !== "header_old.php") queue.push(l);
}
const callers = {};
for (const f of php.values()) for (const l of f.links) (callers[l] ??= new Set()).add(f.file);

/* ----------------------------------------------------- module + phase map */

const MODULES = {
  auth: "Auth & account",
  dash: "Dashboards & reports",
  orders: "Orders (B2C)",
  products: "Products",
  catalog: "Catalog masters & pricing",
  sellers: "Sellers",
  customers: "Customers & users",
  shipping: "Shipping, logistics & returns",
  finance: "Finance & payouts",
  crm: "CRM & leads",
  sales: "Sales targets & performance",
  marketing: "Marketing",
  cms: "CMS & content",
  b2b: "B2B",
  bulk: "Bulk orders",
  ops: "Operations",
  support: "Support, reviews & hiring",
  admin: "Admin, roles & settings",
  infra: "Shared / infrastructure",
};
const EXACT_MODULE = {
  "index.php": "auth", "forget_password.php": "auth", "forget_password_data.php": "auth", "profile.php": "auth", "no-premission.php": "infra",
  "header.php": "infra", "header_old.php": "infra", "common_function.php": "infra", "image.php": "infra", "form1.php": "infra", "homepage.php": "cms",
  "dashboard.php": "dash", "main_dashboard.php": "dash", "ceo_decision_matrix.php": "dash", "score_management.php": "dash", "reports.php": "dash", "reports_old.php": "dash",
  "returns_refunds_report.php": "finance", "manual_payment_attempts.php": "orders", "generate_quotation.php": "b2b", "send_mail.php": "sellers",
  "vendor_package_boxes.php": "catalog", "other_charges.php": "shipping", "order-tracking-logs.php": "customers", "commission.php": "catalog",
  "customer_search_tracking.php": "crm", "engagement_panel.php": "marketing", "manage_engagement_leads.php": "crm", "regenerate_label.php": "orders",
  "seller_transaction.php": "finance", "manage_seller_wise_transaction.php": "finance", "kyc_document.php": "sellers", "track_multiple_awbs.php": "shipping",
  "popular_product.php": "cms", "offer-products.php": "marketing", "days_price.php": "products", "price_calculator.php": "catalog", "edit-deliveryb-bankdetails.php": "customers",
  "order_notification_settings.php": "admin", "all_chats.php": "support", "support_chat.php": "support", "ticket_replay.php": "support",
};
function moduleOf(file) {
  if (EXACT_MODULE[file]) return EXACT_MODULE[file];
  if (file.startsWith("b2b_orders/")) return "b2b";
  if (file.startsWith("bulk_orders/")) return "bulk";
  if (file.startsWith("operations_center/") || file.startsWith("operations_team/")) return "ops";
  if (file.startsWith("support/")) return "support";
  if (file.startsWith("pages/")) return "cms";
  const n = file.replace(/^api\//, "");
  const rules = [
    [/scores?\/|score_|ceo_|main_dashboard|dashboard_data|get_dashboard/, "dash"],
    [/lead|crm|vapi|call_audit|whatsapp_session|circle/, "crm"],
    [/sales_|my_sales|incentive|achievement|salary/, "sales"],
    [/pending_(brand|category|tax|return_policy|attribute)|category|brand|attribute|hsn|tax_class|tax\.php|return_policy|nrv|price_calc|commission|feature_categor|shop_topic|topic|product_cost/, "catalog"],
    [/payout|finance|ledger|wallet|hold_|expense|fraud|payment|settlement|transaction|refund|service_charge|fixed_exp|gst|tcs/, "finance"],
    [/ship|courier|delhivery|servicebil|serviceab|awb|pickup|return|rto|weight|label|minimum|cod_|shipping|master_delivered|track|nimbus|ndr|logistics/, "shipping"],
    [/order|invoice|whatsapp_orders|buy-from|other-country|other_country/, "orders"],
    [/seller|vendor|kyc/, "sellers"],
    [/product|import|bulk_upload|stock|inventory/, "products"],
    [/coupon|coupan|social|marketing|engagement|offer|campaign/, "marketing"],
    [/blog|banner|meta|page|homepage|home|event|notification|faq|custom|seo|footer/, "cms"],
    [/support|ticket|chat|review|requirement|vacanc|career|application/, "support"],
    [/app-user|appuser|user_profile|delivery|customer/, "customers"],
    [/staff|role|menu|setting|language|currency|email_template|reject|country|state|city|signup|script|smtp|sms|password|login|logout|audit/, "admin"],
  ];
  for (const [re, mod] of rules) if (re.test(n)) return mod;
  return "infra";
}

/* --------------------------------------------------- manual route targets */

// [route, status, note]. status "auto" = MISSING when reachable in PHP, LEGACY? when not.
const MANUAL = {
  "index.php": ["/admin/login", "AUDIT", "Same admin_login accounts and password key. Check remember-me (panel_remember_tokens) and login audit."],
  "forget_password.php": ["/admin/forgot-password", "MISSING", "Admin forgot-password flow; the API has no endpoint yet."],
  "forget_password_data.php": ["/admin/forgot-password", "MISSING", "Submit handler of forget_password.php."],
  "profile.php": ["/admin/account", "MOCK", "getMyAccount() reads the mock store. Wire profile view/update and change-password (POST /admin/auth/change-password exists)."],
  "dashboard.php": ["/admin/dashboard", "PARTIAL", "4k-line landing page with dashboard_modals.php and ~50 data endpoints. Verify every card, the #dashboard_*_overview sections, each drill-down modal and filter."],
  "add_product.php": ["/admin/products/new", "AUDIT", "7k lines with its endpoints: verify every field, variation, attribute, image, SEO and pricing rule."],
  "create_order.php": ["/admin/orders/new", "AUDIT", "Manual order: verify customer search/create, address, product + seller pick, pricing, COD/prepaid/partial, payment link, manual payment attempts."],
  "header.php": ["(admin shell)", "INFRA", "Sidebar is built from admin_menus (GET /admin/auth/menu → lib/content/admin/sidebar.js). Still to port: notification bell (pending_notification.php), product change-log modal, Ctrl+K page search over admin_menus."],
  "header_old.php": ["-", "INFRA", "Old sidebar. Pages linked only from here are legacy candidates."],
  "support/header.php": ["-", "INFRA", ""],
  "common_function.php": ["(API services)", "INFRA", "Shared helpers (menu permissions, labels, notifications). Port each helper with the first screen that needs it."],
  "no-premission.php": ["(PermissionDenied)", "INFRA", ""],
  "edit_order.php": ["/admin/orders/[id]", "PARTIAL", "10.7k-line order desk: line status, address, payment, AWB, boxes, shipments, remarks, verification, sales agent, responsible, timeline, invoices, labels. Largest parity item."],
  "manual_payment_attempts.php": ["/admin/orders/payment-attempts", "MISSING", "Linked from create_order.php. Table manual_order_payment_attempts is not used by the API."],
  "regenerate_label.php": ["/admin/orders/[id] (action)", "MISSING", "Regenerate shipping label; used by edit_order and ops order details."],
  "invoice.php": ["/admin/orders/invoices/[no]", "auto", "Invoice print view (current download is api/download_invoice.php)."],
  "view_invoice.php": ["/admin/orders/invoices/[no]", "auto", ""],
  "order-tracking-logs.php": ["/admin/customers/[id]/tracking-logs", "MISSING", "Opened from app-user.php."],
  "generate_quotation.php": ["/admin/b2b/quotations/[id]/pdf", "MISSING", "Quotation print/PDF used by B2B quotations."],
  "edit_product.php": ["/admin/products/[id]", "PARTIAL", "Editor is on the API. Verify every tab: variations, attributes, images, SEO, pricing/NRV, vendor offers, FAQ, timeline."],
  "view_product.php": ["/admin/products/[id]", "PARTIAL", "Read-only product view (also opened from B2B catalog and edit_order)."],
  "import_products_excel.php": ["/admin/products/import", "PARTIAL", "Import + validate exist. Check update mode, column mapping (bulk_products_map.php), export_products_excel.php, import_worker.php."],
  "bulk_upload_product.php": ["/admin/products/import", "auto", ""],
  "view_pending_product.php": ["/admin/products/pending/[id]", "auto", "Pending product review page."],
  "view_pending_product_details.php": ["/admin/products/pending/[id]", "auto", "Pending detail-change review."],
  "pending_product_details.php": ["/admin/products/pending/details", "auto", "Queue of pending product detail changes."],
  "reject-pending-product-details.php": ["/admin/products/pending/[id] (action)", "auto", ""],
  "pending_brand.php": ["/admin/catalog/brands?approval=Pending", "PARTIAL", "Pending tab exists; verify columns and approve/reject side effects."],
  "pending_category.php": ["/admin/catalog/categories?approval=Pending", "PARTIAL", "Pending tab exists; verify columns and approve/reject side effects."],
  "pending_tax.php": ["/admin/catalog/tax-classes (pending)", "auto", ""],
  "pending_return_policy.php": ["/admin/catalog/return-policies (pending)", "auto", ""],
  "pending_attribute_conf.php": ["/admin/catalog/attributes (pending)", "auto", ""],
  "pending_attribute_set.php": ["/admin/catalog/attribute-sets (pending)", "auto", ""],
  "manage_conf_attributes_val.php": ["/admin/catalog/attributes/[id]/values", "auto", "Attribute values (opened from js/admin/manage_attributes.js)."],
  "manage_attribute_set.php": ["/admin/catalog/attribute-sets", "auto", "Table attribute_set is not used by the API."],
  "manage_product_info_attributes.php": ["/admin/catalog/product-info", "auto", "Tables product_info / product_info_set are not used by the API."],
  "manage_product_info_attributes_val.php": ["/admin/catalog/product-info/[id]/values", "auto", ""],
  "commission.php": ["/admin/catalog/categories (commission)", "auto", "Category commission editor (linked from js/admin/category.js)."],
  "price_calculator.php": ["/admin/pricing", "AUDIT", "NRV price calculator."],
  "edit_brand.php": ["/admin/catalog/brands (edit form)", "auto", "brand.php edits in a modal."],
  "edit_category.php": ["/admin/catalog/categories (edit form)", "auto", "category.php edits in a modal."],
  "edit_seller_profile.php": ["/admin/vendors/[id]", "PARTIAL", "Vendor detail is on the API. Verify profile edit, documents, bank, GST/PAN verification, pickup, commission, status, send mail, ledger links."],
  "edit-seller-bankdetails.php": ["/admin/vendors/[id] (bank tab)", "MISSING", ""],
  "kyc_document.php": ["/admin/vendors/[id] (KYC tab)", "MISSING", ""],
  "send_mail.php": ["/admin/vendors/[id] (send mail action)", "MISSING", "Also used from customer and delivery-boy profiles."],
  "vendor_reports.php": ["/admin/vendors/reports", "auto", ""],
  "edit_user_profile.php": ["/admin/customers/[id]", "PARTIAL", "Customer detail is on the API. Verify profile edit, addresses, orders, wallet, tracking logs."],
  "add-app-user.php": ["/admin/customers/new", "auto", ""],
  "wallet-transactions.php": ["/admin/finance/wallet/transactions", "MISSING", ""],
  "wallet-withdraw-requests.php": ["/admin/finance/wallet-withdrawals", "PARTIAL", "List exists; verify approve/reject/pay actions."],
  "wallet_balance.php": ["/admin/finance/wallet/balances", "auto", ""],
  "wallet_ledger.php": ["/admin/finance/ledger/wallet", "MISSING", ""],
  "finance_ledger_management.php": ["/admin/finance/ledger-management", "MISSING", "Hub for customer/vendor/wallet ledgers, payment history, settlements and finance reports."],
  "customer_ledger.php": ["/admin/finance/ledger/customers", "MISSING", ""],
  "vendor_ledger.php": ["/admin/finance/ledger/vendors", "MISSING", ""],
  "payment_history.php": ["/admin/finance/ledger/payments", "MISSING", ""],
  "settlement_management.php": ["/admin/finance/ledger/settlements", "MISSING", ""],
  "finance_reports.php": ["/admin/finance/reports", "MISSING", ""],
  "finance_report_print.php": ["/admin/finance/reports/print", "MISSING", "Printable statement."],
  "hold_ledger_note.php": ["/admin/finance/hold-ledger/[id]/note", "MISSING", "Credit/debit note print from hold ledger."],
  "service_charge_invoice.php": ["/admin/payouts/[id]/service-charge", "MISSING", "Service-charge invoice + receipts for vendor payouts."],
  "service_charge_order_report_download.php": ["/admin/payouts/[id]/service-charge (order report)", "MISSING", "Download."],
  "service_charge_settlement_download.php": ["/admin/payouts/[id]/service-charge (settlement)", "MISSING", "Download."],
  "courier_scoped_slab_master.php": ["/admin/shipping/courier-slabs/scoped", "MISSING", "Opened from courier_cost_slab_master.php."],
  "other_charges.php": ["/admin/shipping/other-charges", "PARTIAL", "Resource exists (shipping.otherCharges)."],
  "rebuild_rto_ledger.php": ["/admin/rto (rebuild action)", "auto", "Admin tool."],
  "track_multiple_awbs.php": ["/admin/shipping/track", "auto", "Track many AWBs at once."],
  "add_blog.php": ["/admin/cms/blogs (create form)", "PARTIAL", "Verify editor fields, image upload, SEO."],
  "edit_blog.php": ["/admin/cms/blogs (edit form)", "PARTIAL", ""],
  "homepagebanner-website.php": ["/admin/cms/home-sections", "PARTIAL", ""],
  "pages.php": ["/admin/cms/pages", "PARTIAL", ""],
  "page_edit.php": ["/admin/cms/pages (edit)", "PARTIAL", ""],
  "page_delete.php": ["/admin/cms/pages (delete)", "PARTIAL", ""],
  "add_events.php": ["/admin/cms/events (form)", "auto", ""],
  "manage_events.php": ["/admin/cms/events", "auto", ""],
  "edit_custom_page.php": ["/admin/cms/seo (edit)", "auto", ""],
  "home-notifications.php": ["/admin/cms/notifications", "auto", ""],
  "popular_product.php": ["/admin/cms/popular-products", "auto", ""],
  "offer-products.php": ["/admin/marketing/offer-products", "auto", ""],
  "support/admin_ticket_details.php": ["/admin/support/[id]", "PARTIAL", "Ticket panel is on the API with a mock fallback; remove the fallback and verify replies, attachments, status, assignment."],
  "add_product_review.php": ["/admin/customers/reviews/new", "MISSING", "Add review from manage_review.php."],
  "add_vacancy.php": ["/admin/hiring/vacancies (create form)", "PARTIAL", ""],
  "edit_vacancy.php": ["/admin/hiring/vacancies (edit form)", "PARTIAL", ""],
  "ticket_replay.php": ["/admin/support/[id] (reply)", "auto", "Contact-inquiry reply."],
  "support_chat.php": ["/admin/support/chat", "auto", ""],
  "all_chats.php": ["/admin/support/vendor-chats", "auto", "Vendor-admin chat."],
  "language_phrase.php": ["/admin/settings/languages/[id]/phrases", "MISSING", "Opened from language_settings.php."],
  "manage_state.php": ["/admin/masters/geography", "PARTIAL", "Geography resource is read-only; add/edit missing."],
  "manage_city.php": ["/admin/masters/geography", "auto", ""],
  "manage_country.php": ["/admin/masters/geography", "auto", ""],
  "edit_email_template.php": ["/admin/settings/email-templates (edit form)", "auto", ""],
  "edit_staff_user_data.php": ["/admin/users/[id]/edit", "auto", ""],
  "order_notification_settings.php": ["/admin/settings/order-notifications", "auto", "Added to the menu by install_order_notification_menu.php; check admin_menus."],
  "b2b_orders/index.php": ["/admin/b2b", "MOCK", "getB2BDashboard() reads the mock store."],
  "b2b_orders/view_order.php": ["/admin/b2b/orders/[id]", "PARTIAL", ""],
  "b2b_orders/order_create.php": ["/admin/b2b/orders/new", "MISSING", ""],
  "b2b_orders/quotation_edit.php": ["/admin/b2b/quotations/[id]", "MISSING", ""],
  "b2b_orders/generate_quotation.php": ["/admin/b2b/quotations/[id]/pdf", "MISSING", ""],
  "b2b_orders/b2b_payment_attempts.php": ["/admin/b2b/payment-attempts", "MISSING", ""],
  "b2b_orders/catalog_generator.php": ["/admin/b2b/catalog/generate", "MISSING", "Catalog PDF generator."],
  "b2b_orders/masters.php": ["/admin/b2b/masters", "MISSING", "Package types, freight rates/zones, MOQ, shipping policies (tables not used by the API)."],
  "b2b_orders/product_edit.php": ["/admin/b2b/catalog/[id]/edit", "MISSING", ""],
  "b2b_orders/view_product.php": ["/admin/b2b/catalog/[id]", "MISSING", ""],
  "b2b_orders/audit_log.php": ["/admin/b2b/audit", "MISSING", ""],
  "b2b_orders/b2b_shipments.php": ["/admin/b2b/shipments", "MISSING", ""],
  "b2b_orders/inventory.php": ["/admin/b2b/inventory", "MISSING", ""],
  "b2b_orders/nav_manager.php": ["-", "DROPPED", "Decision D1/D3: the sidebar comes from admin_menus (Menu Master); the B2B panel's own sidebar manager is not ported."],
  "b2b_orders/packing.php": ["/admin/b2b/packing", "MISSING", ""],
  "b2b_orders/role_edit.php": ["/admin/roles", "DROPPED", "Decision D3: no separate B2B roles. B2B access = main role grants (API b2b/b2b-access.js); manage in Manage Role."],
  "b2b_orders/users_roles.php": ["/admin/roles", "DROPPED", "Decision D3: no separate B2B roles. Check grants with `npm run b2b-access-report` in the API."],
  "b2b_orders/sellers.php": ["/admin/b2b/sellers", "MISSING", ""],
  "b2b_orders/vendor_payouts.php": ["/admin/b2b/vendor-payouts", "auto", ""],
  "bulk_orders/index.php": ["/admin/bulk-orders/dashboard", "MISSING", "Sidebar link exists but no page; API service written (parity/bulk.service.js) but routes not mounted."],
  "bulk_orders/quotations.php": ["/admin/bulk-orders/quotations", "MISSING", "Sidebar link exists but no page."],
  "bulk_orders/create_order.php": ["/admin/bulk-orders/new", "MISSING", "Sidebar link exists but no page."],
  "bulk_orders/orders.php": ["/admin/bulk-orders/orders", "MISSING", "Sidebar link exists but no page."],
  "bulk_orders/products.php": ["/admin/bulk-orders/products", "MISSING", "Sidebar link exists but no page."],
  "bulk_orders/shipments.php": ["/admin/bulk-orders/shipments", "MISSING", "Sidebar link exists but no page."],
  "bulk_orders/view_order.php": ["/admin/bulk-orders/orders/[id]", "MISSING", ""],
  "bulk_orders/create_quotation.php": ["/admin/bulk-orders/quotations/new", "MISSING", ""],
  "bulk_orders/generate_quotation.php": ["/admin/bulk-orders/quotations/[id]/pdf", "MISSING", ""],
  "bulk_orders/quotation_to_order.php": ["/admin/bulk-orders/quotations/[id]/convert", "MISSING", ""],
  "bulk_orders/create_product.php": ["/admin/bulk-orders/products/new", "MISSING", ""],
  "bulk_orders/categories.php": ["/admin/bulk-orders/categories", "MISSING", ""],
  "bulk_orders/create_category.php": ["/admin/bulk-orders/categories/new", "MISSING", ""],
  "bulk_orders/b2b_commission.php": ["/admin/bulk-orders/categories/commission", "auto", ""],
  "bulk_orders/calculator.php": ["/admin/bulk-orders/calculator", "MISSING", ""],
  "bulk_orders/operations.php": ["/admin/bulk-orders/operations", "MISSING", ""],
  "bulk_orders/payouts.php": ["/admin/bulk-orders/payouts", "auto", ""],
  "bulk_orders/settings.php": ["/admin/bulk-orders/settings", "MISSING", ""],
  "bulk_orders/tracking.php": ["/admin/bulk-orders/tracking", "MISSING", ""],
  "bulk_orders/analytics.php": ["/admin/bulk-orders/analytics", "auto", ""],
  "bulk_orders/product_audit_log.php": ["/admin/bulk-orders/products/audit", "auto", ""],
  "bulk_orders/service_charge_invoice.php": ["/admin/bulk-orders/payouts/[id]/service-charge", "auto", ""],
  "operations_center/recordings.php": ["/admin/operations/recordings", "PARTIAL", "Resource exists (operations.recordings)."],
  "operations_team/order_details.php": ["/admin/operations/team/orders/[id]", "auto", "2.5k-line agent order page; no link found in PHP, check how agents open it before dropping."],
  "operations_team/index.php": ["/admin/operations/team", "AUDIT", "Landing page of the ops team module."],
  "reports.php": ["/admin/reports", "PARTIAL", "Next /admin/reports is a Next-only report hub; verify every PHP report and export is there."],
  "operations_team/sync_shipment_status.php": ["(background job)", "INFRA", "Shipment status sync; the API has scripts/sync-shipment-status.js."],
};

/* --------------------------------------------------------- page records */

// Shell files every page includes; not part of a page's own functionality.
const SHELL_FILES = new Set(["session.php", "footernew.php", "footer.php", "db.php", "config.php", "common_function.php", "header.php", "header_old.php", "no-premission.php", "support/header.php", "index.php", "logout.php"]);

const pages = [...php.values()].filter((f) => f.kind === "PAGE");
const navByPage = {};
for (const l of navLeaves) if (l.page) (navByPage[l.page.split("?")[0].split("#")[0]] ??= []).push(l);

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
function nextRoutesFor(file) {
  const name = file.split("/").pop();
  const routes = new Set((navByPage[file] ?? []).map((l) => l.href.split("#")[0]));
  const keys = new Set();
  for (const [k, v] of Object.entries(liveSpecs)) if (v.page === file || v.page === name) keys.add(k);
  for (const [k, v] of Object.entries(parity.parityPages)) if (v.some((x) => x.split("?")[0] === file || x.split("?")[0] === name)) keys.add(k);
  for (const k of keys) for (const r of keyRoutes[k] ?? []) routes.add(r);
  const mention = new RegExp("(^|[^\\w/\\-])" + file.replace(/[.\-\/]/g, "\\$&") + "(?![\\w])");
  for (const a of appPages) if (mention.test(appText[a.file])) routes.add(a.route);
  return { routes: [...routes].sort(), keys: [...keys] };
}

function sizeOf(f) {
  let loc = f.lines;
  for (const l of f.links) {
    const t = php.get(l);
    if (t && t.kind === "ENDPOINT" && !SHELL_FILES.has(l)) loc += t.lines;
  }
  return { loc, size: loc <= 500 ? "S" : loc <= 1500 ? "M" : loc <= 4000 ? "L" : "XL" };
}

const records = [];
for (const f of pages) {
  const { routes, keys } = nextRoutesFor(f.file);
  const manual = MANUAL[f.file];
  const isReachable = reachable.has(f.file);
  let route = routes.join(", ");
  let status;
  let note = "";
  // column / field gap against the Next resource definitions
  const nextCols = new Set();
  const nextForm = new Set();
  for (const k of keys) {
    const r = nextResources[k];
    for (const c of r?.columns ?? []) nextCols.add(norm(c.label)).add(norm(c.key));
    for (const fl of r?.form?.fields ?? []) nextForm.add(norm(fl.label)).add(norm(fl.name));
  }
  const near = (n, set) => [...set].some((x) => x && (x === n || x.includes(n) || n.includes(x)));
  const colGap = keys.length ? f.columns.filter((c) => !near(norm(c), nextCols)) : [];
  const fieldGap = keys.length ? f.inputs.filter((i) => !near(norm(i.replace(/^(update_|edit_|add_)/, "").replace(/\[\]$/, "")), new Set([...nextForm, ...nextCols]))) : [];

  if (manual) {
    route = manual[0] || route;
    status = manual[1];
    note = manual[2] ?? "";
    if (status === "auto") status = isReachable ? "MISSING" : "LEGACY?";
  } else if (routes.length) {
    const live = routes.some(isLive);
    status = !live ? "MISSING" : colGap.length >= 3 || fieldGap.length >= 3 ? "PARTIAL" : "AUDIT";
    if (!live) note = "Route is listed but not connected to the API.";
  } else {
    status = isReachable ? "MISSING" : "LEGACY?";
    route = isReachable ? "(new route)" : "-";
  }
  if (status === "LEGACY?" && !note) note = /_old|copy|test|^form1|^image\.php|^banner1/.test(f.file) ? "Old copy / test file." : "Not reachable from the sidebar or any reachable page. Confirm in admin_menus before dropping.";

  const endpoints = f.links.filter((l) => php.get(l)?.kind === "ENDPOINT" && !SHELL_FILES.has(l));
  const subPages = f.links.filter((l) => php.get(l)?.kind === "PAGE" && !SHELL_FILES.has(l));
  records.push({
    file: f.file,
    module: moduleOf(f.file),
    status,
    route: route || "-",
    nav: (navByPage[f.file] ?? []).map((l) => `${l.section ? l.section + " › " : ""}${l.group ? l.group + " › " : ""}${l.label}`),
    reachable: isReachable,
    linkedFrom: [...(callers[f.file] ?? [])].filter((c) => reachable.has(c) && c !== f.file).sort(),
    lines: f.lines,
    ...sizeOf(f),
    note,
    nextKeys: keys,
    apiResources: (apiResourceByPage[f.file] ?? []).map((r) => r.path),
    columns: f.columns,
    filters: f.filters,
    inputs: f.inputs,
    modals: f.modals,
    buttons: f.buttons,
    exports: f.exports,
    prints: f.prints,
    uploads: f.uploads,
    charts: f.charts,
    endpoints: endpoints.map((e) => ({ file: e, lines: php.get(e).lines, api: apiMentions(e) })),
    subPages,
    tables: f.tables,
    tablesNotInApi: f.tables.filter((t) => t.includes("_") && !apiHasTable(t)),
    colGap,
    fieldGap,
  });
}

const endpointRecords = [...php.values()]
  .filter((f) => f.kind === "ENDPOINT")
  .map((f) => ({
    file: f.file,
    module: moduleOf(f.file),
    lines: f.lines,
    callers: [...(callers[f.file] ?? [])].filter((c) => php.get(c)?.kind === "PAGE").sort(),
    reachable: reachable.has(f.file),
    apiMention: apiMentions(f.file),
    tables: f.tables,
    tablesNotInApi: f.tables.filter((t) => t.includes("_") && !apiHasTable(t)),
    kind: /cron/i.test(f.file) ? "cron" : /webhook/i.test(f.file) ? "webhook" : /^install_|\/install_|migrat|backfill|rebuild|fix_|seed/i.test(f.file) ? "one-off" : /^test|\/test|debug/i.test(f.file) ? "test" : "endpoint",
  }));

/* ------------------------------------------------------------------ output */

const ORDER = ["auth", "orders", "products", "catalog", "sellers", "customers", "shipping", "finance", "crm", "sales", "marketing", "cms", "b2b", "bulk", "ops", "support", "admin", "dash", "infra"];
const STATUS_ORDER = ["MISSING", "MOCK", "PARTIAL", "AUDIT", "LEGACY?", "DROPPED", "INFRA"];
const count = (arr, pred) => arr.filter(pred).length;
const esc = (s) => String(s).replace(/\|/g, "/");
const list = (a, max = 60) => (a.length ? a.slice(0, max).map(esc).join(" · ") + (a.length > max ? ` · … (+${a.length - max})` : "") : "—");

let md = `# PHP admin → Next.js page inventory

Generated by \`docs/php-port/tools/build-inventory.mjs\` on ${new Date().toISOString().slice(0, 10)}. Do not edit by hand; re-run the tool.

Sources: PHP \`${PHP}\` · API \`${rel(API)}\` · Next \`src/\`.

**Status**
- **MISSING**: no working Next screen yet (route column is the proposed route).
- **MOCK**: a Next route exists but its data is the in-memory mock store or not connected.
- **PARTIAL**: Next route + API exist, but known or auto-detected gaps (columns/fields below, or note).
- **AUDIT**: Next route + API exist and no gap was auto-detected. Not done until it passes the parity check in IMPLEMENTATION_PLAN.md §4.
- **LEGACY?**: not reachable from the sidebar, module sidebars or any reachable page. Confirm against \`admin_menus\` before dropping.
- **DROPPED**: not ported by decision (see IMPLEMENTATION_PLAN.md §7).
- **INFRA**: not a screen (header, helpers, background job).

**Size** = PHP lines of the page + the endpoints it calls: S ≤ 500 · M ≤ 1,500 · L ≤ 4,000 · XL > 4,000.

The "columns / fields not found in Next" lists are a heuristic name match against the Next resource definition; treat them as items to check, not proven gaps.

## Summary

| Module | Pages | MISSING | MOCK | PARTIAL | AUDIT | LEGACY? | DROPPED | INFRA | PHP lines (pages+endpoints) |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
`;
for (const m of ORDER) {
  const rs = records.filter((r) => r.module === m);
  if (!rs.length) continue;
  md += `| ${MODULES[m]} | ${rs.length} | ${STATUS_ORDER.map((s) => count(rs, (r) => r.status === s)).join(" | ")} | ${rs.reduce((a, r) => a + r.loc, 0).toLocaleString("en-IN")} |\n`;
}
md += `| **Total** | **${records.length}** | ${STATUS_ORDER.map((s) => `**${count(records, (r) => r.status === s)}**`).join(" | ")} | **${records.reduce((a, r) => a + r.loc, 0).toLocaleString("en-IN")}** |\n\n`;

for (const m of ORDER) {
  const rs = records.filter((r) => r.module === m).sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.loc - a.loc);
  if (!rs.length) continue;
  md += `## ${MODULES[m]}\n\n| PHP page | Status | Next route | Size | Sidebar | Note |\n| --- | --- | --- | --- | --- | --- |\n`;
  for (const r of rs) md += `| \`${r.file}\` | ${r.status} | ${esc(r.route)} | ${r.size} (${r.loc.toLocaleString("en-IN")}) | ${r.nav.length ? esc(r.nav[0]) : r.reachable ? "linked" : "—"} | ${esc(r.note)} |\n`;
  md += "\n";
  for (const r of rs.filter((x) => !["INFRA", "DROPPED"].includes(x.status))) {
    md += `### \`${r.file}\` — ${r.status}\n\n`;
    md += `- Next: ${esc(r.route)}${r.nextKeys.length ? ` (resource ${r.nextKeys.map((k) => `\`${k}\``).join(", ")})` : ""}${r.apiResources.length ? ` · API resource ${r.apiResources.map((p) => `\`/admin${p}\``).join(", ")}` : ""}\n`;
    md += `- [ ] Columns: ${list(r.columns)}\n`;
    if (r.colGap.length) md += `  - Not found in Next resource: ${list(r.colGap)}\n`;
    md += `- [ ] Filters/search: ${list(r.filters)}\n`;
    md += `- [ ] Form fields: ${list(r.inputs, 80)}\n`;
    if (r.fieldGap.length) md += `  - Not found in Next resource: ${list(r.fieldGap)}\n`;
    md += `- [ ] Modals: ${list(r.modals)}\n`;
    md += `- [ ] Buttons/actions: ${list(r.buttons)}\n`;
    const extras = [r.exports && "export", r.prints && "print/PDF", r.uploads && "file upload", r.charts && "charts"].filter(Boolean);
    if (extras.length) md += `- [ ] Also: ${extras.join(", ")}\n`;
    md += `- [ ] Endpoints (${r.endpoints.length}): ${r.endpoints.length ? r.endpoints.map((e) => `\`${e.file}\`${e.api ? "" : "\\*"}`).join(" · ") : "—"}\n`;
    if (r.subPages.length) md += `- [ ] Opens pages: ${r.subPages.map((p) => `\`${p}\``).join(" · ")}\n`;
    if (r.linkedFrom.length) md += `- Opened from: ${list(r.linkedFrom.map((p) => `\`${p}\``), 8)}\n`;
    md += `- Tables: ${list(r.tables)}${r.tablesNotInApi.length ? ` — **not used by the API yet:** ${r.tablesNotInApi.join(", ")}` : ""}\n\n`;
  }
}
md += `\\* endpoint file name is not mentioned anywhere in the API source; find or build its Node equivalent.\n`;
fs.writeFileSync(path.join(OUT, "PAGE_INVENTORY.md"), md);

let ep = `# PHP endpoint map

Generated by \`docs/php-port/tools/build-inventory.mjs\` on ${new Date().toISOString().slice(0, 10)}.

Every non-page PHP file of the admin (AJAX/DataTables \`get_*\`, form \`*_process\`, \`server_*\`, \`api/…\`, module \`*/api/…\`), the pages that call it, and whether the Node API mentions it by name. "Unused?" = no reachable page calls it (may still be a cron, webhook or external caller — check before dropping).

| Module | Endpoints | Called by a reachable page | Named in API | Cron / webhook / one-off / test |
| --- | --: | --: | --: | --: |
`;
for (const m of ORDER) {
  const es = endpointRecords.filter((e) => e.module === m);
  if (!es.length) continue;
  ep += `| ${MODULES[m]} | ${es.length} | ${count(es, (e) => e.reachable)} | ${count(es, (e) => e.apiMention)} | ${count(es, (e) => e.kind !== "endpoint")} |\n`;
}
ep += `| **Total** | **${endpointRecords.length}** | **${count(endpointRecords, (e) => e.reachable)}** | **${count(endpointRecords, (e) => e.apiMention)}** | **${count(endpointRecords, (e) => e.kind !== "endpoint")}** |\n\n`;
for (const m of ORDER) {
  const es = endpointRecords.filter((e) => e.module === m).sort((a, b) => Number(b.reachable) - Number(a.reachable) || b.callers.length - a.callers.length || a.file.localeCompare(b.file));
  if (!es.length) continue;
  ep += `## ${MODULES[m]}\n\n| Endpoint | Lines | Kind | Called from | Named in API | Tables not used by API |\n| --- | --: | --- | --- | --- | --- |\n`;
  for (const e of es) ep += `| \`${e.file}\` | ${e.lines} | ${e.kind}${e.reachable ? "" : " (unused?)"} | ${e.callers.length ? e.callers.slice(0, 5).map((c) => `\`${c}\``).join(", ") + (e.callers.length > 5 ? ` +${e.callers.length - 5}` : "") : "—"} | ${e.apiMention ? "yes" : ""} | ${e.tablesNotInApi.join(", ")} |\n`;
  ep += "\n";
}
fs.writeFileSync(path.join(OUT, "ENDPOINT_MAP.md"), ep);

const groups = {};
for (const r of apiRouteList) {
  const seg = r.split(" ")[1].split("/")[2] || "(root)";
  (groups[seg] ??= []).push(r);
}
let br = `# Node admin API routes

Generated by \`docs/php-port/tools/build-inventory.mjs\` on ${new Date().toISOString().slice(0, 10)}. Paths are under \`<API_PREFIX>\` (\`/api/v1\`). ${apiRouteList.length} routes; ${apiResources.length} are config-driven resources (list, export, get, create/update, actions — see \`src/modules/admin/resources/resource-engine.js\`).

## Config-driven resources

| Path | PHP page (permission) | Form | Actions | Table |
| --- | --- | --- | --- | --- |
${apiResources
  .slice()
  .sort((a, b) => a.path.localeCompare(b.path))
  .map((r) => `| \`/admin${r.path}\` | \`${r.page}\` | ${r.form ? "yes" : ""} | ${Object.keys(r.actions ?? {}).join(", ")} | ${r.table ?? ""} |`)
  .join("\n")}

## All routes by first segment

`;
for (const seg of Object.keys(groups).sort()) br += `### ${seg}\n\n\`\`\`\n${groups[seg].join("\n")}\n\`\`\`\n\n`;
fs.writeFileSync(path.join(OUT, "BACKEND_ADMIN_ROUTES.md"), br);

const missingTables = {};
for (const f of php.values()) for (const t of f.tables) if (t.includes("_") && !apiHasTable(t)) (missingTables[t] ??= new Set()).add(f.file);
fs.writeFileSync(
  path.join(OUT, "inventory.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), pages: records, endpoints: endpointRecords, apiRoutes: apiRouteList, tablesNotInApi: Object.fromEntries(Object.entries(missingTables).map(([t, s]) => [t, [...s].sort()])) }, null, 1)
);

const stat = Object.fromEntries(STATUS_ORDER.map((s) => [s, count(records, (r) => r.status === s)]));
console.log(`pages ${records.length}`, stat, `| endpoints ${endpointRecords.length} (reachable ${count(endpointRecords, (e) => e.reachable)}) | api routes ${apiRouteList.length} | api resources ${apiResources.length} | tables not in api ${Object.keys(missingTables).length}`);
process.exit(0);
