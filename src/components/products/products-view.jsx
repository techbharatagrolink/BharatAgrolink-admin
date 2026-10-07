"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber, formatPercent } from "@/lib/format";

export function ProductsView() {
  const request = useApi();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, stats] = await Promise.all([
        request("admin/products", { query: { q: query, status: statusFilter || undefined, page, limit: 20 } }),
        request("admin/products/summary"),
      ]);
      setRows(list.data || []);
      setMeta(list.meta);
      setSummary(stats.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query, request, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setQuery(q.trim());
            setStatusFilter(status);
          }}
        >
          <select
            aria-label="Product status"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Active and rejected</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Input
            placeholder="Search SKU / title"
            aria-label="Search products"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading products…</p> : null}

      <div>
        <h2 className="text-lg font-medium mb-2">Catalogue</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No products match this search.</TableCell>
              </TableRow>
            ) : null}
            {rows.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.sku || "—"}</TableCell>
                <TableCell>{product.title || "—"}</TableCell>
                <TableCell>{product.vendor || "—"}</TableCell>
                <TableCell>{formatINR(product.price)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {meta ? (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {formatNumber(meta.total)} products · page {meta.page} of {Math.max(meta.totalPages || 1, 1)}
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
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">SKU Mismatch</div>
          <div className="font-bold text-xl">{summary ? `${formatNumber(summary.duplicateSkus)} flagged` : "—"}</div>
          <p className="mt-1 text-xs text-muted-foreground">Active products that share a SKU.</p>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Low Stock</div>
          <div className="font-bold text-xl">{summary ? `${formatNumber(summary.lowStock)} SKUs` : "—"}</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
          {summary?.conversionRate == null ? (
            <>
              <div className="font-bold text-xl">Unavailable</div>
              <p className="mt-1 text-xs text-muted-foreground">Product views are not available, so conversion cannot be calculated.</p>
            </>
          ) : (
            <div className="font-bold text-xl">{formatPercent(summary.conversionRate)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
