"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";

/**
 * A small GET filter form (the PHP b2bp_toolbar): fields write to the URL on Apply; Reset clears them.
 * Phones: one short row (search + "Filters" button with a count); the other fields open in a two-column grid.
 * Tablet / desktop: unchanged inline row.
 */
export function QueryFilters({ fields }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, searchParams.get(f.name) ?? f.defaultValue ?? ""])));
  const [open, setOpen] = useState(false);

  const searchField = fields.find((f) => f.type === "search");
  const others = fields.filter((f) => f !== searchField);
  const activeCount = others.filter((f) => searchParams.get(f.name)).length;
  const setValue = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const apply = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    for (const f of fields) {
      const v = String(values[f.name] ?? "").trim();
      if (v) params.set(f.name, v);
      else params.delete(f.name);
    }
    setOpen(false);
    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => {
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])));
    router.push(pathname);
  };

  const control = (f, id) =>
    f.type === "select" ? (
      <Select id={id} value={values[f.name]} onChange={setValue(f.name)} options={f.options} placeholder={f.placeholder} />
    ) : (
      <Input id={id} type={f.type === "date" || f.type === "month" ? f.type : "search"} value={values[f.name]} onChange={setValue(f.name)} placeholder={f.placeholder} maxLength={120} />
    );

  return (
    <form onSubmit={apply} className="rounded-xl border border-line bg-surface p-3">
      {/* Phones: search + Filters toggle on one line */}
      <div className="flex items-center gap-2 sm:hidden">
        {searchField ? (
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <Input type="search" value={values[searchField.name]} onChange={setValue(searchField.name)} placeholder={searchField.placeholder || searchField.label} aria-label={searchField.label} maxLength={120} className="pl-9" />
          </div>
        ) : (
          <p className="min-w-0 flex-1 text-body font-medium text-ink">Filters</p>
        )}
        {others.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-small font-medium transition-colors",
              open ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line-strong bg-surface text-ink hover:bg-surface-muted",
            )}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-micro font-semibold text-brand-fg">{activeCount}</span>}
          </button>
        )}
      </div>

      <div className={cn("grid grid-cols-2 gap-3 max-sm:mt-3 sm:flex sm:flex-wrap sm:items-end", open ? "ui-pop" : "max-sm:hidden")}>
        {fields.map((f) => {
          const isSearch = f === searchField;
          const lone = !isSearch && others.length % 2 === 1 && f === others[others.length - 1];
          return (
            <Field key={f.name} label={f.label} className={cn(isSearch ? "min-w-56 flex-1 max-sm:hidden" : "sm:w-48", lone && "max-sm:col-span-2")}>
              {({ id }) => control(f, id)}
            </Field>
          );
        })}
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex">
          <Button type="submit" variant="primary">
            Apply
          </Button>
          <Button onClick={reset}>Reset</Button>
        </div>
      </div>
    </form>
  );
}
