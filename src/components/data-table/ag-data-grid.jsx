"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Cell, formatCellValue, resolveHref } from "./cells";
import { ColumnFilter, columnFilterable, columnValueOptions } from "./column-filter";
import { ColumnMenu } from "./column-menu";

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * AG Grid view of <DataTable> (desktop). It is presentation only: every piece of state — sort (URL),
 * column filters, selection, line picks, actions — still lives in DataTable and is passed in. Sorting
 * stays server-side through the URL, so the grid's own sorting is switched off and the header renders
 * the same sort button and column filter as before.
 */

// Zoho Books-style list: uppercase grey headers without dividers, roomy rows, larger dark text.
export const gridTheme = themeQuartz.withParams({
  fontFamily: "inherit",
  backgroundColor: "var(--surface)",
  foregroundColor: "var(--ink)",
  textColor: "var(--ink)",
  headerBackgroundColor: "var(--surface-muted)",
  headerTextColor: "var(--ink-muted)",
  headerFontWeight: 600,
  headerFontSize: "var(--fs-label)",
  fontSize: "var(--fs-table)",
  borderColor: "var(--line)",
  rowBorder: { color: "var(--line)" },
  headerColumnBorder: false,
  columnBorder: false,
  // Short vertical divider at each header edge (also the resize handle); the filter / ⋮ sit beside it.
  headerColumnResizeHandleColor: "var(--line)",
  headerColumnResizeHandleHeight: "40%",
  headerColumnResizeHandleWidth: 2,
  rowHoverColor: "var(--surface-muted)",
  selectedRowBackgroundColor: "var(--brand-50)",
  accentColor: "var(--brand-600)",
  oddRowBackgroundColor: "var(--surface)",
  cellHorizontalPadding: 14,
  headerHeight: 46,
  rowHeight: 52,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  pinnedColumnBorder: { color: "var(--line)" },
});

const MAX_AUTO_WIDTH = 360; // auto-sized columns wrap beyond this (less on smaller screens, see stretch)

/** Determines whether a column can be sorted. Images, avatars, icons, and actions are never sortable. */
export function isColumnSortable(col) {
  if (!col) return false;
  if (col.sortable === false) return false;
  if (col.type === "image" || col.key === "image" || col.type === "avatar" || col.type === "photo" || col.type === "icon") return false;
  if (col.type === "actions" || col.key === "actions" || col.key === "__actions" || col.key === "__select" || col.key === "__serial") return false;
  return true;
}

/** Computes comfortable minimum width so column header labels and action icons never get truncated. */
function estimateHeaderWidth(col) {
  const label = typeof col.label === "string" ? col.label : col.key ?? "";
  if (col.type === "image" || col.key === "image") return Math.max(64, col.width || 64);
  const charWidth = label.length * 9;
  const isSortable = isColumnSortable(col);
  const sortWidth = isSortable ? 24 : 0;
  const filterWidth = 24;
  const menuWidth = 24;
  const padding = 34;
  const needed = Math.ceil(charWidth + sortWidth + filterWidth + menuWidth + padding);
  return Math.max(100, Math.min(360, needed));
}

// Kept as constants: a fresh object on every render makes AG Grid re-apply the column defaults, which
// throws away the fitted column widths (the table then shrinks back, leaving an empty band).
const DEFAULT_COL_DEF = { sortable: false, resizable: true, suppressMovable: false, suppressHeaderMenuButton: true, minWidth: 100 };
const ROW_SELECTION = { mode: "multiRow", checkboxes: false, headerCheckbox: false, enableClickSelection: false, enableSelectionWithoutKeys: false };
const GridState = createContext(null);
const useGrid = () => useContext(GridState);
const NUMERIC = ["currency", "number", "percent", "contributionMargin", "takeRate"];
const isRight = (col) => NUMERIC.includes(col.type) || col.align === "right";

/* ---------- headers ---------- */

function DataHeader({ col, api, column }) {
  const g = useGrid();
  // GridTable columns may draw their own header (e.g. a screen's own "select all" checkbox).
  const custom = g.renderHeader?.(col.key);
  if (custom !== undefined && custom !== null) return <span className={cn("flex w-full min-w-0 items-center", isRight(col) && "justify-end")}>{custom}</span>;
  return <DataHeaderInner col={col} api={api} column={column} />;
}

