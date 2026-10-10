/** vendor_product.stock_status values an admin can set. The storefront will not sell an "Out of Stock" offer even with quantity left. */
export const STOCK_STATUSES = ["In Stock", "Out of Stock"];

/** The status a product ends up with, the API's rule: quantity 0 is always Out of Stock. */
export function effectiveStockStatus(stock, chosen) {
  if (!(Number(stock) > 0)) return "Out of Stock";
  return chosen === "Out of Stock" ? "Out of Stock" : "In Stock";
}

/** A stored stock_status as one of STOCK_STATUSES (older rows hold "out_of_stock", "Low Stock" or nothing). */
export function toStockStatus(stored) {
  return /out/i.test(String(stored ?? "")) ? "Out of Stock" : "In Stock";
}
