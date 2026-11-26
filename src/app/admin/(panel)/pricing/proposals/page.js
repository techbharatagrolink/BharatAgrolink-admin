import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { listProposals } from "@/lib/services/admin/pricing-proposals";
import { formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkTabs, Notice, PageHeader } from "@/components/ui/page";
import { EmptyState, PermissionDenied } from "@/components/ui/states";
import { Money, ProposalStatus, SCOPE_LABEL } from "@/components/admin/pricing/proposals/proposal-status";
import { ExportButton } from "@/components/data-table/export-button";

export const metadata = { title: "Pricing Proposals" };

const TABS = [
  { value: "open", label: "Waiting for vendor", query: { open: "true" } },
  { value: "PARTIAL", label: "Partly answered", query: { status: "PARTIAL" } },
  { value: "COMPLETED", label: "Completed", query: { status: "COMPLETED" } },
  { value: "WITHDRAWN", label: "Withdrawn", query: { status: "WITHDRAWN" } },
  { value: "all", label: "All", query: {} },
];
const PAGE_SIZE = 25;

export default async function PricingProposalsPage({ searchParams }) {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Pricing Proposals" />
        <PermissionDenied module="products" />
      </>
    );
  }
  const params = await searchParams;
  const tab = TABS.find((t) => t.value === params?.tab) ?? TABS[0];
  const page = Math.max(1, Number(params?.page) || 1);
  const result = await listProposals({ ...tab.query, page, pageSize: PAGE_SIZE }, user);
  const canCreate = canPage(user, "manage_product.php", "edit");
  const pages = Math.max(1, Math.ceil((result.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Pricing Proposals"
        description="Services proposed on product variations. Display prices never change; each variation's NRV changes only after the vendor accepts it, from the effective date."
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              name={`pricing-proposals-${tab.value}`}
              columns={[
                { label: "Proposal No", value: (p) => p.proposalNo },
                { label: "Version", value: (p) => p.version },
                { label: "Product", value: (p) => p.productName ?? p.productId },
                { label: "Vendor", value: (p) => p.vendorName ?? p.vendorId },
                { label: "Services", value: (p) => p.services.map((s) => s.name).join("; ") },
                { label: "Variations", value: (p) => p.totals.variations },
                { label: "Status", value: (p) => p.status },
                { label: "Effective Date", value: (p) => p.effectiveDate || "" },
                { label: "Created Date", value: (p) => p.createdAt || "" },
              ]}
              rows={result.rows}
            />
            {canCreate && <ButtonLink href="/admin/pricing/proposals/new" variant="primary">New proposal</ButtonLink>}
          </div>
        }
      />
      <LinkTabs tabs={TABS.map((t) => ({ value: t.value, label: t.label, href: `/admin/pricing/proposals?tab=${t.value}` }))} active={tab.value} />
      {!result.ok && <Notice tone="danger" className="mb-4">{result.message}</Notice>}
      {result.ok && result.rows.length === 0 ? (
        <EmptyState title="No proposals here" description="Create a proposal from a product's variations to ask the vendor for consent." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-4 py-2.5">Proposal</th>
                <th className="px-4 py-2.5">Product / vendor</th>
                <th className="px-4 py-2.5">Services</th>
                <th className="px-4 py-2.5">Variations</th>
                <th className="px-4 py-2.5 text-right">NRV (current → proposed)</th>
                <th className="px-4 py-2.5">Effective</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface-muted">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/pricing/proposals/${p.id}`} className="font-medium text-brand-700 hover:underline">{p.proposalNo}</Link>
                    <span className="block text-xs text-ink-muted">v{p.version} · {SCOPE_LABEL[p.scope] ?? p.scope}</span>
                  </td>
                  <td className="max-w-xs px-4 py-2.5">
                    <span className="line-clamp-1 text-ink">{p.productName ?? p.productId}</span>
                    <span className="block text-xs text-ink-muted">{p.vendorName ?? p.vendorId}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{p.services.map((s) => s.name).join(", ")}</td>
                  <td className="px-4 py-2.5 text-xs text-ink-soft">
                    {p.totals.variations} · {Object.entries(p.counts).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(", ")}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs">
                    <Money value={p.totals.currentNrv} /> → <Money value={p.totals.proposedNrv} className="font-medium" />
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{formatDate(p.effectiveDate)}</td>
                  <td className="px-4 py-2.5"><ProposalStatus status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-ink-muted">
          {page > 1 && <ButtonLink size="sm" href={`/admin/pricing/proposals?tab=${tab.value}&page=${page - 1}`}>Prev</ButtonLink>}
          <span>Page {page} of {pages}</span>
          {page < pages && <ButtonLink size="sm" href={`/admin/pricing/proposals?tab=${tab.value}&page=${page + 1}`}>Next</ButtonLink>}
        </div>
      )}
    </>
  );
}