function DataHeaderInner({ col, api, column }) {
  const g = useGrid();
  const isSortable = isColumnSortable(col);
  const active = g.sortField === col.key;
  const SortIcon = !active ? ArrowUpDown : g.sortDir === "asc" ? ArrowUp : ArrowDown;
  const canFilter = g.columnFilters && columnFilterable(col);
  const right = isRight(col);
  // Server-filtered columns (e.g. orders' Pincode) filter every page through the URL, so they get no
  // checklist of the loaded page's values.
  const server = col.serverFilter && g.setServerFilter ? { value: g.serverFilterValue?.(col) ?? "", apply: (value) => g.setServerFilter(col, value) } : null;
  // Checklist values come from every loaded row (not only the ones left after other column filters).
  const source = g.filterRows ?? null;
  const options = useMemo(() => (canFilter && source && !col.serverFilter ? columnValueOptions(col, source, (row) => formatCellValue(col, row)) : null), [canFilter, source, col]);
  // Every data column shows its filter; only checkbox / action-button columns have none.
  const filterable = canFilter && !/^(actions?|select|__\w+)$/i.test(col.key);

  // Filter (horizontal bars) + ⋮ menu: shown on header hover, kept while a panel is open or a filter is on.
  const tools = (
    <div className="ml-1 flex shrink-0 items-center gap-0.5">
      {filterable && <ColumnFilter column={col} filter={g.colFilters[col.key]} options={options} server={server} onChange={(value) => g.setColFilter(col.key, value)} />}
      <ColumnMenu
        api={api}
        column={column}
        col={col}
        sortable={isSortable && Boolean(g.setSort)}
        sortDir={active ? g.sortDir : ""}
        onSort={g.setSort ? (dir) => g.setSort(col.key, dir) : undefined}
        allColumns={g.allColumns}
        hiddenKeys={g.hiddenKeys}
        onToggleColumn={g.onToggleColumn}
        onReset={g.resetColumns}
      />
    </div>
  );

  return (
    <div
      className="flex w-full min-w-0 items-center gap-1 text-label font-semibold tracking-[0.04em] uppercase select-none"
      aria-sort={active ? (g.sortDir === "asc" ? "ascending" : "descending") : undefined}
    >
      {/* Every column: name (and sort) on the left, filter + ⋮ on the right edge. */}
      <div className="mr-auto flex min-w-0">{isSortable ? (
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            g.sortBy(col);
          }}
          title={`Sort by ${col.label}`}
          className={cn(
            "group inline-flex min-w-0 items-center gap-1.5 tracking-[0.04em] uppercase whitespace-nowrap cursor-pointer transition-colors",
            active ? "text-ink font-bold" : "text-ink-muted hover:text-ink"
          )}
        >
          <span className="whitespace-nowrap">{col.label}</span>
          <SortIcon
            className={cn(
              "size-3.5 shrink-0 transition-all",
              active ? "text-brand-600 stroke-[2.5]" : "text-ink-muted/50 group-hover:text-ink group-hover:opacity-100"
            )}
            aria-hidden
          />
        </button>
      ) : (
        <span className="whitespace-nowrap text-ink-muted" title={col.label}>
          {col.label}
        </span>
      )}</div>
      {tools}
    </div>
  );
}

function SelectAllHeader() {
  const g = useGrid();
  return (
    <span className="flex w-full justify-center">
      <Checkbox
        aria-label="Select all rows on this page"
        checked={g.allChecked}
        onChange={(e) => g.setSelected(e.target.checked ? [...new Set([...g.selected, ...g.pageIds])] : g.selected.filter((sid) => !g.pageIds.includes(sid)))}
      />
    </span>
  );
}

const SerialHeader = () => <span className="w-full text-center text-label font-medium tracking-[0.02em] uppercase">S.No.</span>;

/** S.No. column width for the grid's width: slim on tablets, a little roomier on desktop. Draggable wider. */
const serialWidth = (gridWidth) => (gridWidth < 1024 ? 44 : gridWidth < 1280 ? 48 : 52);
const ActionsHeader = () => <span className="sr-only">Actions</span>;

/* ---------- cells ---------- */

function SelectCell({ data }) {
  const g = useGrid();
  const key = data[g.rowKey];
  return (
    <span className={cn("flex w-full justify-center", g.dense ? "pt-[14px] xl:pt-[18px]" : "pt-[18px] xl:pt-[22px]")}>
      <Checkbox aria-label={`Select ${key}`} checked={g.selected.includes(key)} onChange={(e) => g.setSelected((s) => (e.target.checked ? [...s, key] : s.filter((x) => x !== key)))} />
    </span>
  );
}

function SerialCell({ node }) {
  const g = useGrid();
  return <span className={cn("block w-full text-center text-ink-muted tabular", g.dense ? "py-3 xl:py-4" : "py-4 xl:py-5")}>{g.serialOf(node.rowIndex ?? 0)}</span>;
}

