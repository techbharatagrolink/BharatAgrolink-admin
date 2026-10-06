/**
 * Reports hub (legacy reports.php / orders_report.php). Each report opens the
 * filterable list it is based on; CSV export runs on the server with the
 * same permission and row scope as the list.
 */

export const reportGroups = [
  {
    group: "Sales & orders",
    reports: [
      { key: "orders", title: "Order report", description: "Orders with customer, payment mode, channel and status.", href: "/admin/orders", permission: "orders" },
      { key: "transactions", title: "Date-wise transactions", description: "Line-level taxable value, GST split, TCS and commission by date.", href: "/admin/orders/transactions", permission: "orders.transactions" },
      { key: "invoices", title: "Invoice register", description: "Seller and platform invoices for GST filing.", href: "/admin/orders/invoices", permission: "orders.invoices" },
      { key: "returns", title: "Returns report", description: "Return requests with reason, refund amount and status.", href: "/admin/returns", permission: "returns" },
      { key: "rto", title: "RTO report", description: "RTO shipments with forward and reverse cost.", href: "/admin/rto", permission: "rto" },
    ],
  },
  {
    group: "Catalog & inventory",
    reports: [
      { key: "products", title: "Product report", description: "Listings with pricing, stock and economics verdict.", href: "/admin/products", permission: "products" },
      { key: "inventory", title: "Stock report", description: "Out-of-stock, low-stock and in-stock listings by vendor.", href: "/admin/inventory", permission: "products" },
      { key: "stock-history", title: "Stock movements", description: "Every stock change with source and reason.", href: "/admin/inventory/history", permission: "products" },
    ],
  },
  {
    group: "Vendors & payouts",
    reports: [
      { key: "vendor-reports", title: "Vendor performance", description: "Orders, delivered GMV, RTO % and BSA per vendor.", href: "/admin/vendors/reports", permission: "vendors.reports" },
      { key: "payout-items", title: "Payout items", description: "Delivered lines with gross, TCS and BSA per payout cycle.", href: "/admin/payouts/items", permission: "payouts" },
      { key: "payouts", title: "Payout cycles", description: "Payouts by vendor and cycle with UTR and status.", href: "/admin/payouts", permission: "payouts" },
    ],
  },
  {
    group: "Finance",
    reports: [
      { key: "pnl", title: "Profit & loss", description: "Platform revenue vs operating costs.", href: "/admin/finance", permission: "finance" },
      { key: "gst", title: "GST & TCS summary", description: "Monthly output GST, input credit, TCS and filing status.", href: "/admin/finance/gst", permission: "finance.tax" },
      { key: "ledger", title: "Ledgers", description: "Customer, vendor and wallet ledger entries.", href: "/admin/finance/ledger", permission: "finance.ledger" },
      { key: "hold-ledger", title: "Hold ledger (CN/DN)", description: "Credit and debit notes by party and status.", href: "/admin/finance/hold-ledger", permission: "finance.holdLedger" },
      { key: "cod", title: "COD reconciliation", description: "Courier COD remittances: expected vs received.", href: "/admin/finance/cod", permission: "finance" },
      { key: "refunds", title: "Refunds", description: "Razorpay and manual bank-transfer refunds.", href: "/admin/refunds", permission: "refunds" },
    ],
  },
  {
    group: "Sales team, CRM & B2B",
    reports: [
      { key: "leads", title: "Lead report", description: "Leads by source, status, executive and crop.", href: "/admin/crm/leads", permission: "crm.leads" },
      { key: "call-audit", title: "AI call audit", description: "Call scores, compliance and outcomes.", href: "/admin/crm/call-audit", permission: "crm.callAudit" },
      { key: "achievements", title: "Target achievement", description: "Monthly target vs achieved per person.", href: "/admin/sales/achievements", permission: "sales.targets" },
      { key: "sales-payouts", title: "Sales payouts", description: "Fixed, variable, incentive and prepaid incentive.", href: "/admin/sales/payouts", permission: "sales.payouts" },
      { key: "b2b-orders", title: "B2B orders", description: "B2B orders with contribution and payment status.", href: "/admin/b2b/orders", permission: "b2b.orders" },
    ],
  },
  {
    group: "Operations & support",
    reports: [
      { key: "agents", title: "Agent-wise report", description: "Operations agent workload and KPI performance.", href: "/admin/operations/team/agents", permission: "operations.team" },
      { key: "ndr", title: "NDR register", description: "Undelivered shipments, attempts and next action.", href: "/admin/operations/ndr", permission: "operations.center" },
      { key: "tickets", title: "Support tickets", description: "Tickets by department, priority, SLA and status.", href: "/admin/support", permission: "support" },
      { key: "audit", title: "Audit log", description: "Every sensitive change with actor, before/after and reason.", href: "/admin/audit", permission: "audit" },
    ],
  },
];
