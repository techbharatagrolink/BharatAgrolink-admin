"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
  Headphones,
  Settings,
  LineChart,
} from "lucide-react";

const sidebarItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    name: "Orders",
    icon: <ShoppingCart size={18} />,
    children: [
      { name: "Order List", path: "/orders" },
      { name: "RTO Analysis", path: "/orders/rto" },
      { name: "COD vs Prepaid", path: "/orders/cod" },
    ],
    path: "/orders/list",
    subMenu: [
      { name: "Order List", path: "/orders/list" },
      { name: "RTO Analysis", path: "/orders/rto" },
      { name: "Payment Report", path: "/orders/payment" },
    ],
  },
  {
    name: "Products",
    icon: <Package size={18} />,
    children: [
      { name: "All Products", path: "/products" },
      { name: "Approval", path: "/products/approval" },
      { name: "Pricing & Margin", path: "/products/pricing" },
    ],
  },
  {
    name: "Vendors",
    icon: <Users size={18} />,
    children: [
      { name: "Vendor List", path: "/vendors" },
      { name: "KYC Status", path: "/vendors/kyc" },
      { name: "Settlements", path: "/vendors/settlements" },
    ],
  },
  {
    name: "Logistics",
    icon: <Truck size={18} />,
    children: [
      { name: "Shipments", path: "/logistics" },
      { name: "Pincode Coverage", path: "/logistics/pincode" },
      { name: "Courier Performance", path: "/logistics/performance" },
    ],
  },
  {
    name: "Finance",
    icon: <DollarSign size={18} />,
    children: [
      { name: "Reports", path: "/finance" },
      { name: "GST Summary", path: "/finance/gst" },
      { name: "Payouts", path: "/finance/payouts" },
    ],
  },
  {
    name: "Marketing",
    icon: <LineChart size={18} />,
    children: [
      { name: "Campaigns", path: "/marketing" },
      { name: "Coupons", path: "/marketing/coupons" },
      { name: "SEO Tools", path: "/marketing/seo" },
    ],
  },
  {
    name: "Support",
    icon: <Headphones size={18} />,
    children: [
      { name: "Tickets", path: "/support" },
      { name: "Feedback", path: "/support/feedback" },
    ],
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="w-64 min-h-screen border-r bg-white p-4 space-y-2">
      <h2 className="text-xl font-semibold mb-5">Admin Panel</h2>

      {sidebarItems.map((item, i) => (
        <div key={i}>
          <div
            className={cn(
              "flex items-center justify-between px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100",
              pathname.startsWith(item.path) && "bg-gray-200"
            )}
            onClick={() => setOpenMenu(openMenu === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.name}</span>
            </div>
            {item.children && <ChevronDown size={16} />}
          </div>

          {item.children && openMenu === i && (
            <div className="pl-10 space-y-2 mt-1">
              {item.children.map((sub, j) => (
                <Link
                  key={j}
                  href={sub.path}
                  className={cn(
                    "block text-sm text-gray-700 hover:text-black hover:font-medium cursor-pointer",
                    pathname === sub.path && "font-semibold text-black"
                  )}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
