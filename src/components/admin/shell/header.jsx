"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Bell, BookOpen, ChevronRight, CircleHelp, CornerDownLeft, Keyboard, LogOut, Mail, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, UserRound } from "lucide-react";
import { getBreadcrumbs } from "@/lib/content/admin/navigation";
import { initials } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";
import { logoutAction } from "@/lib/actions/admin/auth";
import { RouteProgress, startRouteProgress } from "./route-progress";
import { NavIcon } from "./icons";

function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-[13px] text-ink-muted">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${i}`}>
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-ink-muted/60" aria-hidden />}
              <li className={cn("min-w-0", i < crumbs.length - 2 && "hidden sm:block", last ? "truncate font-medium text-ink" : "shrink-0")}>
                {crumb.href && !last ? (
                  <Link href={crumb.href} className="hover:text-ink hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{crumb.label}</span>
                )}
              </li>
            </Fragment>
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
      if (item.href) routes.push({ key: item.key, label: item.label, href: item.href, trail: section.section, icon: item.icon });
      for (const child of item.children || []) routes.push({ key: child.key, label: child.label, href: child.href, trail: item.label, icon: item.icon });
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
        className="h-9 w-full rounded-lg border border-line bg-surface-muted pr-12 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:bg-surface focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
        autoComplete="off"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 text-[10px] text-ink-muted lg:block">Ctrl K</kbd>
      {showList && (
        <ul
          id="admin-global-search-list"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-[min(70vh,26rem)] overflow-y-auto rounded-xl border border-line bg-surface py-1.5 shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          {pages.length > 0 && <li role="presentation" className="px-3 pt-1 pb-1.5 text-[10.5px] font-semibold tracking-wide text-ink-muted uppercase">Pages</li>}
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

function ThemeToggle({ className }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("ba-admin-theme", dark ? "dark" : "light");
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} className={cn("flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink", className)} aria-label="Switch light or dark mode">
      <Sun className="hidden size-[18px] dark:block" aria-hidden />
      <Moon className="size-[18px] dark:hidden" aria-hidden />
    </button>
  );
}

function Notifications({ items }) {
  const count = items.length;
  return (
    <Popover
      label={`Notifications${count ? `, ${count} need attention` : ""}`}
      panelClassName="w-80"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="relative flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink">
          <Bell className="size-[18px]" aria-hidden />
          {count > 0 && <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9.5px] font-bold text-accent-fg ring-2 ring-surface">{count > 9 ? "9+" : count}</span>}
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
      label="Help"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="hidden size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink sm:flex">
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
      label="Account menu"
      panelClassName="w-64"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 hover:bg-neutral-bg">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-brand-fg">{initials(user.name)}</span>
          <span className="hidden min-w-0 text-left leading-tight xl:block">
            <span className="block max-w-36 truncate text-[13px] font-medium text-ink">{user.name}</span>
            <span className="block max-w-36 truncate text-[11px] text-ink-muted">{user.role.name}</span>
          </span>
        </button>
      )}
    >
      <div className="border-b border-line px-4 py-3">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-ink-muted">{user.email}</p>
        <p className="mt-1.5 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">{user.role.name}</p>
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

export function Header({ user, navigation = [], notifications, rail, onToggleRail, onOpenMobile }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <div className="flex shrink-0 items-center lg:min-w-0 lg:flex-1 lg:basis-0">
          <button type="button" onClick={onOpenMobile} className="flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <button
            type="button"
            onClick={onToggleRail}
            className="mr-1 hidden size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink md:flex"
            aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
            title={rail ? "Expand sidebar" : "Collapse sidebar"}
          >
            {rail ? <PanelLeftOpen className="size-[18px]" aria-hidden /> : <PanelLeftClose className="size-[18px]" aria-hidden />}
          </button>
          <div className="hidden min-w-0 lg:block">
            <Breadcrumbs />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 justify-center lg:w-[min(36rem,40vw)] lg:flex-none">
          <GlobalSearch navigation={navigation} />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-0.5 lg:flex-1 lg:basis-0">
          <Notifications items={notifications} />
          <Help />
          <ThemeToggle className="hidden sm:flex" />
          <AccountMenu user={user} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2 sm:px-5 lg:hidden">
        <Breadcrumbs />
      </div>
      <RouteProgress />
    </header>
  );
}
