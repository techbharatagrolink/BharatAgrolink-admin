/**
 * Labels for the Inventory Management screens (live central inventory, /admin/stock API).
 * Shared by server pages and client components.
 * Available to sell = on hand − reserved for open orders − safety stock.
 */

export const STOCK_STATUS = {
  IN_STOCK: { label: "In stock", tone: "success" },
  LOW_STOCK: { label: "Low stock", tone: "warning" },
  CRITICAL: { label: "Critical", tone: "danger" },
  OUT_OF_STOCK: { label: "Out of stock", tone: "danger" },
  UNAVAILABLE: { label: "Unavailable", tone: "neutral" },
  STOCK_NOT_CONFIGURED: { label: "Not set up", tone: "neutral" },
};

export const STATUS_OPTIONS = [
  { value: "IN_STOCK", label: "In stock" },
  { value: "LOW_STOCK", label: "Low stock" },
  { value: "CRITICAL", label: "Critical" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
];

export const POOL_OPTIONS = [
  { value: "B2C", label: "B2C (marketplace)" },
  { value: "B2B", label: "B2B" },
];

export const SORT_OPTIONS = [
  { value: "available", label: "Lowest available first" },
  { value: "name", label: "Product name" },
  { value: "sku", label: "SKU" },
];

export const ALERT_TYPES = {
  OUT_OF_STOCK: { label: "Out of stock", tone: "danger" },
  CRITICAL_STOCK: { label: "Critical stock", tone: "danger" },
  LOW_STOCK: { label: "Low stock", tone: "warning" },
};

export const ADJUST_ACTIONS = [
  { value: "ADD", label: "Add stock", hint: "New stock arrived" },
  { value: "REDUCE", label: "Reduce stock", hint: "Damaged, expired or lost" },
  { value: "SET", label: "Set physical count", hint: "Replace with what was counted" },
];

export const ADJUST_REASONS = [
  { value: "REPLENISHMENT", label: "New stock received" },
  { value: "PHYSICAL_COUNT", label: "Physical count" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "EXPIRED", label: "Expired" },
  { value: "RETURN_RECEIVED", label: "Customer return received" },
  { value: "CORRECTION", label: "Correction" },
  { value: "OTHER", label: "Other" },
];

export const DEFAULT_REASON = { ADD: "REPLENISHMENT", REDUCE: "DAMAGED", SET: "PHYSICAL_COUNT" };

export const MOVEMENT_TYPES = {
  OPENING: "Opening balance (copied from the old stock column)",
  ADJUST_ADD: "Stock added",
  ADJUST_REDUCE: "Stock reduced",
  ADJUST_SET: "Physical count",
  RESERVE: "Reserved for order",
  RELEASE: "Reservation released",
  EXPIRE: "Reservation expired",
  COMMIT: "Sold (order confirmed)",
  RETURN_RESTOCK: "Returned to stock",
  RETURN_DAMAGED: "Return (damaged, not restocked)",
};

/** Activity log (who changed what): action codes of stock movements and settings / record changes. */
export const ACTIVITY_ACTIONS = {
  ...MOVEMENT_TYPES,
  OPENING: "Stock set up",
  UPDATE_STOCK_SETTINGS: "Alert levels / safety stock changed",
  CLOSE_STOCK_RECORD: "Stock record closed",
  REOPEN_STOCK_RECORD: "Stock record reopened",
  RESOLVE_SHORTFALL: "Short order resolved",
  DAILY_RECONCILIATION: "Daily stock check",
};

export const ACTOR_OPTIONS = [
  { value: "people", label: "Admins + sellers" },
  { value: "admin", label: "Admins" },
  { value: "seller", label: "Sellers" },
  { value: "customer", label: "Customer orders" },
  { value: "system", label: "System (imports, expiry)" },
  { value: "all", label: "Everyone" },
];

export const ACTOR_LABEL = { admin: "Admin", seller: "Seller", customer: "Customer", system: "System" };

/** Settings field names of the audit log, in words. */
export const SETTING_LABELS = {
  low_stock_threshold: "Low stock at",
  critical_threshold: "Critical at",
  safety_stock_qty: "Safety stock",
  status: "Status",
  onHandQty: "On hand",
  resolution: "Outcome",
  note: "Note",
};

export const NOT_CONFIGURED_REASONS = {
  STOCK_NOT_SET_UP: "Stock never entered",
  NO_PACK_SIZES: "No pack sizes added yet",
  VARIANTS_NOT_SET_UP: "Pack sizes have no stock record",
  NO_PRODUCT_RECORD: "Product record missing",
};

export const SHORTFALL_RESOLUTIONS = [
  { value: "PARTIAL_SHIPPED", label: "Customer accepted part shipment" },
  { value: "WAITING_RESTOCK", label: "Customer will wait for restock" },
  { value: "REFUNDED", label: "Refunded the short items" },
  { value: "CANCELLED", label: "Order cancelled" },
  { value: "OTHER", label: "Other" },
];

export const reasonLabel = (value) => ADJUST_REASONS.find((r) => r.value === value)?.label ?? (value === "MIGRATION" ? "Initial import" : value ?? "");

const numberFormat = new Intl.NumberFormat("en-IN");
export const qty = (n) => numberFormat.format(Number(n ?? 0));

export function signedQty(n) {
  const v = Number(n ?? 0);
  return v > 0 ? `+${qty(v)}` : v < 0 ? `−${qty(Math.abs(v))}` : "0";
}

export const actorLabel = (m) =>
  m.actorType === "system" ? "System" : m.actorType === "customer" ? "Customer order" : `${m.actorType === "admin" ? "Admin" : "Seller"}${m.actorId ? ` · ${m.actorId}` : ""}`;

export const itemName = (item) => item?.productName || item?.sku || "";
