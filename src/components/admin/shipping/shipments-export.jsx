"use client";

import { ExportButton } from "@/components/data-table/export-button";
import { exportShipmentsAction } from "@/lib/actions/admin/shipping";

const PARCEL_COLUMNS = [
  { label: "Order ID", value: (r) => r.orderId },
  { label: "Vendor", value: (r) => r.vendorName },
  { label: "Order date", value: (r) => r.orderDate },
  { label: "Invoice", value: (r) => r.invoiceNumber },
  { label: "Customer", value: (r) => r.customer },
  { label: "Destination", value: (r) => r.destination },
  { label: "Payment", value: (r) => r.paymentMode },
  { label: "Status", value: (r) => r.status },
  { label: "Line statuses", value: (r) => (r.statuses?.length > 1 ? r.statuses : "") },
  { label: "AWB", value: (r) => r.awb },
  { label: "Courier", value: (r) => r.courier || r.carrier },
  { label: "Tracking URL", value: (r) => r.trackingUrl },
  { label: "Amount (₹)", value: (r) => r.amount },
  { label: "Lines", value: (r) => r.lines },
  { label: "Qty", value: (r) => r.qty },
];

const SHIPROCKET_COLUMNS = [
  { label: "Channel order ID", value: (r) => r.channelOrderId },
  { label: "Shiprocket order ID", value: (r) => r.srOrderId },
  { label: "Shipment ID", value: (r) => r.shipmentId },
  { label: "AWB code", value: (r) => r.awb },
  { label: "Status", value: (r) => r.status },
  { label: "Courier", value: (r) => r.courier },
  { label: "Freight charges (₹)", value: (r) => r.freight },
  { label: "Created at", value: (r) => r.createdAt },
];

/** Export of every parcel (or Shiprocket order) for the tab and filters on screen. Super admins only. */
export { PARCEL_COLUMNS, SHIPROCKET_COLUMNS };

export function ShipmentsExport({ params }) {
  const shiprocket = params.tab === "shiprocket";
  return (
    <ExportButton
      name={`shipments-${params.tab}`}
      columns={shiprocket ? SHIPROCKET_COLUMNS : PARCEL_COLUMNS}
      load={() => exportShipmentsAction(params)}
      title={shiprocket ? "Every Shiprocket order for these filters (up to 2,000)" : "Every parcel in this tab for these filters"}
    />
  );
}
