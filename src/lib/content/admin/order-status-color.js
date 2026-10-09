/**
 * Order-status colors from C:\xampp\htdocs\AMPL.BAadmin\manage_orders.php.
 *
 * Named statuses use the `.status-*` colors (the Order Status text colors).
 * Every other status uses `getDotColorClass` in the same order as the PHP:
 * delivered / return completed → green, shipped / transit / picked up /
 * dispatched → blue, out for delivery / pickup / manifested / packed / ready
 * → yellow, cancel / reject / rto → red, otherwise gray.
 *
 * "Undelivered" contains "delivered", so the PHP dot check would paint it green.
 * That select treats Undelivered as the red failure dot so it is not shown as delivered.
 */

const named = {
  placed: "#0d6efd",
  accepted: "#198754",
  rejected: "#842029",
  packed: "#6f42c1",
  "out for delivery": "#fd7e14",
  delivered: "#ffc107",
  cancelled: "#dc3545",
};

const dot = {
  green: "#10b981",
  blue: "#3b82f6",
  yellow: "#f59e0b",
  red: "#ef4444",
  gray: "#6b7280",
};

export function orderStatusColor(status) {
  const text = String(status ?? "").trim().toLowerCase();
  if (!text) return dot.gray;
  if (named[text]) return named[text];
  if (text.includes("undelivered")) return dot.red;
  if (text.includes("delivered") || text.includes("return completed")) return dot.green;
  if (text.includes("shipped") || text.includes("transit") || text.includes("picked up") || text.includes("dispatched")) return dot.blue;
  if (text.includes("out for delivery") || text.includes("pickup") || text.includes("manifested") || text.includes("packed") || text.includes("ready")) return dot.yellow;
  if (text.includes("cancel") || text.includes("reject") || text.includes("rto")) return dot.red;
  return dot.gray;
}
