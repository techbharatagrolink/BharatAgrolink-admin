"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startRouteProgress } from "@/components/admin/shell/route-progress";
import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Columns3, Copy, Download, Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Checkbox, Select } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { Cell, formatCellValue, resolveHref } from "./cells";
import { ClearFiltersButton, FilterBar } from "./filter-bar";
import { applyColumnFilters, columnFilterActive } from "./column-filter";
import { useQueryState } from "./use-query-state";
import { AgDataGrid } from "./ag-data-grid";

const PAGE_SIZES = [10, 25, 50, 100];

function matchesWhen(action, row) {
  if (!action.when) return true;
  const value = row[action.when.field];
  if (action.when.in) return action.when.in.includes(value);
  if (action.when.notIn) return !action.when.notIn.includes(value);
  return true;
}

export function toCsv(columns, rows) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = columns.map((c) => escape(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => escape(c.type === "status" || c.type === "mono" || !c.type ? row[c.key] : formatCellValue(c, row))).join(","));
  return [header, ...body].join("\n");
}

export function download(filename, text) {
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
  toolbarEnd,
  inlineToolbar = false,
  emptyTitle = "No records found",
  emptyDescription = "Try changing the search or filters.",
  toolbar,
  summary,
  dense = true,
  pageSizes = PAGE_SIZES,
  serial = true,
  columnFilters = false,
  // Row checkboxes on every table (bulk export / copy IDs work everywhere). Pass false to hide them.
  selectable = true,
  // Resource lists: also offer the safe row actions in bulk (see `promoted` below).
  promoteRowActions = false,
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
  const [colFilters, setColFilters] = useState({});

  const visible = useMemo(() => columns.filter((c) => !hidden.includes(c.key)), [columns, hidden]);
  // Header filters match the loaded rows in the browser, so typing never reloads the page.
  const rows = useMemo(() => (columnFilters ? applyColumnFilters(data.rows, columns, colFilters) : data.rows), [columnFilters, data.rows, columns, colFilters]);
  const filteredCount = columnFilters && columns.some((c) => columnFilterActive(colFilters[c.key])) ? rows.length : null;
  const setColFilter = (key, value) => setColFilters((current) => ({ ...current, [key]: value }));
  const pageIds = rows.map((r) => r[rowKey]);
  const selectedOnPage = selected.filter((sid) => pageIds.includes(sid));
  const allChecked = rows.length > 0 && selectedOnPage.length === rows.length;
  const [sortField, sortDir] = (get("sort") || "").split(":");
  const showSelection = selectable || bulkActions.length > 0;
  const hasRowActions = rowActions.length > 0;
  // Selected rows loaded on this page (full records) and how many are selected on other pages.
  const selectedRows = rows.filter((r) => selected.includes(r[rowKey]));
  const offPage = selected.length - selectedRows.length;
  // Row actions also offered in bulk on resource lists. Only server actions that are safe to repeat:
  // not destructive (no danger tone / remove), no written reason, no form or picker, and not already
  // a bulk action. They post the same { ids } list the API's action endpoint already accepts, and the
  // server re-checks permission. Each runs only on selected rows where the row menu would offer it.
  const promoted = promoteRowActions
    ? rowActions.filter((a) => a.effect && !a.effect.remove && !a.href && a.kind !== "form" && !a.assign && a.tone !== "danger" && !a.confirm?.requireReason && !bulkActions.some((b) => b.id === a.id))
    : [];

  const exportSelected = () => {
    download(`${exportName || id}-selected-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(columns, selectedRows));
    notify({ message: `Exported ${formatNumber(selectedRows.length)} selected row${selectedRows.length === 1 ? "" : "s"}.` });
  };
  const copyIds = async () => {
    // Real record IDs for rows on this page (some tables use an internal row key); keys for the rest.
    const onPage = new Map(selectedRows.map((r) => [r[rowKey], r.id ?? r.orderId ?? r[rowKey]]));
    try {
      await navigator.clipboard.writeText(selected.map((k) => onPage.get(k) ?? k).join("\n"));
      notify({ message: `Copied ${formatNumber(selected.length)} ID${selected.length === 1 ? "" : "s"}.` });
    } catch {
      notify({ message: "Could not copy to the clipboard.", tone: "error" });
    }
  };

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
        const exported = columnFilters ? applyColumnFilters(result.rows, columns, colFilters) : result.rows;
        download(`${exportName || id}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(columns, exported));
        notify({ message: `Exported ${formatNumber(exported.length)} rows.` });
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
    <div className="min-w-0 rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
      {(search || filters.length > 0 || dateRange || toolbar || onExport !== undefined) && (
        <div className={cn("flex flex-col gap-2 border-b border-line p-3 xl:flex-row xl:items-start", inlineToolbar ? "xl:flex-wrap" : "xl:justify-between")}>
          {/* inlineToolbar: the toolbar sits right after the filters and "Clear filters" gets its own line */}
          {(search || filters.length > 0 || dateRange || !inlineToolbar) && (
            <FilterBar search={search} filters={filters} dateRange={dateRange} hideClear={inlineToolbar} className={cn("min-w-0", !inlineToolbar && "flex-1")} />
          )}
          {/* Phones: the action buttons form one even row of equal-width buttons (wrapping to a second row only
              when there are many). Wider custom toolbar pieces (filter groups, inputs) take a full row. */}
          <div
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-2",
              "ba-phone-actions",
              !inlineToolbar && "shrink-0",
            )}
          >
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
            {toolbarEnd}
            {onExport !== undefined && (
              <Button size="sm" onClick={exportCsv} loading={exporting}>
                {!exporting && <Download className="size-4" aria-hidden />} Export
              </Button>
            )}
          </div>
          {inlineToolbar && <ClearFiltersButton className="xl:basis-full" />}
        </div>
      )}

      {summary && <div className="border-b border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft">{summary}</div>}

      {showSelection && selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-brand-50 px-3 py-2" role="region" aria-label="Bulk actions">
          <span className="text-small font-medium text-brand-800">
            {selected.length} selected
            {offPage > 0 && <span className="font-normal text-brand-700"> ({formatNumber(offPage)} on other pages)</span>}
          </span>
          {bulkActions.map((action) => (
            <Button key={action.id} size="xs" variant={action.tone === "danger" ? "danger-outline" : "secondary"} onClick={() => trigger(action, selected)} disabled={running}>
              {action.label}
            </Button>
          ))}
          {promoted.map((action) => {
            const ids = selectedRows.filter((r) => matchesWhen(action, r)).map((r) => r[rowKey]);
            return (
              <Button
                key={`row-${action.id}`}
                size="xs"
                variant="secondary"
                onClick={() => trigger(action, ids)}
                disabled={running || ids.length === 0}
                title={ids.length === selected.length ? undefined : `Applies to ${ids.length} of the selected rows on this page (the ones where "${action.label}" is available).`}
              >
                {action.label}
                {ids.length !== selected.length && <span className="tabular opacity-75">({ids.length})</span>}
              </Button>
            );
          })}
          <Button size="xs" variant="secondary" onClick={exportSelected} disabled={selectedRows.length === 0} title={offPage > 0 ? "Exports the selected rows on this page" : undefined}>
            <Download className="size-3.5" aria-hidden /> Export selected
            {offPage > 0 && <span className="tabular opacity-75">({selectedRows.length})</span>}
          </Button>
          <Button size="xs" variant="secondary" onClick={copyIds}>
            <Copy className="size-3.5" aria-hidden /> Copy IDs
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      )}

      <div className="relative">
        {pending && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden bg-brand-100" aria-hidden>
            <div className="ui-indeterminate h-full w-2/5 rounded-full bg-brand-600" />
          </div>
        )}
        {pending && (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-10" aria-live="polite">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-sm">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Loading…
            </span>
          </div>
        )}
        {/* Desktop: AG Grid. All state below stays in this component; the grid only renders it. */}
        <div className="hidden xl:block">
          <AgDataGrid
            rows={rows}
            columns={visible}
            rowKey={rowKey}
            rowHref={rowHref}
            dense={dense}
            pending={pending}
            showSelection={showSelection}
            showSerial={showSerial}
            hasRowActions={hasRowActions}
            selected={selected}
            setSelected={setSelected}
            pageIds={pageIds}
            allChecked={allChecked}
            sortField={sortField}
            sortDir={sortDir}
            sortBy={sortBy}
            columnFilters={columnFilters}
            colFilters={colFilters}
            setColFilter={setColFilter}
            picks={picks}
            pickLine={pickLine}
            viewOf={viewOf}
            serialOf={serialOf}
            actionsFor={(row) => rowActions.filter((a) => matchesWhen(a, row))}
            onTrigger={trigger}
          />
        </div>

        <div className={cn("xl:hidden", pending && "opacity-55")}>
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
              const [lead, ...others] = visible;
              // The first status column rides in the card header (badge), the rest become label/value lines.
              const statusCol = others.find((column) => column.type === "status");
              // Fields with no value ("—" lines such as an unanswered "Admin reply") are left out of the phone card.
              const isEmpty = (column) => {
                const value = view[column.key];
                return value == null || value === "" || (Array.isArray(value) && value.length === 0);
              };
              const rest = others.filter((column) => column !== statusCol && !isEmpty(column));
              // Short values (counts, %, amounts, IDs) become compact 2-up tiles; long ones keep full-width lines.
              const isShort = (column) => !column.wrap && !column.sub && column.type !== "image" && typeof view[column.key] !== "object" && String(view[column.key]).length <= 12;
              // A lone short value is just a line (a single tile box looks odd).
              const shortOnes = rest.filter(isShort);
              const tiles = shortOnes.length > 1 ? shortOnes : [];
              const lines = rest.filter((column) => !tiles.includes(column));
              return (
                <li key={key} className={cn("px-3 py-3 transition-colors sm:px-4", selected.includes(key) && "bg-brand-50/60")}>
                  <div className="flex items-start gap-2.5">
                    {showSelection && (
                      <Checkbox className="mt-0.5" aria-label={`Select ${key}`} checked={selected.includes(key)} onChange={(e) => setSelected((s) => (e.target.checked ? [...s, key] : s.filter((x) => x !== key)))} />
                    )}
                    {showSerial && <span className="shrink-0 pt-px text-xs text-ink-muted tabular">{serialOf(index)}.</span>}
                    <div className="min-w-0 flex-1 text-table [&_.truncate]:whitespace-normal">
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
                    {statusCol && (
                      <div className="max-w-[45%] shrink-0 pt-px text-right">
                        <Cell column={statusCol} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                      </div>
                    )}
                    {hasRowActions && <div className="-mt-1 -mr-1 shrink-0">{actionsMenu(key, actions)}</div>}
                  </div>
                  {lines.length > 0 && (
                    <dl className="mt-2.5 grid gap-x-6 rounded-lg bg-surface-muted/60 px-3 py-1 text-table sm:grid-cols-2">
                      {lines.map((column) =>
                        column.wrap ? (
                          // Long text keeps a full-width block: label on top, text underneath.
                          <div key={column.key} className="min-w-0 border-b border-line/60 py-1.5 last:border-0 sm:col-span-2">
                            <dt className="text-small text-ink-muted">{column.label}</dt>
                            <dd className="mt-0.5 min-w-0 break-words text-ink [&_.truncate]:whitespace-normal">
                              <Cell column={column} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                            </dd>
                          </div>
                        ) : (
                          <div key={column.key} className="flex min-w-0 items-start justify-between gap-3 border-b border-line/60 py-1.5 last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0">
                            <dt className="max-w-[40%] shrink-0 pt-px text-small leading-snug text-ink-muted">{column.label}</dt>
                            <dd className="flex min-w-0 flex-1 justify-end text-right leading-snug break-words text-ink [&_.truncate]:whitespace-normal">
                              <Cell column={column} row={view} activeLineId={picks[key]?.id} onPickLine={pickLine} />
                            </dd>
                          </div>
                        ),
                      )}
                    </dl>
                  )}
                  {tiles.length > 0 && (
                    <dl className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line/60 bg-line/60 text-table sm:grid-cols-3">
                      {tiles.map((column, index) => (
                        <div key={column.key} className={cn("min-w-0 bg-surface-muted px-3 py-2", tiles.length % 2 === 1 && index === tiles.length - 1 && "col-span-2 sm:col-span-1")}>
                          <dt className="truncate text-small text-ink-muted">{column.label}</dt>
                          <dd className="mt-0.5 min-w-0 font-medium break-words text-ink tabular [&_.truncate]:whitespace-normal">
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
        {rows.length === 0 &&
          (filteredCount === 0 && data.rows.length > 0 ? (
            <EmptyState title="No matching rows" description="No row on this page matches the column filters." />
          ) : (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-3 py-2.5 text-small text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center tabular sm:text-left">
          {data.total === 0 ? "No results" : `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(data.total)}`}
          {filteredCount != null && (
            <>
              {" · "}
              <span className="font-medium text-brand-700">{formatNumber(filteredCount)} match column filters</span>{" "}
              <button type="button" onClick={() => setColFilters({})} className="font-medium underline hover:text-ink">
                Reset
              </button>
            </>
          )}
        </p>
        <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
          <label className="hidden items-center gap-2 sm:flex">
            <span>Rows</span>
            <Select aria-label="Rows per page" className="w-20" value={String(data.pageSize)} options={pageSizes.map(String)} onChange={(e) => setParams({ pageSize: e.target.value })} />
          </label>
          <Button size="icon-sm" className="max-sm:size-10" onClick={() => setParams({ page: data.page - 1 }, { resetPage: false })} disabled={data.page <= 1 || pending} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-20 text-center font-medium text-ink-soft tabular">
            Page {data.page} / {data.pageCount}
          </span>
          <Button size="icon-sm" className="max-sm:size-10" onClick={() => setParams({ page: data.page + 1 }, { resetPage: false })} disabled={data.page >= data.pageCount || pending} aria-label="Next page">
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
