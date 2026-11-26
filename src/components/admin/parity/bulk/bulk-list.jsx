"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";

/** Filter bar of the bulk_orders list pages: every field is a query-string parameter. */
export function BulkFilters({ fields, values }) {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(() => Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? ""])));
  const active = fields.some((f) => values[f.key]);
  // Phones / tablets: pair like with like so From / To dates always sit together. A text box with a
  // long hint, or a leftover field of its kind, takes the full row.
  const ofType = (type) => fields.filter((f) => (type === "text" ? f.type !== "select" && f.type !== "date" : f.type === type));
  const fullRow = new Set();
  for (const type of ["text", "select", "date"]) {
    const group = ofType(type);
    const pairable = type === "text" ? group.filter((f) => String(f.placeholder ?? f.label ?? "").length <= 18) : group;
    for (const f of group) if (!pairable.includes(f)) fullRow.add(f);
    if (pairable.length % 2 === 1) fullRow.add(pairable[pairable.length - 1]);
  }

  function apply(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(draft)) if (String(value).trim()) params.set(key, String(value).trim());
    if (values.pageSize) params.set("pageSize", values.pageSize);
    router.push(params.size ? `${pathname}?${params}` : pathname);
  }

  return (
    // Phones / tablets: fields pair up two per row (see fullRow above), then a full-width Filter / Clear row.
    <form onSubmit={apply} className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-surface p-3 max-lg:grid-flow-row-dense lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {fields.map((f) => (
        <label key={f.key} className={cn("min-w-0 text-xs font-medium text-ink-muted", fullRow.has(f) && "max-lg:col-span-2")}>
          {f.label}
          {f.type === "select" ? (
            <Select className="mt-1 w-full" value={draft[f.key]} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} options={[{ value: "", label: f.all ?? "All" }, ...f.options]} />
          ) : (
            <Input className="mt-1 w-full" type={f.type === "date" ? "date" : "text"} value={draft[f.key]} placeholder={f.placeholder} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
          )}
        </label>
      ))}
      <div className="col-span-2 flex items-end gap-2 lg:col-span-1 max-sm:[&>*]:flex-1">
        <Button type="submit" variant="primary" size="sm" className="h-9">
          <Search className="size-4" aria-hidden /> Filter
        </Button>
        {active && (
          <Link href={pathname} className={buttonClasses({ size: "sm", className: "h-9" })}>
            <X className="size-4" aria-hidden /> Clear
          </Link>
        )}
      </div>
    </form>
  );
}

/** Page links for a { page, pageCount, total } result, keeping the current filters. */
export function BulkPager({ result, query }) {
  const pathname = usePathname();
  const href = (page) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value && key !== "page") params.set(key, value);
    if (page > 1) params.set("page", String(page));
    return params.size ? `${pathname}?${params}` : pathname;
  };
  const last = Math.max(1, result.pageCount);
  const link = (page, label, disabled) =>
    disabled ? (
      <span className={buttonClasses({ size: "sm", className: "pointer-events-none opacity-50" })} aria-disabled>
        {label}
      </span>
    ) : (
      <Link href={href(page)} className={buttonClasses({ size: "sm" })}>
        {label}
      </Link>
    );
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-small text-ink-muted">
      <span>
        {formatNumber(result.total)} records · page {formatNumber(result.page)} of {formatNumber(last)}
      </span>
      <div className="flex gap-1.5">
        {link(1, "First", result.page <= 1)}
        {link(result.page - 1, "Prev", result.page <= 1)}
        {link(result.page + 1, "Next", result.page >= last)}
        {link(last, "Last", result.page >= last)}
      </div>
    </div>
  );
}
