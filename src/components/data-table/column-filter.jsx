"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ListFilter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/form";

/**
 * Grid-style header filters that match the rows already loaded, instantly and
 * without a round trip. Each column takes up to two conditions joined by
 * AND / OR, like the legacy manage-orders grid.
 */

const OPERATORS = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "notContains", label: "Does not contain" },
    { value: "equals", label: "Equals" },
    { value: "notEqual", label: "Does not equal" },
    { value: "startsWith", label: "Begins with" },
    { value: "endsWith", label: "Ends with" },
    { value: "blank", label: "Blank" },
    { value: "notBlank", label: "Not blank" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "notEqual", label: "Does not equal" },
    { value: "greaterThan", label: "Greater than" },
    { value: "greaterThanOrEqual", label: "Greater than or equal to" },
    { value: "lessThan", label: "Less than" },
    { value: "lessThanOrEqual", label: "Less than or equal to" },
    { value: "inRange", label: "Between" },
    { value: "blank", label: "Blank" },
    { value: "notBlank", label: "Not blank" },
  ],
  date: [
    { value: "equals", label: "Equals" },
    { value: "notEqual", label: "Does not equal" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "inRange", label: "Between" },
    { value: "blank", label: "Blank" },
    { value: "notBlank", label: "Not blank" },
  ],
};
const NO_VALUE = new Set(["blank", "notBlank"]);

export function columnFilterable(column) {
  return column.filter !== false && column.type !== "image";
}

function kindOf(column) {
  if (["number", "currency", "percent"].includes(column.type)) return "number";
  if (["date", "datetime"].includes(column.type)) return "date";
  return "text";
}

const emptyCondition = (kind) => ({ op: kind === "text" ? "contains" : "equals", value: "", to: "" });

function conditionActive(c) {
  if (!c) return false;
  if (NO_VALUE.has(c.op)) return true;
  if (c.op === "inRange") return c.value !== "" || c.to !== "";
  return c.value !== "";
}

/** A filter is on when its condition is set or its value checklist leaves some values out. */
export function columnFilterActive(filter) {
  return conditionActive(filter?.first) || Array.isArray(filter?.values);
}

function isBlank(value) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

/** The checklist key of a row's value in a column ("" = blank). */
export function columnValueKey(column, row) {
  const value = row?.[column.key];
  if (isBlank(value)) return "";
  if (Array.isArray(value)) return value.map((item) => (item && typeof item === "object" ? item.text ?? item.name ?? item.label ?? "" : String(item))).join(", ");
  if (typeof value === "object") return String(value.name ?? value.label ?? value.text ?? value.id ?? "");
  return String(value);
}

const MAX_OPTIONS = 1000;

/**
 * Distinct values of a column in `rows`, for the filter checklist: [{ value, label }] sorted by label,
 * "(Blanks)" last. `label(row)` gives the text the table shows for the value.
 */
export function columnValueOptions(column, rows, label) {
  const seen = new Map();
  for (const row of rows ?? []) {
    const key = columnValueKey(column, row);
    if (seen.has(key)) continue;
    const text = key === "" ? "" : String(label?.(row) ?? "");
    seen.set(key, key === "" ? "(Blanks)" : text && text !== "—" ? text : key);
    if (seen.size >= MAX_OPTIONS) break;
  }
  return [...seen.entries()]
    .map(([value, text]) => ({ value, label: text }))
    .sort((a, b) => (a.value === "" ? 1 : b.value === "" ? -1 : a.label.localeCompare(b.label, "en-IN", { numeric: true, sensitivity: "base" })));
}

function istDay(value) {
  const text = String(value);
  const t = new Date(text.includes("T") || !text.includes(" ") ? text : text.replace(" ", "T")).getTime();
  if (Number.isNaN(t)) return text.slice(0, 10);
  return new Date(t + 5.5 * 3600000).toISOString().slice(0, 10);
}

