import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getApprovals } from "@/lib/services/admin/parity/seller";
import { formatINR, formatNumber, formatPercent } from "@/lib/format";
import { LinkTabs, Notice, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { FilterBar } from "@/components/data-table/filter-bar";
import { ApprovalCard } from "@/components/admin/parity/seller/approval-card";

export const metadata = { title: "B2B Approvals" };

const TITLE = "Approvals";
const PATH = "/admin/b2b/approvals";
const VIEWS = [
  ["pending", "Awaiting decision"],
  ["approved", "Approved (not converted)"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

export default async function B2bApprovalsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.approvals");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="B2B approvals" /></>);
  const sp = await searchParams;
  const view = VIEWS.some(([v]) => v === sp?.view) ? sp.view : "pending";
  const q = typeof sp?.q === "string" ? sp.q.slice(0, 120) : "";
  const page = /^\d+$/.test(sp?.page ?? "") && Number(sp.page) > 0 ? Number(sp.page) : 1;
  const result = await getApprovals({ view, q, page, pageSize: 25 }, user).then((data) => ({ data }), (error) => ({ error }));
  const description = "Quotations below the contribution-margin floor wait here for a decision. Approved quotations can be converted to orders.";
  if (result.error) return (<><PageHeader title={TITLE} description={description} /><ApiUnavailable error={result.error} what="the approval queue" /></>);
  const { rules, stats, rows, total, pageCount } = result.data;
  const canDecide = can(user, "b2b.approvals", "edit");
  const href = (changes) => {
    const params = new URLSearchParams({ view, ...(q ? { q } : {}), page: String(page), ...changes });
    return `${PATH}?${params.toString()}`;
  };

  return (
    <>
      <PageHeader title={TITLE} description={description} meta={<span className="text-xs text-ink-muted">CM floor {formatPercent(rules.minCmPct, 0)} · target {formatPercent(rules.targetCmPct, 0)}</span>} />
      <div className="space-y-4">
        <StatGrid>
          <StatCard label="Pending" value={formatNumber(stats.pending)} hint="Awaiting a decision" tone="warning" />
          <StatCard label="Blocked" value={formatNumber(stats.blocked)} hint="Below hard floor" tone="danger" />
          <StatCard label="Value Held" value={formatINR(stats.valueHeld)} hint="Pipeline waiting on approval" />
          <StatCard label="Ready to Convert" value={formatNumber(stats.readyToConvert)} hint="Approved, not yet an order" />
        </StatGrid>
        <div>
          <LinkTabs active={view} tabs={VIEWS.map(([value, label]) => ({ value, label, href: `${PATH}?view=${value}`, count: value === "pending" ? stats.pending + stats.blocked : value === "approved" ? stats.readyToConvert : undefined }))} />
          <FilterBar search="Quote no or buyer…" />
        </div>
        {!canDecide && <Notice>You can view this queue but not decide on it.</Notice>}
        {rows.length === 0 ? (
          <EmptyState title="Nothing in this queue" description="Quotations arrive here automatically when the commercial engine puts them below the configured floor." />
        ) : (
          rows.map((quote) => <ApprovalCard key={quote.id} quote={quote} rules={rules} canDecide={canDecide} />)
        )}
        {pageCount > 1 && (
          <div className="flex items-center justify-between text-[13px] text-ink-muted">
            <span>
              Page {formatNumber(page)} of {formatNumber(pageCount)} · {formatNumber(total)} quotations
            </span>
            <div className="flex gap-1.5">
              {page > 1 && <ButtonLink size="sm" href={href({ page: String(page - 1) })}>Previous</ButtonLink>}
              {page < pageCount && <ButtonLink size="sm" href={href({ page: String(page + 1) })}>Next</ButtonLink>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
