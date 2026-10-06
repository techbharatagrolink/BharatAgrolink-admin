"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useApi } from "@/components/auth-provider";
import { errorMessage } from "@/lib/format";

const COLORS = ["#0088FE", "#00C49F", "#F59E0B"];
const MODES = [
  { mode: "cod", label: "COD" },
  { mode: "prepaid", label: "Prepaid" },
  { mode: "partial", label: "Partial" },
];

export function PaymentReport() {
  const request = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    Promise.all(MODES.map((item) => request("admin/orders", { query: { paymentMode: item.mode, limit: 1, page: 1 } })))
      .then((results) => {
        if (cancel) return;
        setData(MODES.map((item, index) => ({ label: item.label, value: results[index].meta?.total ?? 0 })));
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">COD vs Prepaid Report</h2>
      {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="mb-3 text-sm text-muted-foreground">Loading payment counts…</p> : null}
      <Card className="p-4 h-80">
        {!loading && total === 0 ? (
          <p className="text-sm text-muted-foreground">No COD, prepaid, or partial orders.</p>
        ) : null}
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" outerRadius={100}>
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </Card>
      {data.length > 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {data.map((item) => `${item.label} ${item.value}`).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
