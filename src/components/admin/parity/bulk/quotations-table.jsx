"use client";

import { useRef, useState } from "react";
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
  // React Compiler compares closed-over fields on every render. pending is null until a row action is chosen.
  const pendingRef = useRef(null);
  pendingRef.current = pending;
  const rows = Array.isArray(result?.rows) ? result.rows.filter((q) => q && q.id != null) : [];

  async function confirm() {
    const action = pendingRef.current;
    if (!action?.row?.id) return;
    setBusy(true);
    const res = action.kind === "delete" ? await deleteBulkQuotationAction(action.row.id) : await convertBulkQuotationAction(action.row.id);
    setBusy(false);
    setPending(null);
    notify({ message: res.ok ? res.data?.message ?? "Done." : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) router.refresh();
  }

  return (
    <Card>
      <CardHeader title="Quotations" />
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-ink-muted">No quotations match the filters.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto scrollbar-thin xl:block">
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
                {rows.map((q) => (
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

          <div className="space-y-3 p-3 xl:hidden">
            {rows.map((q) => (
              <div key={q.id} className="space-y-2.5 rounded-lg border border-line p-3 text-[13px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/admin/bulk-orders/quotations/${q.id}`} className="font-mono text-xs font-semibold text-brand-700 hover:underline">{q.quotationNumber}</Link>
                    <p className="mt-0.5 font-medium text-ink">{q.customerName || "—"}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Date</dt><dd className="text-ink">{formatDate(q.quotationDate)}</dd></div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Mobile</dt><dd className="text-ink">{q.customerMobile || "—"}</dd></div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Email</dt><dd className="truncate text-ink">{q.customerEmail || "—"}</dd></div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Company</dt><dd className="truncate text-ink">{q.customerCompany || "—"}</dd></div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Invoice</dt><dd className="text-ink tabular">{inr(q.invoiceValue)}</dd></div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Packages</dt><dd className="text-ink tabular">{q.noOfPackages}</dd></div>
                  <div>
                    <dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Converted</dt>
                    <dd>
                      {q.converted ? (
                        q.orderId ? (
                          <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(q.orderId)}`} className="text-brand-700 hover:underline">{q.orderId}</Link>
                        ) : (
                          <Badge tone="success">Converted</Badge>
                        )
                      ) : (
                        <Badge tone="neutral">No</Badge>
                      )}
                    </dd>
                  </div>
                  <div><dt className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Valid Until</dt><dd className="text-ink">{q.validUntil ? formatDate(q.validUntil) : "—"}</dd></div>
                </dl>
                <div className="flex gap-1 border-t border-line pt-2">
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
              </div>
            ))}
          </div>
        </>
      )}
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
