"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronsRight, Lock, PanelLeftClose, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NavIcon } from "./icons";

const pathOf = (href) => (href || "").split(/[?#]/)[0];

/** Collect all leaf hrefs from navigation to prevent false prefix matches. */
function collectLeafHrefs(navigation) {
  const set = new Set();
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.children) {
        for (const child of item.children) set.add(pathOf(child.href));
      } else {
        set.add(pathOf(item.href));
      }
    }
  }
  return set;
}

function isActive(pathname, href, leafHrefs) {
  if (!href) return false;
  const exact = pathname === href;
  if (exact) return true;
  // Prefix match only if no other registered leaf matches the path
  const prefixed = pathname.startsWith(`${pathOf(href)}/`);
  return prefixed && !leafHrefs.has(pathname);
}

function groupContains(pathname, item, leafHrefs) {
  return (item.children || []).some((child) => isActive(pathname, child.href, leafHrefs));
}

function activeChildKey(pathname, children, leafHrefs) {
  const exact = children.find((c) => c.href === pathname);
  if (exact) return exact.key;
  return children
    .filter((c) => isActive(pathname, c.href, leafHrefs))
    .sort((a, b) => pathOf(b.href).length - pathOf(a.href).length)[0]?.key;
}

function Badge({ value }) {
  if (!value) return null;
  return (
    <span className="ml-auto min-w-[20px] rounded-full bg-[var(--nav-badge,var(--accent))] px-1.5 text-center text-micro leading-[18px] font-semibold text-white tabular shadow-sm">
      {value > 99 ? "99+" : value}
    </span>
  );
}

// Each nesting level steps in by the parent's icon box (18px) + gap (12px) = 30px:
// 19px to the guide line (under the icon centre) + 1px border + 10px padding.
// Callers add the 19px margin on top of the parent row's own left offset.
const nestedList = "border-l border-white/15 pl-[10px]";
const guideMark = "before:absolute before:inset-y-1.5 before:-left-[11px] before:w-px before:rounded-full";

function itemIsCurrent(pathname, item, leafHrefs) {
  if (item.children) return groupContains(pathname, item, leafHrefs);
  return isActive(pathname, item.href, leafHrefs);
}

function badgeCount(item, badges) {
  if (!item.children) return item.badge ? badges[item.badge] || 0 : 0;
  return item.children.reduce((sum, child) => sum + (child.badge ? badges[child.badge] || 0 : 0), 0);
}

// Zoho-style coloured icons for the top-level sections (Home blue, Reports pink, Analytics purple …).
const SECTION_TINTS = ["#6d8dff", "#ff6b9d", "#b07cff", "#35d08f", "#ffa94d", "#38c6db", "#f7cd4a", "#ff8170", "#8fa8ff"];

/**
 * Zoho-style "+" on a sidebar section: one create page → a direct link; several → a small menu.
 * Sits in a slot that NavParentButton reserves (`reserveAdd`) just left of the section's chevron.
 */
