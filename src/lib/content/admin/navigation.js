/**
 * Admin sidebar and route map.
 *
 * Sections, groups, labels and order mirror the legacy AMPL.BAadmin sidebar
 * (`admin_menus`, active rows, by menu_order). Each leaf `page` is the
 * `admin_menus.menu_link` it stands for: the sidebar shows a leaf when the
 * role grants view on that link (see lib/auth/permissions.js), the same rule
 * header.php uses. Leaves without `page` are Next-only screens; they are
 * gated by `permission` and kept in the closest PHP group.
 *
 * `permission` is the key pages check with checkPermission() and the role
 * matrix lists (lib/services/admin/live-catalog.js maps keys to PHP pages).
 * A section with `section: null` is a top-level PHP link with no header.
 */

export const navigation = [
  {
    section: "Overview",
    items: [
      {
        key: "founder-dashboard",
        label: "Founder Dashboard",
        icon: "LayoutDashboard",
        children: [
          { key: "dashboard-main", label: "Overview", href: "/admin/dashboard", page: "dashboard.php", permission: "dashboard.main" },
          { key: "dashboard-business", label: "Business Dashboard", href: "/admin/dashboards/business", page: "main_dashboard.php", permission: "dashboard.business" },
          { key: "dashboard-ceo", label: "CEO Decision Matrix", href: "/admin/ceo-matrix", page: "ceo_decision_matrix.php", permission: "dashboard.ceo" },
        ],
      },
      {
        key: "biz-performance",
        label: "Business Performance",
        icon: "TrendingUp",
        children: [
          { key: "biz-sales", label: "Sales Overview", href: "/admin/dashboard#dashboard_sales_overview", page: "#dashboard_sales_overview", permission: "dashboard.main" },
          { key: "biz-orders", label: "Orders Overview", href: "/admin/dashboard#dashboard_orders_overview", page: "#dashboard_orders_overview", permission: "dashboard.main" },
          { key: "biz-shipping", label: "Shipping Overview", href: "/admin/dashboard#dashboard_logistics_overview", page: "#dashboard_logistics_overview", permission: "dashboard.main" },
          { key: "biz-products", label: "Product & Location Overview", href: "/admin/dashboard#dashboard_products_overview", page: "#dashboard_products_overview", permission: "dashboard.main" },
        ],
      },
      {
        key: "decision-control",
        label: "Decision & Control",
        icon: "Gauge",
        children: [
          { key: "vendors-scores", label: "Score Management", href: "/admin/vendors/scores", page: "score_management.php", permission: "vendors.scores" },
          { key: "reports", label: "Reports", href: "/admin/reports", permission: "reports" },
        ],
      },
    ],
  },
  {
    section: "Seller",
    items: [
      {
        key: "seller-dashboard",
        label: "Seller Dashboard",
        icon: "LayoutDashboard",
        children: [{ key: "dashboard-sellers", label: "Seller Overview", href: "/admin/dashboards/sellers", page: "seller_dashboard.php", permission: "dashboard.sellers" }],
      },
      {
        key: "seller-mgmt",
        label: "Seller Management",
        icon: "Store",
        children: [
          { key: "vendors-all", label: "All Sellers", href: "/admin/vendors", page: "seller.php", permission: "vendors" },
          { key: "vendors-new", label: "Add Seller", href: "/admin/vendors/new", page: "add_seller.php", permission: "vendors.add" },
          { key: "vendors-verification", label: "Seller Approval", href: "/admin/vendors/verification", page: "seller.php?status=pending", permission: "vendors.verification", badge: "pendingVendors" },
          { key: "vendors-reports", label: "Vendor Reports", href: "/admin/vendors/reports", permission: "vendors.reports" },
        ],
      },
      {
        key: "seller-catalog",
        label: "Seller Catalog",
        icon: "Package",
        children: [
          { key: "products-new", label: "Add Product", href: "/admin/products/new", page: "add_product.php", permission: "products", action: "add" },
          { key: "products-all", label: "Manage Product", href: "/admin/products", page: "manage_product.php", permission: "products" },
          { key: "pricing-cost-config", label: "Cost & Margin Management", href: "/admin/pricing/cost-config", page: "product_cost_management.php", permission: "pricing.costConfig" },
          { key: "products-pending", label: "Pending Products", href: "/admin/products/pending", page: "pending_products.php", permission: "products.approval", badge: "pendingProducts" },
          { key: "products-import", label: "Bulk Import / Update", href: "/admin/products/import", permission: "products.import" },
          { key: "products-inventory", label: "Inventory", href: "/admin/inventory", permission: "products", badge: "outOfStock" },
          { key: "products-stock-history", label: "Stock History", href: "/admin/inventory/history", permission: "products" },
        ],
      },
      {
        key: "catalog-master",
        label: "Catalog Master",
        icon: "FolderTree",
        children: [
          { key: "catalog-categories", label: "Category", href: "/admin/catalog/categories", page: "category.php", permission: "catalog.categories" },
          { key: "catalog-brands", label: "Brand", href: "/admin/catalog/brands", page: "brand.php", permission: "catalog.brands" },
          { key: "catalog-feature-categories", label: "Feature Category", href: "/admin/catalog/feature-categories", page: "feature_category.php", permission: "catalog.featureCategories" },
          { key: "catalog-crop-menu", label: "Crop Menu", href: "/admin/catalog/crop-menu", page: "shop_topics.php", permission: "catalog.cropMenu" },
          { key: "catalog-attributes", label: "Configuration Attributes", href: "/admin/catalog/attributes", page: "manage_conf_attributes.php", permission: "catalog.attributes" },
        ],
      },
      {
        key: "product-compliance",
        label: "Product Compliance",
        icon: "BadgeCheck",
        children: [
          { key: "catalog-hsn", label: "HSN Code", href: "/admin/catalog/hsn-codes", page: "manage_hsncode.php", permission: "catalog.hsn" },
          { key: "catalog-tax", label: "Tax Class", href: "/admin/catalog/tax-classes", page: "manage_tax_class.php", permission: "catalog.tax" },
          { key: "catalog-return-policies", label: "Return Policy", href: "/admin/catalog/return-policies", page: "manage_return_policy.php", permission: "catalog.returnPolicies" },
        ],
      },
      {
        key: "pricing-margin",
        label: "Pricing & Margin",
        icon: "IndianRupee",
        children: [
          { key: "pricing-master-nrv", label: "Master NRV", href: "/admin/pricing/master-nrv", page: "add_master_nrv.php", permission: "pricing.masterNrv" },
          { key: "pricing-calculator", label: "NRV Price Calculator", href: "/admin/pricing", permission: "pricing" },
          { key: "pricing-commission", label: "Seller Commission", href: "/admin/pricing/commission", permission: "pricing.commission" },
        ],
      },
      {
        key: "packaging",
        label: "Packaging",
        icon: "Boxes",
        children: [{ key: "shipping-boxes", label: "Vendor Package Boxes", href: "/admin/shipping/package-boxes", page: "vendor_package_boxes.php", permission: "shipping.boxes" }],
      },
      {
        key: "seller-reports",
        label: "Seller Reports",
        icon: "FileBarChart",
        children: [
          { key: "dashboard-product-overview", label: "Product Dashboard", href: "/admin/dashboards/product-overview", page: "product_dashboard.php", permission: "dashboard.productOverview" },
          { key: "dashboard-products", label: "Product Management Dashboard", href: "/admin/dashboards/products", page: "product_management_dashboard.php", permission: "dashboard.products" },
        ],
      },
    ],
  },
  {
    section: "Marketing",
    items: [
      {
        key: "mktg-dashboard",
        label: "Marketing Dashboard",
        icon: "Megaphone",
        children: [{ key: "marketing", label: "Marketing Management", href: "/admin/marketing", page: "social_media_dashboard.php", permission: "marketing" }],
      },
      {
        key: "spend-budget",
        label: "Spend & Budget",
        icon: "Wallet",
        children: [{ key: "marketing-expenses", label: "Marketing Expenses", href: "/admin/marketing/expenses", page: "marketing_expenses.php", permission: "marketing.expenses" }],
      },
      {
        key: "engagement",
        label: "Engagement",
        icon: "Users",
        children: [{ key: "marketing-engagement", label: "Engagement Panel", href: "/admin/marketing/engagement", page: "engagement_panel.php", permission: "marketing.engagement" }],
      },
      {
        key: "offers-promo",
        label: "Offers & Promotions",
        icon: "Tags",
        children: [{ key: "customers-coupons", label: "Offer & Coupon", href: "/admin/customers/coupons", page: "coupon.php", permission: "customers.coupons" }],
      },
      {
        key: "website-content",
        label: "Website Content",
        icon: "LayoutTemplate",
        children: [
          { key: "cms-home-sections", label: "Home Banner", href: "/admin/cms/home-sections", page: "newhomepage_website.php", permission: "cms" },
          { key: "cms-blogs", label: "Blogs", href: "/admin/cms/blogs", page: "blogs.php", permission: "cms" },
          { key: "cms-seo", label: "Custom Page", href: "/admin/cms/seo", page: "meta.php", permission: "cms.seo" },
          { key: "cms-pages", label: "Custom Add Pages", href: "/admin/cms/pages", page: "pages_custom.php", permission: "cms.pages" },
          { key: "cms-banners", label: "Banners", href: "/admin/cms/banners", permission: "cms" },
          { key: "cms-events", label: "Events", href: "/admin/cms/events", permission: "cms" },
          { key: "cms-faqs", label: "FAQs", href: "/admin/cms/faqs", permission: "cms" },
          { key: "cms-footer", label: "Footer Links", href: "/admin/cms/footer", permission: "cms" },
          { key: "cms-notifications", label: "Push Notifications", href: "/admin/cms/notifications", permission: "cms.notifications" },
        ],
      },
    ],
  },
  {
    section: "Sales",
    items: [
      {
        key: "sales-overview",
        label: "Sales Overview",
        icon: "LayoutDashboard",
        children: [{ key: "dashboard-orders", label: "Sales Dashboard", href: "/admin/dashboards/orders", page: "order_management_dashboard.php", permission: "dashboard.orders" }],
      },
      {
        key: "b2c-sales",
        label: "B2C Sales",
        icon: "ShoppingCart",
        children: [
          { key: "orders-all", label: "B2C Orders", href: "/admin/orders", page: "manage_orders.php", permission: "orders" },
          { key: "orders-whatsapp", label: "WhatsApp Orders", href: "/admin/orders/whatsapp", page: "whatsapp_orders.php", permission: "orders.whatsapp" },
          { key: "orders-new", label: "Create Order", href: "/admin/orders/new", page: "create_order.php", permission: "orders", action: "add" },
          { key: "orders-invoices", label: "Invoices", href: "/admin/orders/invoices", permission: "orders.invoices" },
          { key: "orders-transactions", label: "Date-wise Transactions", href: "/admin/orders/transactions", permission: "orders.transactions" },
          { key: "orders-report", label: "Order Reports", href: "/admin/orders/report", page: "orders_report.php", permission: "orders.transactions" },
          { key: "orders-sr-checkout", label: "Shiprocket Checkout", href: "/admin/orders/sr-checkout", permission: "orders.srCheckout" },
        ],
      },
      {
        key: "b2b-sales",
        label: "B2B Sales",
        icon: "Building2",
        children: [
          { key: "b2b-dashboard", label: "B2B Dashboard", href: "/admin/b2b", page: "b2b_orders/index.php", permission: "b2b" },
          { key: "b2b-buyers", label: "Buyers", href: "/admin/b2b/buyers", page: "b2b_orders/buyers.php", permission: "b2b.buyers" },
          { key: "b2b-rfqs", label: "RFQs", href: "/admin/b2b/rfqs", page: "b2b_orders/rfqs.php", permission: "b2b.rfqs", badge: "openRfqs" },
          { key: "b2b-quotations", label: "B2B Quotations", href: "/admin/b2b/quotations", page: "b2b_orders/b2b_quotations.php", permission: "b2b.quotations" },
          { key: "b2b-catalog", label: "Catalog / Products", href: "/admin/b2b/catalog", page: "b2b_orders/catalog.php", permission: "b2b.catalog" },
          { key: "b2b-orders", label: "B2B Orders List", href: "/admin/b2b/orders", page: "b2b_orders/b2b_order_list.php", permission: "b2b.orders" },
          { key: "b2b-approvals", label: "Approvals", href: "/admin/b2b/approvals", page: "b2b_orders/approvals.php", permission: "b2b.approvals" },
          { key: "b2b-reports", label: "B2B Reports", href: "/admin/b2b/reports", page: "b2b_orders/reports.php", permission: "b2b.reports" },
          { key: "b2b-payments", label: "Payments & Credit", href: "/admin/b2b/payments", permission: "b2b.finance" },
          { key: "b2b-claims", label: "Returns / Claims", href: "/admin/b2b/claims", permission: "b2b.orders" },
          { key: "b2b-alerts", label: "Alerts", href: "/admin/b2b/alerts", permission: "b2b" },
        ],
      },
      {
        key: "bulk-sales",
        label: "Bulk Sales",
        icon: "Boxes",
        children: [
          { key: "bulk-dashboard", label: "Bulk Order Dashboard", href: "/admin/bulk-orders/dashboard", page: "bulk_orders/index.php", permission: "bulk.dashboard" },
          { key: "bulk-inquiries", label: "Bulk Inquiry", href: "/admin/bulk-orders", page: "bulk_orders/bulk_inquiry.php", permission: "bulk" },
          { key: "bulk-quotations", label: "Quotations", href: "/admin/bulk-orders/quotations", page: "bulk_orders/quotations.php", permission: "bulk.quotations" },
          { key: "bulk-create", label: "Create Order", href: "/admin/bulk-orders/new", page: "bulk_orders/create_order.php", permission: "bulk.create" },
          { key: "bulk-orders", label: "All Orders", href: "/admin/bulk-orders/orders", page: "bulk_orders/orders.php", permission: "bulk.orders" },
          { key: "bulk-products", label: "Products", href: "/admin/bulk-orders/products", page: "bulk_orders/products.php", permission: "bulk.products" },
          { key: "bulk-warehouses", label: "Warehouses", href: "/admin/bulk-orders/warehouses", permission: "bulk" },
        ],
      },
      {
        key: "crm-leads",
        label: "CRM & Leads",
        icon: "Contact",
        children: [
          { key: "crm-dashboard", label: "Lead Dashboard", href: "/admin/crm", page: "lead_dashboard.php", permission: "crm" },
          { key: "crm-add-lead", label: "Add Lead", href: "/admin/crm/add-lead", page: "add_lead.php", permission: "crm.addLead" },
          { key: "crm-convert", label: "Convert to Leads", href: "/admin/crm/convert", page: "manage_engagement_leads.php", permission: "crm.convert" },
          { key: "crm-agent-leads", label: "Sales Agent Leads", href: "/admin/crm/agent-leads", page: "sales_agent_leads.php", permission: "crm.agentLeads" },
          { key: "crm-legacy", label: "Manage All Leads", href: "/admin/crm/legacy-leads", page: "manager_all_leads.php", permission: "crm.legacy" },
          { key: "crm-unassigned", label: "Unassigned Leads", href: "/admin/crm/unassigned", page: "pending_leads.php", permission: "crm.unassigned" },
          { key: "crm-dead", label: "Dead Leads", href: "/admin/crm/dead", page: "dead_leads.php", permission: "crm.dead" },
          { key: "crm-leads", label: "CRM Lead Sheet", href: "/admin/crm/leads", page: "crm_leads.php", permission: "crm.leads" },
          { key: "crm-tracking", label: "Customer Tracking", href: "/admin/crm/customer-tracking", page: "customer_search_tracking.php", permission: "crm.tracking" },
          { key: "crm-requested", label: "Requested Leads", href: "/admin/crm/requested", page: "report_requested_leads.php", permission: "crm.requested" },
          { key: "crm-follow-ups", label: "Follow-ups", href: "/admin/crm/follow-ups", permission: "crm.leads", badge: "dueFollowUps" },
          { key: "crm-whatsapp", label: "WhatsApp Leads", href: "/admin/crm/whatsapp", permission: "crm.whatsapp" },
          { key: "crm-circles", label: "Circle Assignment", href: "/admin/crm/circles", permission: "crm.circles" },
        ],
      },
      {
        key: "telesales",
        label: "Telesales",
        icon: "Phone",
        children: [
          { key: "crm-ai-calls", label: "AI Calling Agent", href: "/admin/crm/ai-calls", page: "vapi_calls.php", permission: "crm.aiCalls" },
          { key: "crm-call-audit", label: "AI Call Audit", href: "/admin/crm/call-audit", permission: "crm.callAudit" },
        ],
      },
      {
        key: "target-performance",
        label: "Target & Performance",
        icon: "Target",
        children: [
          { key: "sales-dashboard", label: "Sales Target Management", href: "/admin/sales", page: "sales_target_management.php", permission: "sales" },
          { key: "sales-my-performance", label: "My Sales Performance", href: "/admin/sales/my-performance", page: "my_sales_performance.php", permission: "sales.myPerformance" },
          { key: "sales-team-performance", label: "Team Performance", href: "/admin/sales/team-performance", page: "sales_performance_report.php", permission: "sales.teamPerformance" },
          { key: "sales-targets", label: "Targets", href: "/admin/sales/targets", permission: "sales.targets" },
          { key: "sales-salary", label: "Salary Structure", href: "/admin/sales/salary", permission: "sales.salary" },
          { key: "sales-achievements", label: "Achievements", href: "/admin/sales/achievements", permission: "sales.targets" },
          { key: "sales-payouts", label: "Sales Payouts", href: "/admin/sales/payouts", permission: "sales.payouts" },
          { key: "sales-prepaid", label: "Prepaid Incentive Setup", href: "/admin/sales/prepaid-incentive", permission: "sales.salary" },
        ],
      },
    ],
  },
  {
    section: "Operation",
    items: [
      {
        key: "ops-control",
        label: "Operations Control",
        icon: "RadioTower",
        children: [
          { key: "ops-team-dashboard", label: "Operations Dashboard", href: "/admin/operations/team", page: "operations_team/dashboard.php", permission: "operations.team" },
          { key: "ops-command", label: "Operations Center", href: "/admin/operations", page: "operations_center/index.php", permission: "operations.center" },
          { key: "ops-team-setup", label: "Setup", href: "/admin/operations/team/setup", page: "operations_team/setup.php", permission: "operations.setup" },
          { key: "ops-team-assign", label: "My Orders", href: "/admin/operations/team/assignments", page: "operations_team/agent_orders.php", permission: "operations.team" },
          { key: "ops-ndr", label: "NDR & Escalations", href: "/admin/operations/ndr", permission: "operations.center", badge: "openEscalations" },
          { key: "ops-recordings", label: "Call Recordings", href: "/admin/operations/recordings", permission: "operations.center" },
          { key: "ops-rules", label: "Rules & SLA", href: "/admin/operations/rules", permission: "operations.rules" },
        ],
      },
      {
        key: "order-fulfilment",
        label: "Order Fulfilment",
        icon: "ShoppingCart",
        children: [{ key: "ops-orders", label: "Manage Orders", href: "/admin/orders", page: "manage_orders.php", permission: "orders" }],
      },
      {
        key: "shipments",
        label: "Shipments",
        icon: "Truck",
        children: [
          { key: "shipping-shipments", label: "Shiprocket Orders", href: "/admin/shipping", page: "shiprocket_orders_report.php", permission: "shipping", badge: "pendingShipments" },
          { key: "shipping-delhivery", label: "Delhivery Orders", href: "/admin/shipping/delhivery", page: "shipment_order_delhivery.php", permission: "shipping.delhivery" },
          { key: "shipping-weight", label: "Weight Discrepancy", href: "/admin/shipping/weight-discrepancy", page: "weight_discrapancy.php", permission: "shipping.weight" },
          { key: "returns-all", label: "Return Shipments", href: "/admin/returns", page: "manage_returns.php", permission: "returns", badge: "pendingReturns" },
          { key: "orders-delivered", label: "Master Delivered Orders", href: "/admin/orders/delivered", page: "master_delivered_orders.php", permission: "orders.delivered" },
          { key: "returns-rto", label: "RTO Ledger", href: "/admin/rto", permission: "rto" },
          { key: "returns-reasons", label: "Return Reasons", href: "/admin/returns/reasons", permission: "returns" },
        ],
      },
      {
        key: "courier-serviceability",
        label: "Courier & Serviceability",
        icon: "MapPin",
        children: [
          { key: "shipping-pincodes", label: "Shiprocket Serviceability", href: "/admin/shipping/pincodes", page: "courier_serviceability.php", permission: "shipping.pincodes" },
          { key: "shipping-delhivery-pincodes", label: "Delhivery Serviceability", href: "/admin/shipping/delhivery-serviceability", page: "servicebilty_delhivery.php", permission: "shipping.delhiveryPincodes" },
          { key: "shipping-courier-slabs", label: "Courier Cost Slab", href: "/admin/shipping/courier-slabs", page: "courier_cost_slab_master.php", permission: "shipping.rates" },
          { key: "shipping-other-charges", label: "Other Charges", href: "/admin/shipping/other-charges", permission: "shipping.rates" },
        ],
      },
      {
        key: "pickup",
        label: "Pickup",
        icon: "Package",
        children: [
          { key: "shipping-pickup-addresses", label: "Pickup Addresses", href: "/admin/shipping/pickup-addresses", page: "pickup_addresses.php", permission: "shipping.pickupAddresses" },
          { key: "shipping-pickup-requests", label: "Pickup Update", href: "/admin/shipping/pickup-requests", page: "manage_pickup_requests.php", permission: "shipping.pickupRequests" },
        ],
      },
      {
        key: "b2b-ops",
        label: "B2B Operations",
        icon: "Building2",
        children: [
          { key: "b2b-ops-queue", label: "Operations Queue", href: "/admin/b2b/ops-queue", page: "b2b_orders/ops_queue.php", permission: "b2b.opsQueue" },
          { key: "b2b-logistics", label: "B2B Logistics", href: "/admin/b2b/logistics", page: "b2b_orders/logistics.php", permission: "b2b.logistics" },
        ],
      },
      {
        key: "bulk-ops",
        label: "Bulk Operations",
        icon: "Boxes",
        children: [{ key: "bulk-shipments", label: "Bulk Shipments", href: "/admin/bulk-orders/shipments", page: "bulk_orders/shipments.php", permission: "bulk.shipments" }],
      },
      {
        key: "ops-reports",
        label: "Operations Reports",
        icon: "FileBarChart",
        children: [
          { key: "ops-team-overall", label: "Overall Report", href: "/admin/operations/team/overall", page: "operations_team/overall_report.php", permission: "operations.overall" },
          { key: "ops-team-agents", label: "Agent Report", href: "/admin/operations/team/agents", page: "operations_team/agent_report.php", permission: "operations.team" },
          { key: "dashboard-logistics", label: "Logistics Operations Dashboard", href: "/admin/dashboards/logistics", page: "logistics_operations_dashboard.php", permission: "dashboard.logistics" },
        ],
      },
    ],
  },
  {
    section: "Tech",
    items: [
      {
        key: "tech-settings",
        label: "Technical Settings",
        icon: "Cpu",
        sensitive: true,
        children: [
          { key: "settings-scripts", label: "Script Settings", href: "/admin/settings/scripts", page: "script_settings.php", permission: "settings.scripts" },
          { key: "settings-smtp", label: "SMTP Settings", href: "/admin/settings/smtp", page: "smtp_settings.php", permission: "settings" },
          { key: "settings-sms", label: "SMS Settings", href: "/admin/settings/sms", page: "sms_settings.php", permission: "settings" },
          { key: "settings-integrations", label: "Integrations", href: "/admin/settings/integrations", permission: "settings" },
        ],
      },
    ],
  },
  {
    section: "Finance",
    items: [
      {
        key: "finance-dashboard",
        label: "Finance Dashboard",
        icon: "Landmark",
        sensitive: true,
        children: [{ key: "finance-pnl", label: "Finance Dashboard", href: "/admin/finance", page: "finance.php", permission: "finance" }],
      },
      {
        key: "rev-profit",
        label: "Revenue & Profitability",
        icon: "TrendingUp",
        sensitive: true,
        children: [
          { key: "finance-gmv-booked", label: "Booked GMV", href: "/admin/finance#gmv_booked", page: "finance.php#gmv_booked", permission: "finance" },
          { key: "finance-gmv-delivered", label: "Delivered GMV", href: "/admin/finance#gmv_delivered", page: "finance.php#gmv_delivered", permission: "finance" },
          { key: "finance-platform-revenue", label: "Platform Revenue / Take Rate", href: "/admin/finance#platform_revenue", page: "finance.php#platform_revenue", permission: "finance" },
          { key: "finance-cm-margin", label: "Contribution Margin / CM %", href: "/admin/finance#cm_margin", page: "finance.php#cm_margin", permission: "finance" },
          { key: "finance-net-profit", label: "Fixed Cost / Net Profit", href: "/admin/finance#net_profit", page: "finance.php#net_profit", permission: "finance" },
        ],
      },
      {
        key: "expenses",
        label: "Expenses",
        icon: "Receipt",
        children: [
          { key: "finance-fixed-expenses", label: "Fixed Expenses", href: "/admin/finance/fixed-expenses", page: "fixed_expenses.php", permission: "finance.expenses" },
          { key: "finance-expense-limits", label: "Expense Limit Dashboard", href: "/admin/finance/expense-limits", page: "expense_limit_dashboard.php", permission: "finance.expenses" },
        ],
      },
      {
        key: "seller-settlement",
        label: "Seller Settlement",
        icon: "Wallet",
        sensitive: true,
        children: [
          { key: "payouts-cycles", label: "Payout Vendor", href: "/admin/payouts", page: "payout_new.php", permission: "payouts" },
          { key: "finance-hold-ledger", label: "Hold Ledger", href: "/admin/finance/hold-ledger", page: "hold_ledger.php", permission: "finance.holdLedger" },
          { key: "b2b-settlements", label: "B2B Settlements", href: "/admin/b2b/settlements", page: "b2b_orders/settlements.php", permission: "b2b.finance" },
          { key: "payouts-items", label: "Payout Items", href: "/admin/payouts/items", permission: "payouts" },
          { key: "payouts-access", label: "Payout Access Settings", href: "/admin/payouts/access", permission: "payouts.access" },
          { key: "payouts-legacy", label: "Legacy Payments", href: "/admin/payouts/legacy", permission: "payouts" },
        ],
      },
      {
        key: "payment-refund",
        label: "Payment & Refund",
        icon: "Undo2",
        children: [{ key: "returns-refunds", label: "Refund Return Report", href: "/admin/refunds", page: "returns_refunds_report.php", permission: "refunds" }],
      },
      {
        key: "accts-reports",
        label: "Accounts & Reports",
        icon: "FileBarChart",
        sensitive: true,
        children: [
          { key: "dashboard-finance", label: "Finance Payout Dashboard", href: "/admin/dashboards/finance", page: "finance_payout_dashboard.php", permission: "dashboard.finance" },
          { key: "finance-ledger", label: "Ledger Management", href: "/admin/finance/ledger", permission: "finance.ledger" },
          { key: "finance-cod", label: "COD Reconciliation", href: "/admin/finance/cod", permission: "finance" },
          { key: "finance-gst", label: "GST & TCS", href: "/admin/finance/gst", permission: "finance.tax" },
          { key: "finance-wallet", label: "Wallet Withdrawals", href: "/admin/finance/wallet-withdrawals", permission: "finance.wallet" },
        ],
      },
      {
        key: "fin-risk",
        label: "Risk",
        icon: "ShieldAlert",
        children: [{ key: "finance-fraud", label: "Fraud Analysis Dashboard", href: "/admin/finance/fraud", page: "fraud_analysis_dashboard.php", permission: "finance.fraud" }],
      },
    ],
  },
  {
    section: null,
    items: [{ key: "hiring-applications", label: "Job Applications", icon: "Briefcase", href: "/admin/hiring/applications", page: "vacancy_applications.php", permission: "hiring.applications" }],
  },
  {
    section: "Support",
    items: [
      {
        key: "support-dashboard",
        label: "Support Dashboard",
        icon: "LifeBuoy",
        children: [
          { key: "support-tickets", label: "Helpdesk / Support", href: "/admin/support", page: "support/admin_dashboard.php", permission: "support", badge: "openTickets" },
          { key: "support-sla", label: "Departments & SLA", href: "/admin/support/sla", permission: "support.settings" },
        ],
      },
      {
        key: "communication",
        label: "Communication",
        icon: "MessagesSquare",
        children: [{ key: "support-chat-logs", label: "Chatbot Logs", href: "/admin/support/chat-logs", page: "chat_logs.php", permission: "support.chatLogs" }],
      },
      {
        key: "requests",
        label: "Requests",
        icon: "ClipboardList",
        children: [{ key: "support-requirements", label: "Requirement Requests", href: "/admin/support/requirements", page: "requirement_requests.php", permission: "support.requirements" }],
      },
      {
        key: "reviews",
        label: "Reviews",
        icon: "Star",
        children: [
          { key: "customers-pending-reviews", label: "Pending Reviews", href: "/admin/customers/reviews/pending", page: "product_review.php", permission: "customers.pendingReviews" },
          { key: "customers-reviews", label: "Manage Reviews", href: "/admin/customers/reviews", page: "manage_review.php", permission: "customers.reviews" },
        ],
      },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        key: "user-staff",
        label: "User & Staff",
        icon: "Users",
        children: [
          { key: "customers-all", label: "Manage All User", href: "/admin/customers", page: "app-user.php", permission: "customers" },
          { key: "users-new", label: "Add Staff", href: "/admin/users/new", page: "add-staff.php", permission: "users.add" },
          { key: "access-users", label: "Staff User", href: "/admin/users", page: "manage-staff.php", permission: "users" },
        ],
      },
      {
        key: "roles-permissions",
        label: "Roles & Permissions",
        icon: "ShieldCheck",
        sensitive: true,
        children: [
          { key: "access-roles", label: "Manage Role", href: "/admin/roles", page: "manage-role.php", permission: "roles" },
          { key: "access-menus", label: "Menu Master", href: "/admin/roles/menus", page: "menu-master.php", permission: "roles.menus" },
          { key: "access-audit", label: "Audit Log", href: "/admin/audit", permission: "audit" },
        ],
      },
      {
        key: "business-rules",
        label: "Business Rules",
        icon: "Settings",
        children: [
          { key: "masters-reject-reasons", label: "Manage Reject Reason", href: "/admin/masters/reject-reasons", page: "reject-reason.php", permission: "masters" },
          { key: "shipping-slabs", label: "Manage Shipping Slabs", href: "/admin/shipping/slabs", page: "manage_shipping_slabs.php", permission: "shipping.rates" },
          { key: "shipping-min-order", label: "Manage Minimum Order", href: "/admin/shipping/minimums#minimum-order", page: "manage_minimum_order.php", permission: "shipping.rules" },
          { key: "shipping-min-cod", label: "Manage Minimum COD", href: "/admin/shipping/minimums#minimum-cod", page: "manage_minimum_cod.php", permission: "shipping.rules" },
          { key: "shipping-cod-rules", label: "Manage COD State Rule", href: "/admin/shipping/cod-rules", page: "manage_cod_state_rule.php", permission: "shipping.rules" },
        ],
      },
      {
        key: "general-settings",
        label: "General Settings",
        icon: "Settings",
        sensitive: true,
        children: [
          { key: "settings-system", label: "General Settings", href: "/admin/settings", page: "system_settings.php", permission: "settings" },
          { key: "settings-languages", label: "Language Settings", href: "/admin/settings/languages", page: "language_settings.php", permission: "settings" },
          { key: "masters-currency", label: "Currency Settings", href: "/admin/masters/currency", page: "currency_settings.php", permission: "masters" },
          { key: "masters-geography", label: "Country / State / City", href: "/admin/masters/geography", permission: "masters" },
        ],
      },
      {
        key: "templates",
        label: "Templates",
        icon: "Mail",
        children: [{ key: "settings-email-templates", label: "Email Template", href: "/admin/settings/email-templates", page: "email_template.php", permission: "settings" }],
      },
      {
        key: "ui-website-settings",
        label: "UI / Website Settings",
        icon: "LayoutTemplate",
        children: [{ key: "settings-login-modal", label: "Login Modal", href: "/admin/settings/login-modal", page: "signup_modal_settings.php", permission: "settings.loginModal" }],
      },
    ],
  },
  {
    section: null,
    items: [{ key: "hiring-vacancies", label: "Hiring Vacancies", icon: "Briefcase", href: "/admin/hiring/vacancies", page: "vacancies.php", permission: "hiring.vacancies" }],
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

const pathOf = (href) => (href || "").split(/[?#]/)[0];

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
  const leaves = flattenNavigation().filter((item) => item.href);
  const exact = leaves.find((item) => pathOf(item.href) === pathname);
  if (exact) return exact;
  return leaves
    .filter((item) => pathname.startsWith(`${pathOf(item.href)}/`))
    .sort((a, b) => pathOf(b.href).length - pathOf(a.href).length)[0];
}

export function getBreadcrumbs(pathname) {
  const crumbs = [{ label: "Admin", href: "/admin/dashboard" }];
  const exact = flattenNavigation().find((item) => item.href && pathOf(item.href) === pathname);
  if (exact) {
    if (exact.group) crumbs.push({ label: exact.group.label });
    crumbs.push({ label: exact.label, href: pathOf(exact.href) });
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
    crumbs.push({ label: nearest.label, href: pathOf(nearest.href) });
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
          group: item.children ? item.label : section.section || leaf.label,
          section: section.section || leaf.label,
          sensitive: Boolean(item.sensitive),
        });
      }
    }
  }
  return [...seen.values()];
}
