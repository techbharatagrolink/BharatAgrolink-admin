"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowUpRight, Bell, BookOpen, ChevronDown, ChevronRight, CircleHelp, CornerDownLeft, Keyboard, LogOut, Mail, Menu, Moon, PanelLeftOpen, Plus, PlusCircle, Search, Sun, UserRound } from "lucide-react";
import { getBreadcrumbs } from "@/lib/content/admin/navigation";
import { initials } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";
import { BrandLogo } from "@/components/ui/brand-logo";
import { logoutAction } from "@/lib/actions/admin/auth";
import { RouteProgress, startRouteProgress } from "./route-progress";
import { NavIcon } from "./icons";

// On phones the header panels (notifications, help, account) span the screen width just below the bar,
// instead of hanging off their button and running past the left edge.
const PHONE_PANEL = "max-sm:fixed max-sm:top-[62px] max-sm:right-3 max-sm:left-3 max-sm:mt-0 max-sm:w-auto max-sm:max-w-none max-sm:max-h-[calc(100dvh-5rem)] max-sm:overflow-y-auto";

const pathOf = (href) => String(href ?? "").split(/[?#]/)[0];

/**
 * Breadcrumbs named the way the sidebar names them (admin_menus via Menu Master).
 * navigation.js still decides the trail; live names replace its labels where the
 * screen, or the list screen above it, is in the role's sidebar. A group crumb
 * (no page of its own) gets `menu`: the group's pages in the role's sidebar.
 */
function liveBreadcrumbs(navigation, pathname) {
  const crumbs = getBreadcrumbs(pathname);
  const leaves = [];
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href) leaves.push({ href: item.href, path: pathOf(item.href), label: item.label, group: null });
      for (const child of item.children || []) leaves.push({ href: child.href, path: pathOf(child.href), label: child.label, group: item });
    }
  }
  const live = (href) => leaves.find((leaf) => leaf.path === pathOf(href) && leaf.path !== "/admin/not-ported");
  const groupCrumb = (group) => ({ label: group.label, menu: group.children.map(({ label, href }) => ({ label, href })) });
  // navigation.js group pages the role's sidebar does not show are left out, under their sidebar names.
  const visiblePages = (pages) =>
    pages.flatMap((page) => {
      const leaf = leaves.find((l) => l.href === page.href);
      return leaf ? [{ label: leaf.label, href: leaf.href }] : [];
    });

  const exact = live(pathname);
  if (exact) return [crumbs[0], ...(exact.group ? [groupCrumb(exact.group)] : []), { label: exact.label, href: exact.path }];
  const next = [...crumbs];
  const at = crumbs.findLastIndex((crumb, i) => i > 0 && crumb.href && live(crumb.href));
  if (at >= 0) {
    const match = live(crumbs[at].href);
    next[at] = { ...next[at], label: match.label };
    if (match.group && at > 1 && !next[at - 1].href) next[at - 1] = groupCrumb(match.group);
  }
  return next.map(({ pages, ...crumb }) => (pages ? { ...crumb, menu: visiblePages(pages) } : crumb));
}

