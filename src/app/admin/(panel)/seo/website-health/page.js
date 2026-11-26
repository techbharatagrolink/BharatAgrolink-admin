import Link from "next/link";
import { loadSeo } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { AuditRunButton } from "@/components/admin/seo/audit-run-button";
import { NewTaskButton } from "@/components/admin/seo/task-editor";
import { ExportButton } from "@/components/data-table/export-button";

export const metadata = { title: "Website Health" };

const TYPE_LABEL = {
  broken_link: "Broken link",
  page_error: "Page does not load",
  redirect_chain: "Redirect chain",
  sitemap_redirect: "Sitemap URL redirects",
  sitemap_noindex: "Noindex page in sitemap",
  missing_title: "Missing title",
  duplicate_title: "Duplicate title",
  duplicate_product: "Duplicate product",
  missing_description: "Missing meta description",
  missing_canonical: "Missing canonical",
  canonical_mismatch: "Canonical points elsewhere",
  missing_h1: "Missing H1",
  empty_category: "Empty category",
  missing_product_schema: "Missing Product schema",
  product_schema_incomplete: "Incomplete Product schema",
  schema_parse_error: "Invalid schema JSON",
  robots_missing: "robots.txt missing",
  robots_blocks_all: "robots.txt blocks site",
  robots_no_sitemap: "Sitemap not in robots.txt",
  sitemap_missing: "Sitemap missing",
  slow_mobile_page: "Slow on mobile",
};
const SEVERITY_TONE = { CRITICAL: "danger", HIGH: "danger", MEDIUM: "warning", LOW: "neutral" };
const CHECK_LABEL = {
  page_loads: "Pages load (HTTP 200)",
  title: "Has a title",
  title_unique: "Title is unique",
  meta_description: "Has a meta description",
  canonical: "Has a canonical",
  canonical_self: "Canonical points to itself",
  h1: "Has an H1",
  category_has_products: "Category lists products",
  schema_valid_json: "Structured data is valid JSON",
  product_schema: "Product page has Product schema",
  product_schema_complete: "Product schema is complete",
  sitemap_indexable: "Sitemap pages are indexable",
  robots_txt: "robots.txt reachable",
  robots_allows_site: "robots.txt allows the site",
  robots_lists_sitemap: "robots.txt lists the sitemap",
  sitemap: "Sitemap has URLs",
};
const RUN = { RUNNING: "Running", COMPLETED: "Completed", FAILED: "Failed", CANCELLED: "Cancelled" };

const path = (url) => {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
};

function Panel({ label, value, note, tone }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-3.5">
      <p className="text-[12.5px] font-medium text-ink-muted">{label}</p>
      <p className={cn("mt-1.5 text-[22px] font-semibold tracking-tight tabular", tone === "bad" ? "text-danger-ink" : tone === "warn" ? "text-warning-ink" : "text-ink")}>{value}</p>
      {note && <p className="mt-1 text-xs text-ink-muted">{note}</p>}
    </div>
  );
}

function Evidence({ issue }) {
  const e = issue.evidence ?? {};
  const parts = [];
  if (e.status != null) parts.push(`HTTP ${e.status || "no response"}${e.error ? ` (${e.error})` : ""}`);
  if (e.foundOn?.length) parts.push(`linked from ${e.foundOn.map(path).join(", ")}${e.linkCount > e.foundOn.length ? ` +${e.linkCount - e.foundOn.length} more` : ""}`);
  if (e.finalUrl) parts.push(`→ ${path(e.finalUrl)}${e.hops ? ` (${e.hops} hops)` : ""}`);
  if (e.sameAs?.length) parts.push(`same title as ${e.sameAs.map(path).join(", ")}`);
  if (e.missing?.length) parts.push(`missing: ${e.missing.join(", ")}`);
  if (e.canonical) parts.push(`canonical: ${e.canonical}`);
  if (e.errors?.length) parts.push(e.errors.join("; "));
  if (e.performance != null) parts.push(`performance ${e.performance}/100, LCP ${(e.lcp_ms / 1000).toFixed(1)} s`);
  return <span>{parts.join(" · ") || "—"}</span>;
}

