"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarRange, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/form";
import { useQueryState } from "./use-query-state";

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "mtd", label: "Month to date" },
  { value: "prev-month", label: "Previous month" },
  { value: "cycle-1", label: "Payout cycle 1–15" },
  { value: "cycle-2", label: "Payout cycle 16–end" },
  { value: "custom", label: "Custom range" },
];

function iso(d) {
  const local = new Date(d.getTime() + 5.5 * 3600000);
  return local.toISOString().slice(0, 10);
}

export function presetRange(preset, now = new Date()) {
  const today = new Date(now);
  const day = 86400000;
  const y = today.getUTCFullYear();
  const m = today.getUTCMonth();
  switch (preset) {
    case "today":
      return { from: iso(today), to: iso(today) };
    case "yesterday":
      return { from: iso(new Date(today - day)), to: iso(new Date(today - day)) };
    case "7d":
      return { from: iso(new Date(today - 7 * day)), to: iso(today) };
    case "30d":
      return { from: iso(new Date(today - 30 * day)), to: iso(today) };
    case "mtd":
      return { from: `${y}-${String(m + 1).padStart(2, "0")}-01`, to: iso(today) };
    case "prev-month": {
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 0));
      return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
    }
    case "cycle-1":
      return { from: `${y}-${String(m + 1).padStart(2, "0")}-01`, to: `${y}-${String(m + 1).padStart(2, "0")}-15` };
    case "cycle-2": {
      const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      return { from: `${y}-${String(m + 1).padStart(2, "0")}-16`, to: `${y}-${String(m + 1).padStart(2, "0")}-${last}` };
    }
    default:
      return null;
  }
}

export function SearchInput({ placeholder = "Search…", className }) {
  const { get, setParams } = useQueryState();
  const urlValue = get("q");
  const [value, setValue] = useState(urlValue);
  const [lastUrl, setLastUrl] = useState(urlValue);
  if (lastUrl !== urlValue) {
    setLastUrl(urlValue);
    setValue(urlValue);
  }
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onChange = (next) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setParams({ q: next.trim() }), 350);
  };
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-line-strong bg-surface pr-8 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink" aria-label="Clear search">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function DateRangeFilter({ label = "Date" }) {
  const { get, setParams } = useQueryState();
  const preset = get("range") || (get("from") || get("to") ? "custom" : "");
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <div className="relative">
        <CalendarRange className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <Select
          aria-label={`${label} range`}
          className="w-44 [&_select]:pl-8"
          value={preset}
          placeholder={`${label}: all time`}
          options={DATE_PRESETS}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return setParams({ range: "", from: "", to: "" });
            if (value === "custom") return setParams({ range: "custom" });
            const r = presetRange(value);
            setParams({ range: value, from: r.from, to: r.to });
          }}
        />
      </div>
      {preset === "custom" && (
        <div className="flex items-center gap-1.5">
          <input type="date" aria-label="From date" value={get("from")} onChange={(e) => setParams({ from: e.target.value })} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
          <span className="text-xs text-ink-muted">to</span>
          <input type="date" aria-label="To date" value={get("to")} min={get("from") || undefined} onChange={(e) => setParams({ to: e.target.value })} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
        </div>
      )}
    </div>
  );
}

export function SelectFilter({ name, label, options }) {
  const { get, setParams } = useQueryState();
  return (
    <Select
      aria-label={label}
      className="w-full sm:w-44"
      value={get(name)}
      placeholder={`${label}: all`}
      options={options}
      onChange={(e) => setParams({ [name]: e.target.value })}
    />
  );
}

/** Reusable filter row: search, selects and date range, all synced to the URL. */
export function FilterBar({ search, filters = [], dateRange, children, className }) {
  const { searchParams, setParams } = useQueryState();
  const active = [...searchParams.keys()].some((k) => !["page", "pageSize", "sort", "tab"].includes(k));
  return (
    <div className={cn("flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center", className)}>
      {search && <SearchInput placeholder={search} className="lg:w-72" />}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        {filters.map((f) => (
          <SelectFilter key={f.key} name={f.key} label={f.label} options={f.options} />
        ))}
      </div>
      {dateRange && <DateRangeFilter label={typeof dateRange === "string" ? dateRange : "Date"} />}
      {children}
      {active && (
        <button
          type="button"
          onClick={() => {
            const reset = {};
            for (const k of searchParams.keys()) if (!["tab"].includes(k)) reset[k] = "";
            setParams(reset);
          }}
          className="inline-flex h-9 items-center gap-1 self-start rounded-lg px-2.5 text-[13px] font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink lg:self-auto"
        >
          <X className="size-3.5" aria-hidden /> Clear filters
        </button>
      )}
    </div>
  );
}
