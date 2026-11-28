"use client";

import { useMemo, useState } from "react";
import { AgDataGrid, isColumnSortable } from "./ag-data-grid";
import { applyColumnFilters } from "./column-filter";
import { useTableColumns } from "./use-table-columns";

const noop = () => {};
const none = [];
const empty = {};
const same = (row) => row;
const serial = (i) => i + 1;

/**
 * The shared AG Grid (Zoho-style) look for screens that build their own table rows — Bulk orders,
 * Payment attempts, Manage role and other hand-made lists. The screen keeps its data, state and
 * actions; each column just says how to draw a cell:
 *
 *   <GridTable rowKey="id" rows={rows} columns={[
 *     { key: "order", label: "Order", render: (row, index) => <Link …>{row.orderId}</Link> },
 *     { key: "amount", label: "Amount", align: "right", render: (row) => inr(row.amount) },
 *     { key: "actions", label: "Actions", width: 140, render: (row) => <Button onClick={…} /> },
 *   ]} />
 *
 * Column options: key, label, header() (custom header content, e.g. a select-all checkbox),
 * render(row, index), align ("right"), width (px, fixed), wrap (allow
 * line breaks — on by default for text in the grid). Cells are re-drawn on every render of the
 * screen, so spinners, permissions and other live state show up as before. `rowKey` is a field name
 * or (row, index) => key; it is combined with the position, so repeated keys never clash.
 */
export function GridTable({
  id, // optional: names this table on its page for the session's column choice (defaults to its column keys)
  columns,
  rows = [],
  rowKey = "id",
  dense = true,
  onRowClick,
  sortable = true,
  columnFilters = true,
}) {
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [colFilters, setColFilters] = useState({});

  const sortBy = (col) => {
    if (!sortable || !isColumnSortable(col)) return;
    const key = col.key;
    if (sortField !== key) {
      setSortField(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField("");
      setSortDir("");
    }
  };

  // Column menu Sort Ascending / Descending ("" clears).
  const setSort = (key, dir) => {
    setSortField(dir ? key : "");
    setSortDir(dir || "");
  };

  const setColFilter = (key, value) => {
    setColFilters((curr) => ({ ...curr, [key]: value }));
  };

  const filteredRows = useMemo(() => {
    if (!columnFilters) return rows ?? [];
    return applyColumnFilters(rows ?? [], columns, colFilters);
  }, [rows, columns, colFilters, columnFilters]);

  const sortedRows = useMemo(() => {
    if (!sortField || !sortDir) return filteredRows;
    const col = columns.find((c) => c.key === sortField);
    return [...filteredRows].sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (col?.sortValue) {
        va = col.sortValue(a);
        vb = col.sortValue(b);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va ?? "").localeCompare(String(vb ?? ""), undefined, { numeric: true })
        : String(vb ?? "").localeCompare(String(va ?? ""), undefined, { numeric: true });
    });
  }, [filteredRows, sortField, sortDir, columns]);

  const data = useMemo(
    () =>
      sortedRows.map((row, index) => {
        const key = typeof rowKey === "function" ? rowKey(row, index) : row?.[rowKey];
        return { __id: `${key ?? ""}|${index}`, __row: row, __index: index };
      }),
    [sortedRows, rowKey],
  );

  // Column layout only changes when keys / labels / widths change — the grid keeps its sizing otherwise.
  const layout = JSON.stringify(
    columns.map(({ key, label, align, width, wrap, sortable: colSortable, filter, pin }) => ({
      key,
      filter,
      pin,
      label: typeof label === "string" ? label : "",
      align,
      width,
      wrap,
      sortable: colSortable ?? sortable,
    }))
  );
  const allMeta = useMemo(() => JSON.parse(layout), [layout]);

  // Columns shown (⋮ Choose Columns / Reset Columns), kept for this session like every admin table. A page can
  // have several hand-built tables, so each one is told apart by its column keys unless the screen passes `id`.
  const { hidden, setHidden, reset } = useTableColumns(id ?? `cols:${allMeta.map((c) => c.key).join(",")}`, allMeta);
  const meta = useMemo(() => {
    const shown = allMeta.filter((c) => !hidden.includes(c.key));
    return shown.length ? shown : allMeta;
  }, [allMeta, hidden]);
  // Checkbox and action-button columns always stay; the rest can be hidden.
  const choosable = useMemo(() => allMeta.filter((c) => c.label && !/^(actions?|select)$/i.test(c.key)), [allMeta]);
  const toggleColumn = (key, show) => setHidden((h) => (show ? h.filter((k) => k !== key) : [...new Set([...h, key])]));

  const byKey = new Map(columns.map((c) => [c.key, c]));
  const renderHeader = (key) => byKey.get(key)?.header?.();
  const renderCell = (key, d) => {
    const column = byKey.get(key);
    if (column?.render) return column.render(d.__row, d.__index);
    const value = d.__row?.[key];
    return value == null || value === "" ? <span className="text-ink-muted">—</span> : String(value);
  };

  return (
    <AgDataGrid
      rows={data}
      columns={meta}
      rowKey="__id"
      dense={dense}
      pending={false}
      showSelection={false}
      showSerial={false}
      hasRowActions={false}
      selected={none}
      setSelected={noop}
      pageIds={none}
      allChecked={false}
      sortField={sortField}
      sortDir={sortDir}
      sortBy={sortBy}
      columnFilters={columnFilters}
      colFilters={colFilters}
      setColFilter={setColFilter}
      picks={empty}
      pickLine={noop}
      viewOf={same}
      serialOf={serial}
      actionsFor={() => none}
      onTrigger={noop}
      renderCell={renderCell}
      renderHeader={renderHeader}
      onRowClicked={onRowClick ? (d) => onRowClick(d.__row, d.__index) : undefined}
      filterRows={columnFilters ? rows : undefined}
      setSort={sortable ? setSort : undefined}
      allColumns={choosable.length > 1 ? choosable : undefined}
      hiddenKeys={hidden}
      onToggleColumn={toggleColumn}
      onResetColumns={reset}
    />
  );
}