/** Website Health (task #104, subtask 8): technical audit of the live storefront. */
export default async function SeoWebsiteHealthPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({ title: "Website Health", description: "Technical audit of the public website: links, tags, structured data, sitemap, robots and mobile speed." });
  if (page.denied) return page.denied;

  const filters = {
    type: /^[a-z_]{3,40}$/.test(sp.type ?? "") ? sp.type : undefined,
    severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(sp.severity) ? sp.severity : undefined,
    status: ["OPEN", "RESOLVED", "IGNORED", "ALL"].includes(sp.status) ? sp.status : undefined,
    page: Number(sp.page) > 0 ? Number(sp.page) : undefined,
  };
  const [result, owners, milestones] = await Promise.all([
    loadSeo(page.user, "website-health", filters),
    page.canAdd ? loadSeo(page.user, "owners") : { data: [] },
    page.canAdd ? loadSeo(page.user, "milestones") : { data: null },
  ]);
  const ownerList = Array.isArray(owners.data) ? owners.data : [];
  const milestoneList = milestones.data?.milestones ?? [];
  const blocked = SeoLoadState({ result, what: "Website Health" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const d = result.data;
  const running = d.runs.some((r) => r.status === "RUNNING");
  const current = d.runs.find((r) => r.status === "RUNNING");
  const p = d.panel;
  const byType = {};
  for (const c of d.openCounts) byType[c.type] = (byType[c.type] ?? 0) + c.count;
  const currentPage = filters.page ?? 1;
  const pages = Math.max(1, Math.ceil(d.total / 50));
  const href = (over) => {
    const q = new URLSearchParams();
    const next = { type: filters.type, severity: filters.severity, status: filters.status, ...over };
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return `/admin/seo/website-health${s ? `?${s}` : ""}`;
  };

  return (
    <>
      {page.header(null)}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          {d.latest
            ? `Latest audit ${formatDateTime(d.latest.completedAt)} · ${formatNumber(d.latest.pagesScanned)} pages checked. Not tied to the date filter.`
            : "No audit has completed yet."}
          {current && ` An audit is running now (${formatNumber(current.pages_scanned)} pages so far).`}
        </p>
        {page.canEdit && <AuditRunButton running={running} />}
      </div>

      {d.latest && p ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Panel label="Technical Health" value={d.latest.score == null ? "—" : `${formatNumber(d.latest.score)} / 100`} note="Checks passed ÷ checks run" />
          <Panel label="Broken links" value={formatNumber(p.brokenLinks)} tone={p.brokenLinks ? "bad" : null} note="Pages that do not load" />
          <Panel label="Duplicate products" value={formatNumber(p.duplicateProducts)} tone={p.duplicateProducts ? "warn" : null} note="Product pages sharing a title" />
          <Panel label="Schema errors" value={formatNumber(p.schemaErrors)} tone={p.schemaErrors ? "warn" : null} note="Product structured data" />
          <Panel
            label="Sitemap & robots"
            value={p.sitemapRobots === "ok" ? "OK" : p.sitemapRobots === "warning" ? "Warnings" : "Problem"}
            tone={p.sitemapRobots === "problem" ? "bad" : p.sitemapRobots === "warning" ? "warn" : null}
            note={d.latest.sitemap ? `${formatNumber(d.latest.sitemap.urls)} URLs in sitemap` : null}
          />
          <Panel
            label="Page speed (mobile)"
            value={p.mobileSpeed?.performance != null ? `${p.mobileSpeed.performance} / 100` : "—"}
            tone={p.mobileSpeed?.performance != null && p.mobileSpeed.performance < 50 ? "bad" : p.mobileSpeed?.performance < 90 ? "warn" : null}
            note={p.mobileSpeed?.lcpMs != null ? `Home page · LCP ${(p.mobileSpeed.lcpMs / 1000).toFixed(1)} s` : "PageSpeed unavailable"}
          />
        </div>
      ) : (
        <Card>
          <Unavailable>{running ? "The first audit is running. Results appear here when it finishes." : "Run the first audit to see broken links, duplicates, schema errors, sitemap/robots status and mobile speed."}</Unavailable>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader
          title="Issues"
          description={`${formatNumber(d.total)} ${filters.status === "ALL" ? "" : (filters.status ?? "OPEN").toLowerCase()} issues${filters.type ? ` · ${TYPE_LABEL[filters.type] ?? filters.type}` : ""}${filters.severity ? ` · ${filters.severity}` : ""}`}
          actions={
            <ExportButton
              name={`seo-website-health-issues-${(filters.status ?? "open").toLowerCase()}`}
              columns={[
                { label: "Issue", value: (i) => TYPE_LABEL[i.issue_type] ?? i.issue_type },
                { label: "Severity", value: (i) => i.severity },
                { label: "Status", value: (i) => i.status },
                { label: "URL", value: (i) => i.url },
                { label: "Recommended Fix", value: (i) => i.recommended_fix || "" },
                { label: "First Seen", value: (i) => i.first_seen_at || "" },
                { label: "Last Seen", value: (i) => i.last_seen_at || "" },
                { label: "Resolved At", value: (i) => i.resolved_at || "" },
              ]}
              rows={d.issues}
            />
          }
        />
        <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-2.5 text-xs">
          <Link href={href({ type: undefined, page: undefined })} className={cn("rounded-full border px-2.5 py-1", !filters.type ? "border-brand-600 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>
            All types
          </Link>
          {Object.entries(byType)
            .sort((a, b) => b[1] - a[1])
            .map(([type, n]) => (
              <Link key={type} href={href({ type, page: undefined })} className={cn("rounded-full border px-2.5 py-1", filters.type === type ? "border-brand-600 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>
                {TYPE_LABEL[type] ?? type} · {formatNumber(n)}
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
                  <th className="px-4 py-2 font-medium">Issue</th>
                  <th className="px-4 py-2 font-medium">URL</th>
                  <th className="px-4 py-2 font-medium">Evidence & fix</th>
                  <th className="px-4 py-2 font-medium">Seen</th>
                  {page.canAdd && <th className="px-4 py-2 font-medium" aria-label="Actions" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top">
                {d.issues.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-2.5">
                      <span className="block text-ink">{TYPE_LABEL[i.issue_type] ?? i.issue_type}</span>
                      <span className="mt-1 flex gap-1">
                        <Badge tone={SEVERITY_TONE[i.severity]}>{i.severity}</Badge>
                        {i.status !== "OPEN" && <Badge tone={i.status === "RESOLVED" ? "success" : "neutral"}>{i.status}</Badge>}
                      </span>
                    </td>
                    <td className="max-w-[16rem] px-4 py-2.5">
                      <a href={i.url} target="_blank" rel="noreferrer" className="break-all text-brand-700 hover:underline">
                        {path(i.url)}
                      </a>
                    </td>
                    <td className="max-w-md px-4 py-2.5 text-xs text-ink-soft">
                      <Evidence issue={i} />
                      {i.recommended_fix && <span className="mt-1 block text-ink-muted">Fix: {i.recommended_fix}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-ink-muted">
                      First {formatDateTime(i.first_seen_at)}
                      <span className="block">Last {formatDateTime(i.last_seen_at)}</span>
                      {i.resolved_at && <span className="block text-success-ink">Resolved {formatDateTime(i.resolved_at)}</span>}
                    </td>
                    {page.canAdd && (
                      <td className="px-4 py-2.5">
                        {i.status === "OPEN" && (
                          <NewTaskButton
                            owners={ownerList}
                            milestones={milestoneList}
                            issue={{
                              id: i.id,
                              label: TYPE_LABEL[i.issue_type] ?? i.issue_type,
                              path: path(i.url),
                              url: i.url,
                              severity: i.severity,
                              fix: i.recommended_fix,
                              evidence: JSON.stringify(i.evidence ?? {}).slice(0, 600),
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
          <Unavailable>{d.latest ? "No issues match these filters." : "No audit yet."}</Unavailable>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-xs text-ink-muted">
            <span>
              Page {currentPage} of {pages}
            </span>
            <span className="flex gap-3">
              {currentPage > 1 && <Link href={href({ page: String(currentPage - 1) })} className="text-brand-700 hover:underline">Previous</Link>}
              {currentPage < pages && <Link href={href({ page: String(currentPage + 1) })} className="text-brand-700 hover:underline">Next</Link>}
            </span>
          </div>
        )}
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0">
          <CardHeader title="Checks in the latest audit" description="Score = all passed ÷ all run." />
          {d.latest ? (
            <ul className="divide-y divide-line">
              {Object.entries(d.latest.checks).map(([k, c]) => (
                <li key={k} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                  <span className="text-ink">{CHECK_LABEL[k] ?? k}</span>
                  <span className={cn("tabular text-xs", c.passed === c.total ? "text-success-ink" : "text-warning-ink")}>
                    {formatNumber(c.passed)} / {formatNumber(c.total)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable />
          )}
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Mobile speed (PageSpeed Insights)" />
          {d.speed.length ? (
            <ul className="divide-y divide-line">
              {d.speed.map((s) => (
                <li key={s.url} className="px-4 py-2 text-sm">
                  <span className="block break-all text-ink">{path(s.url)}</span>
                  <span className="text-xs text-ink-muted">
                    Performance {s.performance ?? "—"}/100 · LCP {s.lcp_ms != null ? `${(s.lcp_ms / 1000).toFixed(1)} s` : "—"} · CLS {s.cls != null ? s.cls.toFixed(2) : "—"} · {s.date}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable>No PageSpeed result yet.</Unavailable>
          )}
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Recent audits" />
          {d.runs.length ? (
            <ul className="divide-y divide-line">
              {d.runs.map((r) => (
                <li key={r.id} className="px-4 py-2 text-sm">
                  <span className="block text-ink">
                    {RUN[r.status] ?? r.status} · {formatNumber(r.pages_scanned)} pages{r.score != null ? ` · score ${formatNumber(r.score)}` : ""}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {formatDateTime(r.started_at)} · {r.triggered_by === "system" ? "automatic" : "manual"}
                  </span>
                  {r.error_summary && <span className="block text-xs text-danger-ink">{r.error_summary}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable>No audit yet.</Unavailable>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="How this is measured" />
        <p className="px-4 py-3 text-sm text-ink-soft">{d.methodology}</p>
      </Card>
    </>
  );
}
