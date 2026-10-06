/**
 * Admin sidebar and route map.
 *
 * Information architecture follows the legacy AMPL.BAadmin menus (`admin_menus`
 * tree, `header.php` "Dashboards" section and the module installers that add
 * sidebar entries such as "Lead Management → AI Call Audit", "Vendor → All
 * vendors", "Operations Team" and the four Operations Center entries).
 *
 * Each leaf `permission` is the equivalent of an `admin_menus` row; roles grant
 * `view | add | edit | delete` per permission key (see lib/auth/permissions.js).
 * `legacy` records the old PHP page so data and API mapping stay traceable.
 */

export const navigation = [
  {
    section: "Overview",
    items: [
      {
        key: "dashboards",
        label: "Dashboards",
        icon: "LayoutDashboard",
        children: [
          { key: "dashboard-main", label: "Main Dashboard", href: "/admin/dashboard", permission: "dashboard.main", legacy: "dashboard.php, main_dashboard.php" },
          { key: "dashboard-orders", label: "Order Management", href: "/admin/dashboards/orders", permission: "dashboard.orders", legacy: "order_management_dashboard.php" },
          { key: "dashboard-products", label: "Product Management", href: "/admin/dashboards/products", permission: "dashboard.products", legacy: "product_management_dashboard.php" },
          { key: "dashboard-logistics", label: "Logistics & Operations", href: "/admin/dashboards/logistics", permission: "dashboard.logistics", legacy: "logistics_operations_dashboard.php" },
          { key: "dashboard-finance", label: "Finance & Payout", href: "/admin/dashboards/finance", permission: "dashboard.finance", legacy: "finance_payout_dashboard.php" },
          { key: "dashboard-sellers", label: "Seller Dashboard", href: "/admin/dashboards/sellers", permission: "dashboard.sellers", legacy: "Sellers Overview dashboard" },
        ],
      },
    ],
  },
  {
    section: "Catalog",
    items: [
      {
        key: "products",
        label: "Products",
        icon: "Package",
        children: [
          { key: "products-all", label: "Manage Products", href: "/admin/products", permission: "products", legacy: "manage_product.php" },
          { key: "products-new", label: "Add Product", href: "/admin/products/new", permission: "products", action: "add", legacy: "add_product_process.php" },
          { key: "products-pending", label: "Pending Products", href: "/admin/products/pending", permission: "products.approval", badge: "pendingProducts", legacy: "verfiy_pending_products.php" },
          { key: "products-import", label: "Bulk Import / Update", href: "/admin/products/import", permission: "products.import", legacy: "import_products_excel.php, import_worker.php" },
          { key: "products-inventory", label: "Inventory", href: "/admin/inventory", permission: "products", badge: "outOfStock", legacy: "vendor_product.product_stock (Product Management dashboard stock sections)" },
          { key: "products-stock-history", label: "Stock History", href: "/admin/inventory/history", permission: "products", legacy: "new: stock movement ledger" },
        ],
      },
      {
        key: "catalog",
        label: "Catalog Setup",
        icon: "FolderTree",
        children: [
          { key: "catalog-categories", label: "Categories", href: "/admin/catalog/categories", permission: "catalog.categories", legacy: "category (verify queue)" },
          { key: "catalog-brands", label: "Brands", href: "/admin/catalog/brands", permission: "catalog.brands", legacy: "brand.php, add_brand_process.php" },
          { key: "catalog-attributes", label: "Attributes", href: "/admin/catalog/attributes", permission: "catalog.attributes", legacy: "attribute, attribute-value, attribute-set" },
          { key: "catalog-tax", label: "Tax Classes", href: "/admin/catalog/tax-classes", permission: "catalog.tax", legacy: "tax-class" },
          { key: "catalog-hsn", label: "HSN Codes", href: "/admin/catalog/hsn-codes", permission: "catalog.hsn", legacy: "hsncode" },
          { key: "catalog-return-policies", label: "Return Policies", href: "/admin/catalog/return-policies", permission: "catalog.returnPolicies", legacy: "return-policy" },
        ],
      },
      {
        key: "pricing",
        label: "Pricing",
        icon: "IndianRupee",
        children: [
          { key: "pricing-calculator", label: "NRV Price Calculator", href: "/admin/pricing", permission: "pricing", legacy: "includes/nrv_pricing.php, calculator.php" },
          { key: "pricing-master-nrv", label: "Master NRV", href: "/admin/pricing/master-nrv", permission: "pricing.masterNrv", legacy: "add_master_nrv.php → master_nrv" },
          { key: "pricing-commission", label: "Seller Commission", href: "/admin/pricing/commission", permission: "pricing.commission", legacy: "seller_commission" },
          { key: "pricing-cost-config", label: "Listing Economics", href: "/admin/pricing/cost-config", permission: "pricing.costConfig", legacy: "includes/product_cost_engine.php → product_cost_config" },
        ],
      },
    ],
  },
  {
    section: "Orders",
    items: [
      {
        key: "orders",
        label: "Orders",
        icon: "ShoppingCart",
        children: [
          { key: "orders-all", label: "Manage Orders", href: "/admin/orders", permission: "orders", legacy: "manage_orders.php" },
          { key: "orders-new", label: "Create Order", href: "/admin/orders/new", permission: "orders", action: "add", legacy: "create_order.php → api/createorder.php" },
          { key: "orders-invoices", label: "Invoices", href: "/admin/orders/invoices", permission: "orders.invoices", legacy: "view_invoice.php, api/download_invoice.php" },
          { key: "orders-transactions", label: "Date-wise Transactions", href: "/admin/orders/transactions", permission: "orders.transactions", legacy: "manage_order_date_wise_transaction.php" },
          { key: "orders-whatsapp", label: "WhatsApp Orders", href: "/admin/orders/whatsapp", permission: "orders.whatsapp", legacy: "whatsapp_orders.php → wp_orders" },
          { key: "orders-sr-checkout", label: "Shiprocket Checkout", href: "/admin/orders/sr-checkout", permission: "orders.srCheckout", legacy: "sr_checkout_admin.php" },
        ],
      },
      {
        key: "shipping",
        label: "Shipping",
        icon: "Truck",
        children: [
          { key: "shipping-shipments", label: "Shipments", href: "/admin/shipping", permission: "shipping", badge: "pendingShipments", legacy: "create_shipment.php, bulk_action.php" },
          { key: "shipping-courier-slabs", label: "Courier Slab Rates", href: "/admin/shipping/courier-slabs", permission: "shipping.rates", legacy: "courier_charge_calculator.php → courier_cost_slabs" },
          { key: "shipping-slabs", label: "Shipping Slabs", href: "/admin/shipping/slabs", permission: "shipping.rates", legacy: "manage_shipping_slabs.php" },
          { key: "shipping-cod-rules", label: "COD State Rule", href: "/admin/shipping/cod-rules", permission: "shipping.rules", legacy: "manage_cod_state_rule.php" },
          { key: "shipping-minimums", label: "Minimum Order & COD", href: "/admin/shipping/minimums", permission: "shipping.rules", legacy: "manage_minimum_order.php, manage_minimum_cod.php" },
          { key: "shipping-other-charges", label: "Other Charges", href: "/admin/shipping/other-charges", permission: "shipping.rates", legacy: "other_charges.php" },
          { key: "shipping-boxes", label: "Package Boxes", href: "/admin/shipping/package-boxes", permission: "shipping.boxes", legacy: "vendor_package_boxes" },
          { key: "shipping-weight", label: "Weight Discrepancy", href: "/admin/shipping/weight-discrepancy", permission: "shipping.weight", legacy: "weight_discrapancy.php" },
          { key: "shipping-pincodes", label: "Pincode Serviceability", href: "/admin/shipping/pincodes", permission: "shipping.pincodes", legacy: "pincodes" },
        ],
      },
      {
        key: "returns",
        label: "Returns & RTO",
        icon: "Undo2",
        children: [
          { key: "returns-all", label: "Manage Returns", href: "/admin/returns", permission: "returns", badge: "pendingReturns", legacy: "manage_returns.php, process_return_action.php" },
          { key: "returns-refunds", label: "Refunds", href: "/admin/refunds", permission: "refunds", legacy: "process_return_action.php (Razorpay / BANK-TRF)" },
          { key: "returns-rto", label: "RTO Ledger", href: "/admin/rto", permission: "rto", legacy: "includes/rto_ledger.php → order_rto" },
          { key: "returns-reasons", label: "Return Reasons", href: "/admin/returns/reasons", permission: "returns", legacy: "return reason quick tags" },
        ],
      },
    ],
  },
  {
    section: "Vendors",
    items: [
      {
        key: "vendors",
        label: "Vendor",
        icon: "Store",
        children: [
          { key: "vendors-all", label: "All Vendors", href: "/admin/vendors", permission: "vendors", legacy: "sellerlogin, vendor list" },
          { key: "vendors-verification", label: "Vendor Verification", href: "/admin/vendors/verification", permission: "vendors.verification", badge: "pendingVendors", legacy: "pending seller / KYC queue" },
          { key: "vendors-scores", label: "Top 10 Dashboard", href: "/admin/vendors/scores", permission: "vendors.scores", legacy: "api/scores/data.php?action=vendors" },
          { key: "vendors-reports", label: "Vendor Reports", href: "/admin/vendors/reports", permission: "vendors.reports", legacy: "vendor_reports.php" },
        ],
      },
      {
        key: "payouts",
        label: "Vendor Payouts",
        icon: "Wallet",
        sensitive: true,
        children: [
          { key: "payouts-cycles", label: "Payout Cycles", href: "/admin/payouts", permission: "payouts", legacy: "payout_new.php → vendor_payout" },
          { key: "payouts-items", label: "Payout Items", href: "/admin/payouts/items", permission: "payouts", legacy: "vendor_payout_items, payout_item_timeline" },
          { key: "payouts-access", label: "Payout Access Settings", href: "/admin/payouts/access", permission: "payouts.access", legacy: "vendor_payout_access_settings.php" },
          { key: "payouts-legacy", label: "Legacy Payments", href: "/admin/payouts/legacy", permission: "payouts", legacy: "payment_cron.php → payment" },
        ],
      },
    ],
  },
  {
    section: "Finance",
    items: [
      {
        key: "finance",
        label: "Finance",
        icon: "Landmark",
        sensitive: true,
        children: [
          { key: "finance-pnl", label: "Profit & Loss", href: "/admin/finance", permission: "finance", legacy: "finance.php" },
          { key: "finance-ledger", label: "Ledger Management", href: "/admin/finance/ledger", permission: "finance.ledger", legacy: "finance_ledger_management.php, customer_ledger.php, vendor_ledger.php, wallet_ledger.php" },
          { key: "finance-hold-ledger", label: "Hold Ledger (CN/DN)", href: "/admin/finance/hold-ledger", permission: "finance.holdLedger", legacy: "hold_ledger.php" },
          { key: "finance-cod", label: "COD Reconciliation", href: "/admin/finance/cod", permission: "finance", legacy: "get_finance_payout_data.php (COD)" },
          { key: "finance-gst", label: "GST & TCS", href: "/admin/finance/gst", permission: "finance.tax", legacy: "GST summary" },
          { key: "finance-expense-limits", label: "Expense Limits", href: "/admin/finance/expense-limits", permission: "finance.expenses", legacy: "expense_limit_dashboard.php" },
          { key: "finance-fixed-expenses", label: "Fixed Expenses", href: "/admin/finance/fixed-expenses", permission: "finance.expenses", legacy: "fixed_expenses" },
          { key: "finance-wallet", label: "Wallet Withdrawals", href: "/admin/finance/wallet-withdrawals", permission: "finance.wallet", legacy: "wallet_withdraw" },
        ],
      },
    ],
  },
  {
    section: "Customers",
    items: [
      {
        key: "customers",
        label: "Customers",
        icon: "Users",
        children: [
          { key: "customers-all", label: "All Customers", href: "/admin/customers", permission: "customers", legacy: "appuser_login" },
          { key: "customers-coupons", label: "Coupons", href: "/admin/customers/coupons", permission: "customers.coupons", legacy: "coupons, coupancode" },
          { key: "customers-reviews", label: "Product Reviews", href: "/admin/customers/reviews", permission: "customers.reviews", legacy: "product_review" },
        ],
      },
    ],
  },
  {
    section: "Sales & CRM",
    items: [
      {
        key: "crm",
        label: "Lead Management",
        icon: "Contact",
        children: [
          { key: "crm-dashboard", label: "Lead Dashboard", href: "/admin/crm", permission: "crm", legacy: "lead dashboard" },
          { key: "crm-leads", label: "CRM Lead Sheet", href: "/admin/crm/leads", permission: "crm.leads", legacy: "crm_leads.php, api/crm_leads/*" },
          { key: "crm-follow-ups", label: "Follow-ups", href: "/admin/crm/follow-ups", permission: "crm.leads", badge: "dueFollowUps", legacy: "lead_crm_details.next_follow_up" },
          { key: "crm-legacy", label: "All Leads (Legacy)", href: "/admin/crm/legacy-leads", permission: "crm.legacy", legacy: "manager_all_leads.php, sales_agent_leads.php" },
          { key: "crm-whatsapp", label: "WhatsApp Leads", href: "/admin/crm/whatsapp", permission: "crm.whatsapp", legacy: "whatsapp_leads.php → whatsapp_sessions" },
          { key: "crm-ai-calls", label: "AI Calls (VAPI)", href: "/admin/crm/ai-calls", permission: "crm.aiCalls", legacy: "vapi_calls.php → vapi_call_queue" },
          { key: "crm-call-audit", label: "AI Call Audit", href: "/admin/crm/call-audit", permission: "crm.callAudit", legacy: "call_audit.php" },
          { key: "crm-circles", label: "Circle Assignment", href: "/admin/crm/circles", permission: "crm.circles", legacy: "mobile_circle_prefixes" },
        ],
      },
      {
        key: "sales",
        label: "Sales Team",
        icon: "Target",
        children: [
          { key: "sales-dashboard", label: "Sales Dashboard", href: "/admin/sales", permission: "sales", legacy: "sales_target_management_v2.php (stats)" },
          { key: "sales-targets", label: "Targets", href: "/admin/sales/targets", permission: "sales.targets", legacy: "api/sales_targets/targets_data.php" },
          { key: "sales-salary", label: "Salary Structure", href: "/admin/sales/salary", permission: "sales.salary", legacy: "api/sales_targets/salary_structure_data.php" },
          { key: "sales-achievements", label: "Achievements", href: "/admin/sales/achievements", permission: "sales.targets", legacy: "api/sales_targets/achievements_data.php" },
          { key: "sales-payouts", label: "Sales Payouts", href: "/admin/sales/payouts", permission: "sales.payouts", legacy: "api/sales_targets/payouts_data.php" },
          { key: "sales-prepaid", label: "Prepaid Incentive Setup", href: "/admin/sales/prepaid-incentive", permission: "sales.salary", legacy: "sales_prepaid_incentive_setup.php" },
        ],
      },
    ],
  },
  {
    section: "B2B",
    items: [
      {
        key: "b2b",
        label: "B2B Order Panel",
        icon: "Building2",
        children: [
          { key: "b2b-dashboard", label: "B2B Dashboard", href: "/admin/b2b", permission: "b2b", legacy: "b2b_orders/" },
          { key: "b2b-buyers", label: "Buyers / Leads", href: "/admin/b2b/buyers", permission: "b2b.buyers", legacy: "b2b_sp_buyers" },
          { key: "b2b-rfqs", label: "RFQs", href: "/admin/b2b/rfqs", permission: "b2b.rfqs", badge: "openRfqs", legacy: "b2b_sp_rfqs" },
          { key: "b2b-quotations", label: "Quotations", href: "/admin/b2b/quotations", permission: "b2b.quotations", legacy: "b2b_sp_quotations" },
          { key: "b2b-orders", label: "B2B Orders", href: "/admin/b2b/orders", permission: "b2b.orders", legacy: "b2b_sp_orders" },
          { key: "b2b-payments", label: "Payments & Credit", href: "/admin/b2b/payments", permission: "b2b.finance", legacy: "b2b_sp_payments" },
          { key: "b2b-settlements", label: "Settlements", href: "/admin/b2b/settlements", permission: "b2b.finance", legacy: "b2b_sp_settlements" },
          { key: "b2b-claims", label: "Returns / Claims", href: "/admin/b2b/claims", permission: "b2b.orders", legacy: "b2b_sp_claims" },
          { key: "b2b-alerts", label: "Alerts", href: "/admin/b2b/alerts", permission: "b2b", legacy: "b2b alert engine" },
        ],
      },
      {
        key: "bulk",
        label: "Bulk Order",
        icon: "Boxes",
        children: [
          { key: "bulk-inquiries", label: "Bulk Inquiries", href: "/admin/bulk-orders", permission: "bulk", legacy: "bulk_orders/ (b2b_orders table)" },
          { key: "bulk-warehouses", label: "Warehouses", href: "/admin/bulk-orders/warehouses", permission: "bulk", legacy: "bulk_orders/warehouses.php" },
        ],
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        key: "ops-center",
        label: "Operations Center",
        icon: "RadioTower",
        children: [
          { key: "ops-command", label: "Command Center", href: "/admin/operations", permission: "operations.center", legacy: "operations_center/index.php" },
          { key: "ops-ndr", label: "NDR & Escalations", href: "/admin/operations/ndr", permission: "operations.center", badge: "openEscalations", legacy: "operations_center/ndr_escalations.php" },
          { key: "ops-recordings", label: "Call Recordings", href: "/admin/operations/recordings", permission: "operations.center", legacy: "operations_center/recordings.php" },
          { key: "ops-rules", label: "Rules & SLA", href: "/admin/operations/rules", permission: "operations.rules", legacy: "operations_center/settings.php" },
        ],
      },
      {
        key: "ops-team",
        label: "Operations Team",
        icon: "UsersRound",
        children: [
          { key: "ops-team-dashboard", label: "Team Dashboard", href: "/admin/operations/team", permission: "operations.team", legacy: "operations_team/dashboard" },
          { key: "ops-team-assign", label: "Order Assignment", href: "/admin/operations/team/assignments", permission: "operations.team", legacy: "operations_team/api/assign_orders.php" },
          { key: "ops-team-agents", label: "Agent-wise Report", href: "/admin/operations/team/agents", permission: "operations.team", legacy: "operations_team/api/get_agent_report.php" },
          { key: "ops-team-setup", label: "Setup (Agents & KPIs)", href: "/admin/operations/team/setup", permission: "operations.setup", legacy: "operations_team/setup" },
        ],
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        key: "support",
        label: "Support",
        icon: "LifeBuoy",
        children: [
          { key: "support-tickets", label: "Tickets", href: "/admin/support", permission: "support", badge: "openTickets", legacy: "support/ (tickets)" },
          { key: "support-sla", label: "Departments & SLA", href: "/admin/support/sla", permission: "support.settings", legacy: "tickets.assigned_dept, sla_deadline" },
        ],
      },
    ],
  },
  {
    section: "Content",
    items: [
      {
        key: "cms",
        label: "CMS",
        icon: "LayoutTemplate",
        children: [
          { key: "cms-banners", label: "Banners", href: "/admin/cms/banners", permission: "cms", legacy: "banners" },
          { key: "cms-home-sections", label: "Home Sections", href: "/admin/cms/home-sections", permission: "cms", legacy: "homepage_sections_helper.php" },
          { key: "cms-blogs", label: "Blogs", href: "/admin/cms/blogs", permission: "cms", legacy: "blog_posts" },
          { key: "cms-events", label: "Events", href: "/admin/cms/events", permission: "cms", legacy: "events" },
          { key: "cms-faqs", label: "FAQs", href: "/admin/cms/faqs", permission: "cms", legacy: "faq" },
          { key: "cms-pages", label: "Custom Pages", href: "/admin/cms/pages", permission: "cms.pages", legacy: "pages/ → pages_custom" },
          { key: "cms-footer", label: "Footer Links", href: "/admin/cms/footer", permission: "cms", legacy: "api/add_footer.php → footer_links" },
          { key: "cms-notifications", label: "Push Notifications", href: "/admin/cms/notifications", permission: "cms.notifications", legacy: "notification (Firebase)" },
        ],
      },
    ],
  },
  {
    section: "Reports",
    items: [
      { key: "reports", label: "Reports", icon: "FileBarChart", href: "/admin/reports", permission: "reports", legacy: "reports.php, orders_report.php" },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        key: "access",
        label: "Staff & Roles",
        icon: "ShieldCheck",
        sensitive: true,
        children: [
          { key: "access-users", label: "Staff Users", href: "/admin/users", permission: "users", legacy: "admin_login, all-staff" },
          { key: "access-roles", label: "Roles & Permissions", href: "/admin/roles", permission: "roles", legacy: "user_roles.permissions_json" },
          { key: "access-menus", label: "Admin Menus", href: "/admin/roles/menus", permission: "roles", legacy: "admin_menus" },
          { key: "access-audit", label: "Audit Log", href: "/admin/audit", permission: "audit", legacy: "hold_ledger_audit, expense_limit_audit, activity logs" },
        ],
      },
      {
        key: "masters",
        label: "Masters",
        icon: "Database",
        children: [
          { key: "masters-geography", label: "Country / State / City", href: "/admin/masters/geography", permission: "masters", legacy: "country, state, city" },
          { key: "masters-reject-reasons", label: "Reject Reasons", href: "/admin/masters/reject-reasons", permission: "masters", legacy: "reject-reason" },
          { key: "masters-currency", label: "Currency", href: "/admin/masters/currency", permission: "masters", legacy: "currency-settings" },
        ],
      },
      {
        key: "settings",
        label: "Settings",
        icon: "Settings",
        sensitive: true,
        children: [
          { key: "settings-system", label: "System Settings", href: "/admin/settings", permission: "settings", legacy: "system-settings, settings" },
          { key: "settings-smtp", label: "SMTP Settings", href: "/admin/settings/smtp", permission: "settings", legacy: "smtp-settings" },
          { key: "settings-sms", label: "SMS Settings", href: "/admin/settings/sms", permission: "settings", legacy: "sms-settings" },
          { key: "settings-email-templates", label: "Email Templates", href: "/admin/settings/email-templates", permission: "settings", legacy: "email_template" },
          { key: "settings-languages", label: "Languages", href: "/admin/settings/languages", permission: "settings", legacy: "language_phrase" },
          { key: "settings-integrations", label: "Integrations", href: "/admin/settings/integrations", permission: "settings", legacy: "env-based integrations" },
        ],
      },
    ],
  },
  {
    section: "Help",
    items: [{ key: "help", label: "Help & Guide", icon: "CircleHelp", href: "/admin/help" }],
  },
];

