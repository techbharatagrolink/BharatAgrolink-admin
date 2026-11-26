"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronsDownUp, ChevronsUpDown, MoreHorizontal, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext(null);
const sectionDomId = (id) => `dash-section-${id}`;

// Small Zoho-style dropdown: closes on outside click and Escape.
function Menu({ button, label, align = "right", className, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className={cn("relative", className)}>
      {button({ open, toggle: () => setOpen((v) => !v), label })}
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-full z-40 mt-1.5 min-w-[220px] animate-in overflow-hidden rounded-lg duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1 motion-reduce:animate-none bg-[var(--z-card)] py-1 shadow-[0_12px_32px_-8px_rgb(24_39_75/0.3)] ring-1 ring-[var(--z-line)]",
            // "stretch": on phones exactly as wide as its button (so it stays on screen); wider screens size to content.
            align === "stretch" ? "right-0 max-sm:left-0" : align === "right" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

const menuItem = "flex w-full items-center gap-2 px-3 py-2 text-left text-small text-[var(--z-soft)] transition-colors hover:bg-[var(--z-accent-soft)] hover:text-[var(--z-accent)] disabled:cursor-default disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-[var(--z-soft)]";
const toolButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--z-card)] text-small font-medium text-[var(--z-soft)] shadow-[var(--z-shadow)] ring-1 ring-[var(--z-line-strong)] transition-colors hover:text-[var(--z-accent)] hover:ring-[var(--z-accent)]";

export function DashboardAccordion({ sections, defaultOpen = [], header, beforeSections, children }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const [titles, setTitles] = useState({});
  const allOpen = sections.every((key) => open.has(key));

  const toggle = useCallback(
    (key) =>
      setOpen((current) => {
        const next = new Set(current);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      }),
    [],
  );
  const register = useCallback((id, title) => setTitles((t) => (t[id] === title ? t : { ...t, [id]: title })), []);

  const jumpTo = (id) => {
    setOpen((current) => (current.has(id) ? current : new Set(current).add(id)));
    requestAnimationFrame(() => document.getElementById(sectionDomId(id))?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <AccordionContext.Provider value={{ open, toggle, register }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">{header}</div>
        <div className="flex shrink-0 items-center gap-2 max-sm:w-full">
          <button
            type="button"
            onClick={() => startRefresh(() => router.refresh())}
            disabled={refreshing}
            className="inline-flex size-9 items-center justify-center rounded-lg text-[var(--z-soft)] transition-colors hover:bg-[var(--z-card)] hover:text-[var(--z-accent)] disabled:opacity-60"
            aria-label="Refresh dashboard"
            title="Refresh"
          >
            <RotateCw className={cn("size-[18px]", refreshing && "animate-spin")} aria-hidden />
          </button>
          <Menu
            label="Jump to section"
            align="stretch"
            className="min-w-0 flex-1 sm:flex-none"
            button={({ open: isOpen, toggle: t, label }) => (
              <button type="button" onClick={t} aria-haspopup="menu" aria-expanded={isOpen} className={cn(toolButton, "w-full min-w-0 px-3.5 sm:w-56")}>
                <span className="truncate">{label}</span>
                <ChevronDown className={cn("ml-auto size-4 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden />
              </button>
            )}
          >
            {(close) =>
              sections.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  className={menuItem}
                  onClick={() => {
                    close();
                    jumpTo(id);
                  }}
                >
                  <span className="w-4 text-micro font-semibold text-[var(--z-muted)] tabular">{i + 1}</span>
                  <span className="flex-1 truncate">{titles[id] ?? id}</span>
                  {open.has(id) && <Check className="size-3.5 text-[var(--z-accent)]" aria-label="expanded" />}
                </button>
              ))
            }
          </Menu>
          <Menu
            label="Dashboard options"
            button={({ open: isOpen, toggle: t, label }) => (
              <button type="button" onClick={t} aria-haspopup="menu" aria-expanded={isOpen} aria-label={label} className={cn(toolButton, "w-11")}>
                <MoreHorizontal className="size-4" aria-hidden />
              </button>
            )}
          >
            {(close) => (
              <>
                <button
                  type="button"
                  role="menuitem"
                  className={menuItem}
                  disabled={allOpen}
                  onClick={() => {
                    close();
                    setOpen(new Set(sections));
                  }}
                >
                  <ChevronsUpDown className="size-4" aria-hidden /> Expand all
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={menuItem}
                  disabled={open.size === 0}
                  onClick={() => {
                    close();
                    setOpen(new Set());
                  }}
                >
                  <ChevronsDownUp className="size-4" aria-hidden /> Collapse all
                </button>
              </>
            )}
          </Menu>
        </div>
      </div>
      {beforeSections}
      <div className="space-y-3">{children}</div>
    </AccordionContext.Provider>
  );
}

export function DashboardSection({ id, index, title, note, summary, action, children }) {
  const { open, toggle, register } = useContext(AccordionContext);
  const isOpen = open.has(id);
  const panelId = `dash-panel-${id}`;
  const headingId = `dash-heading-${id}`;

  useEffect(() => register(id, title), [register, id, title]);

  return (
    <section id={sectionDomId(id)} className="scroll-mt-20" aria-labelledby={headingId}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl bg-[var(--z-card)] pr-2 shadow-[var(--z-shadow)] ring-1 transition-all duration-200 sm:pr-4",
          isOpen ? "ring-[var(--z-line)]" : "ring-[var(--z-line)] hover:shadow-[var(--z-shadow-hover)] hover:ring-[var(--z-line-strong)]",
        )}
      >
        <h2 id={headingId} className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className="group flex w-full min-w-0 items-center gap-3 rounded-xl px-4 py-3 text-left sm:px-5"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular transition-colors",
                isOpen ? "bg-[var(--z-accent)] text-white dark:text-[#0e131c]" : "bg-[var(--z-accent-soft)] text-[var(--z-accent)]",
              )}
            >
              {index}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-section font-semibold text-[var(--z-ink)] transition-colors group-hover:text-[var(--z-accent)]">
                {title}
                {note && <span className="ml-1.5 hidden text-xs font-normal text-[var(--z-muted)] sm:inline">({note})</span>}
              </span>
              {summary && <span className="mt-0.5 line-clamp-2 text-xs break-words text-[var(--z-muted)] sm:line-clamp-1">{summary}</span>}
            </span>
            <ChevronDown className={cn("size-4 shrink-0 text-[var(--z-muted)] transition-transform duration-200", isOpen && "rotate-180")} aria-hidden />
          </button>
        </h2>
        {action && <div className="hidden shrink-0 sm:block">{action}</div>}
      </div>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div id={panelId} className="-mx-1.5 min-h-0 overflow-hidden" inert={!isOpen}>
          <div className="px-1.5 pt-3 pb-3">
            {children}
            {action && <div className="mt-3 sm:hidden">{action}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
