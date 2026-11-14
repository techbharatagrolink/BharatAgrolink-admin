// Labels and badge tones of the three independent banner order statuses (doc §7).

export const ORDER_STATUS = {
  DRAFT: ["Not paid", "neutral"],
  PENDING_PAYMENT: ["Payment pending", "warning"],
  PAYMENT_FAILED: ["Payment failed", "danger"],
  PAID: ["Paid", "success"],
  CANCELLED: ["Cancelled", "neutral"],
  REFUND_PENDING: ["Refund pending", "warning"],
  REFUNDED: ["Refunded", "info"],
};

export const APPROVAL_STATUS = {
  PENDING_REVIEW: ["Waiting for review", "warning"],
  APPROVED: ["Approved", "success"],
  REJECTED: ["Rejected", "danger"],
  REVISION_REQUIRED: ["Changes requested", "info"],
};

export const AD_STATUS = {
  SCHEDULED: ["Scheduled", "info"],
  ACTIVE: ["Live", "success"],
  PAUSED: ["Paused", "warning"],
  COMPLETED: ["Completed", "neutral"],
  SUSPENDED: ["Stopped", "danger"],
};

export const CREATIVE_STATUS = {
  SUBMITTED: ["In review", "warning"],
  APPROVED: ["Approved", "success"],
  REJECTED: ["Rejected", "danger"],
  REVISION_REQUIRED: ["Changes requested", "info"],
  SUPERSEDED: ["Replaced", "neutral"],
};

export const LOG_LABELS = {
  create: "Order created",
  payment_started: "Payment started",
  paid: "Payment confirmed",
  payment_failed: "Payment failed",
  payment_mismatch: "Payment amount mismatch",
  paid_after_cancel: "Paid after cancellation",
  duplicate_capture: "Extra payment captured",
  invoice_created: "BAN invoice issued",
  approved: "Approved and scheduled",
  rejected: "Rejected",
  revision_requested: "Changes requested",
  creative_resubmitted: "New creative sent",
  rescheduled: "Rescheduled",
  paused: "Paused",
  resumed: "Resumed",
  stopped: "Stopped",
  activated: "Went live",
  completed: "Completed",
  cancel: "Cancelled by seller",
  cancelled_by_seller: "Cancelled by seller (refund)",
  refunded: "Refunded",
  credit_note_created: "Credit note issued",
};
