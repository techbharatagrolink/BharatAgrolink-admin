"use client";

import { createContext, useContext, useState } from "react";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext(null);

export function DashboardAccordion({ sections, defaultOpen = [], children }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const allOpen = sections.every((key) => open.has(key));
  const toggle = (key) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(sections))}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-brand-700 hover:bg-brand-50"
        >
          {allOpen ? <ChevronsDownUp className="size-4" aria-hidden /> : <ChevronsUpDown className="size-4" aria-hidden />}
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </AccordionContext.Provider>
  );
}

export function DashboardSection({ id, index, title, note, summary, action, children }) {
  const { open, toggle } = useContext(AccordionContext);
  const isOpen = open.has(id);
  const panelId = `dash-panel-${id}`;
  const headingId = `dash-heading-${id}`;

  return (
    <section className={cn("rounded-xl border bg-surface transition-colors", isOpen ? "border-line" : "border-line hover:border-brand-200")} aria-labelledby={headingId}>
      <div className="flex items-center gap-2 pr-2 sm:pr-3">
        <h2 id={headingId} className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className="flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left sm:px-4"
          >
            <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular", isOpen ? "bg-brand-600 text-brand-fg" : "bg-brand-50 text-brand-700")}>{index}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-ink">
                {title}
                {note && <span className="ml-1.5 hidden text-xs font-normal text-ink-muted sm:inline">({note})</span>}
              </span>
              {summary && <span className="block truncate text-xs text-ink-muted">{summary}</span>}
            </span>
            <ChevronDown className={cn("size-4 shrink-0 text-ink-muted transition-transform duration-200", isOpen && "rotate-180")} aria-hidden />
          </button>
        </h2>
        {action && <div className="hidden shrink-0 sm:block">{action}</div>}
      </div>
      <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div id={panelId} className="min-h-0 overflow-hidden" inert={!isOpen}>
          <div className="border-t border-line p-3 sm:p-4">
            {children}
            {action && <div className="mt-3 sm:hidden">{action}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