function SectionAdd({ section, creates }) {
  const [box, setBox] = useState(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!box) return;
    const close = () => setBox(null);
    const onDown = (e) => !panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target) && close();
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [box]);

  const plusClass = "flex size-6 items-center justify-center rounded-md text-nav-muted transition-colors hover:bg-white/15 hover:text-white focus-visible:text-white";
  if (creates.length === 1) {
    const only = creates[0];
    return (
      <Link href={only.href} aria-label={only.label} title={only.label} className={plusClass}>
        <Plus className="size-4" aria-hidden />
      </Link>
    );
  }

  const toggle = () => {
    if (box) return setBox(null);
    const r = btnRef.current.getBoundingClientRect();
    const width = 236;
    const height = creates.length * 40 + 48;
    const sidebarRight = btnRef.current.closest("aside")?.getBoundingClientRect().right ?? r.right;
    if (sidebarRight + 8 + width <= window.innerWidth - 8) {
      // Room beside the sidebar (desktop): open just past its edge, level with the section.
      setBox({ left: sidebarRight + 8, top: Math.max(8, Math.min(r.top - 6, window.innerHeight - height - 8)) });
    } else {
      // Narrow screens (phone drawer): drop down under the "+", kept on screen.
      const below = r.bottom + 6 + height <= window.innerHeight - 8;
      setBox({ left: Math.min(Math.max(8, r.right - width), window.innerWidth - width - 8), top: below ? r.bottom + 6 : Math.max(8, r.top - 6 - height) });
    }
  };
  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} aria-label={`Create in ${section}`} title={`Create in ${section}`} aria-haspopup="true" aria-expanded={Boolean(box)} className={cn(plusClass, box && "bg-white/15 text-white")}>
        <Plus className="size-4" aria-hidden />
      </button>
      {box &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            aria-label={`Create in ${section}`}
            style={{ position: "fixed", left: box.left, top: box.top, width: 236 }}
            className="zoho-nav z-[70] animate-in rounded-lg border border-nav-line bg-nav py-1.5 text-nav-ink shadow-xl duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none"
            onClick={(e) => e.target.closest("a") && setBox(null)}
          >
            <p className="px-3 pt-0.5 pb-1.5 text-micro font-semibold tracking-wide text-nav-muted uppercase">Create in {section}</p>
            {creates.map((c) => (
              <Link key={c.href} role="menuitem" href={c.href} className="mx-1.5 flex items-center gap-2 rounded-md px-2.5 py-2 text-small text-nav-ink hover:bg-white/10 hover:text-white">
                <Plus className="size-3.5 shrink-0 text-nav-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{c.label}</span>
                {c.repeated && <span className="shrink-0 truncate text-micro text-nav-muted">{c.trail}</span>}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

function NavParentButton({ compact, nested, open, containsActive, label, icon, sensitive, badge, onClick, controlsId, tint, reserveAdd }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={compact ? label : undefined}
      aria-expanded={open}
      aria-controls={controlsId}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-lg px-2.5 text-left transition-colors",
        nested ? "h-8 text-small" : "h-9 text-body font-medium",
        compact
          ? containsActive
            ? "bg-nav-active text-nav-active-ink"
            : "text-nav-ink/90 hover:bg-white/8 hover:text-white"
          : open
            ? cn(
                "bg-white/10 text-white",
                nested ? cn(guideMark, "before:bg-accent") : "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-accent",
              )
            : cn("hover:bg-white/8 hover:text-white", containsActive ? cn("text-white", nested && cn(guideMark, "before:bg-white/60")) : nested ? "text-nav-ink/80" : "text-nav-ink/90"),
        compact && "justify-center px-0",
      )}
    >
      <span className="flex size-[18px] shrink-0 items-center justify-center" style={tint && !nested ? { color: tint } : undefined}>
        <NavIcon
          name={icon}
          className={cn(nested ? "size-4" : "size-[18px]", tint && !nested ? null : !compact && (open || containsActive) ? "text-accent" : nested && "opacity-75")}
        />
      </span>
      {!compact && (
        <>
          <span className="truncate">{label}</span>
          {sensitive && <Lock className="size-3 shrink-0 text-nav-muted" aria-label="Sensitive module" />}
          {!open && badge > 0 ? <Badge value={badge} /> : <span className="ml-auto" />}
          {reserveAdd && <span className="w-6 shrink-0" aria-hidden />}
          <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted")} aria-hidden />
        </>
      )}
      {compact && badge > 0 && <span className="absolute top-1.5 right-2 size-2 rounded-full bg-[var(--nav-badge,var(--accent))] ring-2 ring-nav" aria-hidden />}
      {compact && <ChevronDown className={cn("absolute right-0.5 bottom-0.5 size-2.5 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted")} aria-hidden />}
    </button>
  );
}

function RailFlyout({ anchor, onClose, children }) {
  const panelRef = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const maxHeight = window.innerHeight - 16;
      const height = Math.min(panel.scrollHeight, maxHeight);
      let top = rect.top;
      if (top + height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - height - 8);
      setBox({ top, left: rect.right + 8, maxHeight });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(panel);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchor]);

  useEffect(() => {
    const onPointer = (event) => {
      if (panelRef.current?.contains(event.target) || anchor?.contains(event.target)) return;
      onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div
      ref={panelRef}
      style={{ top: box?.top ?? -9999, left: box?.left ?? -9999, maxHeight: box?.maxHeight ?? 420 }}
      className={cn("zoho-nav fixed z-[60] w-[248px] animate-in duration-150 fade-in-0 slide-in-from-left-2 motion-reduce:animate-none overflow-y-auto overscroll-contain rounded-lg border border-nav-line bg-nav py-1.5 text-nav-ink shadow-xl", !box && "invisible")}
    >
      {children}
    </div>,
    document.body,
  );
}

export function Sidebar({ navigation, badges = {}, rail, onToggleRail, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const leafHrefs = useMemo(() => collectLeafHrefs(navigation), [navigation]);
  const sectionKeyOf = (section) => section.key || section.section;
  const activeGroupKey = () => {
    for (const section of navigation) for (const item of section.items) if (item.children && groupContains(pathname, item, leafHrefs)) return item.key;
    return null;
  };
  const activeSectionKey = () => {
    for (const section of navigation) {
      if (section.section && section.items.some((item) => itemIsCurrent(pathname, item, leafHrefs))) return sectionKeyOf(section);
    }
    return null;
  };
  const [openKey, setOpenKey] = useState(activeGroupKey);
  const [openSection, setOpenSection] = useState(activeSectionKey);
  const [railMenu, setRailMenu] = useState(null);
  const [lastPath, setLastPath] = useState(pathname);
  const railAnchors = useRef(new Map());
  if (lastPath !== pathname) {
    setLastPath(pathname);
    const key = activeGroupKey();
    if (key) setOpenKey(key);
    const sectionKey = activeSectionKey();
    if (sectionKey) setOpenSection(sectionKey);
    setRailMenu(null);
  }

  const toggleGroup = (key) => setOpenKey((current) => (current === key ? null : key));
  const toggleSection = (key) => setOpenSection((current) => (current === key ? null : key));
  const toggleRailMenu = (key) => setRailMenu((current) => (current === key ? null : key));
  const compact = rail && !mobileOpen;
  const closeRef = useRef(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  // Flat list of every link with its breadcrumb, for the Zoho-style "Search" box.
  const searchable = useMemo(() => {
    const out = [];
    for (const section of navigation)
      for (const item of section.items) {
        if (item.children) for (const child of item.children) out.push({ ...child, path: [section.section, item.label].filter(Boolean).join(" › ") });
        else out.push({ ...item, path: section.section || "" });
      }
    return out;
  }, [navigation]);
  // Items whose own name matches come first, then items that only match by their section / group.
  const results = q
    ? [...searchable.filter((l) => l.label.toLowerCase().includes(q)), ...searchable.filter((l) => !l.label.toLowerCase().includes(q) && l.path.toLowerCase().includes(q))]
    : [];
  // Zoho-style "+" next to a list page: when the role's menu has a create page ".../new" (e.g. Add
  // Seller at /admin/vendors/new), its list page (/admin/vendors, "All Sellers") gets a quick "+".
  const quickAdd = useMemo(() => {
    const map = new Map();
    for (const l of searchable) {
      const path = pathOf(l.href);
      if (/^(add|new|create)\b/i.test(l.label) && path.endsWith("/new")) map.set(path.slice(0, -4), { href: l.href, label: l.label });
    }
    return map;
  }, [searchable]);

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
          "zoho-nav fixed inset-y-0 left-0 z-50 flex flex-col bg-nav text-nav-ink shadow-[4px_0_24px_-12px_rgb(0_0_0/0.35)] duration-200",
          compact ? "w-16" : "w-[264px]",
          mobileOpen ? "translate-x-0 transition-[width,transform]" : "-translate-x-full transition-[width,transform,visibility] max-md:invisible md:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className={cn("flex h-14 shrink-0 items-center gap-2.5", compact ? "justify-center px-2" : "px-3.5")}>
          <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2.5 rounded-lg" aria-label={`${site.name} admin home`}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-white/20">
              <BrandLogo variant="icon" className="size-7" priority />
            </span>
            {!compact && <span className="truncate text-subheading font-semibold text-white">{site.name}</span>}
          </Link>
          {mobileOpen ? (
            <button ref={closeRef} type="button" onClick={onCloseMobile} className="ml-auto rounded-md p-1.5 text-nav-muted hover:bg-white/10 hover:text-white md:hidden" aria-label="Close menu">
              <X className="size-5" />
            </button>
          ) : (
            !compact && (
              <button
                type="button"
                onClick={onToggleRail}
                className="ml-auto hidden rounded-md p-1.5 text-nav-muted transition-colors hover:bg-white/10 hover:text-white md:block"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-[18px]" />
              </button>
            )
          )}
        </div>

        {!compact && (
          <div className="shrink-0 border-b border-nav-line px-3 pb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-nav-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder="Search"
                aria-label="Search menu"
                className="h-9 w-full rounded-lg border border-white/15 bg-white/5 pr-3 pl-8 text-small text-white placeholder:text-nav-muted transition-colors outline-none hover:border-white/25 focus:border-[var(--accent)] focus:bg-white/10 [&::-webkit-search-cancel-button]:invert"
              />
            </div>
          </div>
        )}

        <nav className="nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-3">
          {q && !compact && (
            <div className="px-2.5">
              <p className="px-2.5 pb-1.5 text-micro font-medium tracking-wide text-nav-muted uppercase">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              {results.length ? (
                <ul className="space-y-0.5">
                  {results.map((l) => {
                    const active = isActive(pathname, l.href, leafHrefs);
                    return (
                      <li key={l.key}>
                        <Link
                          href={l.href}
                          onClick={() => setQuery("")}
                          aria-current={active ? "page" : undefined}
                          className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors", active ? "bg-nav-active text-nav-active-ink" : "text-nav-ink hover:bg-white/8 hover:text-white")}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-small">{l.label}</span>
                            {l.path && <span className="block truncate text-micro text-nav-muted">{l.path}</span>}
                          </span>
                          <Badge value={l.badge ? badges[l.badge] : 0} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-2.5 py-4 text-small text-nav-muted">No menu items match “{query.trim()}”.</p>
              )}
            </div>
          )}
          {/* railAnchors (DOM nodes the compact-rail flyouts hang from) is read inside: a flyout only opens from a click
              on its anchor, so the node is already in the map on the render that shows it. */}
          {/* eslint-disable-next-line react-hooks/refs */}
          {!(q && !compact) && navigation.map((section, sectionIndex) => {
            const sectionKey = sectionKeyOf(section);
            const tint = SECTION_TINTS[sectionIndex % SECTION_TINTS.length];
            // Create pages in this section of the role's menu (Add Seller, Add Product, Create Order…), for its "+".
            const sectionCreates = section.items
              .flatMap((item) => (item.children ?? [item]).map((c) => ({ label: c.label, href: c.href, trail: item.children ? item.label : "" })))
              .filter((c) => c.href && /^(add|new|create)\b/i.test(c.label));
            sectionCreates.forEach((c) => (c.repeated = sectionCreates.filter((x) => x.label === c.label).length > 1));
            const collapsible = Boolean(section.section) && !compact;
            const sectionOpen = !collapsible || openSection === sectionKey;
            const sectionBadge = section.items.reduce((sum, item) => sum + badgeCount(item, badges), 0);
            const sectionActive = section.section ? section.items.some((item) => itemIsCurrent(pathname, item, leafHrefs)) : false;
            const renderItems = (iconOnly) => {
              const nested = Boolean(section.section) && !iconOnly;
              return section.items.map((item) => {
                if (!item.children) {
                  const active = isActive(pathname, item.href, leafHrefs);
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        title={iconOnly ? item.label : undefined}
                        aria-label={iconOnly ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-2.5 transition-colors",
                          nested ? "h-8 text-small" : "h-9 text-body font-medium",
                          active
                            ? cn("bg-nav-active text-nav-active-ink", nested && cn("font-medium", guideMark, "before:bg-accent"))
                            : cn(nested ? "text-nav-ink/80" : "text-nav-ink/90", "hover:bg-white/8 hover:text-white"),
                          iconOnly && "justify-center px-0",
                        )}
                      >
                        <span className="flex size-[18px] shrink-0 items-center justify-center" style={!nested ? { color: tint } : undefined}>
                          <NavIcon name={item.icon} className={cn(nested ? "size-4" : "size-[18px]", nested && !active && "opacity-75")} />
                        </span>
                        {!iconOnly && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                }
                const containsActive = groupContains(pathname, item, leafHrefs);
                const open = openKey === item.key;
                const activeKey = activeChildKey(pathname, item.children, leafHrefs);
                const groupBadge = item.children.reduce((sum, child) => sum + (child.badge ? badges[child.badge] || 0 : 0), 0);
                return (
                  <li key={item.key}>
                    <NavParentButton
                      compact={iconOnly}
                      nested={nested}
                      open={open}
                      containsActive={containsActive}
                      label={item.label}
                      icon={item.icon}
                      sensitive={item.sensitive}
                      badge={groupBadge}
                      onClick={() => toggleGroup(item.key)}
                      controlsId={`nav-${item.key}`}
                    />
                    {!iconOnly && (
                      <div className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!open}>
                        <div className="min-h-0 overflow-hidden">
                          <ul id={`nav-${item.key}`} className={cn("mt-0.5 mb-1 ml-[19px] space-y-0.5", nestedList)}>
                            {item.children.map((child) => {
                              const active = child.key === activeKey;
                              const add = quickAdd.get(pathOf(child.href));
                              return (
                                <li key={child.key} className="group/row relative">
                                  <Link
                                    href={child.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                      "relative flex h-8 items-center gap-2 rounded-md px-2.5 text-small transition-colors",
                                      add && "pr-9",
                                      active ? cn("bg-nav-active font-medium text-nav-active-ink", guideMark, "before:bg-accent") : "text-nav-muted hover:bg-white/8 hover:text-white",
                                    )}
                                  >
                                    <span className="truncate">{child.label}</span>
                                    <Badge value={child.badge ? badges[child.badge] : 0} />
                                  </Link>
                                  {add && (
                                    // Separate link (a link can't sit inside another). Shown on hover / focus, always on the active row.
                                    <Link
                                      href={add.href}
                                      aria-label={add.label}
                                      title={add.label}
                                      className={cn(
                                        "absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-white transition-all hover:bg-white/20 focus-visible:opacity-100",
                                        active ? "opacity-100" : "opacity-0 group-hover/row:opacity-100",
                                      )}
                                    >
                                      <Plus className="size-4" aria-hidden />
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              });
            };

            if (compact && section.section) {
              const menuOpen = railMenu === sectionKey;
              const anchor = railAnchors.current.get(sectionKey);
              return (
                <div key={sectionKey} className="mb-2">
                  <div className="mx-4 mb-2 border-t border-nav-line" aria-hidden />
                  <div
                    className="px-2.5"
                    ref={(node) => {
                      if (node) railAnchors.current.set(sectionKey, node);
                      else railAnchors.current.delete(sectionKey);
                    }}
                  >
                    <NavParentButton
                      compact
                      tint={tint}
                      open={menuOpen}
                      containsActive={sectionActive}
                      label={section.section}
                      icon={section.icon}
                      badge={sectionBadge}
                      onClick={() => toggleRailMenu(sectionKey)}
                      controlsId={menuOpen ? `nav-rail-${sectionKey}` : undefined}
                    />
                  </div>
                  {menuOpen && anchor && (
                    <RailFlyout anchor={anchor} onClose={() => setRailMenu(null)}>
                      <div className="px-1.5">
                        <NavParentButton
                          open
                          tint={tint}
                          containsActive={sectionActive}
                          label={section.section}
                          icon={section.icon}
                          badge={sectionBadge}
                          onClick={() => setRailMenu(null)}
                          controlsId={`nav-rail-${sectionKey}`}
                        />
                      </div>
                      <ul id={`nav-rail-${sectionKey}`} className={cn("mt-0.5 mr-1.5 ml-[25px] space-y-0.5", nestedList)} onClick={(event) => event.target.closest("a") && setRailMenu(null)}>
                        {renderItems(false)}
                      </ul>
                    </RailFlyout>
                  )}
                </div>
              );
            }

            return (
              <div key={sectionKey ?? section.items[0]?.key} className={cn(compact ? "mb-2" : "mb-3")}>
                {compact ? <div className="mx-4 mb-2 border-t border-nav-line" aria-hidden /> : null}
                {collapsible && (
                  <div className="relative px-2.5">
                    <NavParentButton
                      open={sectionOpen}
                      tint={tint}
                      containsActive={sectionActive}
                      label={section.section}
                      icon={section.icon}
                      badge={sectionBadge}
                      onClick={() => toggleSection(sectionKey)}
                      controlsId={`nav-section-${sectionKey}`}
                      reserveAdd={sectionCreates.length > 0}
                    />
                    {sectionCreates.length > 0 && (
                      // Over the slot NavParentButton reserves: wrapper padding 10 + button padding 10 + chevron 16 + gap 12 = 48px from the right.
                      <div className="absolute top-1/2 right-[48px] -translate-y-1/2">
                        <SectionAdd section={section.section} creates={sectionCreates} />
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={cn(collapsible && "grid transition-[grid-template-rows,opacity] duration-200 ease-out", collapsible && (sectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"))}
                  inert={collapsible && !sectionOpen ? true : undefined}
                >
                  <div className={cn(collapsible && "min-h-0 overflow-hidden")}>
                    <ul
                      id={collapsible ? `nav-section-${sectionKey}` : undefined}
                      className={cn("space-y-0.5", collapsible ? cn("mt-0.5 mr-2.5 ml-[29px]", nestedList) : "px-2.5")}
                    >
                      {renderItems(compact)}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {compact && (
          <div className="hidden shrink-0 border-t border-nav-line p-2.5 md:block">
            <button
              type="button"
              onClick={onToggleRail}
              className="flex h-9 w-full items-center justify-center rounded-lg text-nav-muted hover:bg-white/8 hover:text-white"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
