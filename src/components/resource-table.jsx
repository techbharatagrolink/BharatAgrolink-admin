"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatWhen, inr } from "@/lib/format";

function cellText(row, column) {
  const value = row[column.key];
  if (column.money) return inr(value);
  if (column.date) return formatWhen(value);
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function ResourceTable({ path, columns, emptyLabel = "No records." }) {
  const request = useApi();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request(`admin${path}`, { query: { page: 1, pageSize: 25 } })
      .then((result) => {
        if (cancel) return;
        setRows(result.data?.rows || []);
        setTotal(result.data?.total ?? 0);
      })
      .catch((err) => {
        if (!cancel) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [path, request]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{total} records</p>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>{emptyLabel}</TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.badge ? <Badge variant="outline">{cellText(row, column)}</Badge> : cellText(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
