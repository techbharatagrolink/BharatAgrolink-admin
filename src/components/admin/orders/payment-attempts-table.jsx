"use client";

import { useTransition } from "react";
import { formatDateTime, formatINR } from "@/lib/format";
import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { listPaymentAttemptsAction } from "@/lib/actions/admin/payment-attempts";

const statusColors = {
  "Payment Pending": "pending",
  "Payment Failed": "warning",
  "Payment Expired": "danger",
  "Payment Captured - Order Pending": "info",
  "Placed": "success",
};

const columns = [
  { key: "pendingOrderId", label: "Pending Order", sortable: true, type: "mono" },
  { key: "paymentMode", label: "Mode", sortable: true, type: "text", render: (row) => row.paymentMode?.toUpperCase() },
  { key: "amount", label: "Amount", sortable: true, type: "currency", render: (row) => formatINR(row.amount) },
  {
    key: "status",
    label: "Status",
    sortable: true,
    type: "status",
    render: (row) => <StatusBadge status={statusColors[row.status] || "neutral"} dot>{row.status}</StatusBadge>,
  },
  { key: "razorpayOrderId", label: "Razorpay Order", sortable: true, type: "mono", render: (row) => row.razorpayOrderId || <span className="text-ink-muted">—</span> },
  { key: "razorpayPaymentId", label: "Payment ID", sortable: true, type: "mono", render: (row) => row.razorpayPaymentId || <span className="text-ink-muted">—</span> },
  { key: "updatedAt", label: "Updated", sortable: true, type: "datetime" },
  { key: "failureReason", label: "Reason", sortable: false, type: "text", render: (row) => row.failureReason || <span className="text-ink-muted">—</span> },
];

export function PaymentAttemptsTable({ initialStatus = "" }) {
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const handleAction = (actionId, ids, rowData) => {
    startTransition(async () => {
      if (actionId === "retry") {
        notify({ message: `Retrying payment for ${ids.join(", ")}`, tone: "info" });
      } else if (actionId === "sync") {
        notify({ message: `Syncing paid order for ${ids.join(", ")}`, tone: "info" });
      }
    });
  };

  return (
    <DataTable
      id="payment-attempts"
      columns={columns}
      data={async (searchParams) => {
        const status = searchParams.get("status") || initialStatus || undefined;
        return listPaymentAttemptsAction({ status });
      }}
      search={{ placeholder: "Search by pending order ID..." }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Payment Pending", label: "Payment Pending" },
            { value: "Payment Failed", label: "Payment Failed" },
            { value: "Payment Expired", label: "Payment Expired" },
            { value: "Payment Captured - Order Pending", label: "Captured - Order Pending" },
            { value: "Placed", label: "Placed" },
          ],
        },
      ]}
      dateRange
      pageSizes={[10, 25, 50, 100]}
      onAction={handleAction}
      rowActions={[
        { id: "retry", label: "Retry Payment", kind: "confirm", tone: "success", confirm: { title: "Retry Payment?", description: "Open Razorpay checkout to retry payment for {count} attempt(s).", confirmLabel: "Retry" }, when: { in: ["Payment Failed", "Payment Expired"], field: "status" } },
        { id: "sync", label: "Sync Paid Order", kind: "confirm", tone: "secondary", confirm: { title: "Sync Paid Order?", description: "Sync the captured Razorpay payment and create the final order for {count} attempt(s).", confirmLabel: "Sync" }, when: { notIn: ["Placed"], field: "status" } },
      ]}
      onExport={async (params) => {
        const res = await listPaymentAttemptsAction(params);
        return { ok: true, rows: res.rows };
      }}
      exportName="payment-attempts"
    />
  );
}