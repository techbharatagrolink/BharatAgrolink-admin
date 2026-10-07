"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";
import { NavIcon } from "./icons";

function pathOf(pathname) {
  return pathname === "/" ? "/dashboard" : pathname;
}

function isActive(pathname, href) {
  const path = pathOf(pathname);
  if (href === "/dashboard") return path === "/dashboard";
  return path === href || path.startsWith(`${href}/`);
}

function groupContains(pathname, item) {
  return (item.children || []).some((child) => isActive(pathname, child.href));
}

function activeChildHref(pathname, children) {
  const path = pathOf(pathname);
  const exact = children.find((child) => child.href === path);
  if (exact) return exact.href;
  return children
    .filter((child) => child.href !== "/dashboard" && path.startsWith(`${child.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function BrandMark({ compact }) {
  if (compact) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[13px] font-bold text-[#0e3b26]">
        A
      </span>
    );
  }
  return (
    <span className="flex h-10 min-w-0 items-center gap-2 rounded-lg bg-white px-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#0e3b26] text-[12px] font-bold text-white">A</span>
      <span className="truncate text-[13px] font-bold tracking-tight text-[#0e3b26]">Agrolink</span>
    </span>
  );
}

export function Sidebar({ rail, onToggleRail, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const activeGroupKey = () => {
    for (const section of navigation) {
      for (const item of section.items) {
        if (item.children && groupContains(pathname, item)) return item.key;
      }
    }
    return null;
  };
  const [openKey, setOpenKey] = useState(activeGroupKey);
  const [lastPath, setLastPath] = useState(pathname);
  const closeRef = useRef(null);
  const closeMobileRef = useRef(onCloseMobile);

  useEffect(() => {
    closeMobileRef.current = onCloseMobile;
  }, [onCloseMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") closeMobileRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    const key = activeGroupKey();
    if (key) setOpenKey(key);
  }

  const compact = rail && !mobileOpen;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 cursor-pointer bg-black/45 md:hidden" onClick={onCloseMobile} aria-hidden />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-nav text-nav-ink transition-[width,transform] duration-200",
          compact ? "w-16" : "w-[264px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b border-nav-line", compact ? "justify-center px-2" : "px-4")}>
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5" aria-label="Bharat Agrolink admin home">
            <BrandMark compact={compact} />
            {!compact && <span className="truncate text-[11px] font-medium tracking-wide text-nav-muted uppercase">Admin</span>}
          </Link>
          {mobileOpen && (
            <button ref={closeRef} type="button" onClick={onCloseMobile} className="ml-auto flex size-10 items-center justify-center rounded-md text-nav-muted hover:bg-white/10 hover:text-white md:hidden" aria-label="Close menu">
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
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          title={compact ? item.label : undefined}
                          aria-current={active ? "page" : undefined}
                          onClick={onCloseMobile}
                          className={cn(
                            "flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
                            active ? "bg-nav-active text-nav-active-ink" : "text-nav-ink/90 hover:bg-white/8 hover:text-white",
                            compact && "justify-center px-0",
                          )}
                        >
                          <NavIcon name={item.icon} className="size-[18px] shrink-0" />
                          {!compact && <span className="min-w-0 truncate">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  }

                  const containsActive = groupContains(pathname, item);
                  const open = openKey === item.key;
                  const activeHref = activeChildHref(pathname, item.children);
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => {
                          if (compact) {
                            setOpenKey(item.key);
                            onToggleRail?.();
                          } else {
                            setOpenKey((current) => (current === item.key ? null : item.key));
                          }
                        }}
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
                              ? "bg-white/10 text-white before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-[#e8740c]"
                              : cn("hover:bg-white/8 hover:text-white", containsActive ? "text-white" : "text-nav-ink/90"),
                          compact && "justify-center px-0",
                        )}
                      >
                        <NavIcon name={item.icon} className={cn("size-[18px] shrink-0", !compact && (open || containsActive) && "text-[#f59a3c]")} />
                        {!compact && (
                          <>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            <ChevronDown className={cn("ml-auto size-4 shrink-0 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted")} aria-hidden />
                          </>
                        )}
                      </button>
                      {!compact && (
                        <div className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!open ? true : undefined}>
                          <div className="min-h-0 overflow-hidden">
                            <ul id={`nav-${item.key}`} className="mt-0.5 mb-1 ml-[21px] space-y-0.5 border-l border-white/15 pl-3">
                              {item.children.map((child) => {
                                const active = child.href === activeHref;
                                return (
                                  <li key={child.key}>
                                    <Link
                                      href={child.href}
                                      onClick={onCloseMobile}
                                      aria-current={active ? "page" : undefined}
                                      className={cn(
                                        "flex h-8 items-center rounded-md px-2.5 text-[13px] transition-colors",
                                        active ? "bg-nav-active font-medium text-nav-active-ink" : "text-nav-muted hover:bg-white/8 hover:text-white",
                                      )}
                                    >
                                      <span className="min-w-0 truncate">{child.label}</span>
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
