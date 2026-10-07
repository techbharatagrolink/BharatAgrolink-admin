"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NavIcon } from "./icons";

function isActive(pathname, href) {
  if (!href) return false;
  return pathname === href;
}

function groupContains(pathname, item) {
  return (item.children || []).some((child) => pathname === child.href || (child.href !== "/admin/dashboard" && pathname.startsWith(`${child.href}/`)));
}

function activeChildHref(pathname, children) {
  const exact = children.find((c) => c.href === pathname);
  if (exact) return exact.href;
  return children
    .filter((c) => pathname.startsWith(`${c.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function Badge({ value }) {
  if (!value) return null;
  return (
    <span className="ml-auto min-w-[20px] rounded-full bg-accent px-1.5 text-center text-[10.5px] leading-[18px] font-semibold text-accent-fg tabular shadow-sm">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function Sidebar({ navigation, badges = {}, rail, onToggleRail, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const activeGroupKey = () => {
    for (const section of navigation) for (const item of section.items) if (item.children && groupContains(pathname, item)) return item.key;
    return null;
  };
  const [openKey, setOpenKey] = useState(activeGroupKey);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    const key = activeGroupKey();
    if (key) setOpenKey(key);
  }

  const toggleGroup = (key) => setOpenKey((current) => (current === key ? null : key));
  const openFromRail = (key) => {
    setOpenKey(key);
    onToggleRail?.();
  };
  const compact = rail && !mobileOpen;
  const closeRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onCloseMobile?.();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/45 md:hidden" onClick={onCloseMobile} aria-hidden />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-nav text-nav-ink duration-200",
          compact ? "w-16" : "w-[264px]",
          mobileOpen ? "translate-x-0 transition-[width,transform]" : "-translate-x-full transition-[width,transform,visibility] max-md:invisible md:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b border-nav-line", compact ? "justify-center px-2" : "px-4")}>
          <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2.5" aria-label={`${site.name} admin home`}>
            {compact ? (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1">
                <BrandLogo variant="icon" className="size-7" priority />
              </span>
            ) : (
              <>
                <span className="flex h-10 shrink-0 items-center rounded-lg bg-white px-2 py-1">
                  <BrandLogo className="h-8" priority />
                </span>
                <span className="truncate text-[11px] font-medium tracking-wide text-nav-muted uppercase">Admin</span>
              </>
            )}
          </Link>
          {mobileOpen && (
            <button ref={closeRef} type="button" onClick={onCloseMobile} className="ml-auto rounded-md p-1.5 text-nav-muted hover:bg-white/10 hover:text-white md:hidden" aria-label="Close menu">
              <X className="size-5" />
            </button>
          )}
        </div>

        <nav className="nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-3">
          {navigation.map((section) => (
            <div key={section.section} className="mb-3">
              {!compact ? (
                <p className="px-5 pb-1.5 text-[10.5px] font-semibold tracking-[0.08em] text-nav-muted/80 uppercase">{section.section}</p>
              ) : (
                <div className="mx-4 mb-2 border-t border-nav-line" aria-hidden />
              )}
              <ul className="space-y-0.5 px-2.5">
                {section.items.map((item) => {
                  if (!item.children) {
                    const active = isActive(pathname, item.href) || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          title={compact ? item.label : undefined}
                          aria-label={compact ? item.label : undefined}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
                            active ? "bg-nav-active text-nav-active-ink" : "text-nav-ink/90 hover:bg-white/8 hover:text-white",
                            compact && "justify-center px-0",
                          )}
                        >
                          <NavIcon name={item.icon} className="size-[18px] shrink-0" />
                          {!compact && <span className="truncate">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  }
                  const containsActive = groupContains(pathname, item);
                  const open = openKey === item.key;
                  const activeHref = activeChildHref(pathname, item.children);
                  const groupBadge = item.children.reduce((sum, c) => sum + (c.badge ? badges[c.badge] || 0 : 0), 0);
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => (compact ? openFromRail(item.key) : toggleGroup(item.key))}
                        title={compact ? item.label : undefined}
                        aria-expanded={compact ? undefined : open}
                        aria-controls={compact ? undefined : `nav-${item.key}`}
                        className={cn(
                          "relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13.5px] font-medium transition-colors",
                          compact
                            ? containsActive
                              ? "bg-nav-active text-nav-active-ink"
                              : "text-nav-ink/90 hover:bg-white/8 hover:text-white"
                            : open
                              ? "bg-white/10 text-white before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-accent"
                              : cn("hover:bg-white/8 hover:text-white", containsActive ? "text-white" : "text-nav-ink/90"),
                          compact && "justify-center px-0",
                        )}
                      >
                        <NavIcon name={item.icon} className={cn("size-[18px] shrink-0", !compact && (open || containsActive) && "text-accent")} />
                        {!compact && (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.sensitive && <Lock className="size-3 shrink-0 text-nav-muted" aria-label="Sensitive module" />}
                            {!open && groupBadge > 0 ? <Badge value={groupBadge} /> : <span className="ml-auto" />}
                            <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted")} aria-hidden />
                          </>
                        )}
                        {compact && groupBadge > 0 && <span className="absolute top-1.5 right-2 size-2 rounded-full bg-accent ring-2 ring-nav" aria-hidden />}
                      </button>
                      {!compact && (
                        <div className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!open}>
                          <div className="min-h-0 overflow-hidden">
                            <ul id={`nav-${item.key}`} className="mt-0.5 mb-1 ml-[21px] space-y-0.5 border-l border-white/15 pl-3">
                              {item.children.map((child) => {
                                const active = child.href === activeHref;
                                return (
                                  <li key={child.key}>
                                    <Link
                                      href={child.href}
                                      aria-current={active ? "page" : undefined}
                                      className={cn(
                                        "flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] transition-colors",
                                        active ? "bg-nav-active font-medium text-nav-active-ink" : "text-nav-muted hover:bg-white/8 hover:text-white",
                                      )}
                                    >
                                      <span className="truncate">{child.label}</span>
                                      <Badge value={child.badge ? badges[child.badge] : 0} />
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hidden shrink-0 border-t border-nav-line p-2.5 md:block">
          <button
            type="button"
            onClick={onToggleRail}
            className={cn("flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-[13px] text-nav-muted hover:bg-white/8 hover:text-white", compact && "justify-center px-0")}
            aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {compact ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!compact && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
