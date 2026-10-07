"use client";

import { useEffect, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, formatPercent } from "@/lib/format";

const COLORS = ["#1b8a4b", "#e3a008", "#2f6fb5", "#c2410c", "#7c5cc4", "#156f3c"];

export function DashboardView() {
  const request = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    request("admin/dashboard")
      .then((result) => {
        if (!cancel) setStats(result.data);
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

  const weekly = (stats?.weekly || []).map((day) => ({ day: day.label, sales: day.sales, orders: day.orders }));
  const categories = stats?.topCategories || [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Business Dashboard</h1>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading dashboard…</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight break-words tabular-nums lg:text-2xl xl:text-3xl">{stats ? formatNumber(stats.totalOrders) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight break-words tabular-nums lg:text-2xl xl:text-3xl">{stats ? formatINR(stats.totalSales) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight break-words tabular-nums lg:text-2xl xl:text-3xl">{stats ? formatNumber(stats.activeVendors) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RTO %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight break-words tabular-nums lg:text-2xl xl:text-3xl">{stats ? formatPercent(stats.rtoPercent) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis width={48} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Line type="monotone" dataKey="sales" stroke="#1b8a4b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Loading…" : "No delivered category sales."}</p>
            ) : (
              <>
                <div className="mx-auto h-52 w-full max-w-[16rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categories} dataKey="sales" nameKey="name" outerRadius={78} stroke="var(--surface)" strokeWidth={2}>
                        {categories.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatINR(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {categories.map((entry, index) => (
                    <li key={entry.name} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-ink-soft">
                        <span className="size-2.5 shrink-0 rounded-sm" style={{ background: COLORS[index % COLORS.length] }} aria-hidden />
                        <span className="truncate">{entry.name}</span>
                      </span>
                      <span className="shrink-0 font-medium text-ink tabular-nums">{formatINR(entry.sales)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