/** Routes not shown in the sidebar but needing a breadcrumb label. */
export const hiddenRoutes = [
  { pattern: /^\/admin\/orders\/[^/]+$/, label: "Order Details", parent: "/admin/orders" },
  { pattern: /^\/admin\/products\/[^/]+$/, label: "Product Details", parent: "/admin/products" },
  { pattern: /^\/admin\/vendors\/[^/]+$/, label: "Vendor Details", parent: "/admin/vendors" },
  { pattern: /^\/admin\/customers\/[^/]+$/, label: "Customer Details", parent: "/admin/customers" },
  { pattern: /^\/admin\/returns\/[^/]+$/, label: "Return Details", parent: "/admin/returns" },
  { pattern: /^\/admin\/payouts\/[^/]+$/, label: "Payout Details", parent: "/admin/payouts" },
  { pattern: /^\/admin\/support\/[^/]+$/, label: "Ticket Details", parent: "/admin/support" },
  { pattern: /^\/admin\/crm\/leads\/[^/]+$/, label: "Lead Details", parent: "/admin/crm/leads" },
  { pattern: /^\/admin\/b2b\/buyers\/[^/]+$/, label: "Buyer 360", parent: "/admin/b2b/buyers" },
  { pattern: /^\/admin\/b2b\/orders\/[^/]+$/, label: "B2B Order Details", parent: "/admin/b2b/orders" },
  { pattern: /^\/admin\/roles\/[^/]+$/, label: "Edit Role", parent: "/admin/roles" },
  { pattern: /^\/admin\/account$/, label: "My Account" },
];

