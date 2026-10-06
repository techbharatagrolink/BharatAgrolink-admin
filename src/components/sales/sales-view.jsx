"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, formatWhen, statusVariant } from "@/lib/format";

function SalesCard({ title, bucket }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{bucket ? formatINR(bucket.amount) : "—"}</p>
        {bucket ? <p className="mt-1 text-xs text-muted-foreground">{formatNumber(bucket.orders)} orders</p> : null}
      </CardContent>
    </Card>
  );
}

export function SalesView() {
  const request = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/sales")
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

  const recent = data?.recent || [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Sales Management</h1>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading sales…</p> : null}

      <div className="grid md:grid-cols-3 gap-4">
        <SalesCard title="Today's Sales" bucket={data?.today} />
        <SalesCard title="This Week" bucket={data?.week} />
        <SalesCard title="This Month" bucket={data?.month} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No sales yet.</TableCell>
                </TableRow>
              ) : null}
              {recent.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.product || "—"}
                    <span className="block text-xs text-muted-foreground">
                      {row.orderId} · {formatWhen(row.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>{row.category || "—"}</TableCell>
                  <TableCell>{formatINR(row.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status || "—"}</Badge>
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
