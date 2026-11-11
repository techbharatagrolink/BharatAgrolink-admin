"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, ChevronLeft, ChevronRight, Download, Eye, FileSpreadsheet, FileText, X } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { SearchInput, SelectFilter } from "@/components/data-table/filter-bar";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Checkbox, Input, Select } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (ym) => {
  const [y, m] = String(ym).split("-").map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : ym;
};
const HALVES = [
  { value: "first", label: "1st cycle (1–15)" },
  { value: "second", label: "2nd cycle (16–end)" },
];
const STATE_TONE = { Running: "success", Closed: "neutral", Upcoming: "info" };

/** PHP payout_new.php columns, in PHP's order. Items / pending items are extra and hidden by default. */
const COLUMNS = [
  { key: "sr", label: "SR.", type: "number", width: 64 },
  { key: "vendor", label: "Vendor", sub: "vendorId", href: "/admin/vendors/{sellerId}", width: 280, wrap: true, sortable: true },
  { key: "orders", label: "Orders", type: "number", sortable: true },
  { key: "items", label: "Items", type: "number", hidden: true },
  { key: "gross", label: "Gross Amount", type: "currency", sortable: true },
  { key: "taxable", label: "Taxable Value", type: "currency", sortable: true },
  { key: "totalGst", label: "Total GST", type: "currency", sortable: true },
  { key: "cgst", label: "CGST", type: "currency" },
  { key: "sgst", label: "SGST", type: "currency" },
  { key: "igst", label: "IGST", type: "currency" },
  { key: "net", label: "Net Amount", type: "currency", sortable: true },
  { key: "paidBsa", label: "Paid BSA", type: "currency", sortable: true },
  { key: "pendingBsa", label: "Pending BSA", type: "currency", sortable: true },
  { key: "pendingItems", label: "Pending items", type: "number", hidden: true },
  { key: "status", label: "Status", type: "status", sortable: true },
  { key: "view", label: "Action", href: "{viewHref}" },
];

const ROW_ACTIONS = [
  { id: "open", label: "View payout", href: "{viewHref}" },
  { id: "items", label: "View payout items", href: "/admin/payouts/items?vendorId={vendorId}" },
  { id: "vendor", label: "Open vendor", href: "/admin/vendors/{sellerId}" },
];

export const STATUS_FILTER = { key: "status", label: "Status", options: ["Pending", "Paid", "On Hold"] };

