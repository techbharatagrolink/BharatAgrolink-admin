"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { startRouteProgress } from "@/components/admin/shell/route-progress";

const query = (values) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) if (v && !(k === "type" && v === "all")) params.set(k, v);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

// "YYYY-MM" -> { first: "YYYY-MM-01", last: "YYYY-MM-<last day>" }, used to turn a month
// picker value into the existing from/to range (same one every card already filters on).
function monthRange(monthValue) {
  const [y, m] = monthValue.split("-").map(Number);
  const first = `${monthValue}-01`;
  const last = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  return { first, last };
}

export function DashboardFilters({ values, options, label }) {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(values);
  const [lastValues, setLastValues] = useState(values);
  const [expanded, setExpanded] = useState(false);
  const [rangeMode, setRangeMode] = useState("month");
  if (lastValues !== values) {
    setLastValues(values);
    setDraft(values);
  }

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  // Editing a date directly means the month pickers no longer match, so drop that selection.
  const setDate = (key, value) => setDraft((d) => ({ ...d, [key]: value, monthFrom: "", monthTo: "" }));
  // "Select multiple months" = a From month -> To month span (the API only understands one
  // contiguous from/to range, so disjoint months aren't representable). Picking just "From
  // month" behaves as a single month; adding "To month" extends it into a range.
  const setMonthRange = (key, value) => {
    setDraft((d) => {
      const monthFrom = key === "monthFrom" ? value : d.monthFrom;
      const monthTo = key === "monthTo" ? value : d.monthTo;
      if (!monthFrom) return { ...d, monthFrom: "", monthTo: "", from: "", to: "" };
      const { first } = monthRange(monthFrom);
      const { last } = monthRange(monthTo || monthFrom);
      return { ...d, monthFrom, monthTo, from: first, to: last };
    });
  };
  const sticky = { vendor: values.vendor, type: values.type, season: values.season, cycle: values.cycle };
  const dateError = draft.from && draft.to && draft.to < draft.from ? "End date is before start date." : (draft.from && !draft.to) || (!draft.from && draft.to) ? "Choose both dates." : null;
  const extraCount = ["fy", "season", "cycle", "type"].filter((k) => draft[k] && !(k === "type" && draft[k] === "all")).length;

  const apply = (event) => {
    event.preventDefault();
    if (dateError) return;
    const custom = draft.from && draft.to;
    const { monthFrom, monthTo, ...rest } = draft;
    const next = { ...rest, preset: custom || draft.fy ? "" : draft.preset, fy: custom ? "" : draft.fy };
    startRouteProgress();
    router.push(`${pathname}${query(next)}`, { scroll: false });
  };

  const reset = () => {
    startRouteProgress();
    router.push(pathname, { scroll: false });
  };

  return (
    <form onSubmit={apply} className="mb-4 rounded-xl border border-line bg-surface p-3 sm:p-4" aria-label="Dashboard filters">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)_repeat(4,minmax(0,1fr))]">
        <Field label="Seller" className="col-span-2 md:col-span-1">
          {({ id }) => <Select id={id} value={draft.vendor} onChange={(e) => set("vendor", e.target.value)} options={options.vendors} placeholder="All sellers" />}
        </Field>
        <fieldset className="col-span-2 min-w-0 md:col-span-2 xl:col-span-1">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <legend className="text-[13px] font-medium text-ink-soft">Date range</legend>
            <div className="inline-flex shrink-0 rounded-md border border-line-strong p-0.5">
              {[
                { value: "month", label: "Month" },
                { value: "date", label: "Custom" },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setRangeMode(m.value)}
                  className={cn(
                    "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
                    rangeMode === m.value ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          {rangeMode === "month" ? (
            <div className="flex items-center gap-2">
              <Input type="month" aria-label="From month" value={draft.monthFrom || ""} max={draft.monthTo || undefined} onChange={(e) => setMonthRange("monthFrom", e.target.value)} className="min-w-0" />
              <span className="shrink-0 text-xs text-ink-muted">to</span>
              <Input type="month" aria-label="To month" value={draft.monthTo || ""} min={draft.monthFrom || undefined} onChange={(e) => setMonthRange("monthTo", e.target.value)} className="min-w-0" disabled={!draft.monthFrom} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input type="date" aria-label="From date" value={draft.from} max={draft.to || undefined} onChange={(e) => setDate("from", e.target.value)} className="min-w-0" />
              <span className="shrink-0 text-xs text-ink-muted">to</span>
              <Input type="date" aria-label="To date" value={draft.to} min={draft.from || undefined} onChange={(e) => setDate("to", e.target.value)} className="min-w-0" />
            </div>
          )}
          {dateError && <p className="mt-1 text-xs text-danger-ink" role="alert">{dateError}</p>}
        </fieldset>
        <div className={cn("col-span-2 grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-4 xl:col-span-4", !expanded && "hidden md:grid")}>
          <Field label="Financial year">
            {({ id }) => <Select id={id} value={draft.fy} onChange={(e) => set("fy", e.target.value)} options={options.financialYears} placeholder="Any year" />}
          </Field>
          <Field label="Season">
            {({ id }) => <Select id={id} value={draft.season} onChange={(e) => set("season", e.target.value)} options={options.seasons} placeholder="All seasons" />}
          </Field>
          <Field label="Payout cycle">
            {({ id }) => <Select id={id} value={draft.cycle} onChange={(e) => set("cycle", e.target.value)} options={options.cycles} placeholder="Any cycle" />}
          </Field>
          <Field label="Order type">
            {({ id }) => <Select id={id} value={draft.type} onChange={(e) => set("type", e.target.value)} options={options.orderTypes} />}
          </Field>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 overflow-x-auto px-1 scrollbar-thin">
          <nav aria-label="Date presets" className="flex min-w-max items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold tracking-wide text-ink-muted uppercase">Presets</span>
            {options.presets.map((p) => (
              <Link
                key={p.value}
                href={`${pathname}${query({ ...sticky, preset: p.value })}`}
                scroll={false}
                aria-current={values.preset === p.value ? "true" : undefined}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                  values.preset === p.value ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line text-ink-soft hover:border-brand-200 hover:bg-brand-50",
                )}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="ghost" className="md:hidden" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            <SlidersHorizontal className="size-4" aria-hidden /> {expanded ? "Fewer filters" : `More filters${extraCount ? ` (${extraCount})` : ""}`}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden /> Reset
          </Button>
          <Button type="submit" size="sm" variant="primary" disabled={Boolean(dateError)}>
            <Filter className="size-4" aria-hidden /> Apply filter
          </Button>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-muted" aria-live="polite">
        Showing: <span className="font-medium text-ink-soft">{label}</span>
      </p>
    </form>
  );
}
