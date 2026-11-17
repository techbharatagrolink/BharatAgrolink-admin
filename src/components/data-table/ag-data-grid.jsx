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
import { ColumnFilter, columnFilterable } from "./column-filter";

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
  headerFontWeight: 500,
  headerFontSize: "var(--fs-label)",
  fontSize: "var(--fs-table)",
  borderColor: "var(--line)",
  rowBorder: { color: "var(--line)" },
  headerColumnBorder: false,
  columnBorder: false,
  headerColumnResizeHandleColor: "transparent",
  rowHoverColor: "var(--surface-muted)",
  selectedRowBackgroundColor: "var(--brand-50)",
  accentColor: "var(--brand-600)",
  oddRowBackgroundColor: "var(--surface)",
  cellHorizontalPadding: 14,
  headerHeight: 46,
  rowHeight: 52,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  pinnedColumnBorder: false,
});

const MAX_AUTO_WIDTH = 240; // auto-sized columns wrap beyond this (Zoho Books style)
// Kept as constants: a fresh object on every render makes AG Grid re-apply the column defaults, which
// throws away the fitted column widths (the table then shrinks back, leaving an empty band).
const DEFAULT_COL_DEF = { sortable: false, resizable: true, suppressMovable: true, suppressHeaderMenuButton: true };
const ROW_SELECTION = { mode: "multiRow", checkboxes: false, headerCheckbox: false, enableClickSelection: false, enableSelectionWithoutKeys: false };
const GridState = createContext(null);
const useGrid = () => useContext(GridState);
const NUMERIC = ["currency", "number", "percent"];
const isRight = (col) => NUMERIC.includes(col.type) || col.align === "right";

/* ---------- headers ---------- */

