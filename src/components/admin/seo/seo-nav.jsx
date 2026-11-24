"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** Screens of the SEO & AI Command Center, in the order of the reference design. */
export const SEO_SCREENS = [
  { href: "/admin/seo", label: "CEO Overview" },
  { href: "/admin/seo/search", label: "SEO & Google" },
  { href: "/admin/seo/ai-visibility", label: "AI Recommendations" },
  { href: "/admin/seo/orders", label: "Orders & Revenue" },
  { href: "/admin/seo/website-health", label: "Website Health" },
  { href: "/admin/seo/product-data", label: "Product Data" },
  { href: "/admin/seo/tasks", label: "Tasks & Team" },
  { href: "/admin/seo/reports", label: "Reports" },
  { href: "/admin/seo/settings", label: "Settings" },
];

/**
 * Section tabs. The selected date range (?from&to) travels with every tab so all
 * date-dependent screens stay on the same period. Scrolls sideways on small screens.
 */
export function SeoNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const keep = new URLSearchParams();
  for (const key of ["from", "to"]) if (params.get(key)) keep.set(key, params.get(key));
  const suffix = keep.size ? `?${keep.toString()}` : "";

  return (
    <div className="-mx-1 mb-4 overflow-x-auto scrollbar-thin print:hidden">
      <nav className="flex min-w-max gap-1 border-b border-line px-1" aria-label="SEO & AI Command Center">
        {SEO_SCREENS.map((s) => {
          const active = s.href === "/admin/seo" ? pathname === s.href : pathname === s.href || pathname.startsWith(`${s.href}/`);
          return (
            <Link
              key={s.href}
              href={`${s.href}${suffix}`}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex h-9 items-center border-b-2 px-3 text-sm font-medium transition-colors",
                active ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
