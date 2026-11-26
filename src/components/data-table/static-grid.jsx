"use client";

import { useMemo } from "react";
import { textOf } from "@/lib/csv";
import { GridTable } from "./grid-table";

/**
 * GridTable for already-drawn cells. Server pages can't hand render functions to a client component,
 * so MiniTable draws each cell first (on the server or client — wherever it runs) and passes the
 * finished elements here as rows of { __key, cells: { [columnKey]: node } }.
 * Each row also gets the plain text of its cells under the column keys, so the header filter
 * checklist and sorting work on what the table shows.
 */
export function StaticGrid({ columns, rows }) {
  const withText = useMemo(
    () =>
      (rows ?? []).map((row) => {
        const text = {};
        for (const c of columns) {
          const cell = row.cells?.[c.key];
          const value = typeof cell === "number" ? cell : textOf(cell);
          text[c.key] = typeof value === "string" && /^-?[\d,]+(\.\d+)?$/.test(value.trim()) ? Number(value.replace(/,/g, "")) : value;
        }
        return { ...text, __key: row.__key, cells: row.cells };
      }),
    [rows, columns],
  );
  return <GridTable rowKey="__key" rows={withText} columns={columns.map((c) => ({ ...c, render: (row) => row.cells[c.key] }))} />;
}