/** The texts a row shows for a column: its value (and line / remark details) plus the sub line. */
function textsOf(column, row) {
  const value = row[column.key];
  const texts = [];
  if (Array.isArray(value)) texts.push(...value.map((item) => (item && typeof item === "object" ? `${item.text ?? ""} ${item.by ?? ""}` : String(item ?? ""))));
  else if (!isBlank(value)) texts.push(String(value), String(value).replace(/_/g, " "));
  if (column.type === "lineStatus" && Array.isArray(row.lines)) texts.push(...row.lines.map((line) => String(line.status ?? "")));
  if (column.type === "boolean") texts.push(value ? column.trueLabel || "Yes" : column.falseLabel || "No");
  if (column.sub && !isBlank(row[column.sub])) texts.push(String(row[column.sub]));
  return texts.map((t) => t.toLowerCase());
}

function testCondition(column, kind, c, row) {
  const raw = row[column.key];
  if (c.op === "blank") return isBlank(raw);
  if (c.op === "notBlank") return !isBlank(raw);

  if (kind === "number") {
    if (isBlank(raw) || Number.isNaN(Number(raw))) return false;
    const n = Number(raw);
    const a = Number(c.value);
    switch (c.op) {
      case "equals": return n === a;
      case "notEqual": return n !== a;
      case "greaterThan": return n > a;
      case "greaterThanOrEqual": return n >= a;
      case "lessThan": return n < a;
      case "lessThanOrEqual": return n <= a;
      case "inRange": return (c.value === "" || n >= a) && (c.to === "" || n <= Number(c.to));
      default: return true;
    }
  }

  if (kind === "date") {
    if (isBlank(raw)) return false;
    const day = istDay(raw);
    switch (c.op) {
      case "equals": return day === c.value;
      case "notEqual": return day !== c.value;
      case "before": return day < c.value;
      case "after": return day > c.value;
      case "inRange": return (!c.value || day >= c.value) && (!c.to || day <= c.to);
      default: return true;
    }
  }

  const needle = String(c.value).trim().toLowerCase();
  const texts = textsOf(column, row);
  switch (c.op) {
    case "contains": return texts.some((t) => t.includes(needle));
    case "notContains": return !texts.some((t) => t.includes(needle));
    case "equals": return texts.some((t) => t === needle);
    case "notEqual": return !texts.some((t) => t === needle);
    case "startsWith": return texts.some((t) => t.startsWith(needle));
    case "endsWith": return texts.some((t) => t.endsWith(needle));
    default: return true;
  }
}

/** Rows that pass every active column filter. */
export function applyColumnFilters(rows, columns, filters) {
  const active = columns
    .filter((column) => columnFilterActive(filters[column.key]))
    .map((column) => ({ column, kind: kindOf(column), filter: filters[column.key] }));
  if (!active.length) return rows;
  const sets = new Map(active.filter(({ filter }) => Array.isArray(filter.values)).map(({ column, filter }) => [column.key, new Set(filter.values)]));
  return rows.filter((row) =>
    active.every(({ column, kind, filter }) => {
      if (sets.has(column.key) && !sets.get(column.key).has(columnValueKey(column, row))) return false;
      if (!conditionActive(filter.first)) return true;
      const first = testCondition(column, kind, filter.first, row);
      if (!conditionActive(filter.second)) return first;
      const second = testCondition(column, kind, filter.second, row);
      return filter.join === "or" ? first || second : first && second;
    }),
  );
}

const inputClass =
  "h-9 w-full min-w-0 rounded-lg border border-line-strong bg-surface text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none";

