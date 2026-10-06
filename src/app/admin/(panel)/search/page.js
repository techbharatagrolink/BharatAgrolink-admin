import Link from "next/link";
import { SearchX } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { globalSearch } from "@/lib/services/admin/search";
import { PageHeader } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }) {
  const user = await requireAdmin();
  const { q } = await searchParams;
  const result = await globalSearch(Array.isArray(q) ? q[0] : q, user);

  return (
    <>
      <PageHeader title={result.q ? `Results for “${result.q}”` : "Search"} description={result.q.length >= 2 ? `${result.total} matches in the modules you can access.` : "Type at least 2 characters in the search box above."} />
      {result.q.length >= 2 && !result.groups.length && (
        <Card><EmptyState icon={SearchX} title="No matches" description="Try an order ID, AWB, SKU, vendor name or a 10-digit mobile number." /></Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {result.groups.map((g) => (
          <Card key={g.key}>
            <CardHeader title={g.label} actions={<Link href={g.href} className="text-[13px] font-medium text-brand-700 hover:underline">Open list</Link>} />
            <ul className="divide-y divide-line">
              {g.hits.map((h) => (
                <li key={h.id}>
                  <Link href={h.href} className="block px-4 py-2.5 transition-colors hover:bg-surface-muted">
                    <span className="block truncate text-sm font-medium text-ink">{h.title}</span>
                    <span className="block truncate text-[13px] text-ink-muted">{h.subtitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
