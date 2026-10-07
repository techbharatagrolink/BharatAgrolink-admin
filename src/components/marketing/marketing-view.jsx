"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, formatPercent } from "@/lib/format";

const EMPTY_FORM = { bucket: "", amount: "", spendDate: "", campaign: "", vendor: "", invoice: "" };

export function MarketingView() {
  const request = useApi();
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(0);

  const load = useCallback(
    async (nextMonth) => {
      setLoading(true);
      setError("");
      try {
        const result = await request("admin/marketing", { query: nextMonth ? { month: nextMonth } : {} });
        setData(result.data);
        if (!nextMonth && result.data?.expenses?.month) setMonth(result.data.expenses.month);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  useEffect(() => {
    load(month);
  }, [load, month]);

  const sources = data?.sources || [];
  const expenses = data?.expenses;
  const buckets = (expenses?.buckets || []).filter((row) => !row.auto);

  async function onSave(event) {
    event.preventDefault();
    if (!expenses?.month) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await request("admin/marketing/expenses", {
        method: "POST",
        body: {
          month: expenses.month,
          bucket: form.bucket,
          amount: Number(form.amount),
          spendDate: form.spendDate,
          campaign: form.campaign,
          vendor: form.vendor,
          invoice: form.invoice,
        },
      });
      setData((current) => ({ ...current, expenses: result.data }));
      setForm(EMPTY_FORM);
      setNotice("Spend entry saved.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const result = await request(`admin/marketing/expenses/${id}`, { method: "DELETE" });
      setData((current) => ({ ...current, expenses: result.data }));
      setNotice("Entry removed.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(0);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Marketing</h1>
          {data?.period ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Repeat rate and sources are the last 30 days ({data.period.from} to {data.period.to}). Spend is booked by month.
            </p>
          ) : null}
        </div>
        <Input
          type="month"
          aria-label="Spend month"
          className="w-auto"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
        />
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading marketing…</p> : null}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Repeat customer rate</CardTitle>
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
            <CardTitle>Marketing spend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !expenses ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : expenses ? (
              <>
                <div className="text-2xl font-bold">{formatINR(expenses.total)}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatINR(expenses.manual)} entered · {expenses.couponFunded == null ? "coupon figure unavailable" : `${formatINR(expenses.couponFunded)} company coupons`}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">ROI is not shown. Campaign results are not stored.</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">Unavailable</div>
                <p className="mt-1 text-sm text-muted-foreground">This database has no marketing spend ledger.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {expenses ? (
        <div className="grid md:grid-cols-4 gap-3">
          {expenses.buckets
            .filter((row) => row.amount > 0 || row.auto)
            .map((row) => (
              <div key={row.key} className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">{row.label}{row.auto ? " (calculated)" : ""}</div>
                <div className="mt-1 font-semibold">{formatINR(row.amount)}</div>
              </div>
            ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Spend entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && !expenses ? <p className="text-sm text-muted-foreground">No spend ledger to list.</p> : null}
          {expenses ? (
            <>
              <form className="grid gap-2 md:grid-cols-6" onSubmit={onSave}>
                <select
                  aria-label="Spend category"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs md:col-span-2"
                  value={form.bucket}
                  required
                  onChange={(event) => setForm((current) => ({ ...current, bucket: event.target.value }))}
                >
                  <option value="">Category</option>
                  {buckets.map((row) => (
                    <option key={row.key} value={row.key}>
                      {row.label}
                    </option>
                  ))}
                </select>
                <Input aria-label="Amount" type="number" min="0.01" step="0.01" required placeholder="Amount" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
                <Input aria-label="Spend date" type="date" value={form.spendDate} onChange={(event) => setForm((current) => ({ ...current, spendDate: event.target.value }))} />
                <Input aria-label="Campaign" placeholder="Campaign" value={form.campaign} onChange={(event) => setForm((current) => ({ ...current, campaign: event.target.value }))} />
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Add spend"}
                </Button>
                <Input aria-label="Vendor" placeholder="Vendor" value={form.vendor} onChange={(event) => setForm((current) => ({ ...current, vendor: event.target.value }))} />
                <Input aria-label="Invoice" placeholder="Invoice" value={form.invoice} onChange={(event) => setForm((current) => ({ ...current, invoice: event.target.value }))} />
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Campaign / vendor</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>No marketing spend recorded for this month.</TableCell>
                    </TableRow>
                  ) : null}
                  {expenses.entries.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.spendDate || "—"}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{[row.campaign, row.vendor].filter(Boolean).join(" · ") || "—"}</TableCell>
                      <TableCell>{row.invoice || "—"}</TableCell>
                      <TableCell>{formatINR(row.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button type="button" size="sm" variant="outline" disabled={busyId === row.id} onClick={() => onDelete(row.id)}>
                          {busyId === row.id ? "Removing…" : "Remove"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
