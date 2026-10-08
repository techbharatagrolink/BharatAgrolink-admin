"use client";

import { formatNumber } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { DataGrid } from "./data-grid";
import { formatStamp } from "./format";

const pct = (v) => `${(Number(v) || 0).toFixed(2)}%`;
const lastOrder = (row) => (row.lastOrderDate ? formatStamp(row.lastOrderDate, { time: false }) : "N/A");

function problemTone(v) {
  if (v >= 50) return "font-bold text-[#dc2626]";
  if (v >= 30) return "font-bold text-[#ea580c]";
  if (v >= 10) return "font-bold text-[#f59e0b]";
  return "font-bold text-[#10b981]";
}

function deliveryTone(v) {
  if (v >= 80) return "font-bold text-[#10b981]";
  if (v >= 60) return "font-bold text-[#f59e0b]";
  return "font-bold text-[#dc2626]";
}

const customer = { key: "fullname", label: "Customer", render: (r) => <span className="font-medium text-ink">{r.fullname || "N/A"}</span> };
const lastOrderColumn = { key: "lastOrderDate", label: "Last Order Date", render: lastOrder, filterValue: lastOrder };

const PROBLEM_COLUMNS = [
  { key: "rank", label: "#", index: true },
  customer,
  { key: "rtoCount", label: "Total RTO Orders", align: "right", className: () => "font-semibold text-[#dc2626]", render: (r) => formatNumber(r.rtoCount) },
  { key: "cancelledCount", label: "Total Cancelled Orders", align: "right", className: () => "font-semibold text-[#ea580c]", render: (r) => formatNumber(r.cancelledCount) },
  { key: "totalProblemOrders", label: "Total Problem Orders", align: "right", className: () => "font-bold text-[#ef4444]", render: (r) => formatNumber(r.totalProblemOrders) },
  { key: "totalOrders", label: "Total Orders", align: "right", render: (r) => formatNumber(r.totalOrders) },
  { key: "problemPercentage", label: "Problem Order %", align: "right", className: (r) => problemTone(r.problemPercentage), render: (r) => pct(r.problemPercentage), filterValue: (r) => pct(r.problemPercentage) },
  lastOrderColumn,
];

const TOP_COLUMNS = [
  { key: "rank", label: "#", index: true },
  customer,
  { key: "totalOrders", label: "Total Orders", align: "right", className: () => "text-[15px] font-bold text-[#3b82f6]", render: (r) => formatNumber(r.totalOrders) },
  { key: "deliveredCount", label: "Delivered", align: "right", className: () => "font-semibold text-[#10b981]", render: (r) => formatNumber(r.deliveredCount) },
  { key: "rtoCount", label: "RTO", align: "right", className: () => "font-semibold text-[#dc2626]", render: (r) => formatNumber(r.rtoCount) },
  { key: "cancelledCount", label: "Cancelled", align: "right", className: () => "font-semibold text-[#ea580c]", render: (r) => formatNumber(r.cancelledCount) },
  { key: "pendingCount", label: "Pending", align: "right", className: () => "font-semibold text-[#f59e0b]", render: (r) => formatNumber(r.pendingCount) },
  { key: "deliveryRate", label: "Delivery Rate", align: "right", className: (r) => deliveryTone(r.deliveryRate), render: (r) => pct(r.deliveryRate), filterValue: (r) => pct(r.deliveryRate) },
  { key: "totalAmount", label: "Total Amount", align: "right", render: (r) => `₹${(Number(r.totalAmount) || 0).toLocaleString("en-IN")}` },
  lastOrderColumn,
];

/** fraud_analysis_dashboard.php: the two customer grids. */
export function FraudTables({ problemCustomers, topCustomers }) {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader title="Customers with RTO/Cancelled Orders" />
        <DataGrid columns={PROBLEM_COLUMNS} rows={problemCustomers} caption="Customers with RTO or cancelled orders" empty="No customers with RTO or cancelled orders." />
      </Card>
      <Card>
        <CardHeader title="Customers with Most Orders" />
        <DataGrid columns={TOP_COLUMNS} rows={topCustomers} caption="Customers with most orders" empty="No customer orders yet." />
      </Card>
    </div>
  );
}