// A stable, readable id (e.g. "crumb-menu-wide-1-seller-catalog") instead of a useId() one, so the
// server HTML and the browser always agree on aria-controls even if the trees above them differ.
const crumbMenuId = (wide, index, label) => `crumb-menu-${wide ? "wide" : "narrow"}-${index}-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

function CrumbMenu({ crumb, activeHref, id }) {
  return (
    <Popover
      id={id}
      align="left"
      panelClassName="w-64 py-1.5"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="flex items-center gap-0.5 rounded hover:text-ink hover:underline aria-expanded:text-ink">
          {crumb.label}
          <ChevronDown className="size-3.5 shrink-0" aria-hidden />
        </button>
      )}
    >
      <p className="px-3 pt-1 pb-1.5 text-micro font-semibold tracking-wide text-ink-muted uppercase">{crumb.label}</p>
      <ul>
        {crumb.menu.map((page) => {
          const current = page.href === activeHref;
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={current ? "page" : undefined}
                className={cn("mx-1.5 block truncate rounded-lg px-2.5 py-2 text-sm hover:bg-surface-muted", current ? "bg-brand-50 font-medium text-brand-700" : "text-ink")}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </Popover>
  );
}

function Breadcrumbs({ wide = false, navigation = [] }) {
  const pathname = usePathname();
  const crumbs = liveBreadcrumbs(navigation, pathname);
  const isAncestor = (i) => i < crumbs.length - 2;
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-small text-ink-muted">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          // The trail's last crumb is the screen you are on (or the list screen it belongs to); "Admin" alone is just home.
          const href = last && i > 0 ? (crumb.href ?? pathname) : crumb.href;
          return (
            <li key={`${crumb.label}-${i}`} className={cn("flex min-w-0 items-center gap-1", isAncestor(i) && (wide ? "hidden 2xl:flex" : "hidden sm:flex"), last ? cn("font-semibold text-ink", wide && "text-subheading") : "shrink-0")}>
              {i > 0 && <ChevronRight className={cn("size-3.5 shrink-0 text-ink-muted/60", isAncestor(i - 1) && (wide ? "hidden 2xl:block" : "hidden sm:block"))} aria-hidden />}
              {href ? (
                <Link
                  href={href}
                  className={cn("hover:text-ink hover:underline", last && "min-w-0 truncate")}
                  aria-current={last && pathOf(href) === pathname ? "page" : undefined}
                  title={last ? crumb.label : undefined}
                >
                  {crumb.label}
                </Link>
              ) : crumb.menu?.length ? (
                <CrumbMenu crumb={crumb} activeHref={crumbs[i + 1]?.href} id={crumbMenuId(wide, i, crumb.label)} />
              ) : (
                <span className="min-w-0 truncate">{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function flattenRoutes(navigation) {
  const routes = [];
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href) routes.push({ key: item.key, label: item.label, href: item.href, trail: section.section || "", icon: item.icon });
      for (const child of item.children || []) routes.push({ key: child.key, label: child.label, href: child.href, trail: item.label || "", icon: item.icon });
    }
  }
  return routes;
}

function matchRoutes(routes, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return routes
    .map((route) => {
      const label = route.label.toLowerCase();
      const haystack = `${label} ${route.trail.toLowerCase()}`;
      if (!terms.every((t) => haystack.includes(t))) return null;
      return { route, score: label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2 };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.route.label.localeCompare(b.route.label))
    .slice(0, 8)
    .map((m) => m.route);
}

function GlobalSearch({ navigation }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const routes = flattenRoutes(navigation);
  const pages = matchRoutes(routes, query);
  const q = query.trim();
  const options = [...pages.map((page) => ({ type: "page", ...page })), ...(q.length >= 2 ? [{ type: "search", key: "__search", label: q }] : [])];
  const showList = open && options.length > 0;
  const current = Math.min(activeIndex, options.length - 1);

  const choose = (option) => {
    if (!option) return;
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    startRouteProgress();
    router.push(option.type === "page" ? option.href : `/admin/search?q=${encodeURIComponent(option.label)}`);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!options.length) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current + step + options.length) % options.length);
    } else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (showList) choose(options[current]);
      else if (q.length >= 2) choose({ type: "search", label: q });
    } else if (event.key === "Escape") {
      if (showList) {
        event.preventDefault();
        setOpen(false);
      } else {
        inputRef.current?.blur();
      }
    }
  };

  useEffect(() => {
    const onKey = (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      className="relative w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        if (showList) choose(options[current]);
        else if (q.length >= 2) choose({ type: "search", label: q });
      }}
    >
      <label htmlFor="admin-global-search" className="sr-only">
        Search pages, orders, products, vendors, customers, leads and tickets
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        ref={inputRef}
        id="admin-global-search"
        role="combobox"
        aria-expanded={showList}
        aria-controls="admin-global-search-list"
        aria-autocomplete="list"
        aria-activedescendant={showList ? `gs-opt-${options[current].key}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="Search pages, order ID, AWB, product, vendor…"
        className="h-9 w-full rounded-md border border-line bg-surface-muted pr-3 pl-9 lg:pr-12 text-sm text-ink transition-colors placeholder:text-ink-muted hover:border-line-strong focus:border-brand-600 focus:bg-surface focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
        autoComplete="off"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 text-micro text-ink-muted lg:block">Ctrl K</kbd>
      {showList && (
        <ul
          id="admin-global-search-list"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-[min(70vh,26rem)] overflow-y-auto rounded-xl border border-line bg-surface py-1.5 shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          {pages.length > 0 && <li role="presentation" className="px-3 pt-1 pb-1.5 text-micro font-semibold tracking-wide text-ink-muted uppercase">Pages</li>}
          {options.map((option, i) => (
            <li
              key={option.key}
              id={`gs-opt-${option.key}`}
              role="option"
              aria-selected={i === current}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(option)}
              className={cn(
                "mx-1.5 flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                i === current ? "bg-brand-50 text-ink" : "text-ink-soft",
                option.type === "search" && pages.length > 0 && "mt-1",
              )}
            >
              {option.type === "page" ? (
                <>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
                    <NavIcon name={option.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{option.label}</span>
                    <span className="block truncate text-xs text-ink-muted">{option.trail}</span>
                  </span>
                  {i === current && <CornerDownLeft className="size-3.5 shrink-0 text-ink-muted" aria-hidden />}
                </>
              ) : (
                <>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
                    <Search className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    Search records for <span className="font-medium text-ink">&ldquo;{option.label}&rdquo;</span>
                  </span>
                  {i === current && <CornerDownLeft className="size-3.5 shrink-0 text-ink-muted" aria-hidden />}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

const CREATE_VERB = /^(add|new|create|generate|upload|import)\b/i;
const QUICK_LIMIT = 7;

/**
 * Columns for the "+" panel, one per menu section, built only from the role's own menu (so every
 * link is a page this user can already open): create actions first (⊕), then action queues that carry
 * a badge (e.g. Seller Approval), then the main page of each group. Top-level links go under General.
 */
function quickSections(navigation) {
  const columns = [];
  const general = { key: "__general", title: "General", icon: "LayoutDashboard", links: [] };
  for (const section of navigation) {
    const leaves = [];
    const groupFirsts = [];
    for (const item of section.items) {
      if (item.children?.length) {
        item.children.forEach((c, i) => {
          const leaf = { ...c, trail: item.label, icon: c.icon || item.icon };
          leaves.push(leaf);
          if (i === 0) groupFirsts.push(leaf);
        });
      } else if (item.href) {
        leaves.push(item);
        groupFirsts.push(item);
      }
    }
    const usable = (l) => l.href && !l.href.includes("#");
    const creates = leaves.filter((l) => usable(l) && CREATE_VERB.test(l.label)).map((l) => ({ ...l, kind: "create" }));
    const queues = leaves.filter((l) => usable(l) && l.badge && !CREATE_VERB.test(l.label)).map((l) => ({ ...l, kind: "queue" }));
    const pages = groupFirsts.filter((l) => usable(l) && !CREATE_VERB.test(l.label) && !l.badge).map((l) => ({ ...l, kind: "page" }));
    const seen = new Set();
    const links = [...creates, ...queues, ...pages].filter((l) => !seen.has(l.href) && seen.add(l.href)).slice(0, QUICK_LIMIT);
    if (!links.length) continue;
    if (!section.section) general.links.push(...links);
    else columns.push({ key: section.key || section.section, title: section.section, icon: section.icon, links });
  }
  if (general.links.length) columns.unshift({ ...general, links: general.links.slice(0, QUICK_LIMIT) });
  return columns;
}

// Zoho-style "+" quick panel: create actions and the most important pages, grouped by area.
function QuickCreate({ navigation, badges = {} }) {
  const columns = quickSections(navigation);
  if (!columns.length) return null;
  return (
    <Popover
      id="admin-quick-create"
      label="Quick create and shortcuts"
      // A sheet across the content area, just under the header. The header's backdrop blur makes the header
      // the containing block for this fixed panel, so these offsets are measured from the header — which
      // already starts right of the sidebar — and the panel never slides under the sidebar.
      panelClassName="fixed top-[62px] right-3 left-3 mt-0 w-auto max-w-none md:right-5 md:left-5"
      trigger={({ toggle, props }) => (
        <button
          type="button"
          onClick={toggle}
          {...props}
          title="Quick create"
          className="mr-1 flex size-8 items-center justify-center rounded-md border border-brand-600/60 text-brand-700 transition-colors hover:bg-brand-50 aria-expanded:bg-brand-600 aria-expanded:text-brand-fg"
        >
          <Plus className="size-[18px]" aria-hidden />
        </button>
      )}
    >
      <div className="max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {columns.map((col) => (
            <section key={col.key} aria-label={col.title} className="min-w-0">
              <h3 className="mb-2 flex items-center gap-1.5 text-micro font-medium tracking-[0.06em] text-ink-muted uppercase">
                <NavIcon name={col.icon} className="size-3.5" />
                {col.title}
              </h3>
              <ul className="space-y-0.5">
                {col.links.map((l) => {
                  const count = l.badge ? badges[l.badge] || 0 : 0;
                  // Same label twice in a column (e.g. "Create Order" for B2C and Bulk): show which group.
                  const repeated = l.trail && col.links.filter((x) => x.label === l.label).length > 1;
                  return (
                    <li key={l.key || l.href}>
                      <Link
                        href={l.href}
                        title={l.trail ? `${l.label} · ${l.trail}` : l.label}
                        className="group -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-body text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        {l.kind === "create" ? (
                          <PlusCircle className="size-4 shrink-0 fill-ink-muted/80 text-surface transition-colors group-hover:fill-brand-600" aria-hidden />
                        ) : (
                          <ArrowUpRight className="size-4 shrink-0 text-ink-muted transition-colors group-hover:text-brand-600" aria-hidden />
                        )}
                        <span className="min-w-0 flex-1 truncate">
                          {l.label}
                          {repeated && <span className="ml-1 text-micro text-ink-muted">· {l.trail}</span>}
                        </span>
                        {count > 0 && <span className="shrink-0 rounded-full bg-danger px-1.5 text-micro leading-[18px] font-semibold text-white tabular">{count > 99 ? "99+" : count}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-micro text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <PlusCircle className="size-3.5 fill-ink-muted/80 text-surface" aria-hidden /> Create new
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ArrowUpRight className="size-3.5" aria-hidden /> Go to page
          </span>
          <span className="ml-auto hidden sm:inline">Only pages your role can open are shown.</span>
        </p>
      </div>
    </Popover>
  );
}

function ThemeToggle({ className }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("ba-admin-theme", dark ? "dark" : "light");
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} className={cn("flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg hover:text-ink", className)} aria-label="Switch light or dark mode">
      <Sun className="hidden size-[18px] dark:block" aria-hidden />
      <Moon className="size-[18px] dark:hidden" aria-hidden />
    </button>
  );
}

function Notifications({ items }) {
  const count = items.length;
  return (
    <Popover
      id="admin-notifications-panel"
      label={`Notifications${count ? `, ${count} need attention` : ""}`}
      panelClassName={cn("w-80", PHONE_PANEL)}
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="relative flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg hover:text-ink">
          <Bell className="size-[18px]" aria-hidden />
          {count > 0 && <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-micro font-bold text-white ring-2 ring-surface">{count > 9 ? "9+" : count}</span>}
        </button>
      )}
    >
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-semibold text-ink">Needs attention</p>
        <p className="text-xs text-ink-muted">Queues filtered to what your role can access.</p>
      </div>
      {count === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>
      ) : (
        <ul className="max-h-80 overflow-y-auto py-1">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="flex gap-3 px-4 py-2.5 hover:bg-surface-muted">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.tone === "danger" ? "bg-danger" : "bg-warning-ink")} aria-hidden />
                <span className="min-w-0">
                  <span className="block text-sm text-ink">{item.title}</span>
                  <span className="block text-xs text-ink-muted">{item.meta}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

function Help() {
  return (
    <Popover
      id="admin-help-panel"
      label="Help"
      panelClassName={PHONE_PANEL}
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg hover:text-ink">
          <CircleHelp className="size-[18px]" aria-hidden />
        </button>
      )}
    >
      <div className="py-1.5">
        <p className="px-4 pt-1.5 pb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">Help</p>
        <Link href="/admin/help" className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          <BookOpen className="size-4 text-ink-muted" aria-hidden /> Admin guide &amp; module map
        </Link>
        <a href={`mailto:${site.supportEmail}`} className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          <Mail className="size-4 text-ink-muted" aria-hidden /> Contact tech support
        </a>
        <div className="mt-1 border-t border-line px-4 pt-2.5 pb-2">
          <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-ink-soft">
            <Keyboard className="size-3.5" aria-hidden /> Shortcuts
          </p>
          <p className="flex justify-between text-xs text-ink-muted">
            Focus search <kbd className="rounded border border-line px-1">/</kbd>
          </p>
        </div>
      </div>
    </Popover>
  );
}

function AccountMenu({ user }) {
  return (
    <Popover
      id="admin-account-panel"
      label="Account menu"
      panelClassName={cn("w-64", PHONE_PANEL)}
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 hover:bg-neutral-bg">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-brand-fg">{initials(user.name)}</span>
          <span className="hidden min-w-0 text-left leading-tight xl:block">
            <span className="block max-w-36 truncate text-small font-medium text-ink">{user.name}</span>
            <span className="block max-w-36 truncate text-micro text-ink-muted">{user.role.name}</span>
          </span>
        </button>
      )}
    >
      <div className="border-b border-line px-4 py-3">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-ink-muted">{user.email}</p>
        <p className="mt-1.5 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-micro font-medium text-brand-700">{user.role.name}</p>
      </div>
      <div className="py-1">
        <Link href="/admin/account" className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          <UserRound className="size-4 text-ink-muted" aria-hidden /> My account
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-danger-ink hover:bg-danger-bg">
            <LogOut className="size-4" aria-hidden /> Log out
          </button>
        </form>
      </div>
    </Popover>
  );
}

export function Header({ user, navigation = [], notifications, badges = {}, rail, onToggleRail, onOpenMobile }) {
  const [scrolled, setScrolled] = useState(false);
  // Phones: search hides behind an icon in the bar and opens over it, full width.
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => {
    flushSync(() => setSearchOpen(true));
    document.getElementById("admin-global-search")?.focus();
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur transition-shadow duration-200 supports-[backdrop-filter]:bg-surface/90",
        scrolled ? "shadow-[0_6px_18px_-10px_rgb(24_39_75/0.35)]" : "shadow-[0_1px_2px_rgb(24_39_75/0.04)]",
      )}
    >
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <div className="flex shrink-0 items-center gap-1.5 lg:min-w-0 lg:flex-1 lg:basis-0">
          <button type="button" onClick={onOpenMobile} className="flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          {/* On desktop the logo lives in the sidebar; phones and tablets hide the sidebar, so show it here. */}
          <Link href="/admin/dashboard" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-line md:hidden" aria-label={`${site.name} admin home`}>
            <BrandLogo variant="icon" className="size-7" />
          </Link>
          {/* Collapsing lives in the sidebar's own header; this button brings a collapsed sidebar back. */}
          {rail && (
            <button
              type="button"
              onClick={onToggleRail}
              className="mr-1 hidden size-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg hover:text-ink md:flex"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="size-[18px]" aria-hidden />
            </button>
          )}
          <div className="hidden min-w-0 lg:block">
            <Breadcrumbs wide navigation={navigation} />
          </div>
        </div>
        <div
          className={cn(
            searchOpen ? "absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-2 bg-surface px-3" : "hidden",
            "min-w-0 sm:static sm:flex sm:h-auto sm:flex-1 sm:justify-center sm:bg-transparent sm:px-0 lg:w-[min(36rem,32vw)] lg:flex-none",
          )}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false);
          }}
        >
          <button type="button" onClick={() => setSearchOpen(false)} className="flex size-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg sm:hidden" aria-label="Close search">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <GlobalSearch navigation={navigation} />
        </div>
        <div className="ml-auto flex shrink-0 items-center justify-end gap-0.5 sm:ml-0 lg:flex-1 lg:basis-0">
          <button type="button" onClick={openSearch} className="flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-neutral-bg hover:text-ink sm:hidden" aria-label="Search">
            <Search className="size-[18px]" aria-hidden />
          </button>
          <QuickCreate navigation={navigation} badges={badges} />
          <Notifications items={notifications} />
          <Help />
          <ThemeToggle className="max-[359px]:hidden" />
          <AccountMenu user={user} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2 sm:px-5 lg:hidden">
        <Breadcrumbs navigation={navigation} />
      </div>
      <RouteProgress />
    </header>
  );
}
