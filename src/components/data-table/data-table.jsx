"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startRouteProgress } from "@/components/admin/shell/route-progress";
import { useMemo, useState, useTransition } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Columns3, Copy, Download, FileSpreadsheet, FileText, LayoutGrid, LayoutList, Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Checkbox, Select } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { useCanExport } from "@/components/admin/shell/admin-user";
import { csvText, downloadCsv, downloadXlsx, exportFileName, formatExportDate } from "@/lib/csv";
import { Cell, formatCellValue, resolveHref } from "./cells";
import { ClearFiltersButton, FilterBar } from "./filter-bar";
import { applyColumnFilters, columnFilterActive } from "./column-filter";
import { useQueryState } from "./use-query-state";
import { AgDataGrid, isColumnSortable } from "./ag-data-grid";

const PAGE_SIZES = [10, 25, 50, 100];

function matchesWhen(action, row) {
  if (!action.when) return true;
  const value = row[action.when.field];
  if (action.when.in) return action.when.in.includes(value);
  if (action.when.notIn) return !action.when.notIn.includes(value);
  return true;
}

// Amounts, counts and percentages stay plain numbers in the file (no \u20b9, digit grouping or rounding to
// whole rupees) so Excel can add them up; the unit moves to the column header instead.
const NUMERIC_TYPES = new Set(["currency", "contributionMargin", "number", "percent", "takeRate"]);
const UNITS = { currency: "\u20b9", contributionMargin: "\u20b9", percent: "%", takeRate: "%" };

function csvHeader(column) {
  const unit = UNITS[column.type];
  return unit && !String(column.label).includes(unit) ? `${column.label} (${unit})` : column.label;
}

function csvValue(column, row) {
  const value = row[column.key];
  if (value == null || value === "") return "";
  if (NUMERIC_TYPES.has(column.type)) {
    const number = Number(value);
    return Number.isFinite(number) ? number : "";
  }
  if (column.type === "status") return column.labels?.[value] ?? String(value).replace(/_/g, " ");
  // Mobile numbers must be exported raw and unmasked so users get accurate data without asterisks
  if (column.type === "mobile") return String(value).replace(/\s+/g, " ").trim();
  if (column.type === "boolean") return value ? "Yes" : "No";
  if (column.type === "date" || column.type === "datetime" || /date|updated|created/i.test(column.key)) {
    return formatExportDate(value);
  }
  if (column.type === "mono" || !column.type) {
    if (value instanceof Date || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value))) {
      return formatExportDate(value);
    }
    return value;
  }
  const formatted = formatCellValue(column, row);
  if (formatted === "—" || formatted === "-" || formatted == null) return "";
  return formatted;
}

/** CSV text (with BOM) of `rows` under `columns`, as the table's Export writes it. */
export function toCsv(columns, rows) {
  return csvText(columns.map(csvHeader), rows.map((row) => columns.map((column) => csvValue(column, row))));
}

