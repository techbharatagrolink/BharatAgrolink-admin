"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  TrendingUp,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

// Only routes that exist under src/app are listed here.
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
      { name: "Overview", path: "/orders" },
      { name: "Order List", path: "/orders/list" },
      { name: "RTO Analysis", path: "/orders/rto" },
      { name: "COD vs Prepaid", path: "/orders/payment" },
    ],
  },
  {
    name: "Products",
    icon: <Package size={18} />,
    children: [
      { name: "All Products", path: "/products" },
      { name: "Approval", path: "/products/approval" },
    ],
  },
  {
    name: "Vendors",
    icon: <Users size={18} />,
    path: "/vendors",
  },
  {
    name: "Sales",
    icon: <TrendingUp size={18} />,
    path: "/sales",
  },
  {
    name: "Logistics",
    icon: <Truck size={18} />,
    path: "/logistics",
  },
  {
    name: "Finance",
    icon: <DollarSign size={18} />,
    path: "/finance",
  },
  {
    name: "Marketing",
    icon: <LineChart size={18} />,
    children: [
      { name: "Campaigns", path: "/marketing" },
      { name: "Coupons", path: "/marketing/coupons" },
    ],
  },
  {
    name: "Support",
    icon: <Headphones size={18} />,
    path: "/support",
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
  },
  {
    name: "Profile",
    icon: <UserCircle size={18} />,
    path: "/profile",
  },
];

const isActive = (pathname, path) => pathname === path || (path === "/dashboard" && pathname === "/");
const sectionIndexFor = (pathname) =>
  sidebarItems.findIndex((item) => item.children?.some((sub) => isActive(pathname, sub.path)));

function NavItems({ pathname, onNavigate }) {
  const [openMenu, setOpenMenu] = useState(() => sectionIndexFor(pathname));
  const [lastPathname, setLastPathname] = useState(pathname);

  // Open the section of the current page after client-side navigation.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    const section = sectionIndexFor(pathname);
    if (section !== -1) setOpenMenu(section);
  }

  const rowClass = "flex w-full items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400";

  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      {sidebarItems.map((item, i) => {
        if (!item.children) {
          const active = isActive(pathname, item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(rowClass, active && "bg-gray-200 font-medium")}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </span>
            </Link>
          );
        }

        const sectionActive = item.children.some((sub) => isActive(pathname, sub.path));
        const open = openMenu === i;
        const panelId = `sidebar-section-${i}`;
        return (
          <div key={item.name}>
            <button
              type="button"
              className={cn(rowClass, "cursor-pointer text-left", sectionActive && "bg-gray-200 font-medium")}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenMenu(open ? -1 : i)}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </span>
              <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} aria-hidden="true" />
            </button>

            {open && (
              <div id={panelId} className="pl-10 space-y-1 mt-1">
                {item.children.map((sub) => {
                  const active = isActive(pathname, sub.path);
                  return (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded py-1 text-sm text-gray-700 hover:text-black hover:font-medium focus-visible:outline-2 focus-visible:outline-gray-400",
                        active && "font-semibold text-black"
                      )}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="rounded-md p-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-gray-400"
        >
          <Menu size={20} />
        </button>
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 min-h-screen border-r bg-white p-4">
        <h2 className="text-xl font-semibold mb-5">Admin Panel</h2>
        <NavItems pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close navigation menu"
                autoFocus
                className="rounded-md p-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <NavItems pathname={pathname} onNavigate={closeMobile} />
          </aside>
        </div>
      )}
    </>
  );
}
