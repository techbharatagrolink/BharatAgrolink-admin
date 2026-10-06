"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, statusVariant } from "@/lib/format";

export function FinanceView() {
  const request = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/finance/summary")
      .then((result) => {
        if (!cancel) setData(result.data);
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
  }, [request]);

  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Finance & Payouts</h1>
        {data?.period ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Commission and GST are delivered orders from {data.period.from} to {data.period.to}.
          </p>
        ) : null}
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading finance…</p> : null}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Commission Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data ? formatINR(data.commissionCollected) : "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data ? formatINR(data.pendingPayouts) : "—"}</div>
            {data ? <p className="mt-1 text-xs text-muted-foreground">{formatNumber(data.pendingPayoutCount)} unpaid</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GST Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data ? formatINR(data.gstCollected) : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No payouts.</TableCell>
                </TableRow>
              ) : null}
              {transactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.vendor || "—"}</TableCell>
                  <TableCell>{row.type || "Payout"}</TableCell>
                  <TableCell>{formatINR(row.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
