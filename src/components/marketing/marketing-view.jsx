"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatNumber, formatPercent } from "@/lib/format";

export function MarketingView() {
  const request = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/marketing")
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

  const sources = data?.sources || [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Marketing & Sales</h1>
        {data?.period ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Last 30 days ({data.period.from} to {data.period.to})
          </p>
        ) : null}
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading marketing…</p> : null}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ad Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Unavailable</div>
            <p className="mt-1 text-sm text-muted-foreground">Ad spend is not stored, so this stays blank.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Loading…" : "No orders in this period."}</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {sources.map((row) => (
                  <li key={row.source}>
                    {row.source} — {formatNumber(row.orders)} orders
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repeat Customer Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data ? formatPercent(data.repeatCustomerRate) : "—"}</div>
            {data ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatNumber(data.repeatOrders)} repeat orders of {formatNumber(data.orders)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unavailable. Campaign results are not stored, so ROI is not shown.</p>
        </CardContent>
      </Card>
    </div>
  );
}
