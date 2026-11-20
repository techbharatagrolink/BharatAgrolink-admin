import Link from "next/link";
import { Download } from "lucide-react";
import { loadSeo } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/page";
import { formatDateTime, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { ProductCheckButton } from "@/components/admin/seo/product-check-button";
import { NewTaskButton } from "@/components/admin/seo/task-editor";

export const metadata = { title: "Product Data" };

const SEVERITY_TONE = { CRITICAL: "danger", HIGH: "danger", MEDIUM: "warning", LOW: "neutral" };
const SITE = "https://bharatagrolink.com";

function Stat({ label, value, note, tone }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-3.5">
      <p className="text-[12.5px] font-medium text-ink-muted">{label}</p>
      <p className={cn("mt-1.5 text-[22px] font-semibold tracking-tight tabular", tone === "bad" ? "text-danger-ink" : tone === "warn" ? "text-warning-ink" : "text-ink")}>{value}</p>
      {note && <p className="mt-1 text-xs text-ink-muted">{note}</p>}
    </div>
  );
}

function details(e) {
  if (!e) return "—";
  const parts = [];
  if (e.items) parts.push(e.items.map((i) => `${i.ref}: price ${i.price} > MRP ${i.mrp}`).join("; "));
  if (e.characters != null) parts.push(`${e.characters} characters`);
  if (e.images != null) parts.push(`${e.images} image`);
  if (e.labels) parts.push(`repeated: ${e.labels.join(", ")}`);
  if (e.sameNameAs) parts.push(`same name as product id ${e.sameNameAs.join(", ")}`);
  if (Array.isArray(e.variants)) parts.push(`variants: ${e.variants.join(", ")}`);
  else if (e.variants != null) parts.push(`${e.variants} variants`);
  if (e.title === false || e.description === false) parts.push(`missing ${[e.title === false && "title", e.description === false && "description"].filter(Boolean).join(" and ")}`);
  return parts.join(" · ") || "—";
}

