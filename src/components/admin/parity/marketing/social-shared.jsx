"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
export const truncate = (s, max) => (s.length > max ? `${s.slice(0, max)}...` : s);

const STATUS_TONES = { generated: "success", completed: "success", published: "success", approved: "info", reviewed: "info", pending: "warning", draft: "neutral", failed: "danger", archived: "neutral" };

export function StatusPill({ status, upper = false }) {
  const label = String(status ?? "").replace("_", " ");
  return <Badge tone={STATUS_TONES[status] ?? "neutral"}>{upper ? label.toUpperCase() : label}</Badge>;
}

/** The dashboard's collapsible cards: a header button that shows or hides the body. */
export function Collapsible({ id, title, icon: Icon, badge, actions, defaultOpen = false, nested = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={cn("overflow-hidden rounded-xl border border-line bg-surface", nested && "rounded-lg")} aria-labelledby={`${id}-heading`}>
      <div className={cn("flex flex-wrap items-center justify-between gap-2 px-4 py-3", nested ? "bg-surface-muted" : "border-b border-line")}>
        <h2 id={`${id}-heading`} className={cn("font-semibold text-ink", nested ? "text-sm" : "text-base")}>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={id} className="inline-flex items-center gap-2">
            {Icon && <Icon className="size-4 text-brand-700" aria-hidden />}
            {title}
            <ChevronDown className={cn("size-4 text-ink-muted transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        </h2>
        <div className="flex items-center gap-2">
          {actions}
          {badge && <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-700">{badge}</span>}
        </div>
      </div>
      <div id={id} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

/** A grid of toggle chips standing in for the PHP page's clickable tag / checkbox tiles. */
export function ChipGroup({ label, options, value, onChange, columns = "sm:grid-cols-3 lg:grid-cols-4" }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">{label}</legend>
      <div className={cn("grid grid-cols-2 gap-2", columns)}>
        {options.map((o) => {
          const v = typeof o === "object" ? o.value : o;
          const text = typeof o === "object" ? o.label : o;
          const on = value.includes(v);
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(v)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                on ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-ink-soft hover:border-brand-200",
              )}
            >
              <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong")}>
                {on && <Check className="size-3" aria-hidden />}
              </span>
              {text}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function MetaItem({ label, children }) {
  return (
    <div className="flex items-baseline gap-1.5 text-[13px]">
      <span className="text-ink-muted">{label}:</span>
      <strong className="text-ink">{children}</strong>
    </div>
  );
}
