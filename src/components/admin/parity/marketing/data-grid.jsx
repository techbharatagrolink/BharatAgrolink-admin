"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";

const PAGE_SIZES = [20, 50, 100];

/**
 * The AG Grid tables of the PHP dashboards, on rows already loaded: every column
 * sortable and filterable, 20 rows a page. A column with `index` shows the row's
 * position in the current sort, like AG Grid's rowIndex + 1.
 */
export function DataGrid({ columns, rows, caption, empty = "No rows to show." }) {
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const view = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v.trim());
    const filtered = active.length
      ? rows.filter((row) =>
          active.every(([key, v]) => {
            const column = columns.find((c) => c.key === key);
            const value = column?.filterValue ? column.filterValue(row) : row[key];
            return String(value ?? "").toLowerCase().includes(v.trim().toLowerCase());
          }),
        )
      : rows;
    if (!sort.key) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    const value = (row) => (column?.sortValue ? column.sortValue(row) : row[sort.key]);
    return [...filtered].sort((a, b) => {
      const x = value(a);
      const y = value(b);
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, columns, filters, sort]);

  const pages = Math.max(1, Math.ceil(view.length / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  const visible = view.slice(start, start + pageSize);

  function sortBy(key) {
    setSort((s) => (s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : { key: null, dir: "asc" }));
  }

  return (
    <div>
      <div className="flex justify-end px-4 pb-2 print:hidden">
        <Button size="xs" variant={showFilters ? "primary" : "ghost"} onClick={() => setShowFilters((v) => !v)} aria-pressed={showFilters}>
          <Filter className="size-3.5" aria-hidden />
          Column filters
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-3 py-2 whitespace-nowrap", c.align === "right" && "text-right")}>
                  {c.index ? (
                    c.label
                  ) : (
                    <button type="button" onClick={() => sortBy(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                      {c.label}
                      {sort.key === c.key && (sort.dir === "asc" ? <ArrowUp className="size-3" aria-label="ascending" /> : <ArrowDown className="size-3" aria-label="descending" />)}
                    </button>
                  )}
                </th>
              ))}
            </tr>
            {showFilters && (
              <tr className="print:hidden">
                {columns.map((c) => (
                  <th key={c.key} className="px-3 pb-2">
                    {!c.index && (
                      <Input
                        value={filters[c.key] ?? ""}
                        onChange={(e) => {
                          setFilters((f) => ({ ...f, [c.key]: e.target.value }));
                          setPage(1);
                        }}
                        aria-label={`Filter ${c.label}`}
                        placeholder="Filter…"
                        className="h-7 min-w-20 text-xs font-normal"
                      />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row, i) => (
              <tr key={row.userId ?? start + i} className="hover:bg-surface-muted/60">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2 whitespace-nowrap", c.align === "right" && "text-right tabular", c.className?.(row))}>
                    {c.index ? <strong>{start + i + 1}</strong> : c.render ? c.render(row) : (row[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-ink-muted">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-xs text-ink-muted print:hidden">
        <label className="flex items-center gap-2">
          Page size
          <Select value={String(pageSize)} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} options={PAGE_SIZES.map(String)} className="w-20" aria-label="Page size" />
        </label>
        <span>
          {view.length ? `${formatNumber(start + 1)} to ${formatNumber(start + visible.length)} of ${formatNumber(view.length)}` : "0 rows"}
        </span>
        <div className="flex items-center gap-1">
          <Button size="xs" variant="ghost" disabled={current <= 1} onClick={() => setPage(1)}>First</Button>
          <Button size="xs" variant="ghost" disabled={current <= 1} onClick={() => setPage(current - 1)}>Previous</Button>
          <span className="px-1">Page {current} of {pages}</span>
          <Button size="xs" variant="ghost" disabled={current >= pages} onClick={() => setPage(current + 1)}>Next</Button>
          <Button size="xs" variant="ghost" disabled={current >= pages} onClick={() => setPage(pages)}>Last</Button>
        </div>
      </div>
    </div>
  );
}