/** Product Data (task #104, subtask 11): listing quality of every live product. */
export default async function SeoProductDataPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({ title: "Product Data", description: "Listing quality of every live product: required attributes, variants, duplicates and category templates." });
  if (page.denied) return page.denied;

  const filters = {
    rule: /^[a-z_]{3,40}$/.test(sp.rule ?? "") ? sp.rule : undefined,
    severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(sp.severity) ? sp.severity : undefined,
    category: /^\d+$/.test(sp.category ?? "") ? sp.category : undefined,
    status: ["OPEN", "RESOLVED", "ALL"].includes(sp.status) ? sp.status : undefined,
    page: Number(sp.page) > 0 ? Number(sp.page) : undefined,
  };
  const [result, owners, milestones] = await Promise.all([
    loadSeo(page.user, "product-quality", filters),
    page.canAdd ? loadSeo(page.user, "owners") : { data: [] },
    page.canAdd ? loadSeo(page.user, "milestones") : { data: null },
  ]);
  const blocked = SeoLoadState({ result, what: "Product Data" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const d = result.data;
  const L = d.latest;
  const ownerList = Array.isArray(owners.data) ? owners.data : [];
  const milestoneList = milestones.data?.milestones ?? [];
  const byRule = {};
  const catNames = {};
  for (const c of d.openCounts) byRule[c.rule] = (byRule[c.rule] ?? 0) + c.count;
  for (const i of d.issues) if (i.category_id) catNames[i.category_id] = i.category_name;
  const ruleLabel = (k) => d.rules[k]?.label ?? k;
  const pages = Math.max(1, Math.ceil(d.total / 50));
  const current = filters.page ?? 1;
  const href = (over) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ rule: filters.rule, severity: filters.severity, category: filters.category, status: filters.status, ...over })) if (v) q.set(k, v);
    const s = q.toString();
    return `/admin/seo/product-data${s ? `?${s}` : ""}`;
  };
  const exportHref = `/admin/seo/product-data/export?${new URLSearchParams(Object.entries({ rule: filters.rule, severity: filters.severity, category: filters.category, status: filters.status }).filter(([, v]) => v)).toString()}`;
  const critical = d.openCounts.filter((c) => c.severity === "CRITICAL").reduce((s, c) => s + c.count, 0);

  return (
    <>
      {page.header(null)}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">{L ? `Last checked ${formatDateTime(L.completedAt)} · ${formatNumber(L.products)} live products. Not tied to the date filter.` : "No product check has run yet."}</p>
        <div className="flex flex-wrap gap-2">
          {L && (
            <a href={exportHref} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-muted">
              <Download className="size-4" aria-hidden />
              Download CSV
            </a>
          )}
          {page.canEdit && <ProductCheckButton running={d.running} />}
        </div>
      </div>

      {L ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Data quality score" value={`${formatNumber(L.score)} / 100`} note="Checks passed ÷ checks run" />
            <Stat label="Complete listings" value={`${formatNumber(L.complete)} / ${formatNumber(L.products)}`} note="Products passing every check" tone={L.complete < L.products / 2 ? "warn" : null} />
            <Stat label="Open issues" value={formatNumber(d.openCounts.reduce((s, c) => s + c.count, 0))} note={`${formatNumber(Object.keys(byRule).length)} kinds of problem`} />
            <Stat label="Critical" value={formatNumber(critical)} note="No image or no sellable price" tone={critical ? "bad" : null} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <Card className="min-w-0 xl:col-span-2">
              <CardHeader title="Checks" description="How many live products pass each check. Click a problem to list its products." />
              <ul className="divide-y divide-line">
                {Object.entries(L.byRule ?? {})
                  .sort((a, b) => b[1].total - b[1].passed - (a[1].total - a[1].passed))
                  .map(([rule, c]) => {
                    const failing = c.total - c.passed;
                    return (
                      <li key={rule} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-2 text-sm sm:grid-cols-[14rem_1fr_auto]">
                        {failing ? (
                          <Link href={href({ rule, page: undefined })} className="text-ink hover:text-brand-700 hover:underline">
                            {ruleLabel(rule)}
                          </Link>
                        ) : (
                          <span className="text-ink">{ruleLabel(rule)}</span>
                        )}
                        <ProgressBar value={c.passed} max={c.total} tone={failing / c.total > 0.25 ? "danger" : failing ? "warning" : "brand"} className="col-span-2 sm:col-span-1 sm:row-start-1 sm:col-start-2" label={`${ruleLabel(rule)} pass rate`} />
                        <span className={cn("tabular text-xs sm:row-start-1 sm:col-start-3", failing ? "text-warning-ink" : "text-success-ink")}>
                          {failing ? `${formatNumber(failing)} of ${formatNumber(c.total)} fail` : `all ${formatNumber(c.total)} pass`}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </Card>
            <Card className="min-w-0">
              <CardHeader title="By category" description="Complete listings per top-level category." />
              <ul className="divide-y divide-line">
                {Object.entries(L.byCategory ?? {})
                  .sort((a, b) => b[1].products - a[1].products)
                  .map(([name, c]) => (
                    <li key={name} className="px-4 py-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-ink">{name}</span>
                        <span className="text-xs tabular text-ink-muted">
                          {formatNumber(c.complete)} / {formatNumber(c.products)} complete
                        </span>
                      </div>
                      <ProgressBar value={c.checksPassed} max={c.checksTotal} className="mt-1" label={`${name} checks passed`} />
                    </li>
                  ))}
              </ul>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <Unavailable>Run the first check to see the quality of every live product listing.</Unavailable>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader
          title="Products to fix"
          description={`${formatNumber(d.total)} ${(filters.status ?? "OPEN") === "ALL" ? "" : (filters.status ?? "OPEN").toLowerCase()} issues${filters.rule ? ` · ${ruleLabel(filters.rule)}` : ""}${filters.severity ? ` · ${filters.severity}` : ""}${filters.category && catNames[filters.category] ? ` · ${catNames[filters.category]}` : ""}`}
        />
        <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-2.5 text-xs">
          <Link href={href({ rule: undefined, page: undefined })} className={cn("rounded-full border px-2.5 py-1", !filters.rule ? "border-brand-600 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>
            All problems
          </Link>
          {Object.entries(byRule)
            .sort((a, b) => b[1] - a[1])
            .map(([rule, n]) => (
              <Link key={rule} href={href({ rule, page: undefined })} className={cn("rounded-full border px-2.5 py-1", filters.rule === rule ? "border-brand-600 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>
                {ruleLabel(rule)} · {formatNumber(n)}
              </Link>
            ))}
          <span className="mx-1 text-line">|</span>
          {["OPEN", "RESOLVED", "ALL"].map((s) => (
            <Link key={s} href={href({ status: s === "OPEN" ? undefined : s, page: undefined })} className={cn("rounded-full border px-2.5 py-1", (filters.status ?? "OPEN") === s ? "border-brand-600 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>
              {s === "ALL" ? "All statuses" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
        {d.issues.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Problem</th>
                  <th className="px-4 py-2 font-medium">Details & fix</th>
                  {page.canAdd && <th className="px-4 py-2 font-medium" aria-label="Actions" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top">
                {d.issues.map((i) => (
                  <tr key={i.id}>
                    <td className="max-w-xs px-4 py-2.5">
                      <span className="block text-ink">{i.prod_name ?? i.evidence?.name ?? `Product ${i.product_id}`}</span>
                      <span className="flex flex-wrap gap-x-2 text-xs">
                        {i.category_name && <span className="text-ink-muted">{i.category_name}</span>}
                        {i.product_unique_id && (
                          <Link href={`/admin/products/${i.product_unique_id}`} className="text-brand-700 hover:underline">
                            Edit in admin
                          </Link>
                        )}
                        {i.web_url && (
                          <a href={`${SITE}/product/${i.web_url}`} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                            View on site
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="block text-ink">{ruleLabel(i.rule_key)}</span>
                      <span className="mt-1 flex gap-1">
                        <Badge tone={SEVERITY_TONE[i.severity]}>{i.severity}</Badge>
                        {i.status !== "OPEN" && <Badge tone={i.status === "RESOLVED" ? "success" : "neutral"}>{i.status}</Badge>}
                      </span>
                    </td>
                    <td className="max-w-md px-4 py-2.5 text-xs text-ink-soft">
                      {details(i.evidence)}
                      <span className="mt-1 block text-ink-muted">Fix: {d.rules[i.rule_key]?.fix}</span>
                    </td>
                    {page.canAdd && (
                      <td className="px-4 py-2.5">
                        {i.status === "OPEN" && (
                          <NewTaskButton
                            owners={ownerList}
                            milestones={milestoneList}
                            issue={{
                              id: i.id,
                              sourceType: "product_issue",
                              module: "product_data",
                              label: ruleLabel(i.rule_key),
                              path: i.prod_name ?? `product ${i.product_id}`,
                              url: i.web_url ? `${SITE}/product/${i.web_url}` : `/admin/products/${i.product_unique_id}`,
                              severity: i.severity,
                              fix: d.rules[i.rule_key]?.fix,
                              evidence: details(i.evidence),
                            }}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Unavailable>{L ? "No issues match these filters." : "No check yet."}</Unavailable>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-xs text-ink-muted">
            <span>
              Page {current} of {pages}
            </span>
            <span className="flex gap-3">
              {current > 1 && (
                <Link href={href({ page: String(current - 1) })} className="text-brand-700 hover:underline">
                  Previous
                </Link>
              )}
              {current < pages && (
                <Link href={href({ page: String(current + 1) })} className="text-brand-700 hover:underline">
                  Next
                </Link>
              )}
            </span>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <CardHeader title="How this is measured" />
        <p className="px-4 py-3 text-sm text-ink-soft">{d.methodology}</p>
        <ul className="border-t border-line px-4 py-3 text-xs text-ink-muted">
          {Object.entries(d.templates).map(([slug, t]) => (
            <li key={slug}>
              <span className="font-medium text-ink-soft">{t.label}:</span> {t.rules.map(ruleLabel).join(", ")}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
