import { navigation } from "./navigation";
import { can } from "@/lib/auth/permissions";

/**
 * Builds the sidebar from the role's admin_menus tree (GET /admin/auth/menu),
 * the way header.php renderMenu() does, in the shape the Sidebar component
 * takes: sections (top-level menus) -> items (groups or links) -> children.
 *
 * navigation.js is the route map: a menu row's `menu_link` finds the Next
 * route of the leaf whose `page` is that link. Group icons come from the
 * navigation group with the same key as the row's "#hash" link. Next-only
 * screens (leaves without `page`) are added to the group they sit in there,
 * when the role has their permission.
 *
 * A menu link with no Next route yet opens /admin/not-ported, so nothing the
 * PHP sidebar shows goes missing.
 */

const norm = (link) => String(link ?? "").trim().replace(/^\/+/, "");
const pathOf = (href) => String(href ?? "").split(/[?#]/)[0];

/** Sidebar routes whose screen is not built yet (bulk orders, plan phase 10). Remove a route when its page lands. */
const PENDING_ROUTES = new Set(["/admin/bulk-orders/new"]);

const leafByLink = new Map();
const groups = new Map();
const topLevelExtras = [];
for (const section of navigation) {
  for (const item of section.items) {
    if (item.children) {
      const extras = [];
      for (const child of item.children) {
        if (child.page) leafByLink.set(norm(child.page), child);
        else extras.push(child);
      }
      groups.set(`#${item.key}`, { key: item.key, label: item.label, section: section.section, icon: item.icon, sensitive: Boolean(item.sensitive), extras });
    } else if (item.page) {
      leafByLink.set(norm(item.page), item);
    } else {
      topLevelExtras.push({ section: section.section, item });
    }
  }
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

function faIcon(className) {
  const value = String(className ?? "");
  return FA_ICONS.find(([re]) => re.test(value))?.[1] ?? "Circle";
}

function routeFor(link) {
  const value = norm(link);
  return leafByLink.get(value) ?? leafByLink.get(value.split(/[?#]/)[0]) ?? null;
}

export function notPortedHref(link, name) {
  const params = new URLSearchParams({ link: String(link ?? ""), name: String(name ?? "") });
  return `/admin/not-ported?${params}`;
}

function toLeaf(node, label = node.name) {
  const route = routeFor(node.link);
  const ported = route && !PENDING_ROUTES.has(pathOf(route.href));
  return {
    key: `menu-${node.id}`,
    label,
    href: ported ? route.href : notPortedHref(node.link, node.name),
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

const visibleExtra = (user, leaf) => can(user, leaf.permission, "view") && (!leaf.action || can(user, leaf.permission, leaf.action));

function uniqueByHref(leaves) {
  const seen = new Set();
  return leaves.filter((leaf) => {
    if (seen.has(leaf.href)) return false;
    seen.add(leaf.href);
    return true;
  });
}

const FALLBACK = [{ section: null, items: [{ key: "menu-dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" }] }];

/**
 * `items` is the API tree: [{ id, name, link, icon, actions, children }].
 * `user` is the session user (for Next-only screens' permissions).
 */
export function buildSidebar(items, user) {
  const sections = [];
  const usedGroups = new Set();

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
      if (meta) usedGroups.add(meta.key);
      const extras = (meta?.extras ?? []).filter((leaf) => visibleExtra(user, leaf));
      const children = uniqueByHref([...leavesOf(node.children), ...extras]);
      if (children.length) sectionItems.push({ key: `menu-${node.id}`, label: node.name, icon: meta?.icon ?? faIcon(node.icon), sensitive: meta?.sensitive || undefined, children });
    }
    if (sectionItems.length) sections.push({ section: top.name, items: sectionItems });
  }

  // Next-only screens whose navigation group is not in this role's menu: keep them reachable.
  for (const meta of groups.values()) {
    if (usedGroups.has(meta.key)) continue;
    const extras = meta.extras.filter((leaf) => visibleExtra(user, leaf));
    if (!extras.length) continue;
    const group = { key: `nav-${meta.key}`, label: meta.label, icon: meta.icon, sensitive: meta.sensitive || undefined, children: extras };
    const section = sections.find((s) => s.section === meta.section);
    if (section) section.items.push(group);
    else sections.push({ section: meta.section, items: [group] });
  }

  if (!sections.length) return FALLBACK;

  for (const { section, item } of topLevelExtras) if (visibleExtra(user, item)) sections.push({ section, items: [item] });
  return sections;
}
