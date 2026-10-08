"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localIso } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";

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

  const activePreset = PRESETS.find((p) => {
    const r = presetRange(p.id);
    return r.from === (query.from || "") && r.to === (query.to || "");
  })?.id;

  return (
    <form
      className="rounded-xl border border-line bg-surface p-4"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => preset(p.id)}
            className={cn("h-8 rounded-full border px-3 text-[13px] font-medium", activePreset === p.id ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line bg-surface text-ink-soft hover:bg-surface-muted")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Field label="From">{({ id }) => <Input id={id} type="date" value={values.from} onChange={set("from")} />}</Field>
        <Field label="To">{({ id }) => <Input id={id} type="date" value={values.to} onChange={set("to")} />}</Field>
        <Field label="Order Type">
          {({ id }) => <Select id={id} value={values.orderType} onChange={set("orderType")} placeholder="All" options={[{ value: "B2C", label: "B2C" }, { value: "B2B", label: "B2B" }]} />}
        </Field>
        <Field label="Vendor">
          {({ id }) => <Select id={id} value={values.vendorId} onChange={set("vendorId")} placeholder="All vendors" options={options.vendors.map((v) => ({ value: v.id, label: v.name || v.id }))} />}
        </Field>
        <Field label="Category">
          {({ id }) => <Select id={id} value={values.categoryId} onChange={set("categoryId")} placeholder="All categories" options={options.categories.map((c) => ({ value: c.id, label: c.name }))} />}
        </Field>
        <Field label="State">{({ id }) => <Select id={id} value={values.state} onChange={set("state")} placeholder="All states" options={options.states.map((s) => ({ value: s, label: s }))} />}</Field>
        <Field label="Payment">
          {({ id }) => <Select id={id} value={values.paymentMode} onChange={set("paymentMode")} placeholder="All" options={options.paymentModes.map((m) => ({ value: m, label: m.toUpperCase() }))} />}
        </Field>
        <Field label="Min Value">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={values.minValue} onChange={set("minValue")} />}</Field>
        <Field label="Max Value">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={values.maxValue} onChange={set("maxValue")} />}</Field>
        <Field label="Search" className="col-span-2 md:col-span-3 xl:col-span-2">
          {({ id }) => <Input id={id} type="search" value={values.search} onChange={set("search")} placeholder="Order ID, name, mobile, GSTIN" maxLength={120} />}
        </Field>
        <div className="col-span-2 flex items-end gap-2 md:col-span-1">
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
