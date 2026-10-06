"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/auth-provider";
import { errorMessage, presentOrder } from "@/lib/format";

export function OrdersList() {
  const request = useApi();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/orders", { query: { page: 1, limit: 20, sort: "created", dir: "desc" } })
      .then((result) => {
        if (!cancel) setRows((result.data || []).map(presentOrder));
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="mb-3 text-sm text-muted-foreground">Loading orders…</p> : null}
      <Card className="p-4">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={5}>
                  No orders yet.
                </td>
              </tr>
            ) : null}
            {rows.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.createdAt}</td>
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2 font-medium">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