export function flattenNavigation(tree = navigation) {
  const rows = [];
  for (const section of tree) {
    for (const item of section.items) {
      if (item.href) rows.push({ ...item, section: section.section, group: null });
      for (const child of item.children || []) {
        rows.push({ ...child, section: section.section, group: item });
      }
    }
  }
  return rows;
}

export function findNavItem(pathname) {
  const leaves = flattenNavigation();
  const exact = leaves.find((item) => item.href === pathname);
  if (exact) return exact;
  return leaves
    .filter((item) => item.href && pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function getBreadcrumbs(pathname) {
  const crumbs = [{ label: "Admin", href: "/admin/dashboard" }];
  const exact = flattenNavigation().find((item) => item.href === pathname);
  if (exact) {
    if (exact.group) crumbs.push({ label: exact.group.label });
    crumbs.push({ label: exact.label, href: exact.href });
    return crumbs;
  }
  const hidden = hiddenRoutes.find((route) => route.pattern.test(pathname));
  if (hidden) {
    const parent = hidden.parent && flattenNavigation().find((item) => item.href === hidden.parent);
    if (parent?.group) crumbs.push({ label: parent.group.label });
    if (parent) crumbs.push({ label: parent.label, href: parent.href });
    crumbs.push({ label: hidden.label });
    return crumbs;
  }
  const nearest = findNavItem(pathname);
  if (nearest) {
    if (nearest.group) crumbs.push({ label: nearest.group.label });
    crumbs.push({ label: nearest.label, href: nearest.href });
  }
  return crumbs;
}

/** Every distinct permission key, in sidebar order (drives the role matrix). */
export function getPermissionCatalog() {
  const seen = new Map();
  for (const section of navigation) {
    for (const item of section.items) {
      const leaves = item.children || [item];
      for (const leaf of leaves) {
        if (!leaf.permission || seen.has(leaf.permission)) continue;
        seen.set(leaf.permission, {
          key: leaf.permission,
          label: leaf.action ? item.label : leaf.label,
          group: item.children ? item.label : section.section,
          section: section.section,
          sensitive: Boolean(item.sensitive),
        });
      }
    }
  }
  return [...seen.values()];
}
