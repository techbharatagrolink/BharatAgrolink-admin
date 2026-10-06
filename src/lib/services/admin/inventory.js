import "server-only";
import { getStore } from "@/lib/mock/admin/store";
import { NOW, DAY } from "@/lib/mock/admin/seed";
import { mockLatency, sum } from "./_query";

/**
 * Inventory overview (Product Management dashboard stock sections 3–5).
 * Planned API: GET /api/admin/inventory/summary
 * Counts listings with product status 1 or 3, as the legacy queries do.
 */

export async function getInventorySummary() {
  await mockLatency();
  const s = getStore();
  const listed = s.products.filter((p) => [1, 3].includes(p.statusCode));
  const byVendor = new Map();
  for (const p of listed) {
    const row = byVendor.get(p.vendorId) ?? { id: p.vendorId, vendor: p.vendor, inStock: 0, lowStock: 0, outOfStock: 0, total: 0 };
    row.total++;
    if (p.stockStatus === "Out of Stock") row.outOfStock++;
    else if (p.stockStatus === "Low Stock") row.lowStock++;
    else row.inStock++;
    byVendor.set(p.vendorId, row);
  }
  const weekAgo = NOW - 7 * DAY;
  const recent = s.stockMovements.filter((m) => new Date(m.at).getTime() >= weekAgo);
  return {
    stats: {
      listed: listed.length,
      units: sum(listed, "stock"),
      inStock: listed.filter((p) => p.stockStatus === "In Stock").length,
      lowStock: listed.filter((p) => p.stockStatus === "Low Stock").length,
      outOfStock: listed.filter((p) => p.stockStatus === "Out of Stock").length,
      below50: listed.filter((p) => p.stock > 0 && p.stock < 50).length,
      movements7d: recent.length,
      manual7d: recent.filter((m) => m.type === "Manual adjustment").length,
    },
    vendors: [...byVendor.values()].sort((a, b) => b.total - a.total).slice(0, 10),
  };
}
