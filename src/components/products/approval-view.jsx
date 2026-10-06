"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber } from "@/lib/format";

export function ApprovalView() {
  const request = useApi();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await request("admin/products/approval", { query: { q: query, page, limit: 20 } });
      setRows(list.data || []);
      setMeta(list.meta);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query, request]);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(productId) {
    setBusyId(productId);
    setError("");
    try {
      await request(`admin/products/${encodeURIComponent(productId)}/approve`, { method: "POST" });
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Product Approval</h1>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setQuery(q.trim());
          }}
        >
          <Input
            placeholder="Search SKU / title"
            aria-label="Search approval queue"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading approval queue…</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No products are waiting for approval.</TableCell>
            </TableRow>
          ) : null}
          {rows.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku || "—"}</TableCell>
              <TableCell>{product.title || "—"}</TableCell>
              <TableCell>{product.vendor || "—"}</TableCell>
              <TableCell>{formatINR(product.price)}</TableCell>
              <TableCell>
                <Badge>{product.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" disabled={busyId === product.id} onClick={() => approve(product.id)}>
                  {busyId === product.id ? "Approving…" : "Approve"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {meta ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {formatNumber(meta.total)} waiting · page {meta.page} of {Math.max(meta.totalPages || 1, 1)}
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
  );
}
