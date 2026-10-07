const screen = (slug) => `/screens/${slug}`;

export const navigation = [
  {
    section: "Overview",
    items: [{ key: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" }],
  },
  {
    section: "Commerce",
    items: [
      {
        key: "orders",
        label: "Orders",
        icon: "ShoppingCart",
        children: [
          { key: "orders-overview", label: "Overview", href: "/orders" },
          { key: "orders-list", label: "Order List", href: "/orders/list" },
          { key: "orders-rto", label: "RTO Analysis", href: "/orders/rto" },
          { key: "orders-payment", label: "COD vs Prepaid", href: "/orders/payment" },
        ],
      },
      {
        key: "products",
        label: "Products",
        icon: "Package",
        children: [
          { key: "products-all", label: "All Products", href: "/products" },
          { key: "products-approval", label: "Approval", href: "/products/approval" },
        ],
      },
      { key: "vendors", label: "Vendors", icon: "Users", href: "/vendors" },
      { key: "sales", label: "Sales", icon: "TrendingUp", href: "/sales" },
    ],
  },
  {
    section: "Operations",
    items: [
      { key: "logistics", label: "Logistics", icon: "Truck", href: "/logistics" },
      { key: "finance", label: "Finance", icon: "DollarSign", href: "/finance" },
      {
        key: "marketing",
        label: "Marketing",
        icon: "LineChart",
        children: [
          { key: "marketing-campaigns", label: "Campaigns", href: "/marketing" },
          { key: "marketing-coupons", label: "Coupons", href: "/marketing/coupons" },
        ],
      },
      { key: "support", label: "Support", icon: "Headphones", href: "/support" },
    ],
  },
  {
    section: "System",
    items: [
      { key: "settings", label: "Settings", icon: "Settings", href: "/settings" },
      { key: "profile", label: "Profile", icon: "UserCircle", href: "/profile" },
    ],
  },
  {
    section: "Seller",
    items: [
      { key: "seller-dashboard", label: "Seller Overview", icon: "Store", href: screen("seller-dashboard") },
      {
        key: "seller-management",
        label: "Seller Management",
        icon: "Users",
        children: [
          { key: "seller-all", label: "All Sellers", href: "/vendors" },
          { key: "seller-approval", label: "Seller Approval", href: screen("seller-approval") },
        ],
      },
      {
        key: "seller-catalog",
        label: "Seller Catalog",
        icon: "Package",
        children: [
          { key: "seller-products", label: "Manage Product", href: "/products" },
          { key: "seller-pending", label: "Pending Products", href: "/products/approval" },
          { key: "seller-cost", label: "Cost & Margin", href: screen("cost-margin") },
          { key: "seller-product-dashboard", label: "Product Dashboard", href: screen("product-dashboard") },
        ],
      },
      {
        key: "catalog-master",
        label: "Catalog Master",
        icon: "FolderTree",
        children: [
          { key: "catalog-categories", label: "Category", href: screen("categories") },
          { key: "catalog-brands", label: "Brand", href: screen("brands") },
          { key: "catalog-features", label: "Feature Category", href: screen("feature-categories") },
          { key: "catalog-crops", label: "Crop Menu", href: screen("crop-menu") },
          { key: "catalog-attributes", label: "Configuration Attributes", href: screen("attributes") },
        ],
      },
      {
        key: "product-compliance",
        label: "Product Compliance",
        icon: "BadgeCheck",
        children: [
          { key: "compliance-hsn", label: "HSN Code", href: screen("hsn-codes") },
          { key: "compliance-tax", label: "Tax Class", href: screen("tax-classes") },
          { key: "compliance-returns", label: "Return Policy", href: screen("return-policies") },
        ],
      },
      { key: "pricing-nrv", label: "Master NRV", icon: "BadgePercent", href: screen("master-nrv") },
      { key: "packaging", label: "Vendor Package Boxes", icon: "Boxes", href: screen("package-boxes") },
      { key: "seller-reports", label: "Product Management", icon: "LineChart", href: screen("product-management") },
    ],
  },
  {
    section: "Marketing",
    items: [
      { key: "mkt-dashboard", label: "Marketing Management", icon: "Megaphone", href: "/marketing" },
      { key: "mkt-expenses", label: "Marketing Expenses", icon: "Wallet", href: "/marketing" },
      {
        key: "mkt-engagement",
        label: "Engagement",
        icon: "MessageSquare",
        children: [
          { key: "mkt-cart", label: "Cart Tracking", href: screen("cart-tracking") },
          { key: "mkt-viewed", label: "Recently Viewed", href: screen("recently-viewed") },
        ],
      },
      { key: "mkt-coupons", label: "Offer & Coupon", icon: "BadgePercent", href: "/marketing/coupons" },
      {
        key: "mkt-content",
        label: "Website Content",
        icon: "Globe",
        children: [
          { key: "mkt-banner", label: "Home Banner", href: screen("home-banner") },
          { key: "mkt-blogs", label: "Blogs", href: screen("blogs") },
          { key: "mkt-seo", label: "Custom Page", href: screen("seo-pages") },
          { key: "mkt-pages", label: "Custom Add Pages", href: screen("custom-pages") },
        ],
      },
    ],
  },
  {
    section: "Sales",
    items: [
      { key: "sales-dashboard", label: "Sales Dashboard", icon: "TrendingUp", href: screen("order-dashboard") },
      {
        key: "b2c-sales",
        label: "B2C Sales",
        icon: "ShoppingCart",
        children: [
          { key: "b2c-orders", label: "B2C Orders", href: "/orders" },
          { key: "b2c-whatsapp", label: "WhatsApp Orders", href: screen("whatsapp-orders") },
        ],
      },
      {
        key: "b2b-sales",
        label: "B2B Sales",
        icon: "Building2",
        children: [
          { key: "b2b-dashboard", label: "B2B Dashboard", href: screen("b2b-reports") },
          { key: "b2b-buyers", label: "Buyers", href: screen("b2b-buyers") },
          { key: "b2b-rfqs", label: "RFQs", href: screen("b2b-rfqs") },
          { key: "b2b-quotes", label: "B2B Quotations", href: screen("b2b-quotations") },
          { key: "b2b-approvals", label: "Approvals", href: screen("b2b-quotations") },
          { key: "b2b-catalog", label: "Catalog / Products", href: screen("b2b-catalog") },
          { key: "b2b-orders", label: "B2B Orders List", href: screen("b2b-orders") },
          { key: "b2b-reports", label: "B2B Reports", href: screen("b2b-reports") },
        ],
      },
      { key: "bulk-inquiry", label: "Bulk Inquiry", icon: "Boxes", href: screen("bulk-inquiries") },
      {
        key: "crm-leads",
        label: "CRM & Leads",
        icon: "Contact",
        children: [
          { key: "lead-dashboard", label: "Lead Dashboard", href: screen("lead-dashboard") },
          { key: "crm-sheet", label: "CRM Lead Sheet", href: screen("crm-leads") },
          { key: "all-leads", label: "Manage All Leads", href: screen("all-leads") },
          { key: "unassigned-leads", label: "Unassigned Leads", href: screen("unassigned-leads") },
          { key: "dead-leads", label: "Dead Leads", href: screen("dead-leads") },
          { key: "ai-calls", label: "AI Calling Agent", href: screen("ai-calls") },
          { key: "customer-tracking", label: "Customer Tracking", href: screen("search-terms") },
        ],
      },
      {
        key: "sales-targets",
        label: "Target & Performance",
        icon: "Target",
        children: [
          { key: "sales-target-list", label: "Sales Target Management", href: screen("sales-targets") },
          { key: "team-performance", label: "Team Performance", href: screen("sales-performance") },
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
        icon: "Radio",
        children: [
          { key: "ops-dashboard", label: "Operations Dashboard", href: screen("ops-team") },
          { key: "ops-center", label: "Operations Center", href: screen("ops-center") },
          { key: "ops-setup", label: "Setup", href: screen("ops-setup") },
          { key: "ops-my-orders", label: "My Orders", href: screen("my-orders") },
        ],
      },
      {
        key: "ops-shipments",
        label: "Shipments",
        icon: "Truck",
        children: [
          { key: "ops-shiprocket", label: "Shiprocket Orders", href: screen("shiprocket-orders") },
          { key: "ops-delhivery", label: "Delhivery Orders", href: screen("delhivery-orders") },
          { key: "ops-weight", label: "Weight Discrepancy", href: screen("weight-discrepancy") },
          { key: "ops-returns", label: "Return Shipments", href: screen("return-shipments") },
        ],
      },
      {
        key: "ops-courier",
        label: "Courier & Serviceability",
        icon: "MapPin",
        children: [
          { key: "ops-slabs", label: "Courier Cost Slab", href: screen("courier-slabs") },
          { key: "ops-pincodes", label: "Shiprocket Serviceability", href: screen("pincodes") },
        ],
      },
      {
        key: "ops-pickup",
        label: "Pickup",
        icon: "Warehouse",
        children: [
          { key: "ops-pickup-addresses", label: "Pickup Addresses", href: screen("pickup-addresses") },
          { key: "ops-pickup-requests", label: "Pickup Update", href: screen("pickup-requests") },
        ],
      },
      {
        key: "ops-b2b",
        label: "B2B Operations",
        icon: "ClipboardList",
        children: [
          { key: "ops-b2b-queue", label: "Operations Queue", href: screen("b2b-ops") },
          { key: "ops-b2b-logistics", label: "B2B Logistics", href: screen("b2b-logistics") },
        ],
      },
      { key: "ops-agents", label: "Agent Report", icon: "Users", href: screen("agent-report") },
      { key: "ops-logistics-dash", label: "Logistics Dashboard", icon: "Truck", href: "/logistics" },
    ],
  },
  {
    section: "Tech",
    items: [
      { key: "tech-smtp", label: "SMTP Settings", icon: "Mail", href: screen("smtp") },
      { key: "tech-sms", label: "SMS Settings", icon: "MessageSquare", href: screen("sms") },
    ],
  },
  {
    section: "Finance",
    items: [
      { key: "finance-dash", label: "Finance Dashboard", icon: "DollarSign", href: "/finance" },
      { key: "finance-fixed", label: "Fixed Expenses", icon: "Receipt", href: screen("fixed-expenses") },
      { key: "finance-limits", label: "Expense Limits", icon: "Wallet", href: screen("expense-limits") },
      {
        key: "finance-settlement",
        label: "Seller Settlement",
        icon: "Landmark",
        children: [
          { key: "finance-payouts", label: "Payout Vendor", href: screen("payouts") },
          { key: "finance-hold", label: "Hold Ledger", href: screen("hold-ledger") },
          { key: "finance-b2b", label: "B2B Settlements", href: screen("b2b-settlements") },
        ],
      },
      { key: "finance-refunds", label: "Refund Return Report", icon: "Undo2", href: screen("refunds") },
      { key: "finance-payout-dash", label: "Finance Payout Dashboard", icon: "LineChart", href: screen("finance-payout") },
    ],
  },
  {
    section: "Support",
    items: [
      { key: "support-desk", label: "Helpdesk / Support", icon: "Headphones", href: "/support" },
      { key: "support-chat", label: "Chatbot Logs", icon: "MessageSquare", href: screen("chat-sessions") },
      { key: "support-requests", label: "Requirement Requests", icon: "ClipboardList", href: screen("requirement-requests") },
      { key: "support-vacancies", label: "Hiring Vacancies", icon: "Contact", href: screen("vacancies") },
      {
        key: "support-reviews",
        label: "Reviews",
        icon: "Star",
        children: [
          { key: "reviews-pending", label: "Pending Reviews", href: screen("pending-reviews") },
          { key: "reviews-manage", label: "Manage Reviews", href: screen("reviews") },
        ],
      },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        key: "admin-people",
        label: "User & Staff",
        icon: "Users",
        children: [
          { key: "admin-users", label: "Manage All User", href: screen("customers") },
          { key: "admin-staff", label: "Staff User", href: screen("staff") },
        ],
      },
      {
        key: "admin-access",
        label: "Roles & Permissions",
        icon: "Shield",
        children: [
          { key: "admin-roles", label: "Manage Role", href: screen("roles") },
          { key: "admin-menus", label: "Menu Master", href: screen("menus") },
        ],
      },
      {
        key: "admin-rules",
        label: "Business Rules",
        icon: "Scale",
        children: [
          { key: "admin-reject", label: "Manage Reject Reason", href: screen("reject-reasons") },
          { key: "admin-slabs", label: "Manage Shipping Slabs", href: screen("shipping-slabs") },
          { key: "admin-minimum-order", label: "Manage Minimum Order", href: screen("minimums") },
          { key: "admin-minimum-cod", label: "Manage Minimum COD", href: screen("minimums") },
          { key: "admin-cod", label: "Manage COD State Rule", href: screen("cod-rules") },
        ],
      },
      {
        key: "admin-settings",
        label: "General Settings",
        icon: "Settings",
        children: [
          { key: "admin-system", label: "General Settings", href: screen("system-settings") },
          { key: "admin-languages", label: "Language Settings", href: screen("languages") },
          { key: "admin-currency", label: "Currency Settings", href: screen("currency") },
        ],
      },
      { key: "admin-email", label: "Email Template", icon: "Mail", href: screen("email-templates") },
    ],
  },
  {
    section: "Founder",
    items: [
      { key: "founder-overview", label: "Overview", icon: "LayoutDashboard", href: "/dashboard" },
      { key: "founder-business", label: "Business Dashboard", icon: "LineChart", href: screen("business-dashboard") },
      { key: "founder-matrix", label: "CEO Decision Matrix", icon: "Scale", href: screen("ceo-matrix") },
      { key: "founder-scores", label: "Score Management", icon: "Target", href: screen("seller-scores") },
    ],
  },
];

function leaves() {
  const items = [];
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href) items.push({ ...item, group: null, section: section.section });
      for (const child of item.children || []) items.push({ ...child, group: item.label, section: section.section, icon: item.icon });
    }
  }
  return items;
}

export function getBreadcrumbs(pathname) {
  const path = pathname === "/" ? "/dashboard" : pathname;
  const crumbs = [{ label: "Admin", href: "/dashboard" }];
  const exact = leaves().find((item) => item.href === path);
  const nearest =
    exact ||
    leaves()
      .filter((item) => item.href !== "/dashboard" && path.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
  if (!nearest) return crumbs;
  if (nearest.group) crumbs.push({ label: nearest.group });
  crumbs.push({ label: nearest.label, href: nearest.href });
  return crumbs;
}