function DataHeader({ col }) {
  const g = useGrid();
  // GridTable columns may draw their own header (e.g. a screen's own "select all" checkbox).
  const custom = g.renderHeader?.(col.key);
  if (custom !== undefined && custom !== null) return <span className={cn("flex w-full min-w-0 items-center", isRight(col) && "justify-end")}>{custom}</span>;
  const active = g.sortField === col.key;
  const SortIcon = !active ? ArrowUpDown : g.sortDir === "asc" ? ArrowUp : ArrowDown;
  const filterable = g.columnFilters && columnFilterable(col);
  return (
    <span
      className={cn("flex w-full min-w-0 items-center gap-2 text-label font-medium tracking-[0.04em] uppercase", filterable ? "justify-between" : isRight(col) && "justify-end")}
      aria-sort={active ? (g.sortDir === "asc" ? "ascending" : "descending") : undefined}
    >
      {col.sortable ? (
        <button type="button" onClick={() => g.sortBy(col)} title={col.label} className={cn("inline-flex min-w-0 items-center gap-1 tracking-[0.04em] uppercase hover:text-ink", active && "text-ink")}>
          <span className="truncate">{col.label}</span>
          <SortIcon className={cn("size-3.5 shrink-0", active && "text-brand-600")} aria-hidden />
        </button>
      ) : (
        <span className="truncate" title={col.label}>
          {col.label}
        </span>
      )}
      {filterable && <ColumnFilter column={col} filter={g.colFilters[col.key]} onChange={(value) => g.setColFilter(col.key, value)} />}
    </span>
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

const SerialHeader = () => <span className="w-full text-right text-label font-medium tracking-[0.04em] uppercase">S.No.</span>;
const ActionsHeader = () => <span className="sr-only">Actions</span>;

/* ---------- cells ---------- */

function SelectCell({ data }) {
  const g = useGrid();
  const key = data[g.rowKey];
  return (
    <span className={cn("flex w-full justify-center", g.dense ? "pt-[18px]" : "pt-[22px]")}>
      <Checkbox aria-label={`Select ${key}`} checked={g.selected.includes(key)} onChange={(e) => g.setSelected((s) => (e.target.checked ? [...s, key] : s.filter((x) => x !== key)))} />
    </span>
  );
}

function SerialCell({ node }) {
  const g = useGrid();
  return <span className={cn("block w-full text-right text-ink-muted tabular", g.dense ? "py-4" : "py-5")}>{g.serialOf(node.rowIndex ?? 0)}</span>;
}

function DataCell({ data, col, lead }) {
  const g = useGrid();
  const key = data[g.rowKey];
  const view = g.viewOf(data);
  const href = lead ? resolveHref(g.rowHref, data) : null;
  return (
    <div className={cn("w-full min-w-0", g.dense ? "py-4" : "py-5", isRight(col) && "text-right tabular")}>
      {g.renderCell ? (
        // GridTable: the screen's own cell markup, looked up on every render so it follows live state.
        <div className={cn("min-w-0", !col.wrap && "truncate")}>{g.renderCell(col.key, data)}</div>
      ) : lead && href && !col.href && col.type !== "image" ? (
        <Link href={href} className="block truncate text-brand-700 hover:underline">
          {formatCellValue(col, view)}
          {col.sub && view[col.sub] && <span className="block truncate text-xs font-normal text-ink-muted">{view[col.sub]}</span>}
        </Link>
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
    <span className={cn("flex w-full justify-end", g.dense ? "pt-3" : "pt-4")}>
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
}) {
  const apiRef = useRef(null);
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const selectedRef = useRef(selected);

  const leadKey = columns[0]?.key;
  const columnDefs = useMemo(() => {
    const defs = [];
    if (showSelection)
      defs.push({ colId: "__select", headerComponent: SelectAllHeader, cellRenderer: SelectCell, width: 52, pinned: "left", resizable: false, suppressSizeToFit: true, suppressAutoSize: true });
    if (showSerial)
      defs.push({ colId: "__serial", headerComponent: SerialHeader, cellRenderer: SerialCell, width: 64, pinned: "left", resizable: false, suppressSizeToFit: true, suppressAutoSize: true });
    columns.forEach((col, i) => {
      const lead = col.key === leadKey;
      defs.push({
        colId: col.key,
        headerComponent: DataHeader,
        headerComponentParams: { col },
        cellRenderer: DataCell,
        cellRendererParams: { col, lead },
        pinned: lead && columns.length > 1 ? "left" : undefined,
        autoHeight: true,
        minWidth: 72,
        ...(col.width ? { width: col.width, maxWidth: col.width, suppressAutoSize: true, suppressSizeToFit: true } : {}),
        cellClass: "ba-cell",
      });
    });
    if (hasRowActions)
      defs.push({ colId: "__actions", headerComponent: ActionsHeader, cellRenderer: ActionsCell, width: 56, pinned: "right", resizable: false, suppressSizeToFit: true, suppressAutoSize: true });
    return defs;
  }, [columns, leadKey, showSelection, showSerial, hasRowActions]);

  // Column sizing runs in three steps. AG Grid applies "auto-size" asynchronously, so each step waits
  // for its columnResized event (source "autosizeColumns") before the next one — otherwise the late
  // auto-size lands after the stretch and the table shrinks back, leaving an empty band.
  //   1) size cells only (header ignored) → remember as each column's content width
  //   2) size including headers, capped at 240px
  //   3) stretch (or trim) to the table width — see `stretch` below
  const phaseRef = useRef(null);
  const contentRef = useRef({});
  const fit = useCallback(() => {
    const api = apiRef.current;
    if (!api || api.isDestroyed?.()) return;
    phaseRef.current = "content";
    api.autoSizeAllColumns(true);
  }, []);
  // Step 3 (only reads refs, so it is a stable callback).
  const stretch = useCallback(() => {
    const api = apiRef.current;
    const wrap = wrapRef.current;
    if (!api || api.isDestroyed?.() || !wrap) return;
    const contentWidth = contentRef.current;
    // Cap auto-sized columns at a Zoho-like 240px so long text wraps. Applied here rather than as a column
    // maxWidth, so the stretch below can still widen columns to fill the table.
    const cols = api.getAllDisplayedColumns();
    const tooWide = cols.filter((c) => !c.getColDef().suppressAutoSize && c.getActualWidth() > MAX_AUTO_WIDTH);
    if (tooWide.length) api.setColumnWidths(tooWide.map((c) => ({ key: c.getColId(), newWidth: MAX_AUTO_WIDTH })));
    const total = cols.reduce((sum, c) => sum + c.getActualWidth(), 0);
    // Room for columns, measured from the grid itself: the pinned areas plus the visible middle area
    // (which already leaves out the vertical scrollbar when rows exceed the height cap).
    const w = (sel, prop = "offsetWidth") => wrap.querySelector(sel)?.[prop] ?? 0;
    const width = w(".ag-pinned-left-cols-container") + w(".ag-center-cols-viewport", "clientWidth") + w(".ag-pinned-right-cols-container");
    if (width <= 0) return;
    // Widths are set directly with setColumnWidths: AG Grid's sizeColumnsToFit result did not stick
    // (columns fell back to their content width, leaving an empty band before the actions column).
    const stretchable = cols.filter((c) => !c.getColDef().suppressSizeToFit);
    const base = stretchable.reduce((sum, c) => sum + c.getActualWidth(), 0);
    if (!stretchable.length || !base) return;
    if (total < width) {
      // Fill the table: share the spare room in proportion to each column's width.
      const extra = width - total;
      let given = 0;
      const next = stretchable.map((c, i) => {
        const add = i === stretchable.length - 1 ? extra - given : Math.floor((extra * c.getActualWidth()) / base);
        given += add;
        return { key: c.getColId(), newWidth: c.getActualWidth() + add };
      });
      api.setColumnWidths(next, true);
    } else if (total < width * 1.35) {
      // Slightly too wide: trim columns towards a floor (their content, at most 140px — text wraps,
      // as in Zoho Books). Genuinely wide tables keep their horizontal scroll, as the old table did.
      const floor = (c) => Math.max(72, Math.min(140, contentWidth[c.getColId()] ?? 72));
      const spare = stretchable.reduce((sum, c) => sum + Math.max(0, c.getActualWidth() - floor(c)), 0);
      if (spare > 0) {
        const ratio = Math.min(1, (total - width) / spare);
        api.setColumnWidths(stretchable.map((c) => ({ key: c.getColId(), newWidth: Math.round(c.getActualWidth() - Math.max(0, c.getActualWidth() - floor(c)) * ratio) })), true);
      }
    }
  }, []);
  const onColumnResized = useCallback(
    (e) => {
      if (!e.finished || e.source !== "autosizeColumns") return;
      const api = apiRef.current;
      if (!api || api.isDestroyed?.()) return;
      if (phaseRef.current === "content") {
        contentRef.current = Object.fromEntries(api.getAllDisplayedColumns().map((c) => [c.getColId(), c.getActualWidth()]));
        phaseRef.current = "full";
        queueMicrotask(() => api.autoSizeAllColumns());
      } else if (phaseRef.current === "full") {
        phaseRef.current = null;
        queueMicrotask(stretch);
      }
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

  const state = {
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
