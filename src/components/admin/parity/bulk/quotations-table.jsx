"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Repeat, Trash2 } from "lucide-react";
import { convertBulkQuotationAction, deleteBulkQuotationAction } from "@/lib/actions/admin/parity/bulk";
import { formatDate, inr } from "@/lib/format";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { BulkPager } from "./bulk-list";

/** quotations.php grid with view, convert-to-order and delete. */
export function BulkQuotationsTable({ result, query, canEdit, canDelete }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    const res = pending.kind === "delete" ? await deleteBulkQuotationAction(pending.row.id) : await convertBulkQuotationAction(pending.row.id);
    setBusy(false);
    setPending(null);
    notify({ message: res.ok ? res.data.message ?? "Done." : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) router.refresh();
  }

  return (
    <Card>
      <CardHeader title="Quotations" />
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-max text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-xs text-ink-muted">
              {["Quotation #", "Date", "Customer", "Mobile", "Email", "Company", "Invoice", "Packages", "Status", "Converted", "Valid Until", ""].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-ink-muted">
                  No quotations match the filters.
                </td>
              </tr>
            )}
            {result.rows.map((q) => (
              <tr key={q.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2 font-mono text-xs">
                  <Link href={`/admin/bulk-orders/quotations/${q.id}`} className="text-brand-700 hover:underline">
                    {q.quotationNumber}
                  </Link>
                </td>
                <td className="px-3 py-2 text-xs">{formatDate(q.quotationDate)}</td>
                <td className="px-3 py-2 font-medium text-ink">{q.customerName || "—"}</td>
                <td className="px-3 py-2">{q.customerMobile || "—"}</td>
                <td className="px-3 py-2">{q.customerEmail || "—"}</td>
                <td className="px-3 py-2">{q.customerCompany || "—"}</td>
                <td className="px-3 py-2 tabular">{inr(q.invoiceValue)}</td>
                <td className="px-3 py-2 tabular">{q.noOfPackages}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-3 py-2">
                  {q.converted ? (
                    q.orderId ? (
                      <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(q.orderId)}`} className="text-brand-700 hover:underline">
                        {q.orderId}
                      </Link>
                    ) : (
                      <Badge tone="success">Converted</Badge>
                    )
                  ) : (
                    <Badge tone="neutral">No</Badge>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">{q.validUntil ? formatDate(q.validUntil) : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Link href={`/admin/bulk-orders/quotations/${q.id}`} className={buttonClasses({ size: "icon-sm", variant: "ghost" })} aria-label={`View ${q.quotationNumber}`}>
                      <Eye className="size-4" aria-hidden />
                    </Link>
                    {canEdit && !q.converted && (
                      <Button size="icon-sm" variant="ghost" onClick={() => setPending({ kind: "convert", row: q })} aria-label={`Convert ${q.quotationNumber} to order`}>
                        <Repeat className="size-4" aria-hidden />
                      </Button>
                    )}
                    {canDelete && !q.converted && (
                      <Button size="icon-sm" variant="ghost" onClick={() => setPending({ kind: "delete", row: q })} aria-label={`Delete ${q.quotationNumber}`}>
                        <Trash2 className="size-4 text-danger-ink" aria-hidden />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BulkPager result={result} query={query} />
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={confirm}
        loading={busy}
        tone={pending?.kind === "delete" ? "danger" : "primary"}
        title={pending?.kind === "delete" ? `Delete quotation ${pending?.row.quotationNumber}?` : `Convert ${pending?.row.quotationNumber ?? ""} to an order?`}
        description={
          pending?.kind === "delete"
            ? "The quotation, its items and packages are removed."
            : "A Shiprocket Cargo order is created from this quotation with its saved courier partner and mode."
        }
        confirmLabel={pending?.kind === "delete" ? "Delete" : "Convert"}
      />
    </Card>
  );
}
