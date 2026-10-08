import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth/session";
import { lookupOptions } from "@/lib/services/admin/resources";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Category" };

/**
 * category.php: categories one level at a time. ?parentId=<id> shows a
 * category's sub categories (0 = top level), with the breadcrumb the PHP page
 * builds (get_category_data.php bradcumb).
 */
export default async function CategoriesPage({ searchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp?.parentId) ? sp.parentId[0] : sp?.parentId;
  const parentId = /^\d+$/.test(raw ?? "") ? raw : "0";
  const user = await getCurrentAdmin();
  const path = parentId !== "0" && user ? await lookupOptions(`lookup:category-path?id=${parentId}`, user) : [];

  return (
    <ResourcePage resourceKey="catalog.categories" pathname="/admin/catalog/categories" searchParams={{ ...sp, parentId }}>
      <nav aria-label="Category level" className="mb-3 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/admin/catalog/categories" className="font-medium text-brand-700 hover:underline">
          Category
        </Link>
        {path.map((crumb) => (
          <span key={crumb.value} className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-ink-muted" aria-hidden />
            {crumb.value === parentId ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link href={`/admin/catalog/categories?parentId=${crumb.value}`} className="text-brand-700 hover:underline">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </ResourcePage>
  );
}
