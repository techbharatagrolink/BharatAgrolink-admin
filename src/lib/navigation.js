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
