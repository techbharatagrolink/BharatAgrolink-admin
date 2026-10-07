"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export function ResourceTable({ path, columns, emptyLabel = "No records.", query = {}, actions = [] }) {
  const request = useApi();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const queryKey = JSON.stringify(query);

  const load = useCallback(() => {
    let cancel = false;
    setLoading(true);
    setError("");
    request(`admin${path}`, { query: { page: 1, pageSize: 25, ...query } })
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
  }, [path, queryKey, request]);

  useEffect(() => load(), [load]);

  async function runAction(action, row) {
    setBusy(`${action.id}-${row.id}`);
    setError("");
    try {
      await request(`admin${path}/actions/${action.id}`, { method: "POST", body: { ids: [row.id] } });
      load();
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    } finally {
      setBusy("");
    }
  }

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
            {actions.length ? <TableHead className="text-right">Action</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions.length ? 1 : 0)}>{emptyLabel}</TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.badge ? <Badge variant="outline">{cellText(row, column)}</Badge> : cellText(row, column)}
                </TableCell>
              ))}
              {actions.length ? (
                <TableCell className="text-right">
                  {actions
                    .filter((action) => !action.when || action.when(row))
                    .map((action) => (
                      <Button key={action.id} type="button" size="sm" variant="outline" disabled={busy === `${action.id}-${row.id}`} onClick={() => runAction(action, row)}>
                        {busy === `${action.id}-${row.id}` ? "Saving…" : action.label}
                      </Button>
                    ))}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
