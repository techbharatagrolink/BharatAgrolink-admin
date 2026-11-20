"use client";

import { GridTable } from "./grid-table";

/**
 * GridTable for already-drawn cells. Server pages can't hand render functions to a client component,
 * so MiniTable draws each cell first (on the server or client — wherever it runs) and passes the
 * finished elements here as rows of { __key, cells: { [columnKey]: node } }.
 */
export function StaticGrid({ columns, rows }) {
  return <GridTable rowKey="__key" rows={rows} columns={columns.map((c) => ({ ...c, render: (row) => row.cells[c.key] }))} />;
}
