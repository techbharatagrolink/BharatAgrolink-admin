"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatNumber, formatPercent, statusVariant } from "@/lib/format";

export function LogisticsView() {
  const request = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/logistics")
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

  const couriers = data?.couriers || [];
  const recent = data?.recent || [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Logistics & Operations</h1>
        {data?.period ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Last 30 days ({data.period.from} to {data.period.to})
          </p>
        ) : null}
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading logistics…</p> : null}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Forward vs Reverse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">
              {data ? `Forward ${formatPercent(data.forwardPercent)} / Reverse ${formatPercent(data.reversePercent)}` : "—"}
            </div>
            {data ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatNumber(data.forward)} forward · {formatNumber(data.reverse)} reverse
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {couriers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Loading…" : "No courier shipments in this period."}</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {couriers.map((row) => (
                  <li key={row.courier}>
                    {row.courier} — {formatPercent(row.onTimeRate)} on-time · {formatPercent(row.successRate)} delivered
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">{data ? `Pincode coverage: ${formatNumber(data.pincodeCoverage)}` : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Recent Deliveries</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AWB</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && recent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No shipments.</TableCell>
              </TableRow>
            ) : null}
            {recent.map((row) => (
              <TableRow key={`${row.orderId}-${row.awb}`}>
                <TableCell>{row.awb || "—"}</TableCell>
                <TableCell>{row.courier || "—"}</TableCell>
                <TableCell>{row.zone || "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(row.status)}>{row.status || "—"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
