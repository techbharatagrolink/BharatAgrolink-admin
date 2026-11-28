"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { localIso } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const FIELDS = ["from", "to", "orderType", "vendorId", "categoryId", "state", "paymentMode", "minValue", "maxValue", "search"];

function presetRange(preset) {
  const today = new Date();
  const day = (d) => localIso(d);
  if (preset === "today") return { from: day(today), to: day(today) };
  if (preset === "week") {
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return { from: day(monday), to: day(today) };
  }
  if (preset === "month") return { from: day(new Date(today.getFullYear(), today.getMonth(), 1)), to: day(today) };
  if (preset === "lastMonth") return { from: day(new Date(today.getFullYear(), today.getMonth() - 1, 1)), to: day(new Date(today.getFullYear(), today.getMonth(), 0)) };
  if (preset === "90") {
    const start = new Date(today);
    start.setDate(today.getDate() - 89);
    return { from: day(start), to: day(today) };
  }
  return { from: "", to: "" };
}

const PRESETS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "90", label: "Last 90 Days" },
  { id: "lifetime", label: "Lifetime" },
];

/** Filter bar of master_delivered_orders.php; Apply writes the filters to the URL. */
export function DeliveredFilters({ query, options }) {
  const router = useRouter();
  const pathname = usePathname();
  const [values, setValues] = useState(() => Object.fromEntries(FIELDS.map((k) => [k, query[k] === "ALL" ? "" : String(query[k] ?? "")])));
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));

  function apply(next = values) {
    const params = new URLSearchParams();
    for (const key of FIELDS) if (next[key]) params.set(key, next[key]);
    if (query.perPage !== 50) params.set("perPage", String(query.perPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function preset(id) {
    const next = { ...values, ...presetRange(id) };
    setValues(next);
    apply(next);
  }

  // Phones: the fields other than Search fold behind "More filters" (count = filters applied now).
  const [more, setMore] = useState(false);
  const activeCount = [query.from || query.to, query.orderType, query.vendorId, query.categoryId, query.state, query.paymentMode, query.minValue || query.maxValue].filter((v) => v && v !== "ALL").length;
  const fold = !more && "max-sm:hidden";
  const presetRow = useRef(null);

  const activePreset = PRESETS.find((p) => {
    const r = presetRange(p.id);
    return r.from === (query.from || "") && r.to === (query.to || "");
  })?.id;
  useEffect(() => {
    const row = presetRow.current;
    const chip = row?.querySelector("[aria-pressed=\"true\"]");
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [activePreset]);

  return (
    <form
      className="rounded-xl border border-line bg-surface p-4"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      {/* Phones: presets in one swipeable row (the selected one scrolled into view). */}
      <div ref={presetRow} className="mb-3 flex flex-wrap gap-2 max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => preset(p.id)}
            aria-pressed={activePreset === p.id}
            className={cn("h-8 shrink-0 rounded-full border px-3 text-small font-medium whitespace-nowrap", activePreset === p.id ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line bg-surface text-ink-soft hover:bg-surface-muted")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Field label="Date range" className={cn("col-span-2", fold)}>
          {() => <DateRangePicker label="Date range" from={values.from} to={values.to} onChange={({ from, to }) => setValues((v) => ({ ...v, from, to }))} />}
        </Field>
        <Field label="Order Type" className={cn(fold)}>
          {({ id }) => <Select id={id} value={values.orderType} onChange={set("orderType")} placeholder="All" options={[{ value: "B2C", label: "B2C" }, { value: "B2B", label: "B2B" }]} />}
        </Field>
        <Field label="Vendor" className={cn(fold)}>
          {({ id }) => <Select id={id} value={values.vendorId} onChange={set("vendorId")} placeholder="All vendors" options={options.vendors.map((v) => ({ value: v.id, label: v.name || v.id }))} />}
        </Field>
        <Field label="Category" className={cn(fold)}>
          {({ id }) => <Select id={id} value={values.categoryId} onChange={set("categoryId")} placeholder="All categories" options={options.categories.map((c) => ({ value: c.id, label: c.name }))} />}
        </Field>
        <Field label="State" className={cn(fold)}>{({ id }) => <Select id={id} value={values.state} onChange={set("state")} placeholder="All states" options={options.states.map((s) => ({ value: s, label: s }))} />}</Field>
        <Field label="Payment" className={cn("max-sm:col-span-2", fold)}>
          {({ id }) => <Select id={id} value={values.paymentMode} onChange={set("paymentMode")} placeholder="All" options={options.paymentModes.map((m) => ({ value: m, label: m.toUpperCase() }))} />}
        </Field>
        <Field label="Min Value" className={cn(fold)}>{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={values.minValue} onChange={set("minValue")} />}</Field>
        <Field label="Max Value" className={cn(fold)}>{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={values.maxValue} onChange={set("maxValue")} />}</Field>
        <Field label="Search" className="col-span-2 max-sm:order-first md:col-span-3 xl:col-span-2">
          {({ id }) => <Input id={id} type="search" value={values.search} onChange={set("search")} placeholder="Order ID, name, mobile, GSTIN" maxLength={120} />}
        </Field>
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          className={cn(
            "col-span-2 flex h-9 items-center gap-2 rounded-lg border px-3 text-small font-medium transition-colors max-sm:order-first sm:hidden",
            more ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line-strong bg-surface text-ink",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {more ? "Fewer filters" : "More filters"}
          {activeCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-micro font-semibold text-brand-fg">{activeCount}</span>}
          <ChevronDown className={cn("ml-auto size-4 transition-transform", more && "rotate-180")} aria-hidden />
        </button>
        <div className="col-span-2 flex items-end gap-2 md:col-span-1 max-sm:grid max-sm:grid-cols-2">
          <Button type="submit" variant="primary">
            Apply
          </Button>
          <Button type="button" onClick={() => router.push(pathname)}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
