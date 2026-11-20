"use client";

import { useMemo } from "react";
import { AgDataGrid } from "./ag-data-grid";

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
export function GridTable({ columns, rows, rowKey = "id", dense = true, onRowClick }) {
  const data = useMemo(
    () =>
      (rows ?? []).map((row, index) => {
        const key = typeof rowKey === "function" ? rowKey(row, index) : row?.[rowKey];
        return { __id: `${key ?? ""}|${index}`, __row: row, __index: index };
      }),
    [rows, rowKey],
  );

  // Column layout only changes when keys / labels / widths change — the grid keeps its sizing otherwise.
  const layout = JSON.stringify(columns.map(({ key, label, align, width, wrap }) => ({ key, label: typeof label === "string" ? label : "", align, width, wrap })));
  const meta = useMemo(() => JSON.parse(layout), [layout]);

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
      sortField=""
      sortDir=""
      sortBy={noop}
      columnFilters={false}
      colFilters={empty}
      setColFilter={noop}
      picks={empty}
      pickLine={noop}
      viewOf={same}
      serialOf={serial}
      actionsFor={() => none}
      onTrigger={noop}
      renderCell={renderCell}
      renderHeader={renderHeader}
      onRowClicked={onRowClick ? (d) => onRowClick(d.__row, d.__index) : undefined}
    />
  );
}
