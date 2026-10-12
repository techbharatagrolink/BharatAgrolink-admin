"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronsLeft, ChevronsRight, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NavIcon } from "./icons";

const pathOf = (href) => (href || "").split(/[?#]/)[0];

function isActive(pathname, href) {
  if (!href) return false;
  return pathname === href;
}

function groupContains(pathname, item) {
  return (item.children || []).some((child) => pathname === child.href || (child.href !== "/admin/dashboard" && pathname.startsWith(`${child.href}/`)));
}

function activeChildKey(pathname, children) {
  const exact = children.find((c) => c.href === pathname);
  if (exact) return exact.key;
  return children
    .filter((c) => pathname.startsWith(`${pathOf(c.href)}/`))
    .sort((a, b) => pathOf(b.href).length - pathOf(a.href).length)[0]?.key;
}

function Badge({ value }) {
  if (!value) return null;
  return (
    <span className="ml-auto min-w-[20px] rounded-full bg-accent px-1.5 text-center text-[10.5px] leading-[18px] font-semibold text-accent-fg tabular shadow-sm">
      {value > 99 ? "99+" : value}
    </span>
  );
}

// Each nesting level steps in by the parent's icon box (18px) + gap (12px) = 30px:
// 19px to the guide line (under the icon centre) + 1px border + 10px padding.
// Callers add the 19px margin on top of the parent row's own left offset.
const nestedList = "border-l border-white/15 pl-[10px]";
const guideMark = "before:absolute before:inset-y-1.5 before:-left-[11px] before:w-px before:rounded-full";

function itemIsCurrent(pathname, item) {
  if (item.children) return groupContains(pathname, item);
  return isActive(pathname, item.href) || pathname.startsWith(`${item.href}/`);
}

function badgeCount(item, badges) {
  if (!item.children) return item.badge ? badges[item.badge] || 0 : 0;
  return item.children.reduce((sum, child) => sum + (child.badge ? badges[child.badge] || 0 : 0), 0);
}

function NavParentButton({ compact, nested, open, containsActive, label, icon, sensitive, badge, onClick, controlsId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={compact ? label : undefined}
      aria-expanded={open}
      aria-controls={controlsId}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-lg px-2.5 text-left transition-colors",
        nested ? "h-8 text-[13px]" : "h-9 text-[13.5px] font-medium",
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
      <span className="flex size-[18px] shrink-0 items-center justify-center">
        <NavIcon
          name={icon}
          className={cn(nested ? "size-4" : "size-[18px]", !compact && (open || containsActive) ? "text-accent" : nested && "opacity-75")}
        />
      </span>
      {!compact && (
        <>
          <span className="truncate">{label}</span>
          {sensitive && <Lock className="size-3 shrink-0 text-nav-muted" aria-label="Sensitive module" />}
          {!open && badge > 0 ? <Badge value={badge} /> : <span className="ml-auto" />}
          <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted")} aria-hidden />
        </>
      )}
      {compact && badge > 0 && <span className="absolute top-1.5 right-2 size-2 rounded-full bg-accent ring-2 ring-nav" aria-hidden />}
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
      className={cn("fixed z-[60] w-[248px] overflow-y-auto overscroll-contain rounded-lg border border-nav-line bg-nav py-1.5 text-nav-ink shadow-xl", !box && "invisible")}
    >
      {children}
    </div>,
    document.body,
  );
}

export function Sidebar({ navigation, badges = {}, rail, onToggleRail, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const sectionKeyOf = (section) => section.key || section.section;
  const activeGroupKey = () => {
    for (const section of navigation) for (const item of section.items) if (item.children && groupContains(pathname, item)) return item.key;
    return null;
  };
  const activeSectionKey = () => {
    for (const section of navigation) {
      if (section.section && section.items.some((item) => itemIsCurrent(pathname, item))) return sectionKeyOf(section);
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
          {navigation.map((section) => {
            const sectionKey = sectionKeyOf(section);
            const collapsible = Boolean(section.section) && !compact;
            const sectionOpen = !collapsible || openSection === sectionKey;
            const sectionBadge = section.items.reduce((sum, item) => sum + badgeCount(item, badges), 0);
            const sectionActive = section.section ? section.items.some((item) => itemIsCurrent(pathname, item)) : false;
            const renderItems = (iconOnly) => {
              const nested = Boolean(section.section) && !iconOnly;
              return section.items.map((item) => {
                if (!item.children) {
                  const active = isActive(pathname, item.href) || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        title={iconOnly ? item.label : undefined}
                        aria-label={iconOnly ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-2.5 transition-colors",
                          nested ? "h-8 text-[13px]" : "h-9 text-[13.5px] font-medium",
                          active
                            ? cn("bg-nav-active text-nav-active-ink", nested && cn("font-medium", guideMark, "before:bg-accent"))
                            : cn(nested ? "text-nav-ink/80" : "text-nav-ink/90", "hover:bg-white/8 hover:text-white"),
                          iconOnly && "justify-center px-0",
                        )}
                      >
                        <span className="flex size-[18px] shrink-0 items-center justify-center">
                          <NavIcon name={item.icon} className={cn(nested ? "size-4" : "size-[18px]", nested && !active && "opacity-75")} />
                        </span>
                        {!iconOnly && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                }
                const containsActive = groupContains(pathname, item);
                const open = openKey === item.key;
                const activeKey = activeChildKey(pathname, item.children);
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
                              return (
                                <li key={child.key}>
                                  <Link
                                    href={child.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                      "relative flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] transition-colors",
                                      active ? cn("bg-nav-active font-medium text-nav-active-ink", guideMark, "before:bg-accent") : "text-nav-muted hover:bg-white/8 hover:text-white",
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
                  <div className="px-2.5">
                    <NavParentButton
                      open={sectionOpen}
                      containsActive={sectionActive}
                      label={section.section}
                      icon={section.icon}
                      badge={sectionBadge}
                      onClick={() => toggleSection(sectionKey)}
                      controlsId={`nav-section-${sectionKey}`}
                    />
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