function DataCell({ data, col, lead }) {
  const g = useGrid();
  const key = data[g.rowKey];
  const view = g.viewOf(data);
  const href = lead ? resolveHref(g.rowHref, data) : null;
  return (
    <div className={cn("w-full min-w-0", g.dense ? "py-3 xl:py-4" : "py-4 xl:py-5", isRight(col) && "text-right tabular")}>
      {g.renderCell ? (
        // GridTable: the screen's own cell markup, looked up on every render so it follows live state.
        <div className={cn("min-w-0", !col.wrap && "truncate")}>{g.renderCell(col.key, data)}</div>
      ) : lead && href && !col.href && col.type !== "image" ? (
        <Link href={href} className="block truncate text-brand-700 hover:underline">
          {formatCellValue(col, view)}
          {col.sub && view[col.sub] && <span className="block truncate text-xs font-normal text-ink-muted">{view[col.sub]}</span>}
        </Link>
      ) : col.wrap ? (
        // Long wrapped text (e.g. pack-size stock, notes) is capped at 3 lines so one cell can't make the
        // whole row tall; hovering shows the full text.
        <div className="line-clamp-3" title={typeof view[col.key] === "string" ? view[col.key] : undefined}>
          <Cell column={col} row={view} activeLineId={g.picks[key]?.id} onPickLine={g.pickLine} />
        </div>
      ) : (
        <Cell column={col} row={view} activeLineId={g.picks[key]?.id} onPickLine={g.pickLine} />
      )}
    </div>
  );
}

