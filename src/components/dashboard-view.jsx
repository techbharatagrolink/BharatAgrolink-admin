"use client";

import { useEffect, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, formatPercent } from "@/lib/format";

const COLORS = ["#4F46E5", "#16A34A", "#DC2626", "#F59E0B", "#0E7490", "#7C3AED"];

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

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats ? formatNumber(stats.totalOrders) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats ? formatINR(stats.totalSales) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats ? formatNumber(stats.activeVendors) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RTO %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats ? formatPercent(stats.rtoPercent) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekly}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">{loading ? "Loading…" : "No delivered category sales."}</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="sales" nameKey="name" outerRadius={80} label>
                      {categories.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatINR(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
