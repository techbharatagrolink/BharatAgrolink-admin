"use client";

import { ArrowLeft } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useQueryState } from "@/components/data-table/use-query-state";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/page";
import { formatINR, formatNumber } from "@/lib/format";
import { ExportMenu, ITEM_EXPORT_FILTERS, PayoutFilters } from "./payout-summary-table";

/* The Export items sheet's main columns; the rest of the sheet is a column toggle away. */
const COLUMNS = [
  { key: "orderId", label: "Order ID", type: "mono", href: "/admin/orders/{orderId}" },
  { key: "vendorName", label: "Vendor", sub: "vendorId", width: 220, wrap: true },
  { key: "productSku", label: "Product SKU", width: 200, wrap: true },
  { key: "productName", label: "Product", width: 220, wrap: true, hidden: true },
  { key: "invoiceNumber", label: "Seller Invoice", hidden: true },
  { key: "balInvoiceNumber", label: "Bharat Agrolink Invoice", hidden: true },
  { key: "status", label: "Payment Status", type: "status" },
  { key: "cycleLabel", label: "Cycle" },
  { key: "cycleMovement", label: "Cycle Movement", width: 220, wrap: true, hidden: true },
  { key: "qty", label: "Qty", type: "number" },
  { key: "gross", label: "Total Order value", type: "currency" },
  { key: "serviceInclGst", label: "Service Charges Incl. GST", type: "currency", hidden: true },
  { key: "tcs", label: "TCS", type: "currency" },
  { key: "totalNrv", label: "Total NRV", type: "currency" },
  { key: "finalPayout", label: "Final seller Payout", type: "currency" },
  { key: "pendingPayout", label: "Pending Payment", type: "currency" },
  { key: "customerPaymentType", label: "Customer Payment", hidden: true },
  { key: "awbNumber", label: "AWB Number", type: "mono", hidden: true },
  { key: "transactionId", label: "Transaction ID", type: "mono" },
  { key: "transactionDate", label: "Transaction Date", type: "datetime", hidden: true },
  { key: "deliveryDate", label: "Delivery Date", type: "date" },
];

const ROW_ACTIONS = [
  { id: "payout", label: "Open vendor payout", href: "/admin/payouts/{payoutId}" },
  { id: "order", label: "Open order", href: "/admin/orders/{orderId}" },
];

export function VendorItemsTable({ data, cycles }) {
  const { searchParams } = useQueryState();
  const payoutIds = searchParams.get("payoutIds") || "";
  const back = new URLSearchParams();
  for (const key of ITEM_EXPORT_FILTERS) if (searchParams.get(key)) back.set(key, searchParams.get(key));
  const backHref = back.toString() ? `/admin/payouts?${back.toString()}` : "/admin/payouts";
  const counts = data.counts ?? {};
  const cycleText = data.cycle ? data.cycle.cycles.map((c) => c.label).join(" + ") : "";

  const summary = (
    <span className="flex flex-wrap gap-x-4 gap-y-1 tabular">
      <span>
        Items <b className="text-ink">{formatNumber(data.total)}</b>
      </span>
      <span>
        Paid <b className="text-success-ink">{formatNumber(counts.paid ?? 0)}</b>
      </span>
      <span>
        Pending <b className="text-warning-ink">{formatNumber(counts.pending ?? 0)}</b>
      </span>
      <span>
        Pending payment <b className="text-warning-ink">{formatINR(data.pendingPayout)}</b>
      </span>
    </span>
  );

  return (
    <div className="min-w-0 space-y-4">
      {payoutIds && (
        <Notice title={`Selected vendors only (${formatNumber(payoutIds.split(",").length)})`}>
          These are the items of the vendors ticked on the summary. Go back to the summary to see every vendor.
        </Notice>
      )}
      {data.cycle && <Notice title={`Cycle: ${cycleText}`}>Only the items in this payout cycle are listed.</Notice>}
      <DataTable
        id="vendor-payout-items"
        columns={COLUMNS}
        data={data}
        inlineToolbar
        toolbarEnd={
          <ButtonLink href={backHref} size="sm">
            <ArrowLeft className="size-4" aria-hidden /> Vendor summary
          </ButtonLink>
        }
        toolbar={
          <>
            <PayoutFilters cycles={cycles} />
            <ExportMenu label="Export items" title="These items as a sheet" path="/admin/payouts/items-export" filters={ITEM_EXPORT_FILTERS} payoutIds={payoutIds ? payoutIds.split(",") : []} />
          </>
        }
        rowActions={ROW_ACTIONS}
        summary={summary}
        emptyTitle="No payout items found"
        emptyDescription="No vendor has payout items with these filters."
      />
    </div>
  );
}
