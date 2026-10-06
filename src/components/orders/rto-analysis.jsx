"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApi } from "@/components/auth-provider";
import { errorMessage, presentOrder } from "@/lib/format";

const RTO_STATUSES = ["RTO", "RTO Delivered", "RTO/Exeption"];

export function RtoAnalysis() {
  const request = useApi();
  const [chart, setChart] = useState([]);
  const [responsible, setResponsible] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    Promise.all([
      request("admin/orders/rto-summary"),
      request("admin/orders", { query: { status: "RTO", limit: 20, page: 1, sort: "created", dir: "desc" } }),
    ])
      .then(([summary, list]) => {
        if (cancel) return;
        const counts = new Map((summary.data?.byStatus || []).map((row) => [row.status, row.orders]));
        setChart(RTO_STATUSES.map((status) => ({ reason: status, count: counts.get(status) || 0 })));
        setResponsible(summary.data?.byResponsible || []);
        setRows((list.data || []).map(presentOrder));
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">RTO Analysis</h2>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading RTO orders…</p> : null}
      <Card className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <XAxis dataKey="reason" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#ff6b6b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <p className="text-xs text-muted-foreground">Counts are orders that have a product in that status. Return reasons are not stored.</p>
      {responsible.length > 0 ? (
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-medium">Responsible party</h3>
          <ul className="space-y-1 text-sm">
            {responsible.map((row) => (
              <li key={row.responsible}>
                {row.responsible} — {row.orders}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card className="p-4">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Responsible</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr>
                <td className="p-2" colSpan={4}>
                  No RTO orders.
                </td>
              </tr>
            ) : null}
            {rows.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2">{order.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
