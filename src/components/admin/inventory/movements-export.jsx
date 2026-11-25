"use client";

import { ExportButton } from "@/components/data-table/export-button";
import { exportStockMovementsAction } from "@/lib/actions/admin/inventory";
import { MOVEMENT_TYPES, actorLabel, reasonLabel } from "@/lib/content/admin/inventory";

const COLUMNS = [
  { label: "Movement ID", value: (m) => m.id },
  { label: "When", value: (m) => m.at },
  { label: "Product", value: (m) => m.productName },
  { label: "SKU", value: (m) => m.sku },
  { label: "What", value: (m) => MOVEMENT_TYPES[m.type] ?? m.type },
  { label: "On hand change", value: (m) => m.onHandDelta },
  { label: "Reserved change", value: (m) => m.reservedDelta },
  { label: "On hand after", value: (m) => m.onHandAfter },
  { label: "Reason", value: (m) => reasonLabel(m.reason) },
  { label: "Note", value: (m) => m.note },
  { label: "Reference type", value: (m) => m.referenceType },
  { label: "Reference ID", value: (m) => m.referenceId },
  { label: "By", value: (m) => actorLabel(m) },
];

/** Stock History export: every movement of the tab on screen, not only the loaded 100. Super admins only. */
export function MovementsExport({ view }) {
  return <ExportButton name={view === "opening" ? "stock-opening-balances" : "stock-history"} columns={COLUMNS} load={() => exportStockMovementsAction({ view })} />;
}
