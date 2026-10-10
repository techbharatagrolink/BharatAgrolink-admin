import { navigation } from "./navigation";

/**
 * Builds the sidebar from the role's admin_menus tree (GET /admin/auth/menu),
 * the way header.php renderMenu() does, in the shape the Sidebar component
 * takes: sections (top-level menus) -> items (groups or links) -> children.
 *
 * navigation.js is the route map: a menu row's `menu_link` finds the Next
 * route of the leaf whose `page` is that link. A link that starts with
 * "/admin/" is a route of this admin and opens as it is (the PHP admin cannot
 * open those). Group icons come from the navigation group with the same key
 * as the row's "#hash" link.
 *
 * The sidebar shows admin_menus rows only. Next-only screens (navigation
 * leaves without `page`) have no row, so they are not in it; Menu Master
 * lists them (nextOnlyScreens) and they open by URL.
 *
 * A menu link with no Next route yet opens /admin/not-ported, so nothing the
 * PHP sidebar shows goes missing.
 */

const norm = (link) => String(link ?? "").trim().replace(/^\/+/, "");
const pathOf = (href) => String(href ?? "").split(/[?#]/)[0];

/** Sidebar routes whose screen is not built yet (bulk orders, plan phase 10). Remove a route when its page lands. */
const PENDING_ROUTES = new Set(["/admin/bulk-orders/new"]);

const isRouteLink = (link) => String(link ?? "").trim().startsWith("/admin/");

const leafByLink = new Map();
const leafByRoute = new Map();
const groups = new Map();
const nextOnly = [];
const addRoute = (leaf) => {
  if (!leaf.href) return;
  if (!leafByRoute.has(leaf.href)) leafByRoute.set(leaf.href, leaf);
  if (!leafByRoute.has(pathOf(leaf.href))) leafByRoute.set(pathOf(leaf.href), leaf);
};
for (const section of navigation) {
  for (const item of section.items) {
    if (item.children) {
      for (const child of item.children) {
        addRoute(child);
        if (child.page) leafByLink.set(norm(child.page), child);
        else nextOnly.push({ ...child, section: section.section, group: item.label });
      }
      groups.set(`#${item.key}`, { key: item.key, icon: item.icon, sensitive: Boolean(item.sensitive) });
    } else if (item.page) {
      addRoute(item);
      leafByLink.set(norm(item.page), item);
    } else {
      addRoute(item);
      nextOnly.push({ ...item, section: section.section, group: null });
    }
  }
}

/** Screens of this admin with no admin_menus row (so not in the sidebar): [{ key, label, href, permission, section, group }]. */
export function nextOnlyScreens() {
  return nextOnly.map(({ key, label, href, permission, section, group }) => ({ key, label, href, permission: permission ?? null, section: section ?? null, group }));
}

/** navigation.js without the Next-only screens: the static sidebar used when the menu API is down. */
export function menuOnlyNavigation() {
  return navigation.map((section) => ({
    ...section,
    items: section.items.flatMap((item) => {
      if (!item.children) return item.page ? [item] : [];
      const children = item.children.filter((child) => child.page);
      return children.length ? [{ ...item, children }] : [];
    }),
  }));
}

/** Font Awesome classes used in admin_menus -> lucide icon names (NavIcon). */
const FA_ICONS = [
  [/tachometer|chart-pie|dashboard/, "LayoutDashboard"],
  [/chart-line|line-chart/, "TrendingUp"],
  [/balance-scale|gavel/, "Gauge"],
  [/store|user-tie/, "Store"],
  [/users-cog|user-friends|users/, "Users"],
  [/box|cubes|dolly|truck-loading/, "Boxes"],
  [/sitemap|list/, "FolderTree"],
  [/check-double|check-circle/, "BadgeCheck"],
  [/percent|rupee|money|coins/, "IndianRupee"],
  [/bullhorn/, "Megaphone"],
  [/wallet|credit-card/, "Wallet"],
  [/comments|comment/, "MessagesSquare"],
  [/gift|tag/, "Tags"],
  [/globe|window|image/, "LayoutTemplate"],
  [/shopping-cart|cart/, "ShoppingCart"],
  [/handshake|building/, "Building2"],
  [/phone/, "Phone"],
  [/bullseye/, "Target"],
  [/truck|shipping/, "Truck"],
  [/map/, "MapPin"],
  [/cogs|cog|gear|sliders|wrench/, "Settings"],
  [/laptop|code/, "Cpu"],
  [/receipt|invoice|file/, "Receipt"],
  [/shield/, "ShieldCheck"],
  [/headset|life-ring/, "LifeBuoy"],
  [/question/, "ClipboardList"],
  [/star/, "Star"],
  [/envelope/, "Mail"],
  [/briefcase/, "Briefcase"],
  [/undo/, "Undo2"],
];

export function faIcon(className) {
  const value = String(className ?? "");
  return FA_ICONS.find(([re]) => re.test(value))?.[1] ?? "Circle";
}

function routeFor(link) {
  if (isRouteLink(link)) {
    const value = String(link).trim();
    return leafByRoute.get(value) ?? leafByRoute.get(pathOf(value)) ?? null;
  }
  const value = norm(link);
  return leafByLink.get(value) ?? leafByLink.get(value.split(/[?#]/)[0]) ?? null;
}

/**
 * Where a menu link opens in this admin: { href, ported, known, route }.
 * Unported links open /admin/not-ported. `route` links ("/admin/...") open as
 * written; `known` says whether navigation.js has a screen at that path.
 */
export function menuTarget(link) {
  if (isRouteLink(link)) {
    const href = String(link).trim();
    return { href, ported: !PENDING_ROUTES.has(pathOf(href)), known: Boolean(routeFor(href)), route: true };
  }
  const leaf = routeFor(link);
  const ported = Boolean(leaf) && !PENDING_ROUTES.has(pathOf(leaf.href));
  return { href: ported ? leaf.href : null, ported, known: ported, route: false };
}

/** Links Menu Master offers: legacy pages with a screen here, then this admin's screens that have no PHP page (as /admin/ routes). */
export function knownPages() {
  const legacy = [...leafByLink.entries()].filter(([, leaf]) => !PENDING_ROUTES.has(pathOf(leaf.href))).map(([page, leaf]) => ({ page, label: leaf.label, href: leaf.href }));
  const routes = nextOnly.filter((leaf) => leaf.href && !PENDING_ROUTES.has(pathOf(leaf.href))).map((leaf) => ({ page: leaf.href, label: `${leaf.label} (new admin screen)`, href: leaf.href }));
  return [...legacy, ...routes];
}

export function notPortedHref(link, name) {
  const params = new URLSearchParams({ link: String(link ?? ""), name: String(name ?? "") });
  return `/admin/not-ported?${params}`;
}

function toLeaf(node, label = node.name) {
  const route = routeFor(node.link);
  const { href, ported } = menuTarget(node.link);
  return {
    key: `menu-${node.id}`,
    label,
    href: ported ? href : notPortedHref(node.link, node.name),
    page: node.link,
    icon: route?.icon ?? faIcon(node.icon),
    badge: route?.badge,
    permission: route?.permission,
  };
}

/** Leaves under a group; deeper levels (PHP renders any depth) are listed with their parent's name. */
function leavesOf(nodes, prefix = "") {
  const out = [];
  for (const node of nodes) {
    const label = prefix ? `${prefix} › ${node.name}` : node.name;
    const link = norm(node.link);
    if (link && (!link.startsWith("#") || link.startsWith("#dashboard_"))) out.push(toLeaf(node, label));
    if (node.children?.length) out.push(...leavesOf(node.children, label));
  }
  return out;
}

function uniqueByHref(leaves) {
  const seen = new Set();
  return leaves.filter((leaf) => {
    if (seen.has(leaf.href)) return false;
    seen.add(leaf.href);
    return true;
  });
}

const FALLBACK = [{ section: null, items: [{ key: "menu-dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" }] }];

/** `items` is the API tree: [{ id, name, link, icon, actions, children }]. */
export function buildSidebar(items) {
  const sections = [];

  for (const top of items ?? []) {
    if (!top.children?.length) {
      sections.push({ section: null, items: [toLeaf(top)] });
      continue;
    }
    const sectionItems = [];
    for (const node of top.children) {
      if (!node.children?.length) {
        sectionItems.push(toLeaf(node));
        continue;
      }
      const meta = groups.get(norm(node.link));
      const children = uniqueByHref(leavesOf(node.children));
      if (children.length) sectionItems.push({ key: `menu-${node.id}`, label: node.name, icon: meta?.icon ?? faIcon(node.icon), sensitive: meta?.sensitive || undefined, children });
    }
    if (sectionItems.length) sections.push({ section: top.name, items: sectionItems });
  }

  return sections.length ? sections : FALLBACK;
}
