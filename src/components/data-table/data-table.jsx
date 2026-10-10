"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startRouteProgress } from "@/components/admin/shell/route-progress";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Columns3, Download, Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Checkbox, Select } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { Cell, formatCellValue, resolveHref } from "./cells";
import { FilterBar } from "./filter-bar";
import { useQueryState } from "./use-query-state";

const PAGE_SIZES = [10, 25, 50, 100];

function matchesWhen(action, row) {
  if (!action.when) return true;
  const value = row[action.when.field];
  if (action.when.in) return action.when.in.includes(value);
  if (action.when.notIn) return !action.when.notIn.includes(value);
  return true;
}

function toCsv(columns, rows) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = columns.map((c) => escape(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => escape(c.type === "status" || c.type === "mono" || !c.type ? row[c.key] : formatCellValue(c, row))).join(","));
  return [header, ...body].join("\n");
}

function download(filename, text) {
  const blob = new Blob(["\ufeff", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Enterprise table. Data is paginated/filtered on the server; this component
 * only edits URL params. Actions run through a server action (`onAction`) that
 * re-checks permissions and writes the audit log.
 */
export function DataTable({
  id = "table",
  columns,
  data,
  rowKey = "id",
  search,
  filters = [],
  dateRange,
  rowHref,
  rowActions = [],
  bulkActions = [],
  onAction,
  onCustomAction,
  onExport,
  exportName,
  emptyTitle = "No records found",
  emptyDescription = "Try changing the search or filters.",
  toolbar,
  summary,
  dense = true,
  pageSizes = PAGE_SIZES,
  serial = true,
}) {
  const router = useRouter();
  const { notify } = useToast();
  const { get, setParams, pending } = useQueryState();
  const [selected, setSelected] = useState([]);
  const [picks, setPicks] = useState({});
  const [hidden, setHidden] = useState(() => columns.filter((c) => c.hidden).map((c) => c.key));
  const [showSerial, setShowSerial] = useState(serial);
  const [confirm, setConfirm] = useState(null);
  const [running, startRunning] = useTransition();
  const [exporting, setExporting] = useState(false);

  const visible = useMemo(() => columns.filter((c) => !hidden.includes(c.key)), [columns, hidden]);
  const rows = data.rows;
  const pageIds = rows.map((r) => r[rowKey]);
  const selectedOnPage = selected.filter((sid) => pageIds.includes(sid));
  const allChecked = rows.length > 0 && selectedOnPage.length === rows.length;
  const [sortField, sortDir] = (get("sort") || "").split(":");
  const showSelection = bulkActions.length > 0;
  const hasRowActions = rowActions.length > 0;

  const pickLine = (orderId, line) => setPicks((current) => ({ ...current, [orderId]: line }));
  const viewOf = (row) => {
    const line = picks[row[rowKey]];
    if (!line) return row;
    return {
      ...row,
      trackingId: line.trackingId || "",
      trackingUrl: line.trackingUrl || "",
      productName: line.productName || row.productName,
      invoiceNumber: line.invoiceNumber || "",
      status: line.status || row.status,
    };
  };

  const runAction = (action, ids, reason) => {
    startRunning(async () => {
      const result = await onAction(action.id, ids, reason ? { reason } : {});
      setConfirm(null);
      if (result?.ok) {
        notify({ message: result.message || "Done.", tone: "success" });
        setSelected([]);
        router.refresh();
      } else notify({ message: result?.message || "Action failed.", tone: "error" });
    });
  };

  const trigger = (action, ids) => {
    if (action.href) {
      startRouteProgress();
      return router.push(resolveHref(action.href, rows.find((r) => r[rowKey] === ids[0]) || {}));
    }
    if ((action.kind === "form" || action.assign) && onCustomAction) {
      return onCustomAction(action, ids, rows.filter((r) => ids.includes(r[rowKey])), () => setSelected([]));
    }
    if (action.confirm) setConfirm({ action, ids });
    else runAction(action, ids);
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      if (onExport) {
        const result = await onExport(Object.fromEntries(new URLSearchParams(window.location.search)));
        if (!result?.ok) throw new Error(result?.message);
        download(`${exportName || id}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(columns, result.rows));
        notify({ message: `Exported ${formatNumber(result.rows.length)} rows.` });
      } else {
        download(`${exportName || id}-page.csv`, toCsv(columns, rows));
      }
    } catch (error) {
      notify({ message: error.message || "Export failed.", tone: "error" });
    } finally {
      setExporting(false);
    }
  };

  const sortBy = (column) => {
    if (!column.sortable) return;
    const next = sortField !== column.key ? "desc" : sortDir === "desc" ? "asc" : "";
    setParams({ sort: next ? `${column.key}:${next}` : "" }, { resetPage: false });
  };

  const sortable = visible.filter((c) => c.sortable);
  const sortOptions = sortable.flatMap((c) => [
    { value: `${c.key}:desc`, label: `${c.label} ↓` },
    { value: `${c.key}:asc`, label: `${c.label} ↑` },
  ]);

  const actionsMenu = (key, actions) =>
    actions.length > 0 && (
      <Popover
        label={`Actions for ${key}`}
        panelClassName="w-52"
        trigger={({ toggle, props }) => (
          <Button variant="ghost" size="icon-sm" onClick={toggle} {...props}>
            <MoreHorizontal className="size-4" />
          </Button>
        )}
      >
        <ul className="py-1">
          {actions.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                data-close
                onClick={() => trigger(action, [key])}
                className={cn("w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted", action.tone === "danger" ? "text-danger-ink" : "text-ink")}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    );

  const from = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const to = Math.min(data.total, data.page * data.pageSize);
  // Serial numbers continue across pages: row 1 of page 2 at 25/page is 26.
  const serialOf = (index) => (Math.max(0, (data.page - 1) * data.pageSize) || 0) + index + 1;

  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface shadow-sm">
      {(search || filters.length > 0 || dateRange || toolbar || onExport !== undefined) && (
        <div className="flex flex-col gap-2 border-b border-line p-3 xl:flex-row xl:items-start xl:justify-between">
          <FilterBar search={search} filters={filters} dateRange={dateRange} className="min-w-0 flex-1" />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {toolbar}
            <Popover
              label="Choose columns"
              panelClassName="w-56"
              trigger={({ toggle, props }) => (
                <Button size="sm" onClick={toggle} {...props}>
                  <Columns3 className="size-4" aria-hidden /> Columns
                </Button>
              )}
            >
              <div className="max-h-72 space-y-1.5 overflow-y-auto p-3">
                {serial && <Checkbox label="S.No." checked={showSerial} onChange={(e) => setShowSerial(e.target.checked)} className="flex" />}
                {columns.map((c) => (
                  <Checkbox
                    key={c.key}
                    label={c.label}
                    checked={!hidden.includes(c.key)}
                    onChange={(e) => setHidden((h) => (e.target.checked ? h.filter((k) => k !== c.key) : [...h, c.key]))}
                    className="flex"
                  />
                ))}
              </div>
            </Popover>
            {onExport !== undefined && (
              <Button size="sm" onClick={exportCsv} loading={exporting}>
                {!exporting && <Download className="size-4" aria-hidden />} Export
              </Button>
            )}
          </div>
        </div>
      )}

      {summary && <div className="border-b border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft">{summary}</div>}

      {showSelection && selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-brand-50 px-3 py-2">
          <span className="text-[13px] font-medium text-brand-800">{selected.length} selected</span>
          {bulkActions.map((action) => (
            <Button key={action.id} size="xs" variant={action.tone === "danger" ? "danger-outline" : "secondary"} onClick={() => trigger(action, selected)} disabled={running}>
              {action.label}
            </Button>
          ))}
          <Button size="xs" variant="ghost" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      )}

      <div className="relative">
        {pending && (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-10" aria-live="polite">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-sm">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Loading…
            </span>
          </div>
        )}
        <div className={cn("hidden max-h-[70vh] overflow-auto scrollbar-thin md:block", pending && "opacity-55")}>
          <table className="w-full min-w-max border-separate border-spacing-0 text-left text-[13px]">
            <thead>
              <tr>
                {showSelection && (
                  <th scope="col" className="sticky top-0 z-10 w-10 border-b border-line bg-surface-muted px-3 py-2.5">
                    <Checkbox aria-label="Select all rows on this page" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? [...new Set([...selected, ...pageIds])] : selected.filter((sid) => !pageIds.includes(sid)))} />
                  </th>
                )}
                {showSerial && (
                  <th scope="col" className="sticky top-0 z-10 w-14 border-b border-line bg-surface-muted px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-ink-muted">
                    S.No.
                  </th>
                )}
                {visible.map((column, index) => {
                  const active = sortField === column.key;
                  const SortIcon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                      className={cn("sticky top-0 z-10 border-b border-line bg-surface-muted px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-ink-muted", index === 0 && "left-0 z-20", ["currency", "number", "percent"].includes(column.type) && "text-right", column.align === "right" && "text-right")}
                      style={column.width ? { width: column.width, maxWidth: column.width } : undefined}
                    >
                      {column.sortable ? (
                        <button type="button" onClick={() => sortBy(column)} className={cn("inline-flex items-center gap-1 hover:text-ink", active && "text-ink")}>
                          {column.label}
                          <SortIcon className="size-3.5" aria-hidden />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
                {hasRowActions && (
                  <th scope="col" className="sticky top-0 z-10 w-12 border-b border-line bg-surface-muted px-3 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const key = row[rowKey];
                const view = viewOf(row);
                const href = resolveHref(rowHref, row);
                const actions = rowActions.filter((a) => matchesWhen(a, row));
                return (
                  <tr key={key} className={cn("border-b border-line last:border-0 hover:bg-surface-muted", selected.includes(key) && "bg-brand-50/60")}>
                    {showSelection && (
                      <td className="border-b border-line px-3 py-2">
                        <Checkbox aria-label={`Select ${key}`} checked={selected.includes(key)} onChange={(e) => setSelected((s) => (e.target.checked ? [...s, key] : s.filter((x) => x !== key)))} />
                      </td>
                    )}
                    {showSerial && <td className={cn("border-b border-line bg-surface px-3 text-right align-middle text-ink-muted tabular", dense ? "py-2" : "py-3")}>{serialOf(index)}</td>}
                    {visible.map((column, ci) => (
                      <td
                        key={column.key}
                        className={cn("border-b border-line bg-surface px-3 align-middle text-ink-soft", dense ? "py-2" : "py-3", ci === 0 && "sticky left-0 z-[1]", ["currency", "number", "percent"].includes(column.type) && "text-right tabular", column.align === "right" && "text-right")}
                        style={{ maxWidth: column.width || 320 }}
                      >
                        {ci === 0 && href && !column.href && column.type !== "image" ? (
                          <Link href={href} className="block truncate font-medium text-brand-700 hover:underline">
                            {formatCellValue(column, view)}
                            {column.sub && view[column.sub] && <span className="block truncate text-xs font-normal text-ink-muted">{view[column.sub]}</span>}
                          </Link>
                        ) : (
                          <Cell column={column} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                        )}
                      </td>
                    ))}
                    {hasRowActions && <td className="border-b border-line px-3 py-2 text-right">{actionsMenu(key, actions)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={cn("md:hidden", pending && "opacity-55")}>
          {(showSelection || sortOptions.length > 0) && rows.length > 0 && (
            <div className="flex items-center gap-3 border-b border-line bg-surface-muted px-3 py-2">
              {showSelection && (
                <Checkbox label="Select all" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? [...new Set([...selected, ...pageIds])] : selected.filter((sid) => !pageIds.includes(sid)))} />
              )}
              {sortOptions.length > 0 && (
                <Select
                  aria-label="Sort by"
                  className="ml-auto w-auto max-w-[60%]"
                  value={sortField && sortDir ? `${sortField}:${sortDir}` : ""}
                  options={sortOptions}
                  placeholder="Sort: default"
                  onChange={(e) => setParams({ sort: e.target.value }, { resetPage: false })}
                />
              )}
            </div>
          )}
          <ul className="divide-y divide-line">
            {rows.map((row, index) => {
              const key = row[rowKey];
              const view = viewOf(row);
              const href = resolveHref(rowHref, row);
              const actions = rowActions.filter((a) => matchesWhen(a, row));
              const [lead, ...rest] = visible;
              return (
                <li key={key} className={cn("px-3 py-3", selected.includes(key) && "bg-brand-50/60")}>
                  <div className="flex items-start gap-2.5">
                    {showSelection && (
                      <Checkbox className="mt-0.5" aria-label={`Select ${key}`} checked={selected.includes(key)} onChange={(e) => setSelected((s) => (e.target.checked ? [...s, key] : s.filter((x) => x !== key)))} />
                    )}
                    {showSerial && <span className="shrink-0 pt-px text-xs text-ink-muted tabular">{serialOf(index)}.</span>}
                    <div className="min-w-0 flex-1 text-sm">
                      {lead &&
                        (href && !lead.href && lead.type !== "image" ? (
                          <Link href={href} className="block font-medium break-words text-brand-700 hover:underline">
                            {formatCellValue(lead, view)}
                            {lead.sub && view[lead.sub] && <span className="block text-xs font-normal text-ink-muted">{view[lead.sub]}</span>}
                          </Link>
                        ) : (
                          <div className="font-medium text-ink">
                            <Cell column={lead} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                          </div>
                        ))}
                    </div>
                    {hasRowActions && <div className="-mt-1 -mr-1 shrink-0">{actionsMenu(key, actions)}</div>}
                  </div>
                  {rest.length > 0 && (
                    <dl className={cn("mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]", showSelection && "pl-7")}>
                      {rest.map((column) => (
                        <div key={column.key} className={cn("min-w-0", column.wrap && "col-span-2")}>
                          <dt className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">{column.label}</dt>
                          <dd className="mt-0.5 min-w-0 break-words text-ink-soft [&_.truncate]:whitespace-normal">
                            <Cell column={column} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {rows.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-3 py-2.5 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="tabular">
          {data.total === 0 ? "No results" : `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(data.total)}`}
        </p>
        <div className="flex items-center gap-2">
          <label className="hidden items-center gap-2 sm:flex">
            <span>Rows</span>
            <Select aria-label="Rows per page" className="w-20" value={String(data.pageSize)} options={pageSizes.map(String)} onChange={(e) => setParams({ pageSize: e.target.value })} />
          </label>
          <Button size="icon-sm" onClick={() => setParams({ page: data.page - 1 }, { resetPage: false })} disabled={data.page <= 1 || pending} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-20 text-center tabular">
            Page {data.page} / {data.pageCount}
          </span>
          <Button size="icon-sm" onClick={() => setParams({ page: data.page + 1 }, { resetPage: false })} disabled={data.page >= data.pageCount || pending} aria-label="Next page">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={(reason) => runAction(confirm?.action, confirm?.ids, reason)}
        title={confirm?.action.confirm?.title || confirm?.action.label}
        description={confirm ? (confirm.action.confirm?.description || "").replace("{count}", String(confirm.ids.length)) : ""}
        confirmLabel={confirm?.action.confirm?.confirmLabel || confirm?.action.label}
        tone={confirm?.action.tone === "danger" ? "danger" : "warning"}
        requireReason={confirm?.action.confirm?.requireReason}
        reasonOptions={confirm?.action.confirm?.reasonOptions}
        loading={running}
      />
    </div>
  );
}
