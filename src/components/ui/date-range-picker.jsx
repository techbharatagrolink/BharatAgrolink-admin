"use client";

import { useState } from "react";
import { CalendarRange, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover } from "./popover";

/*
 * One date filter for the whole admin panel: pick a day range, a month (or a span of months), a year (or a
 * span of years), or a quick preset, all in one box. Every choice is turned into the same { from, to }
 * (YYYY-MM-DD, inclusive) the screens already filter on.
 *
 *   Controlled:   <DateRangePicker from={from} to={to} onChange={({ from, to, preset }) => …} />
 *   Plain form:   <DateRangePicker fromName="from" toName="to" defaultFrom={…} defaultTo={…} />  (hidden inputs)
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const pad = (n) => String(n).padStart(2, "0");

/** Today in India (YYYY-MM-DD). */
function todayIst() {
  return new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
}
const addDays = (ymd, days) => new Date(Date.parse(`${ymd}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const monthStart = (y, m) => `${y}-${pad(m + 1)}-01`;
const monthEnd = (y, m) => new Date(Date.UTC(y, m + 1, 0)).toISOString().slice(0, 10);
const parts = (ymd) => ymd.split("-").map(Number);

/** The default quick picks. Screens may pass their own `presets` ([{ value, label, from, to }]). */
export function defaultDatePresets() {
  const today = todayIst();
  const [y, m] = parts(today);
  const lastMonth = m === 1 ? [y - 1, 11] : [y, m - 2];
  return [
    { value: "today", label: "Today", from: today, to: today },
    { value: "yesterday", label: "Yesterday", from: addDays(today, -1), to: addDays(today, -1) },
    { value: "7d", label: "Last 7 days", from: addDays(today, -6), to: today },
    { value: "30d", label: "Last 30 days", from: addDays(today, -29), to: today },
    { value: "mtd", label: "This month", from: monthStart(y, m - 1), to: today },
    { value: "prev-month", label: "Last month", from: monthStart(...lastMonth), to: monthEnd(...lastMonth) },
    { value: "ytd", label: "This year", from: `${y}-01-01`, to: today },
    { value: "prev-year", label: "Last year", from: `${y - 1}-01-01`, to: `${y - 1}-12-31` },
  ];
}

/**
 * Filter forms list "From" and "To" as two date fields; this joins every such back-to-back pair into one
 * { type: "dateRange", from, to, label } item so the form can draw a single DateRangePicker for it.
 */
export function pairDateFields(fields) {
  const out = [];
  for (let i = 0; i < fields.length; i += 1) {
    const f = fields[i];
    const next = fields[i + 1];
    if (f.type === "date" && next?.type === "date") {
      const base = String(f.label ?? "")
        .replace(/^\s*(from|start)\s*/i, "")
        .replace(/\s*(from|start)\s*$/i, "")
        .trim();
      out.push({ type: "dateRange", from: f, to: next, label: !base || /^date$/i.test(base) ? "Date range" : base });
      i += 1;
    } else out.push(f);
  }
  return out;
}

const fmtDay = (ymd) => {
  const [y, m, d] = parts(ymd);
  return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
};

/** Short text of a range: "Nov 2026", "Nov 2026 – Jan 2027", "2026", "2024 – 2026" or "01 Nov 2026 – 15 Nov 2026". */
export function describeRange(from, to) {
  if (!from && !to) return "";
  if (!from || !to) return from ? `From ${fmtDay(from)}` : `Until ${fmtDay(to)}`;
  if (from === to) return fmtDay(from);
  const [fy, fm, fd] = parts(from);
  const [ty, tm] = parts(to);
  const wholeMonths = fd === 1 && to === monthEnd(ty, tm - 1);
  if (wholeMonths && fm === 1 && tm === 12) return fy === ty ? String(fy) : `${fy} – ${ty}`;
  if (wholeMonths) return fy === ty && fm === tm ? `${MONTHS[fm - 1]} ${fy}` : `${MONTHS[fm - 1]} ${fy} – ${MONTHS[tm - 1]} ${ty}`;
  return `${fmtDay(from)} – ${fmtDay(to)}`;
}

/** Which tab fits a range when the picker opens. */
function modeOf(from, to) {
  if (!from || !to) return "date";
  const [fy, fm, fd] = parts(from);
  const [ty, tm] = parts(to);
  if (fd !== 1 || to !== monthEnd(ty, tm - 1)) return "date";
  return fm === 1 && tm === 12 ? "year" : "month";
}

const cellClass = (selected, inRange) =>
  cn(
    "h-9 rounded-md text-sm font-medium transition-colors",
    selected ? "bg-brand-600 text-brand-fg" : inRange ? "bg-brand-50 text-brand-800" : "text-ink hover:bg-surface-muted",
  );

export function DateRangePicker({
  from: fromProp,
  to: toProp,
  onChange,
  fromName,
  toName,
  defaultFrom = "",
  defaultTo = "",
  presets,
  label = "Date range",
  placeholder = "All dates",
  applyLabel = "Apply",
  clearable = true,
  className,
  size = "md",
  align = "left",
}) {
  const controlled = onChange != null;
  const [own, setOwn] = useState({ from: YMD.test(defaultFrom) ? defaultFrom : "", to: YMD.test(defaultTo) ? defaultTo : "" });
  const from = controlled ? fromProp || "" : own.from;
  const to = controlled ? toProp || "" : own.to;

  const [mode, setMode] = useState("date");
  const [draft, setDraft] = useState({ from: "", to: "" });
  const [picking, setPicking] = useState(null); // month / year grid: first click of a span, waiting for the second
  const [viewYear, setViewYear] = useState(() => parts(todayIst())[0]);
  const quick = presets ?? defaultDatePresets();

  const commit = (next) => {
    if (controlled) onChange(next);
    else setOwn({ from: next.from, to: next.to });
  };

  // Opening starts from what is applied now, on the tab that fits it.
  const prepare = () => {
    setDraft({ from, to });
    setPicking(null);
    setMode(modeOf(from, to));
    setViewYear(parts(from || todayIst())[0]);
  };

  const draftError = draft.from && draft.to && draft.to < draft.from ? "End is before start." : (draft.from && !draft.to) || (!draft.from && draft.to) ? "Choose both dates." : null;

  // Month / year grids: first click picks a single month (year); a second click extends it into a span.
  const pickMonth = (y, m) => {
    const key = y * 12 + m;
    if (picking == null) {
      setPicking(key);
      setDraft({ from: monthStart(y, m), to: monthEnd(y, m) });
    } else {
      const [a, b] = picking <= key ? [picking, key] : [key, picking];
      setPicking(null);
      setDraft({ from: monthStart(Math.floor(a / 12), a % 12), to: monthEnd(Math.floor(b / 12), b % 12) });
    }
  };
  const pickYear = (y) => {
    if (picking == null) {
      setPicking(y);
      setDraft({ from: `${y}-01-01`, to: `${y}-12-31` });
    } else {
      const [a, b] = picking <= y ? [picking, y] : [y, picking];
      setPicking(null);
      setDraft({ from: `${a}-01-01`, to: `${b}-12-31` });
    }
  };

  const text = describeRange(from, to);
  const yearPageStart = viewYear - (((viewYear % 12) + 12) % 12);
  const height = size === "sm" ? "h-8" : size === "lg" ? "h-10" : "h-9";

  return (
    <>
      {fromName && <input type="hidden" name={fromName} value={from} />}
      {toName && <input type="hidden" name={toName} value={to} />}
      <Popover
        align={align}
        sheetOnPhone
        label={label}
        className={cn("min-w-0", className)}
        panelClassName="w-[22rem]"
        trigger={({ toggle, props }) => (
          <div className={cn("relative flex w-full min-w-0 items-center rounded-lg border border-line-strong bg-surface text-sm focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20", height)}>
            <button
              type="button"
              {...props}
              onClick={(event) => {
                prepare();
                toggle(event);
              }}
              title={text || placeholder}
              className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-lg pr-2 pl-2.5 text-left focus:outline-none"
            >
              <CalendarRange className="size-4 shrink-0 text-ink-muted" aria-hidden />
              <span className={cn("truncate", text ? "text-ink" : "text-ink-muted")}>{text || placeholder}</span>
            </button>
            {clearable && (from || to) && (
              <button type="button" onClick={() => commit({ from: "", to: "", preset: "" })} className="mr-1.5 shrink-0 rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink" aria-label={`Clear ${label.toLowerCase()}`}>
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}
      >
        <div className="space-y-3 p-3 text-sm">
          {/* Quick picks apply at once (a screen with its own preset buttons passes presets={[]}). */}
          <div className={cn("flex flex-wrap gap-1.5", quick.length === 0 && "hidden")}>
            {quick.map((p) => (
              <button
                key={p.value}
                type="button"
                data-close
                onClick={() => commit({ from: p.from, to: p.to, preset: p.value })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  p.from === from && p.to === to ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line text-ink-soft hover:border-brand-200 hover:bg-brand-50",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-line p-0.5" role="tablist" aria-label="Pick by">
            {[
              ["date", "Date"],
              ["month", "Month"],
              ["year", "Year"],
            ].map(([value, name]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => {
                  setMode(value);
                  setPicking(null);
                }}
                className={cn("flex-1 rounded-md py-1.5 text-small font-medium transition-colors", mode === value ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:text-ink")}
              >
                {name}
              </button>
            ))}
          </div>

          {mode === "date" && (
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1 text-xs text-ink-muted">
                From
                <input
                  type="date"
                  value={draft.from}
                  max={draft.to || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink focus:border-brand-600 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-xs text-ink-muted">
                To
                <input
                  type="date"
                  value={draft.to}
                  min={draft.from || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink focus:border-brand-600 focus:outline-none"
                />
              </label>
            </div>
          )}

          {mode === "month" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={() => setViewYear((y) => y - 1)} className="rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink" aria-label="Previous year">
                  <ChevronLeft className="size-4" />
                </button>
                <span className="font-semibold text-ink tabular">{viewYear}</span>
                <button type="button" onClick={() => setViewYear((y) => y + 1)} className="rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink" aria-label="Next year">
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {MONTHS.map((name, m) => {
                  const start = monthStart(viewYear, m);
                  const end = monthEnd(viewYear, m);
                  const selected = (draft.from && draft.from === start) || (draft.to && draft.to === end);
                  const inRange = draft.from && draft.to && start >= draft.from && end <= draft.to;
                  return (
                    <button key={name} type="button" onClick={() => pickMonth(viewYear, m)} className={cellClass(selected, inRange)} aria-pressed={Boolean(inRange)}>
                      {name}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-ink-muted">{picking != null ? "Pick an end month for a span, or Apply for this month." : "Pick a month; pick a second one for a span."}</p>
            </div>
          )}

          {mode === "year" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={() => setViewYear((y) => y - 12)} className="rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink" aria-label="Earlier years">
                  <ChevronLeft className="size-4" />
                </button>
                <span className="font-semibold text-ink tabular">
                  {yearPageStart} – {yearPageStart + 11}
                </span>
                <button type="button" onClick={() => setViewYear((y) => y + 12)} className="rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink" aria-label="Later years">
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map((y) => {
                  const selected = draft.from === `${y}-01-01` || draft.to === `${y}-12-31`;
                  const inRange = draft.from && draft.to && `${y}-01-01` >= draft.from && `${y}-12-31` <= draft.to;
                  return (
                    <button key={y} type="button" onClick={() => pickYear(y)} className={cn(cellClass(selected, inRange), "tabular")} aria-pressed={Boolean(inRange)}>
                      {y}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-ink-muted">{picking != null ? "Pick an end year for a span, or Apply for this year." : "Pick a year; pick a second one for a span."}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
            <span className="min-w-0 truncate text-xs text-ink-muted" aria-live="polite">
              {draftError ? <span className="text-danger-ink">{draftError}</span> : describeRange(draft.from, draft.to) || "No dates chosen"}
            </span>
            <div className="flex shrink-0 gap-1.5">
              {clearable && (
                <button type="button" data-close onClick={() => commit({ from: "", to: "", preset: "" })} className="rounded-md px-2.5 py-1.5 text-small font-medium text-ink-muted hover:bg-surface-muted hover:text-ink">
                  Clear
                </button>
              )}
              <button
                type="button"
                data-close={draftError ? undefined : true}
                disabled={Boolean(draftError)}
                onClick={() => !draftError && commit({ from: draft.from, to: draft.to, preset: "custom" })}
                className="rounded-md bg-brand-600 px-3 py-1.5 text-small font-semibold text-brand-fg hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyLabel}
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}
