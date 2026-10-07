"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/auth-provider";
import { errorMessage, presentOrder, statusVariant } from "@/lib/format";

export function OrdersList() {
  const request = useApi();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request("admin/orders", { query: { page, limit: 20, sort: "created", dir: "desc" } });
      setRows((result.data || []).map(presentOrder));
      setMeta(result.meta);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, request]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="mb-3 text-sm text-muted-foreground">Loading orders…</p> : null}
      <Card className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Invoice</th>
              <th className="text-left p-2">Items</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Payment</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={8}>
                  No orders yet.
                </td>
              </tr>
            ) : null}
            {rows.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.createdAt}</td>
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.invoice}</td>
                <td className="p-2">{order.items}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2">{order.payment}</td>
                <td className="p-2">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {meta ? (
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {meta.total} orders · page {meta.page} of {Math.max(meta.totalPages || 1, 1)}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={loading || page >= (meta.totalPages || 1)} onClick={() => setPage((current) => current + 1)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