function ConditionEditor({ kind, condition, onChange, autoFocus, label }) {
  const set = (patch) => onChange({ ...condition, ...patch });
  const type = kind === "number" ? "number" : kind === "date" ? "date" : "text";
  const valueInput = (key, placeholder, focus) => (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        autoFocus={focus}
        type={type}
        inputMode={kind === "number" ? "decimal" : undefined}
        value={condition[key]}
        onChange={(e) => set({ [key]: e.target.value })}
        placeholder={placeholder}
        aria-label={`${label} ${placeholder.toLowerCase()}`}
        className={cn(inputClass, "pl-8", condition[key] !== "" && kind !== "date" ? "pr-8" : "pr-2")}
      />
      {condition[key] !== "" && kind !== "date" && (
        <button type="button" onClick={() => set({ [key]: "" })} className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink" aria-label="Clear value">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
  return (
    <div className="space-y-2">
      <Select aria-label={`${label} condition`} value={condition.op} onChange={(e) => set({ op: e.target.value })} options={OPERATORS[kind]} />
      {!NO_VALUE.has(condition.op) && valueInput("value", condition.op === "inRange" ? "From" : "Filter...", autoFocus)}
      {condition.op === "inRange" && valueInput("to", "To", false)}
    </div>
  );
}

/**
 * AG Grid-style value checklist: search, "(Select All)" and one checkbox per distinct value.
 * `selected` null = every value; a change back to every value clears it to null again.
 */
function ValueChecklist({ label, options, selected, onChange }) {
  const [search, setSearch] = useState("");
  const all = options.map((o) => o.value);
  const chosen = new Set(selected ?? all);
  const needle = search.trim().toLowerCase();
  const shown = needle ? options.filter((o) => o.label.toLowerCase().includes(needle)) : options;
  const shownAll = shown.length > 0 && shown.every((o) => chosen.has(o.value));
  const shownSome = shown.some((o) => chosen.has(o.value));
  const commit = (next) => onChange(all.every((v) => next.has(v)) ? null : all.filter((v) => next.has(v)));
  const toggle = (value, on) => {
    const next = new Set(chosen);
    if (on) next.add(value);
    else next.delete(value);
    commit(next);
  };
  const toggleShown = (on) => {
    // While searching, "(Select All)" acts on the matching values only (as AG Grid does).
    const next = needle ? new Set(chosen) : new Set();
    for (const o of shown) on ? next.add(o.value) : next.delete(o.value);
    commit(next);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." aria-label={`Search ${label} values`} className={cn(inputClass, "pr-2 pl-8")} />
      </div>
      <ul className="max-h-52 overflow-y-auto rounded-lg border border-line py-1" aria-label={`${label} values`}>
        {shown.length === 0 ? (
          <li className="px-3 py-2 text-small text-ink-muted">No matching values</li>
        ) : (
          <>
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm text-ink hover:bg-surface-muted">
                <input
                  type="checkbox"
                  className="size-4 accent-brand-600"
                  checked={shownAll}
                  ref={(el) => el && (el.indeterminate = !shownAll && shownSome)}
                  onChange={(e) => toggleShown(e.target.checked)}
                />
                (Select All)
              </label>
            </li>
            {shown.map((o) => (
              <li key={o.value}>
                <label className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm text-ink hover:bg-surface-muted">
                  <input type="checkbox" className="size-4 accent-brand-600" checked={chosen.has(o.value)} onChange={(e) => toggle(o.value, e.target.checked)} />
                  <span className={cn("min-w-0 truncate", o.value === "" && "text-ink-muted italic")} title={o.label}>
                    {o.label}
                  </span>
                </label>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

/**
 * Filter for a column the API filters (`server` = { value, apply }): the typed text goes to the URL and
 * every page is searched, not only the loaded rows. Applied on Enter or "Apply".
 */
function ServerFilter({ column, server, onDone }) {
  const [draft, setDraft] = useState(server.value);
  const apply = (value) => {
    server.apply(value);
    onDone();
  };
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply(draft);
      }}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={column.serverFilterPlaceholder || "Filter..."}
          aria-label={`Filter ${column.label}`}
          className={cn(inputClass, "pr-2 pl-8")}
        />
      </div>
      {column.serverFilterHint && <p className="text-small text-ink-muted">{column.serverFilterHint}</p>}
      <div className="flex justify-end gap-2 border-t border-line pt-2">
        {server.value !== "" && (
          <button type="button" onClick={() => apply("")} className="rounded-lg px-2 py-1 text-small font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
            Reset
          </button>
        )}
        <button type="submit" className="rounded-lg bg-brand-600 px-2.5 py-1 text-small font-medium text-white hover:bg-brand-700">
          Apply
        </button>
      </div>
    </form>
  );
}

/**
 * Filter button (horizontal bars) for a header; the panel is portalled so the scrolling table does not
 * clip it. With `options` (the column's distinct values) it opens on a value checklist, with the
 * condition filter (contains / greater than / between …) below it. With `server` it filters on the API.
 */
export function ColumnFilter({ column, filter, onChange, options, onOpenChange, server }) {
  const kind = kindOf(column);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const [showCondition, setShowCondition] = useState(false);
  const button = useRef(null);
  const panel = useRef(null);
  const value = filter ?? { first: emptyCondition(kind), join: "and", second: emptyCondition(kind) };
  const active = server ? server.value !== "" : columnFilterActive(filter);
  const hasList = Array.isArray(options) && options.length > 0;
  const conditionOpen = !hasList || showCondition || conditionActive(value.first);
  const update = (patch) => onChange({ ...value, ...patch });

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);

  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const place = () => {
      const r = button.current.getBoundingClientRect();
      const width = 260;
      setPos({ top: r.bottom + 6, left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)), width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!panel.current?.contains(e.target) && !button.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className={cn("ba-col-menu inline-flex shrink-0 items-center", (active || open) && "is-active", open && "is-open")}>
        <button
          ref={button}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`Filter ${column.label}${active ? " (active)" : ""}`}
          aria-expanded={open}
          title={`Filter ${column.label}`}
          className={cn(
            "relative inline-flex size-6 shrink-0 items-center justify-center rounded transition-colors hover:bg-surface hover:text-ink cursor-pointer",
            active ? "bg-brand-50 text-brand-700 font-semibold" : "text-ink-muted hover:text-ink",
            open && "bg-surface text-ink shadow-xs",
          )}
        >
          <ListFilter className="size-3.5" aria-hidden />
          {active && <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-brand-600 ring-2 ring-surface" aria-hidden />}
        </button>
      </div>
      {open &&
        pos &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={`Filter ${column.label}`}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="z-[60] space-y-2.5 rounded-xl border border-line bg-surface p-3 text-left text-sm font-normal normal-case tracking-normal shadow-xl"
          >
            {server ? (
              <ServerFilter column={column} server={server} onDone={() => setOpen(false)} />
            ) : (
            <>
            {hasList &&<ValueChecklist label={column.label} options={options} selected={Array.isArray(value.values) ? value.values : null} onChange={(values) => update({ values: values ?? undefined })} />}
            {hasList && (
              <button
                type="button"
                onClick={() => setShowCondition((s) => !s)}
                aria-expanded={conditionOpen}
                className="flex w-full items-center justify-between border-t border-line pt-2 text-small font-medium text-ink-soft hover:text-ink"
              >
                Filter by condition
                <span aria-hidden>{conditionOpen ? "−" : "+"}</span>
              </button>
            )}
            {conditionOpen && (
              <>
                <ConditionEditor kind={kind} label={column.label} condition={value.first} autoFocus={!hasList} onChange={(first) => update({ first })} />
                {conditionActive(value.first) && (
                  <>
                    <div className="flex items-center justify-center gap-5 text-small text-ink">
                      {["and", "or"].map((join) => (
                        <label key={join} className="inline-flex cursor-pointer items-center gap-1.5">
                          <input type="radio" name={`join-${column.key}`} checked={value.join === join} onChange={() => update({ join })} className="size-4 accent-brand-600" />
                          {join.toUpperCase()}
                        </label>
                      ))}
                    </div>
                    <ConditionEditor kind={kind} label={column.label} condition={value.second} onChange={(second) => update({ second })} />
                  </>
                )}
              </>
            )}
            {active && (
              <div className="flex justify-end border-t border-line pt-2">
                <button type="button" onClick={() => onChange(null)} className="rounded-lg px-2 py-1 text-small font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
                  Reset
                </button>
              </div>
            )}
            </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
