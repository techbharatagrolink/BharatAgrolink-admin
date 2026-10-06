/** Status → tone used by StatusBadge across every module. */
const tones = {
  success: ["Active", "Approved", "Verified", "Delivered", "Paid", "Processed", "Refunded", "Completed", "Resolved", "Closed", "Published", "Reconciled", "Converted", "Accepted", "RTO Delivered", "Visible", "Sent", "Filed", "Scored", "completed", "delivered", "Settled", "Captured", "Recovered", "In Stock", "ok", "On track", "Connected", "Return Completed", "Auto-approved", "Auto-Closed", "RELEASED", "APPROVED", "Upcoming", "Order placed", "Interested", "Hot", "Published"],
  warning: ["Pending", "Pending Pickup", "Placed", "Awaiting Pickup", "Awaiting Response", "Under Review", "Submitted", "Approval Pending", "Partially Reconciled", "Partial", "Due", "Low Stock", "below_target", "At risk", "Follow Up", "Requested", "Pending Manual Transfer", "On Hold", "Hold", "Processing", "Initiated", "Return Requested", "Negotiation", "Quotes Received", "Evidence Pending", "PENDING", "UNDER_REVIEW", "DEFERRED", "Acknowledged", "Scheduled", "Warm", "queued", "calling", "Draft", "Draft / Rejected", "Seller Sourcing", "Customer Quote Ready", "Called", "Raised by courier", "Eligible", "Medium", "Normal", "Call back", "Busy", "In Progress", "In-Progress", "Ready to Ship", "Documents Missing", "Partially Paid"],
  danger: ["Rejected", "Cancelled", "Failed", "Suspended", "Blocked", "RTO", "RTO In Transit", "Undelivered", "Out of Stock", "loss", "below_floor", "Breached", "Overdue", "Lost", "Expired", "DISPUTED", "Disputed", "High", "Urgent", "Not Interested", "failed", "no-answer", "Dead", "Abandoned", "Not reachable", "Inactive", "cancelled", "returned", "Hidden", "Hidden (known issue: never shows)", "Open"],
  info: ["Accepted", "Packed", "Shipped", "In Transit", "Out for Delivery", "Replacement Shipped", "Confirmed", "New", "Viewed", "Order", "confirmed", "processing", "packed", "dispatched", "in_transit", "Engine", "Manual", "Cold", "Low", "Not Eligible"],
};

const map = new Map();
for (const [tone, list] of Object.entries(tones)) {
  for (const status of list) if (!map.has(status)) map.set(status, tone);
}
// Order matters for a few overloaded words.
map.set("Accepted", "info");
map.set("Open", "warning");
map.set("Inactive", "neutral");
map.set("Hidden", "neutral");
map.set("High", "danger");
map.set("overdue", "danger");
map.set("upcoming", "info");

export function statusTone(status) {
  if (status == null) return "neutral";
  if (typeof status === "boolean") return status ? "success" : "neutral";
  return map.get(String(status)) || "neutral";
}
