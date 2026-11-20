"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, Columns3, Download, ListFilter } from "lucide-react";
import { exportDeliveredAction } from "@/lib/actions/admin/parity/ops";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { DELIVERED_COLUMNS, PER_PAGE, deliveredCsv, downloadText } from "./delivered-config";

const DEFAULT_ON = DELIVERED_COLUMNS.filter((c) => c.on).map((c) => c.key);
const money = (v) => `₹ ${(Number(v) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function display(column, value) {
  if (value == null || value === "") return "—";
  if (column.money) return money(value);
  if (column.number) return formatNumber(value);
  if (column.date) return formatDate(value);
  if (column.upper) return String(value).toUpperCase();
  return String(value);
}

/** orders_table.php: server-side sort and paging, column chooser and per-column filters on the loaded page. */
export function DeliveredTable({ table }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const [visible, setVisible] = useState(DEFAULT_ON);
  const [chooser, setChooser] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [colFilters, setColFilters] = useState({});
  const [exporting, setExporting] = useState(false);
  // Phones: the per-column filters open from a button above the cards.
  const [phoneFilters, setPhoneFilters] = useState(false);

  const columns = DELIVERED_COLUMNS.filter((c) => visible.includes(c.key));
  const rows = useMemo(() => {
    const active = Object.entries(colFilters).filter(([, v]) => v.trim());
    if (!active.length) return table.rows;
    return table.rows.filter((row) => active.every(([key, v]) => String(row[key] ?? "").toLowerCase().includes(v.trim().toLowerCase())));
  }, [table.rows, colFilters]);

  function go(changes) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value == null || value === "") params.delete(key);
      else params.set(key, String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function sortBy(key) {
    if (table.sort === key) go({ sort: key, order: table.order === "DESC" ? "ASC" : "DESC", page: 1 });
    else go({ sort: key, order: "DESC", page: 1 });
  }

  async function exportCsv() {
    setExporting(true);
    const result = await exportDeliveredAction(Object.fromEntries(searchParams.entries()));
    setExporting(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    downloadText(result.data.filename, deliveredCsv(result.data.rows));
    if (result.data.truncated) notify({ message: `Export stopped at ${formatNumber(result.data.rows.length)} rows. Narrow the filters to export the rest.`, tone: "info" });
  }

  const toggle = (key) => setVisible((v) => (v.includes(key) ? v.filter((k) => k !== key) : DELIVERED_COLUMNS.filter((c) => c.key === key || v.includes(c.key)).map((c) => c.key)));
  const chooserColumns = DELIVERED_COLUMNS.filter((c) => c.label.toLowerCase().includes(columnSearch.trim().toLowerCase()));
  const last = Math.max(1, table.totalPages);
  const activeColFilters = Object.values(colFilters).filter((v) => v.trim()).length;
  // Phone cards: the first non-badge column is the card title, the badge column rides beside it.
  const leadCol = columns.find((c) => !c.badge);
  const badgeCol = columns.find((c) => c.badge);
  const cardCols = columns.filter((c) => c !== leadCol && c !== badgeCol);

  return (
    <Card>
      <CardHeader
        title="Delivered Orders"
        description={`— ${formatNumber(table.totalLines)} lines across ${formatNumber(table.totalOrders)} orders`}
        actions={
          // A fragment, so on phones the three controls form one even row (shared .ba-phone-actions).
          <>
            <div className="relative">
              <Button size="sm" onClick={() => setChooser((v) => !v)} aria-expanded={chooser}>
                <Columns3 className="size-4" aria-hidden /> Columns
              </Button>
              {chooser && (
                <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-line bg-surface p-3 shadow-lg max-sm:right-auto max-sm:left-0">
                  <div className="mb-2 flex flex-wrap gap-1.5 text-xs">
                    <button type="button" className="text-brand-700 hover:underline" onClick={() => setVisible(DELIVERED_COLUMNS.map((c) => c.key))}>
                      Select All
                    </button>
                    <span className="text-ink-muted">·</span>
                    <button type="button" className="text-brand-700 hover:underline" onClick={() => setVisible([])}>
                      Deselect All
                    </button>
                    <span className="text-ink-muted">·</span>
                    <button type="button" className="text-brand-700 hover:underline" onClick={() => setVisible(DEFAULT_ON)}>
                      Reset Default
                    </button>
                  </div>
                  <Input value={columnSearch} onChange={(e) => setColumnSearch(e.target.value)} placeholder="Search columns" aria-label="Search columns" className="mb-2 h-8" />
                  <ul className="max-h-64 space-y-1 overflow-y-auto text-small">
                    {chooserColumns.map((c) => (
                      <li key={c.key}>
                        <label className="flex items-center gap-2 text-ink-soft">
                          <input type="checkbox" checked={visible.includes(c.key)} onChange={() => toggle(c.key)} />
                          {c.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Select aria-label="Rows per page" value={String(table.perPage)} onChange={(e) => go({ perPage: e.target.value, page: 1 })} options={PER_PAGE.map((n) => ({ value: String(n), label: `${n} / page` }))} className="w-28" />
            <Button size="sm" onClick={exportCsv} loading={exporting}>
              <Download className="size-4" aria-hidden /> Export<span className="max-sm:hidden"> CSV</span>
            </Button>
          </>
        }
      />

      {/* Phones: sort + per-column filters, then one card per row. */}
      <div className="space-y-2 border-b border-line px-4 py-3 sm:hidden">
        <div className="flex gap-2">
          <Select
            aria-label="Sort by"
            value={columns.some((c) => c.key === table.sort) ? table.sort : ""}
            onChange={(e) => e.target.value && go({ sort: e.target.value, order: table.order || "DESC", page: 1 })}
            options={columns.map((c) => ({ value: c.key, label: `Sort: ${c.label}` }))}
            placeholder="Sort: default"
            className="min-w-0 flex-1"
          />
          <Button size="sm" className="h-9 w-9 shrink-0 px-0" disabled={!table.sort} onClick={() => go({ sort: table.sort, order: table.order === "DESC" ? "ASC" : "DESC", page: 1 })} aria-label={table.order === "DESC" ? "Sorted high to low, switch to low to high" : "Sorted low to high, switch to high to low"}>
            {table.order === "DESC" ? <ArrowDown className="size-4" aria-hidden /> : <ArrowUp className="size-4" aria-hidden />}
          </Button>
          <Button size="sm" onClick={() => setPhoneFilters((v) => !v)} aria-expanded={phoneFilters} aria-label="Filter this page" className={cn("relative h-9 w-9 shrink-0 px-0", phoneFilters && "border-brand-600 bg-brand-50 text-brand-700")}>
            <ListFilter className="size-4" aria-hidden />
            {activeColFilters > 0 && <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-brand-600 text-micro font-semibold text-brand-fg">{activeColFilters}</span>}
          </Button>
        </div>
        {phoneFilters && (
          <div className="ui-pop space-y-1.5">
            <p className="text-label font-medium text-ink-muted">Filter this page</p>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((c) => (
                <Input key={c.key} value={colFilters[c.key] ?? ""} onChange={(e) => setColFilters((f) => ({ ...f, [c.key]: e.target.value }))} placeholder={c.label} aria-label={`Filter ${c.label}`} className="h-9" />
              ))}
            </div>
          </div>
        )}
      </div>
      <ul className="divide-y divide-line sm:hidden">
        {rows.length === 0 && <li className="px-4 py-8 text-center text-ink-muted">No delivered orders found for the selected filters.</li>}
        {rows.map((row) => (
          <li key={row.row_uid ?? `${row.order_type}-${row.order_id}-${row.product_sku}`} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 break-words text-body font-medium text-ink">{leadCol ? display(leadCol, row[leadCol.key]) : null}</p>
              {badgeCol && <Badge tone={row[badgeCol.key] === "B2B" ? "info" : "brand"}>{row[badgeCol.key]}</Badge>}
            </div>
            {cardCols.length > 0 && (
              <dl className="mt-2 rounded-lg bg-surface-muted/60 px-3 py-1 text-small">
                {cardCols.map((c) => (
                  <div key={c.key} className="flex items-start justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
                    <dt className="max-w-[40%] shrink-0 text-ink-muted">{c.label}</dt>
                    <dd className={cn("min-w-0 text-right break-words text-ink", (c.money || c.number) && "tabular")}>{display(c, row[c.key])}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto scrollbar-thin max-sm:hidden">
        <table className="w-full min-w-max text-left text-small">
          <thead>
            <tr className="border-b border-line">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-3 py-2 text-xs font-semibold text-ink-muted", (c.money || c.number) && "text-right")}>
                  <button type="button" onClick={() => sortBy(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                    {c.label}
                    {table.sort === c.key && (table.order === "DESC" ? <ArrowDown className="size-3" aria-hidden /> : <ArrowUp className="size-3" aria-hidden />)}
                  </button>
                </th>
              ))}
            </tr>
            <tr className="border-b border-line">
              {columns.map((c) => (
                <th key={c.key} className="px-2 py-1.5">
                  <Input value={colFilters[c.key] ?? ""} onChange={(e) => setColFilters((f) => ({ ...f, [c.key]: e.target.value }))} placeholder="Filter" aria-label={`Filter ${c.label}`} className="h-7 min-w-20 text-xs" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={Math.max(1, columns.length)} className="px-4 py-8 text-center text-ink-muted">
                  No delivered orders found for the selected filters.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.row_uid ?? `${row.order_type}-${row.order_id}-${row.product_sku}`} className="border-b border-line last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2 text-ink-soft", (c.money || c.number) && "text-right tabular")}>
                    {c.badge ? <Badge tone={row[c.key] === "B2B" ? "info" : "brand"}>{row[c.key]}</Badge> : display(c, row[c.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-small text-ink-muted max-sm:flex-col max-sm:items-stretch max-sm:text-center">
        <span>
          Page {formatNumber(table.page)} of {formatNumber(last)}
        </span>
        <div className="flex gap-1.5 max-sm:grid max-sm:grid-cols-4">
          <Button size="sm" disabled={table.page <= 1} onClick={() => go({ page: 1 })}>
            First
          </Button>
          <Button size="sm" disabled={table.page <= 1} onClick={() => go({ page: table.page - 1 })}>
            Prev
          </Button>
          <Button size="sm" disabled={table.page >= last} onClick={() => go({ page: table.page + 1 })}>
            Next
          </Button>
          <Button size="sm" disabled={table.page >= last} onClick={() => go({ page: last })}>
            Last
          </Button>
        </div>
      </div>
    </Card>
  );
}
