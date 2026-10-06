"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, CircleHelp, CornerDownLeft, Keyboard, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, UserRound } from "lucide-react";
import { getBreadcrumbs, navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";
import { RouteProgress, startRouteProgress } from "./route-progress";
import { useAuth } from "@/components/auth-provider";
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

function flattenRoutes() {
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
      if (!terms.every((term) => haystack.includes(term))) return null;
      return { route, score: label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2 };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.route.label.localeCompare(b.route.label))
    .slice(0, 8)
    .map((match) => match.route);
}

function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pages = matchRoutes(flattenRoutes(), query);
  const showList = open && pages.length > 0;
  const current = Math.min(activeIndex, Math.max(pages.length - 1, 0));

  const choose = (page) => {
    if (!page) return;
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    startRouteProgress();
    router.push(page.href);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!pages.length) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current + step + pages.length) % pages.length);
    } else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (showList) choose(pages[current]);
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
        if (showList) choose(pages[current]);
      }}
    >
      <label htmlFor="admin-global-search" className="sr-only">
        Search admin pages
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        ref={inputRef}
        id="admin-global-search"
        role="combobox"
        aria-expanded={showList}
        aria-controls="admin-global-search-list"
        aria-autocomplete="list"
        aria-activedescendant={showList ? `gs-opt-${pages[current].key}` : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="Search pages…"
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
          onMouseDown={(event) => event.preventDefault()}
        >
          <li role="presentation" className="px-3 pt-1 pb-1.5 text-[10.5px] font-semibold tracking-wide text-ink-muted uppercase">
            Pages
          </li>
          {pages.map((page, i) => (
            <li
              key={page.key}
              id={`gs-opt-${page.key}`}
              role="option"
              aria-selected={i === current}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(page)}
              className={cn("mx-1.5 flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm", i === current ? "bg-brand-50 text-ink" : "text-ink-soft")}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
                <NavIcon name={page.icon} className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{page.label}</span>
                <span className="block truncate text-xs text-ink-muted">{page.trail}</span>
              </span>
              {i === current && <CornerDownLeft className="size-3.5 shrink-0 text-ink-muted" aria-hidden />}
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

function Notifications() {
  return (
    <Popover
      label="Notifications"
      panelClassName="w-80"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="relative flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink">
          <Bell className="size-[18px]" aria-hidden />
        </button>
      )}
    >
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-semibold text-ink">Needs attention</p>
        <p className="text-xs text-ink-muted">Alerts from orders, products and support will show here.</p>
      </div>
      <p className="px-4 py-6 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>
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
        <Link href="/support" className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          <CircleHelp className="size-4 text-ink-muted" aria-hidden /> Support
        </Link>
        <a href="mailto:admin-support@bharatagrolink.com" className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          Contact tech support
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

function AccountMenu() {
  const { session, logout } = useAuth();
  const admin = session?.profile?.admin;
  const name = admin?.name || "Admin";
  const email = admin?.email || "";
  const role = session?.profile?.role?.title || (session?.profile?.superAdmin ? "Super Admin" : "Administrator");
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  return (
    <Popover
      label="Account menu"
      panelClassName="w-64"
      trigger={({ toggle, props }) => (
        <button type="button" onClick={toggle} {...props} className="flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 hover:bg-neutral-bg">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-brand-fg">{initials}</span>
          <span className="hidden min-w-0 text-left leading-tight xl:block">
            <span className="block max-w-36 truncate text-[13px] font-medium text-ink">{name}</span>
            <span className="block max-w-36 truncate text-[11px] text-ink-muted">{role}</span>
          </span>
        </button>
      )}
    >
      <div className="border-b border-line px-4 py-3">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="truncate text-xs text-ink-muted">{email}</p>
        <p className="mt-1.5 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">{role}</p>
      </div>
      <div className="py-1">
        <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          <UserRound className="size-4 text-ink-muted" aria-hidden /> My account
        </Link>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted">
          Log out
        </button>
      </div>
    </Popover>
  );
}

export function Header({ rail, onToggleRail, onOpenMobile }) {
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
          <GlobalSearch />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-0.5 lg:flex-1 lg:basis-0">
          <Notifications />
          <Help />
          <ThemeToggle className="hidden sm:flex" />
          <AccountMenu />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2 sm:px-5 lg:hidden">
        <Breadcrumbs />
      </div>
      <RouteProgress />
    </header>
  );
}