/** Row "⋯" menu. Rendered in a portal (fixed position) so the grid's scroll areas never clip it. */
function ActionsCell({ data }) {
  const g = useGrid();
  const key = data[g.rowKey];
  const actions = g.actionsFor(data);
  const [box, setBox] = useState(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const close = useCallback(() => setBox(null), []);

  useEffect(() => {
    if (!box) return;
    const onDown = (e) => !panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target) && close();
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [box, close]);

  if (!actions.length) return null;
  const toggle = () => {
    if (box) return close();
    const r = btnRef.current.getBoundingClientRect();
    const height = actions.length * 36 + 8;
    const below = r.bottom + 6 + height < window.innerHeight;
    setBox({ top: below ? r.bottom + 6 : Math.max(8, r.top - 6 - height), left: Math.max(8, r.right - 208) });
  };
  const menuId = `row-actions-${String(key).replace(/[^\w-]/g, "_")}`;

  return (
    <span className={cn("flex w-full justify-end", g.dense ? "pt-2 xl:pt-3" : "pt-3 xl:pt-4")}>
      <Button ref={btnRef} variant="ghost" size="icon-sm" onClick={toggle} aria-label={`Actions for ${key}`} aria-haspopup="true" aria-expanded={Boolean(box)} aria-controls={box ? menuId : undefined}>
        <MoreHorizontal className="size-4" />
      </Button>
      {box &&
        createPortal(
          <div
            ref={panelRef}
            id={menuId}
            style={{ position: "fixed", top: box.top, left: box.left }}
            className="z-[65] w-52 animate-in rounded-lg border border-line bg-surface shadow-[var(--shadow-pop)] duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none"
          >
            <ul className="py-1">
              {actions.map((action) => (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      g.onTrigger(action, [key]);
                    }}
                    className={cn("w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted", action.tone === "danger" ? "text-danger-ink" : "text-ink")}
                  >
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </span>
  );
}

/* ---------- grid ---------- */

export function AgDataGrid({
  rows,
  columns,
  rowKey,
  rowHref,
  dense,
  pending,
  showSelection,
  showSerial,
  hasRowActions,
  selected,
  setSelected,
  pageIds,
  allChecked,
  sortField,
  sortDir,
  sortBy,
  columnFilters,
  colFilters,
  setColFilter,
  picks,
  pickLine,
  viewOf,
  serialOf,
  actionsFor,
  onTrigger,
  renderCell, // optional (GridTable): (columnKey, row) => cell content
  renderHeader, // optional (GridTable): (columnKey) => header content, or undefined for the label
  onRowClicked, // optional (GridTable): (row) => void — whole-row click, as some screens' tables had
  filterRows, // optional: every loaded row, for the filter checklists (rows may already be filtered)
  setSort, // optional: (columnKey, "asc" | "desc" | "") => void — column menu Sort Ascending / Descending
  allColumns, // optional: every column (shown or hidden), for the column menu's Choose Columns
  hiddenKeys, // optional: keys of the hidden columns
  onToggleColumn, // optional: (columnKey, show) => void
  onResetColumns, // optional: () => void — column menu Reset Columns (shows every default column again)
  serverFilterValue, // optional: (column) => its URL filter value, for columns with `serverFilter`
  setServerFilter, // optional: (column, value) => void — sets that URL filter (the API filters every page)
}) {
  const apiRef = useRef(null);
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const selectedRef = useRef(selected);
  const serialSized = useRef(false);

  const leadKey = columns[0]?.key;
  const columnDefs = useMemo(() => {
    const defs = [];
    if (showSelection)
      defs.push({ colId: "__select", headerComponent: SelectAllHeader, cellRenderer: SelectCell, width: 52, pinned: "left", resizable: false, suppressSizeToFit: true, suppressAutoSize: true, lockPosition: "left", lockPinned: true, suppressMovable: true });
    if (showSerial)
      // Slim S.No.: sized to the screen on every refit (serialWidth) until the user drags it wider or narrower.
      defs.push({ colId: "__serial", headerComponent: SerialHeader, cellRenderer: SerialCell, width: 52, minWidth: 40, maxWidth: 120, headerClass: "ba-serial", cellClass: "ba-serial", pinned: "left", resizable: true, suppressSizeToFit: true, suppressAutoSize: true, lockPosition: "left", lockPinned: true, suppressMovable: true });
    columns.forEach((col, i) => {
      const lead = col.key === leadKey;
      const minW = Math.max(estimateHeaderWidth(col), col.minWidth || 100);
      const explicitWidth = col.width ? Math.max(col.width, minW) : undefined;
      defs.push({
        colId: col.key,
        headerComponent: DataHeader,
        headerComponentParams: { col },
        cellRenderer: DataCell,
        cellRendererParams: { col, lead },
        pinned: lead && columns.length > 1 ? "left" : undefined,
        lockPinned: lead && columns.length > 1 ? true : undefined,
        autoHeight: true,
        minWidth: minW,
        ...(explicitWidth ? { width: explicitWidth, maxWidth: explicitWidth, suppressAutoSize: true, suppressSizeToFit: true } : {}),
        cellClass: "ba-cell",
      });
    });
    if (hasRowActions)
      defs.push({ colId: "__actions", headerComponent: ActionsHeader, cellRenderer: ActionsCell, width: 56, pinned: "right", resizable: false, suppressSizeToFit: true, suppressAutoSize: true, lockPosition: "right", lockPinned: true, suppressMovable: true });
    return defs;
  }, [columns, leadKey, showSelection, showSerial, hasRowActions]);

  const stretch = useCallback(() => {
    const api = apiRef.current;
    const wrap = wrapRef.current;
    if (!api || api.isDestroyed?.() || !wrap) return;

    const cols = api.getAllDisplayedColumns();
    // Room for the columns: the grid's width less its vertical scrollbar. Measured on the wrapper, so it
    // follows the screen (desktop, tablet, sidebar open or folded) on every refit.
    const scrollbar = wrap.querySelector(".ag-body-vertical-scroll")?.offsetWidth ?? 0;
    const width = wrap.clientWidth - scrollbar;
    if (width <= 0) return;

    const serialCol = api.getColumn("__serial");
    if (serialCol && !serialSized.current && serialCol.getActualWidth() !== serialWidth(width)) api.setColumnWidths([{ key: "__serial", newWidth: serialWidth(width) }], true);

    // Long auto-sized columns are capped to a share of the screen and wrap their text instead, so one
    // column (a product name, an address) can't push the rest off a tablet screen.
    const limit = Math.max(160, Math.min(MAX_AUTO_WIDTH, Math.round(width * (width < 1024 ? 0.34 : 0.3))));
    const capped = cols
      .filter((c) => !c.getColDef().suppressSizeToFit && c.getActualWidth() > Math.max(limit, c.getMinWidth()))
      .map((c) => ({ key: c.getColId(), newWidth: Math.max(limit, c.getMinWidth()) }));
    if (capped.length) api.setColumnWidths(capped, true);

    const stretchable = cols.filter((c) => !c.getColDef().suppressSizeToFit);
    const total = cols.reduce((sum, c) => sum + c.getActualWidth(), 0);
    const base = stretchable.reduce((sum, c) => sum + c.getActualWidth(), 0);
    if (!stretchable.length || !base) return;

    if (total < width) {
      const extra = width - total;
      let given = 0;
      const next = stretchable.map((c, i) => {
        const add = i === stretchable.length - 1 ? extra - given : Math.floor((extra * c.getActualWidth()) / base);
        given += add;
        return { key: c.getColId(), newWidth: c.getActualWidth() + add };
      });
      api.setColumnWidths(next, true);
    }
  }, []);

  const fit = useCallback(() => {
    const api = apiRef.current;
    if (!api || api.isDestroyed?.()) return;
    // Auto-size columns with skipHeader=false so every header title is fully legible
    api.autoSizeAllColumns(false);
    queueMicrotask(stretch);
  }, [stretch]);

  const onColumnResized = useCallback(
    (e) => {
      // A drag on the S.No. edge keeps that width; refits stop resizing it.
      if (e.finished && e.source === "uiColumnResized" && e.columns?.some((c) => c.getColId() === "__serial")) serialSized.current = true;
      if (!e.finished || e.source !== "autosizeColumns") return;
      const api = apiRef.current;
      if (!api || api.isDestroyed?.()) return;
      queueMicrotask(stretch);
    },
    [stretch],
  );
  const fitSoon = useCallback(() => requestAnimationFrame(() => requestAnimationFrame(fit)), [fit]);
  const getRowId = useCallback((p) => String(p.data[rowKey]), [rowKey]);

  // Height = header + rows, capped at 70vh (the old table's scroll box), so short pages have no empty area.
  // Attached once the grid has built its DOM (onGridReady), then follows every row-height change.
  useEffect(() => {
    if (!ready) return;
    const el = wrapRef.current?.querySelector(".ag-center-cols-container");
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setBodyHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  // Highlight selected rows by mirroring DataTable's selection onto AG Grid's row-selected state.
  // AG Grid only toggles a CSS class — no redraw, so a focused checkbox keeps focus. (Its own
  // checkboxes and click-to-select are off; DataTable still owns the selection.)
  const syncSelection = useCallback(() => {
    const api = apiRef.current;
    if (!api || api.isDestroyed?.()) return;
    const want = new Set(selectedRef.current.map(String));
    api.forEachNode((node) => {
      const on = Boolean(node.data) && want.has(String(node.data[rowKey]));
      if (node.isSelected() !== on) node.setSelected(on, false, "api");
    });
  }, [rowKey]);
  useEffect(() => {
    selectedRef.current = selected;
    syncSelection();
  }, [selected, syncSelection]);

  // Column menu "Reset Columns": original order, pinning and widths, then the default visible columns.
  const resetColumns = useCallback(() => {
    const api = apiRef.current;
    if (api && !api.isDestroyed?.()) api.resetColumnState();
    serialSized.current = false;
    onResetColumns?.();
    fitSoon();
  }, [onResetColumns, fitSoon]);

  const state = {
    filterRows,
    serverFilterValue,
    setServerFilter,
    setSort,
    allColumns,
    hiddenKeys,
    onToggleColumn,
    resetColumns,
    rowKey,
    rowHref,
    dense,
    selected,
    setSelected,
    pageIds,
    allChecked,
    sortField,
    sortDir,
    sortBy,
    columnFilters,
    colFilters,
    setColFilter,
    picks,
    pickLine,
    viewOf,
    serialOf,
    actionsFor,
    onTrigger,
    renderCell,
    renderHeader,
  };

  const height = Math.max(41, Math.min(typeof window !== "undefined" ? window.innerHeight * 0.7 : 600, 41 + bodyHeight + 14));

  return (
    <GridState.Provider value={state}>
      <div ref={wrapRef} className={cn("ba-grid transition-opacity", pending && "opacity-55")} style={{ height }}>
        <AgGridReact
          theme={gridTheme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={getRowId}
          rowSelection={ROW_SELECTION}
          onGridReady={(p) => {
            apiRef.current = p.api;
            setReady(true);
          }}
          onFirstDataRendered={() => {
            syncSelection();
            fitSoon();
          }}
          onRowDataUpdated={() => {
            syncSelection();
            fitSoon();
          }}
          onGridColumnsChanged={fitSoon}
          onColumnResized={onColumnResized}
          onGridSizeChanged={fitSoon}
          onRowClicked={onRowClicked ? (e) => e.data && onRowClicked(e.data) : undefined}
          rowClass={onRowClicked ? "cursor-pointer" : undefined}
          maintainColumnOrder
          suppressCellFocus
          enableCellTextSelection
          ensureDomOrder
          suppressNoRowsOverlay
          suppressRowTransform
          animateRows={false}
        />
      </div>
    </GridState.Provider>
  );
}