/* PHP Export with vendors ticked: their items (same columns as the items page export). */
const BULK_ACTIONS = [
  { id: "view-items", label: "View items", kind: "form", view: true },
  { id: "export-items-xlsx", label: "Export items (Excel)", kind: "form", format: "xlsx" },
  { id: "export-items-csv", label: "Export items (CSV)", kind: "form", format: "csv" },
];
const FORMATS = [
  { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { value: "csv", label: "CSV (.csv)", icon: FileText },
];
const SUMMARY_EXPORT_FILTERS = ["q", "status", "sort", "cycleMonth", "cycle", "orderIds"];
export const ITEM_EXPORT_FILTERS = ["q", "status", "cycleMonth", "cycle", "orderIds"];

/** A download URL carrying the page's current filters, so every export matches what the table shows. */
function exportHref(path, filters, searchParams, format, payoutIds = [], columns = null) {
  const out = new URLSearchParams();
  for (const key of filters) if (searchParams.get(key)) out.set(key, searchParams.get(key));
  if (payoutIds.length) out.set("payoutIds", payoutIds.join(","));
  if (columns && columns.length) out.set("columns", columns.join(","));
  out.set("format", format);
  return `${path}?${out.toString()}`;
}

/**
 * Export button that asks Excel or CSV, for the page's current filters. When `columns` is given (every
 * column's {value, label}), a "Columns" checklist sits above the format links so the file can leave some out;
 * leaving every column ticked (or none) downloads every column, same as before this existed.
 */
export function ExportMenu({ label, title, path, filters, payoutIds = [], columns }) {
  const { searchParams, pending } = useQueryState();
  const allKeys = useMemo(() => (columns ?? []).map((c) => c.value), [columns]);
  const [picked, setPicked] = useState(null);
  const known = useMemo(() => new Set(allKeys), [allKeys]);
  const selected = useMemo(() => {
    if (picked === null) return allKeys;
    return picked.filter((k) => known.has(k));
  }, [picked, allKeys, known]);
  const toggle = (key) =>
    setPicked((p) => {
      const cur = p === null ? allKeys : p;
      return cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
    });
  const chosen = selected.length && selected.length < allKeys.length ? selected : null;
  return (
    <Popover
      label={`${label}: choose columns and format`}
      panelClassName="w-60"
      trigger={({ toggle: open, props }) => (
        <Button size="sm" onClick={open} disabled={pending} title={title} {...props}>
          <Download className="size-4" aria-hidden /> {label}
        </Button>
      )}
    >
      {columns && columns.length > 0 && (
        <div className="max-h-64 space-y-1.5 overflow-y-auto border-b border-line p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">Columns</span>
            <button type="button" onClick={() => setPicked(selected.length ? [] : allKeys)} className="text-xs font-medium text-brand-700 hover:underline">
              {selected.length ? "Clear" : "Select all"}
            </button>
          </div>
          {columns.map((c) => (
            <Checkbox key={c.value} label={c.label} checked={selected.includes(c.value)} onChange={() => toggle(c.value)} className="flex" />
          ))}
        </div>
      )}
      {columns && columns.length > 0 && selected.length === 0 ? (
        <p className="px-3.5 py-2.5 text-xs text-ink-muted">Tick at least one column to export.</p>
      ) : (
        <ul className="p-1">
          {FORMATS.map(({ value, label: formatLabel, icon: Icon }) => (
            <li key={value}>
              <a href={exportHref(path, filters, searchParams, value, payoutIds, chosen)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] text-ink hover:bg-surface-muted">
                <Icon className="size-4 text-ink-muted" aria-hidden /> {formatLabel}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

/** The summary filters as the payout detail page reads them (its status filter is f_status), so View opens the same slice. */
function detailFilters(searchParams) {
  const out = new URLSearchParams();
  for (const key of ["cycleMonth", "cycle", "orderIds"]) if (searchParams.get(key)) out.set(key, searchParams.get(key));
  if (searchParams.get("status")) out.set("f_status", searchParams.get("status"));
  // The whole summary state rides along, so the detail page's "Payout summary" link returns to it
  if (searchParams.toString()) out.set("back", searchParams.toString());
  const qs = out.toString();
  return qs ? `?${qs}` : "";
}

/** The items Export items would download, on screen instead (same filters, plus ticked vendors). */
function viewItemsHref(searchParams, payoutIds = []) {
  const out = new URLSearchParams();
  for (const key of ITEM_EXPORT_FILTERS) if (searchParams.get(key)) out.set(key, searchParams.get(key));
  if (payoutIds.length) out.set("payoutIds", payoutIds.join(","));
  const qs = out.toString();
  return qs ? `/admin/payouts/vendor-items?${qs}` : "/admin/payouts/vendor-items";
}

/** PHP "Order ID (comma-separated)": only vendors with an item of those orders. */
export function OrderIdsFilter() {
  const { get, setParams } = useQueryState();
  const applied = get("orderIds");
  const [value, setValue] = useState(applied);
  const apply = () => setParams({ orderIds: value.split(",").map((s) => s.trim()).filter(Boolean).join(",") });
  return (
    <Input
      aria-label="Order IDs"
      title="Order ID(s), comma separated"
      className="w-full sm:w-36"
      placeholder="Order ID(s)"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          apply();
        }
      }}
      onBlur={() => value.trim() !== applied && apply()}
    />
  );
}

/**
 * Calendar month picker: one year at a time with all twelve months, back to last year at least.
 * Months that have payout items carry a dot; months after the newest cycle cannot be picked.
 */
function MonthPicker({ value, cycles, onChange }) {
  const withItems = new Set(cycles.map((c) => c.month));
  const newest = [...withItems].sort().at(-1) ?? "";
  const [year, setYear] = useState(null);
  const yearOf = (ym) => Number(String(ym).slice(0, 4)) || null;
  const known = [...withItems, value].map(yearOf).filter(Boolean);
  const open = (toggle) => {
    const top = known.length ? Math.max(...known) : new Date().getFullYear();
    setYear(yearOf(value) ?? yearOf(newest) ?? top);
    toggle();
  };
  const maxYear = known.length ? Math.max(...known) : year;
  const minYear = Math.min(...known, (maxYear ?? year) - 1);
  return (
    <Popover
      label="Cycle month: choose month"
      panelClassName="w-64"
      trigger={({ toggle, props }) => (
        <Button size="sm" onClick={() => open(toggle)} className="w-full justify-start font-normal sm:w-36" {...props}>
          <CalendarRange className="size-4 text-ink-muted" aria-hidden />
          <span className="truncate">{value ? monthLabel(value) : "Month: all"}</span>
        </Button>
      )}
    >
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Button size="icon-sm" variant="ghost" onClick={() => setYear((y) => y - 1)} disabled={year <= minYear} aria-label="Previous year">
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <span className="text-sm font-semibold text-ink tabular">{year}</span>
          <Button size="icon-sm" variant="ghost" onClick={() => setYear((y) => y + 1)} disabled={maxYear != null && year >= maxYear} aria-label="Next year">
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
        <ul className="grid grid-cols-3 gap-1.5">
          {MONTHS.map((name, i) => {
            const ym = `${year}-${String(i + 1).padStart(2, "0")}`;
            const active = ym === value;
            return (
              <li key={name}>
                <button
                  type="button"
                  data-close
                  disabled={Boolean(newest) && ym > newest}
                  aria-pressed={active}
                  onClick={() => onChange(active ? "" : ym)}
                  className={cn(
                    "relative w-full rounded-md border px-2 py-1.5 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    active ? "border-brand-600 bg-brand-50 font-semibold text-brand-700" : "border-line text-ink hover:border-brand-200 hover:bg-surface-muted",
                  )}
                >
                  {name}
                  {withItems.has(ym) && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-brand-600" aria-label="has payout items" />}
                </button>
              </li>
            );
          })}
        </ul>
        {value && (
          <button type="button" data-close onClick={() => onChange("")} className="mt-2 w-full rounded-md px-2 py-1.5 text-xs font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
            All months
          </button>
        )}
      </div>
    </Popover>
  );
}

export function CycleSelector({ cycles }) {
  const { get, setParams } = useQueryState();
  const month = get("cycleMonth");
  const half = get("cycle");
  return (
    <>
      <MonthPicker value={month} cycles={cycles} onChange={(m) => setParams({ cycleMonth: m, cycle: m ? half : "" })} />
      <Select
        aria-label="Cycle"
        className="w-full sm:w-40"
        value={half}
        placeholder="All cycles"
        options={HALVES}
        disabled={!month}
        onChange={(e) => setParams({ cycle: e.target.value })}
      />
    </>
  );
}

/** Search, status, cycle month, cycle and order IDs, sized to sit on one line with the table's buttons. */
export function PayoutFilters({ cycles }) {
  return (
    <>
      <SearchInput placeholder="Search vendor name or ID" className="w-full sm:w-48" />
      <SelectFilter name="status" label={STATUS_FILTER.label} options={STATUS_FILTER.options} className="w-full sm:w-32" />
      <CycleSelector cycles={cycles} />
      <OrderIdsFilter />
    </>
  );
}

/** Every cycle that has payout items. Picking one filters the table; nothing changes on its own. */
function CycleStrip({ cycles }) {
  const { get, setParams, pending } = useQueryState();
  const month = get("cycleMonth");
  const half = get("cycle");
  if (!cycles.length) return null;
  return (
    <section aria-label="Payout cycles" className="min-w-0 rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <h2 className="text-sm font-semibold text-ink">Payout cycles</h2>
        {month && (
          <button type="button" onClick={() => setParams({ cycleMonth: "", cycle: "" })} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
            <X className="size-3.5" aria-hidden /> All cycles
          </button>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-thin overscroll-x-contain scroll-smooth [scroll-snap-type:x_proximity] sm:[scroll-snap-type:none]">
        <ul className="flex min-w-max gap-2 p-3">
          {cycles.map((c) => {
            const active = month === c.month && half === c.half;
            return (
              <li key={c.index} className="w-40 shrink-0 [scroll-snap-align:start] sm:w-48 lg:w-52">
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => setParams(active ? { cycleMonth: "", cycle: "" } : { cycleMonth: c.month, cycle: c.half })}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                    active ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600/20" : "border-line hover:border-brand-200 hover:bg-surface-muted",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-ink">{c.label.replace(/ \(.*\)$/, "")}</span>
                    <Badge tone={STATE_TONE[c.state]}>{c.state}</Badge>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ink-muted tabular">
                    {c.from.slice(8)}–{c.to.slice(8)} {monthLabel(c.month)} · {formatNumber(c.vendors)} vendors · {formatNumber(c.items)} items
                  </span>
                  <span className="mt-1 block truncate text-xs text-success-ink tabular">Paid BSA {formatINR(c.paidBsa)}</span>
                  <span className="block truncate text-xs text-warning-ink tabular">Pending BSA {formatINR(c.pendingBsa)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function PayoutSummaryTable({ data, cycles, exportColumns }) {
  const router = useRouter();
  const { searchParams } = useQueryState();
  const detailQuery = detailFilters(searchParams);
  const rows = data.rows.map((r) => ({ ...r, view: "View", viewHref: `/admin/payouts/${encodeURIComponent(r.id)}${detailQuery}` }));
  const t = data.totals ?? {};
  const counts = data.tabCounts ?? {};
  const summary = (
    <span className="flex flex-wrap gap-x-4 gap-y-1 tabular">
      <span>
        Filtered totals — Orders <b className="text-ink">{formatNumber(t.orders)}</b>
      </span>
      <span>
        Gross <b className="text-ink">{formatINR(t.gross)}</b>
      </span>
      <span>
        Taxable <b className="text-ink">{formatINR(t.taxable)}</b>
      </span>
      <span>
        GST <b className="text-ink">{formatINR(t.totalGst)}</b> (CGST {formatINR(t.cgst)} · SGST {formatINR(t.sgst)} · IGST {formatINR(t.igst)})
      </span>
      <span>
        Net <b className="text-ink">{formatINR(t.net)}</b>
      </span>
      <span>
        Paid BSA <b className="text-success-ink">{formatINR(t.paidBsa)}</b>
      </span>
      <span>
        Pending BSA <b className="text-warning-ink">{formatINR(t.pendingBsa)}</b>
      </span>
      <span>
        Status: {formatNumber(counts.Pending ?? 0)} pending · {formatNumber(counts.Paid ?? 0)} paid
        {counts["On Hold"] ? ` · ${formatNumber(counts["On Hold"])} on hold` : ""}
      </span>
    </span>
  );
  return (
    <div className="space-y-4">
      <CycleStrip cycles={cycles} />
      <DataTable
        id="vendor-payouts"
        columns={COLUMNS}
        data={{ ...data, rows }}
        inlineToolbar
        toolbarEnd={<ExportMenu label="Export" title="These vendor rows with the current filters" path="/admin/payouts/summary-export" filters={SUMMARY_EXPORT_FILTERS} columns={exportColumns?.summary} />}
        toolbar={
          <>
            <PayoutFilters cycles={cycles} />
            <ButtonLink href={viewItemsHref(searchParams)} size="sm" title="Items of every vendor matching these filters, on screen">
              <Eye className="size-4" aria-hidden /> View items
            </ButtonLink>
            <ExportMenu label="Export items" title="Items of every vendor matching these filters (status, cycle, order IDs)" path="/admin/payouts/items-export" filters={ITEM_EXPORT_FILTERS} columns={exportColumns?.items} />
          </>
        }
        rowActions={ROW_ACTIONS}
        bulkActions={BULK_ACTIONS}
        onCustomAction={(action, ids, _rows, clear) => {
          if (action.view) {
            router.push(viewItemsHref(searchParams, ids));
            return;
          }
          if (!action.format) return;
          window.location.href = exportHref("/admin/payouts/items-export", ITEM_EXPORT_FILTERS, searchParams, action.format, ids);
          clear();
        }}
        summary={summary}
        emptyTitle="No vendor payouts found"
        emptyDescription={data.cycle ? "No vendor has payout items in this cycle with these filters." : "Try changing the search or filters."}
      />
    </div>
  );
}
