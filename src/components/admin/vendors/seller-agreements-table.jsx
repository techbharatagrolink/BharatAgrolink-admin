"use client";

import { useMemo, useState, useTransition } from "react";
import { Eye, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { sellerAgreementsExportAction } from "@/lib/actions/admin/seller-agreements";
import { AgreementDocumentModal } from "./agreement-document-modal";

export function SellerAgreementsTable({ data }) {
  const { notify } = useToast();
  const [, startTransition] = useTransition();
  const [selectedSeller, setSelectedSeller] = useState(null);

  const columns = useMemo(
    () => [
      { key: "vendorName", label: "Seller", sortable: true, type: "text" },
      { key: "vendorId", label: "Vendor ID", sortable: true, type: "mono" },
      { key: "version", label: "Agreement Version", sortable: true, type: "mono" },
      { key: "currentVersion", label: "Current Version", sortable: true, type: "mono" },
      {
        key: "status",
        label: "Status",
        sortable: true,
        type: "status",
        render: (row) => (
          <StatusBadge
            status={row.status === "Accepted" ? "delivered" : row.needsUpdate ? "warning" : "pending"}
            dot
          >
            {row.status === "Accepted" ? "Accepted" : row.needsUpdate ? "Outdated Version" : "Pending"}
          </StatusBadge>
        ),
      },
      {
        key: "acceptedAt",
        label: "Accepted At",
        sortable: true,
        type: "datetime",
        render: (row) => (row.acceptedAt ? formatDateTime(row.acceptedAt) : <span className="text-ink-muted">—</span>),
      },
      {
        key: "signatory",
        label: "Signatory",
        sortable: true,
        type: "text",
        render: (row) => (
          <div>
            <span className="font-medium">{row.signatory}</span>
            {row.designation && <span className="block text-xs text-ink-muted">{row.designation}</span>}
          </div>
        ),
      },
      {
        key: "ipAddress",
        label: "IP Address",
        sortable: true,
        type: "mono",
        render: (row) => row.ipAddress || <span className="text-ink-muted">—</span>,
      },
      {
        key: "viewAgreement",
        label: "Document",
        sortable: false,
        render: (row) => (
          <Button
            size="xs"
            variant="secondary"
            className="inline-flex items-center gap-1.5 font-medium text-brand-700 hover:bg-brand-50 hover:text-brand-800"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSeller(row);
            }}
          >
            <Eye className="size-3.5" />
            View
          </Button>
        ),
      },
    ],
    []
  );

  const handleAction = (actionId, ids) => {
    if (actionId === "view") {
      const targetId = ids[0];
      const match = data.rows?.find((r) => r.id === targetId || r.vendorId === targetId);
      if (match) setSelectedSeller(match);
      return;
    }

    startTransition(async () => {
      if (actionId === "resend") {
        notify({ message: `Resent agreement to ${ids.length} seller(s).`, tone: "success" });
      }
    });
  };

  return (
    <>
      <DataTable
        id="seller-agreements"
        columns={columns}
        data={data}
        search={{ placeholder: "Search by seller name or vendor ID..." }}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "accepted", label: "Accepted" },
              { value: "pending", label: "Pending" },
              { value: "outdated", label: "Outdated Version" },
            ],
          },
        ]}
        dateRange
        pageSizes={[10, 25, 50, 100]}
        onAction={handleAction}
        rowActions={[
          { id: "view", label: "View Agreement Document" },
          {
            id: "resend",
            label: "Resend Agreement",
            kind: "confirm",
            tone: "secondary",
            confirm: {
              title: "Resend Agreement?",
              description: "Send the latest agreement version to {count} seller(s).",
              confirmLabel: "Resend",
            },
          },
        ]}
        onExport={sellerAgreementsExportAction}
        exportName="seller-agreements"
      />

      <AgreementDocumentModal
        seller={selectedSeller}
        open={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
      />
    </>
  );
}