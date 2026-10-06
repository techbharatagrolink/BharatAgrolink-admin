"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi, useAuth } from "@/components/auth-provider";
import { apiDownload } from "@/lib/api";
import { errorMessage, presentOrder, statusVariant } from "@/lib/format";

const selectClass = "h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs";

function filtersQuery(filters, page) {
  return {
    q: filters.q,
    status: filters.status,
    paymentMode: filters.paymentMode,
    from: filters.date || undefined,
    to: filters.date || undefined,
    page,
    limit: 20,
    sort: "created",
    dir: "desc",
  };
}

export function OrdersOverview() {
  const request = useApi();
  const { session } = useAuth();
  const [draft, setDraft] = useState({ q: "", status: "", paymentMode: "", date: "" });
  const [filters, setFilters] = useState({ q: "", status: "", paymentMode: "", date: "" });
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = filtersQuery(filters, page);
      const [list, total, cod, prepaid, rto] = await Promise.all([
        request("admin/orders", { query }),
        request("admin/orders", { query: { limit: 1, page: 1 } }),
        request("admin/orders", { query: { limit: 1, page: 1, paymentMode: "cod" } }),
        request("admin/orders", { query: { limit: 1, page: 1, paymentMode: "prepaid" } }),
        request("admin/orders", { query: { limit: 1, page: 1, status: "RTO" } }),
      ]);
      setItems(list.data || []);
      setMeta(list.meta);
      const all = total.meta?.total ?? 0;
      const rtoCount = rto.meta?.total ?? 0;
      const codCount = cod.meta?.total ?? 0;
      const prepaidCount = prepaid.meta?.total ?? 0;
      const paymentTotal = codCount + prepaidCount;
      setSummary({
        codShare: paymentTotal ? Math.round((codCount / paymentTotal) * 100) : 0,
        prepaidShare: paymentTotal ? Math.round((prepaidCount / paymentTotal) * 100) : 0,
        rtoRate: all ? ((rtoCount / all) * 100).toFixed(1) : "0.0",
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, page, request]);

  useEffect(() => {
    request("admin/orders/meta")
      .then((result) => setStatuses(result.data?.manualStatuses || []))
      .catch(() => {});
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  async function onExport() {
    setExporting(true);
    setError("");
    try {
      const blob = await apiDownload("admin/orders/export.csv", {
        token: session?.token,
        query: { ...filtersQuery(filters, 1), page: undefined, limit: 5000 },
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  const rows = items.map(presentOrder);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setFilters(draft);
          }}
        >
          <Input
            placeholder="Search order id / customer"
            aria-label="Search orders"
            value={draft.q}
            onChange={(event) => setDraft((current) => ({ ...current, q: event.target.value }))}
          />
          <Button type="submit">Filter</Button>
          <Button type="button" variant="ghost" onClick={onExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export"}
          </Button>
        </form>
      </header>

      <div className="flex gap-3 flex-wrap">
        <Input
          type="date"
          aria-label="Order date"
          className="w-auto"
          value={draft.date}
          onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
        />
        <select
          aria-label="Order status"
          className={selectClass}
          value={draft.status}
          onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          aria-label="Payment method"
          className={selectClass}
          value={draft.paymentMode}
          onChange={(event) => setDraft((current) => ({ ...current, paymentMode: event.target.value }))}
        >
          <option value="">All Payments</option>
          <option value="cod">COD</option>
          <option value="prepaid">Prepaid</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading orders…</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No orders match these filters.</TableCell>
            </TableRow>
          ) : null}
          {rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.courier}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {order.trackingUrl ? (
                  <Button size="sm" variant="outline" asChild>
                    <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                      Track
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Track
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {meta.total} orders · page {meta.page} of {Math.max(meta.totalPages || 1, 1)}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || page >= (meta.totalPages || 1)}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">COD vs Prepaid</div>
          <div className="font-bold text-xl">{summary ? `COD ${summary.codShare}% / Prepaid ${summary.prepaidShare}%` : "—"}</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">RTO Rate</div>
          <div className="font-bold text-xl">{summary ? `${summary.rtoRate}%` : "—"}</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Avg Delivery Time</div>
          <div className="font-bold text-xl">Unavailable</div>
          <p className="mt-1 text-xs text-muted-foreground">The admin API does not return an average delivery time.</p>
        </div>
      </div>
    </div>
  );
}