export function download(filename, text) {
  downloadCsv(filename, text);
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
  columnFilters = true,
  // Row checkboxes on every table (bulk export / copy IDs work everywhere). Pass false to hide them.
  selectable = true,
  // Resource lists: also offer the safe row actions in bulk (see `promoted` below).
  promoteRowActions = false,
}) {
  const router = useRouter();
  const { notify } = useToast();
  // Export and "Export selected" are for super admins only (the export actions re-check on the server).
  const canExport = useCanExport();
  const { get, setParams, pending } = useQueryState();
  const [selected, setSelected] = useState([]);
  const [picks, setPicks] = useState({});
  const [hidden, setHidden] = useState(() => columns.filter((c) => c.hidden).map((c) => c.key));
  const [showSerial, setShowSerial] = useState(serial);
  const [confirm, setConfirm] = useState(null);
  const [running, startRunning] = useTransition();
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const [colFilters, setColFilters] = useState({});

  const activeColFilterCount = useMemo(() => Object.values(colFilters).filter(columnFilterActive).length, [colFilters]);
  const isColFiltersEnabled = Boolean(columnFilters) || activeColFilterCount > 0;

  const visible = useMemo(() => columns.filter((c) => !hidden.includes(c.key)), [columns, hidden]);
  // Header filters match the loaded rows in the browser, so typing never reloads the page.
  const rows = useMemo(() => (isColFiltersEnabled ? applyColumnFilters(data.rows, columns, colFilters) : data.rows), [isColFiltersEnabled, data.rows, columns, colFilters]);
  const filteredCount = isColFiltersEnabled && columns.some((c) => columnFilterActive(colFilters[c.key])) ? rows.length : null;
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

  const exportSelected = async (format = "csv") => {
    if (format === "xlsx") {
      const headers = columns.map(csvHeader);
      const rowsData = selectedRows.map((row) => columns.map((column) => csvValue(column, row)));
      await downloadXlsx(exportFileName(`${exportName || id}-selected`, "xlsx"), headers, rowsData);
    } else {
      download(exportFileName(`${exportName || id}-selected`, "csv"), toCsv(columns, selectedRows));
    }
    notify({ message: `Exported ${formatNumber(selectedRows.length)} selected row${selectedRows.length === 1 ? "" : "s"} (${format.toUpperCase()}).` });
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

  const exportData = async (format = "csv") => {
    setExporting(true);
    try {
      let exportRows = rows;
      let truncated = false;
      let usedFallback = false;
      if (onExport) {
        try {
          const result = await onExport(Object.fromEntries(new URLSearchParams(window.location.search)));
          if (result?.ok && Array.isArray(result.rows)) {
            exportRows = columnFilters ? applyColumnFilters(result.rows, columns, colFilters) : result.rows;
            truncated = Boolean(result.truncated);
          } else {
            usedFallback = true;
          }
        } catch {
          usedFallback = true;
        }
      }
      const exportCols = visible.filter((c) => c.export !== false && c.key !== "actions");
      const headers = exportCols.map(csvHeader);
      const rowsData = exportRows.map((row) => exportCols.map((column) => csvValue(column, row)));
      const baseName = onExport && !usedFallback ? (exportName || id) : `${exportName || id}-page`;
      if (format === "xlsx") {
        await downloadXlsx(exportFileName(baseName, "xlsx"), headers, rowsData);
      } else {
        download(exportFileName(baseName, "csv"), csvText(headers, rowsData));
      }
      notify(
        truncated
          ? { message: `Exported the first ${formatNumber(exportRows.length)} rows (${format.toUpperCase()}). Narrow the filters to export the rest.`, tone: "info" }
          : { message: `Exported ${formatNumber(exportRows.length)} rows (${format.toUpperCase()}).`, tone: "success" },
      );
    } catch (error) {
      notify({ message: error.message || "Export failed.", tone: "error" });
    } finally {
      setExporting(false);
    }
  };

  // Column menu: explicit sort direction ("" clears), Choose Columns and Reset Columns.
  const setSort = (key, dir) => setParams({ sort: dir ? `${key}:${dir}` : "" }, { resetPage: false });
  const toggleColumn = (key, show) => setHidden((h) => (show ? h.filter((k) => k !== key) : [...new Set([...h, key])]));
  const resetColumns = () => {
    setHidden(columns.filter((c) => c.hidden).map((c) => c.key));
    setShowSerial(serial);
  };

  const sortBy = (column) => {
    if (!isColumnSortable(column)) return;
    const next = sortField !== column.key ? "desc" : sortDir === "desc" ? "asc" : "";
    setParams({ sort: next ? `${column.key}:${next}` : "" }, { resetPage: false });
  };

  const sortable = visible.filter(isColumnSortable);
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
        // Tablet and up: filters and buttons share one row and wrap onto the next when the screen is narrow.
        <div className={cn("flex flex-col gap-2 border-b border-line p-3 md:flex-row md:flex-wrap md:items-start", !inlineToolbar && "md:justify-between")}>
          {/* inlineToolbar: the toolbar sits right after the filters and "Clear filters" gets its own line */}
          {(search || filters.length > 0 || dateRange || !inlineToolbar) && (
            <FilterBar search={search} filters={filters} dateRange={dateRange} hideClear={inlineToolbar} className={cn("min-w-0", !inlineToolbar && "flex-1 md:min-w-[18rem]")} />
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
            <div className="hidden items-center rounded-lg border border-line bg-surface-muted p-0.5 sm:inline-flex" role="group" aria-label="View mode">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  viewMode === "grid" || viewMode === "auto" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
                )}
                title="AG Grid table view"
              >
                <LayoutGrid className="size-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  viewMode === "cards" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
                )}
                title="Cards view"
              >
                <LayoutList className="size-3.5" />
                <span>Cards</span>
              </button>
            </div>
            {toolbarEnd}
            {onExport !== undefined && canExport && (
              <Popover
                panelClassName="w-40"
                trigger={({ toggle, props }) => (
                  <Button size="sm" onClick={toggle} loading={exporting} {...props}>
                    {!exporting && <Download className="size-4" aria-hidden />} Export <ChevronDown className="size-3.5 opacity-70" aria-hidden />
                  </Button>
                )}
              >
                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      data-close
                      onClick={() => exportData("csv")}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                    >
                      <FileText className="size-4 text-ink-muted" /> CSV (.csv)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      data-close
                      onClick={() => exportData("xlsx")}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                    >
                      <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
                    </button>
                  </li>
                </ul>
              </Popover>
            )}
          </div>
          {inlineToolbar && <ClearFiltersButton className="md:basis-full" />}
        </div>
      )}

      {activeColFilterCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-brand-50/70 px-3 py-1.5 text-xs text-brand-800" role="status">
          <span>
            Filtered: <strong>{formatNumber(rows.length)}</strong> of {formatNumber(data.rows.length)} rows match {activeColFilterCount} column filter{activeColFilterCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => setColFilters({})}
            className="font-medium text-brand-700 underline hover:text-brand-900"
          >
            Clear column filters
          </button>
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
          {canExport && (
            <Popover
              panelClassName="w-44"
              trigger={({ toggle, props }) => (
                <Button size="xs" variant="secondary" onClick={toggle} disabled={selectedRows.length === 0} title={offPage > 0 ? "Exports the selected rows on this page" : undefined} {...props}>
                  <Download className="size-3.5" aria-hidden /> Export selected
                  {offPage > 0 && <span className="tabular opacity-75">({selectedRows.length})</span>}
                  <ChevronDown className="size-3 opacity-70" aria-hidden />
                </Button>
              )}
            >
              <ul className="py-1">
                <li>
                  <button
                    type="button"
                    data-close
                    onClick={() => exportSelected("csv")}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink hover:bg-surface-muted"
                  >
                    <FileText className="size-3.5 text-ink-muted" /> CSV (.csv)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-close
                    onClick={() => exportSelected("xlsx")}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink hover:bg-surface-muted"
                  >
                    <FileSpreadsheet className="size-3.5 text-success-ink" /> Excel (.xlsx)
                  </button>
                </li>
              </ul>
            </Popover>
          )}
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
        {/* AG Grid: interactive table view with column pinning, sorting, resizing, and filters. */}
        <div className={cn(viewMode === "grid" ? "block" : viewMode === "cards" ? "hidden" : "hidden md:block")}>
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
            columnFilters={isColFiltersEnabled}
            colFilters={colFilters}
            setColFilter={setColFilter}
            picks={picks}
            pickLine={pickLine}
            viewOf={viewOf}
            serialOf={serialOf}
            actionsFor={(row) => rowActions.filter((a) => matchesWhen(a, row))}
            onTrigger={trigger}
            filterRows={data.rows}
            setSort={setSort}
            allColumns={columns}
            hiddenKeys={hidden}
            onToggleColumn={toggleColumn}
            onResetColumns={resetColumns}
          />
        </div>

        <div className={cn(viewMode === "cards" ? "block" : viewMode === "grid" ? "hidden" : "md:hidden", pending && "opacity-55")}>
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

      {/* Footer: "Showing x–y of n" on the left, Rows + paging on the right, on one line from tablets up; it stays
          pinned to the bottom of the screen while a long table scrolls, so paging is always in reach. */}
      <div className="flex flex-col gap-2 rounded-b-xl border-t border-line bg-surface px-3 py-2.5 text-small text-ink-muted sm:sticky sm:bottom-0 sm:z-10 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between">
        <p className="min-w-0 text-center tabular sm:truncate sm:text-left">
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
        <div className="flex shrink-0 items-center gap-2 max-sm:w-full max-sm:justify-between">
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
