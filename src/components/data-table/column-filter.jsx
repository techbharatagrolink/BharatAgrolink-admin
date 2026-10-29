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

export function columnFilterActive(filter) {
  return conditionActive(filter?.first);
}

function isBlank(value) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
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
  return rows.filter((row) =>
    active.every(({ column, kind, filter }) => {
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

/** Funnel button for a header; the panel is portalled so the scrolling table does not clip it. */
export function ColumnFilter({ column, filter, onChange }) {
  const kind = kindOf(column);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const button = useRef(null);
  const panel = useRef(null);
  const value = filter ?? { first: emptyCondition(kind), join: "and", second: emptyCondition(kind) };
  const active = columnFilterActive(filter);

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
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Filter ${column.label}${active ? " (active)" : ""}`}
        aria-expanded={open}
        title={`Filter ${column.label}`}
        className={cn(
          "relative inline-flex size-6 shrink-0 items-center justify-center rounded hover:bg-surface hover:text-ink",
          active ? "bg-brand-50 text-brand-700" : "text-ink-muted",
          open && "bg-surface text-ink",
        )}
      >
        <ListFilter className="size-4" aria-hidden />
        {active && <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-brand-600" aria-hidden />}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={`Filter ${column.label}`}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="z-[60] space-y-2.5 rounded-xl border border-line bg-surface p-3 text-left text-sm font-normal shadow-xl"
          >
            <ConditionEditor kind={kind} label={column.label} condition={value.first} autoFocus onChange={(first) => onChange({ ...value, first })} />
            {conditionActive(value.first) && (
              <>
                <div className="flex items-center justify-center gap-5 text-[13px] text-ink">
                  {["and", "or"].map((join) => (
                    <label key={join} className="inline-flex cursor-pointer items-center gap-1.5">
                      <input type="radio" name={`join-${column.key}`} checked={value.join === join} onChange={() => onChange({ ...value, join })} className="size-4 accent-brand-600" />
                      {join.toUpperCase()}
                    </label>
                  ))}
                </div>
                <ConditionEditor kind={kind} label={column.label} condition={value.second} onChange={(second) => onChange({ ...value, second })} />
              </>
            )}
            {active && (
              <div className="flex justify-end border-t border-line pt-2">
                <button type="button" onClick={() => onChange(null)} className="rounded-lg px-2 py-1 text-[13px] font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
                  Reset
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
