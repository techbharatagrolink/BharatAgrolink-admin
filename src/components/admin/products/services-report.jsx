import Link from "next/link";
import { formatINR, formatNumber } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the "products by seller service" reports
 * (/admin/products/with-services and category-scoped pages like
 * /admin/marketing/products-with-services). Each page scans the live
 * products list, picks the services it cares about, and renders these.
 */

export function chargeText(s) {
  return s.chargeType === "FIXED_PER_UNIT" ? `₹${s.chargeValue}/unit` : `${s.chargeValue}%`;
}

/** One entry per distinct service, with how many of the given products have it selected. */
export function groupByService(rows) {
  const map = new Map();
  for (const p of rows) {
    for (const s of p.services ?? []) {
      const key = String(s.code ?? s.name);
      if (!map.has(key)) map.set(key, { key, name: s.name, category: s.category, chargeType: s.chargeType, chargeValue: s.chargeValue, count: 0 });
      map.get(key).count += 1;
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function ServiceBadges({ services, baseHref }) {
  return (
    <div className="flex flex-wrap gap-1 max-w-[320px]">
      {services.map((s, idx) => (
        <Link
          key={s.code ?? idx}
          href={`${baseHref}?service=${encodeURIComponent(String(s.code ?? s.name))}`}
          title={s.category ? `Filter by ${s.category}` : "Filter by this service"}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
        >
          {s.name} ({chargeText(s)})
        </Link>
      ))}
    </div>
  );
}

export function ServiceCardsGrid({ baseHref, serviceGroups, selectedKey, totalCount }) {
  if (!serviceGroups.length) return null;
  return (
    <Card className="mb-4">
      <CardHeader title="By service" description="Click a service to see only the products that have it selected." />
      <CardBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Link
            href={baseHref}
            className={cn(
              "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
              !selectedKey ? "border-brand-600 bg-brand-50" : "border-line",
            )}
          >
            <p className="text-sm font-semibold text-ink">All services</p>
            <p className="mt-1.5 text-xl font-semibold tabular text-ink">{totalCount}</p>
            <p className="text-[11px] text-ink-muted">products</p>
          </Link>
          {serviceGroups.map((g) => (
            <Link
              key={g.key}
              href={`${baseHref}?service=${encodeURIComponent(g.key)}`}
              className={cn(
                "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
                selectedKey === g.key ? "border-brand-600 bg-brand-50" : "border-line",
              )}
            >
              <p className="truncate text-sm font-semibold text-ink">{g.name}</p>
              {g.category && <p className="truncate text-xs text-ink-muted">{g.category}</p>}
              <p className="mt-1.5 text-xl font-semibold tabular text-ink">{g.count}</p>
              <p className="text-[11px] text-ink-muted">product{g.count === 1 ? "" : "s"} · {chargeText(g)}</p>
            </Link>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function ProductsServicesTable({ rows, baseHref, description, selectedName, emptyMessage }) {
  return (
    <Card>
      <CardHeader
        title={`${formatNumber(rows.length)} product${rows.length === 1 ? "" : "s"}${selectedName ? ` with “${selectedName}”` : ""}`}
        description={description || "Scanned from the live products list."}
        actions={
          selectedName ? (
            <Link href={baseHref} className="text-xs font-medium text-brand-700 hover:underline">
              Clear filter
            </Link>
          ) : null
        }
      />
      {rows.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                  <th scope="col" className="px-4 py-2.5">Product</th>
                  <th scope="col" className="px-4 py-2.5">Vendor</th>
                  <th scope="col" className="px-4 py-2.5">Category</th>
                  <th scope="col" className="px-4 py-2.5">Services</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Display price</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <tr key={p.id} className="align-top hover:bg-surface-muted/60">
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-700 hover:underline">
                        {p.name}
                      </Link>
                      <div className="text-xs text-ink-muted">{p.sku}</div>
                    </td>
                    <td className="px-4 py-2.5 text-ink-soft">{p.vendor}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{p.category}</td>
                    <td className="px-4 py-2.5">
                      <ServiceBadges services={p.services} baseHref={baseHref} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(p.display)}</td>
                    <td className="px-4 py-2.5 text-right tabular">{formatNumber(p.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2.5 border-t border-line p-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-700 hover:underline">
                    {p.name}
                  </Link>
                  <Badge tone="brand">{p.services.length} service{p.services.length === 1 ? "" : "s"}</Badge>
                </div>
                <p className="text-xs text-ink-muted">{p.sku} · {p.vendor} · {p.category}</p>
                <div className="mt-2">
                  <ServiceBadges services={p.services} baseHref={baseHref} />
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                  <div><dt className="text-xs text-ink-muted">Display price</dt><dd className="font-medium text-ink">{formatINR(p.display)}</dd></div>
                  <div><dt className="text-xs text-ink-muted">Stock</dt><dd className="text-ink-soft">{formatNumber(p.stock)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <CardBody>
          <p className="text-sm text-ink-muted">{emptyMessage || "No products match."}</p>
        </CardBody>
      )}
    </Card>
  );
}
