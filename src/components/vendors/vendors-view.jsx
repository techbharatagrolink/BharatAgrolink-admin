"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/components/auth-provider";
import { errorMessage, formatINR, formatNumber } from "@/lib/format";

export function VendorsView() {
  const request = useApi();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, stats] = await Promise.all([
        request("admin/vendors", { query: { page, pageSize: 25 } }),
        request("admin/vendors/overview").catch((err) => ({ error: err })),
      ]);
      setRows(list.data?.rows || []);
      setTotal(list.data?.total ?? 0);
      setPageCount(list.data?.pageCount || 1);
      setOverview(stats.error ? { error: errorMessage(stats.error) } : stats.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, request]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Vendor Management</h1>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading vendors…</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>KYC</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Delivered GMV</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No vendors.</TableCell>
            </TableRow>
          ) : null}
          {rows.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name || "—"}</TableCell>
              <TableCell>
                <Badge variant="outline">{vendor.kyc || "—"}</Badge>
              </TableCell>
              <TableCell>{vendor.city || "—"}</TableCell>
              <TableCell>{formatNumber(vendor.orders)}</TableCell>
              <TableCell>{formatINR(vendor.gmv)}</TableCell>
              <TableCell>{vendor.status || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">
          {formatNumber(total)} vendors · page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={loading || page >= pageCount} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Settlement Pending</div>
          <div className="font-bold text-xl">{overview && !overview.error ? formatINR(overview.settlementPending) : "—"}</div>
          {overview && !overview.error ? (
            <p className="mt-1 text-xs text-muted-foreground">{formatNumber(overview.unpaidPayouts)} unpaid payouts</p>
          ) : null}
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">KYC Pending</div>
          <div className="font-bold text-xl">{overview && !overview.error ? formatNumber(overview.kycPending) : "—"}</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Avg Rating</div>
          {overview?.error ? (
            <p className="text-sm text-muted-foreground">{overview.error}</p>
          ) : !overview || loading ? (
            <div className="font-bold text-xl">—</div>
          ) : overview.avgRating == null ? (
            <>
              <div className="font-bold text-xl">Unavailable</div>
              <p className="mt-1 text-xs text-muted-foreground">No published product ratings.</p>
            </>
          ) : (
            <div className="font-bold text-xl">{Number(overview.avgRating).toFixed(2)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
