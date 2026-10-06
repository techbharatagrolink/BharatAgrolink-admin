/** Help centre content: the business rules staff ask about most. */

export const helpTopics = [
  {
    key: "orders",
    title: "Order and line status",
    permission: "orders",
    href: "/admin/orders",
    points: [
      "Status is tracked per order line (one vendor's items). The order header shows the highest-priority line status.",
      "Placed → Accepted → Packed → Pending Pickup → Shipped → In Transit → Out for Delivery → Delivered.",
      "Cancel, Reject, RTO and Return Requested always need a reason; it is shown to the customer or vendor and saved in the audit log.",
      "A line becomes returnable for 7 days after delivery.",
    ],
  },
  {
    key: "pricing",
    title: "NRV pricing",
    permission: "pricing",
    href: "/admin/pricing",
    points: [
      "Vendors quote NRV (net realisable value). Display price = NRV grossed up by the take rate, plus GST, capped at MRP.",
      "TCS is 1% of taxable value. Vendor payout (BSA) = NRV − TCS.",
      "Listings below the contribution floor are flagged Below floor CM or Loss-making and should not be approved without a price fix.",
    ],
  },
  {
    key: "inventory",
    title: "Stock levels",
    permission: "products",
    href: "/admin/inventory",
    points: [
      "Out of stock = 0 units, Low stock = 1–9 units, In stock = 10 or more.",
      "The main dashboard alert counts products below 50 units (out-of-stock excluded).",
      "Every stock change is written to Stock History. Manual adjustments need a reason.",
    ],
  },
  {
    key: "returns",
    title: "Returns and refunds",
    permission: "returns",
    href: "/admin/returns",
    points: [
      "Pending → Awaiting Pickup → In Transit → Received → Refunded or Replacement Shipped.",
      "Refund = item price + GST (+ forward shipping if refunded) − 3% platform fee if deducted. The server calculates it; nobody types an amount.",
      "Prepaid orders refund through Razorpay. COD refunds become a manual bank transfer for finance.",
    ],
  },
  {
    key: "payouts",
    title: "Vendor payouts",
    permission: "payouts",
    href: "/admin/payouts",
    points: [
      "Delivered lines are grouped per vendor into half-month cycles (1st–15th, 16th–month end).",
      "To mark a payout paid you need payouts: edit, an active vendor with verified KYC, a unique bank UTR, the payment proof and a note.",
      "Put a payout on hold to skip a cycle; release it to make it payable again.",
    ],
  },
  {
    key: "access",
    title: "Roles and access",
    permission: null,
    href: "/admin/account",
    points: [
      "Each role grants view, add, edit or delete per menu. Menus you cannot view are hidden.",
      "Sales Executives and Operations Agents only see records assigned to them.",
      "The server re-checks every action, so hidden buttons are not the security boundary.",
      "Ask a full admin if you need more access. Nobody can change their own role.",
    ],
  },
];

export const shortcuts = [
  { keys: ["/"], action: "Focus global search" },
  { keys: ["Ctrl", "K"], action: "Focus global search (from anywhere)" },
  { keys: ["Esc"], action: "Close dialogs, drawers and the mobile menu" },
];
