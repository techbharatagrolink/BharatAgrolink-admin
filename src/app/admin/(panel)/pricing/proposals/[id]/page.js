import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { getProposal } from "@/lib/services/admin/pricing-proposals";
import { formatDate, formatDateTime } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DescriptionList, Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { Difference, ItemStatus, Money, ProposalStatus, SCOPE_LABEL } from "@/components/admin/pricing/proposals/proposal-status";
import { ClarificationReply, WithdrawProposalButton } from "@/components/admin/pricing/proposals/proposal-actions";

export const metadata = { title: "Pricing Proposal" };

export default async function PricingProposalPage({ params }) {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Pricing Proposal" />
        <PermissionDenied module="products" />
      </>
    );
  }
  const { id } = await params;
  const result = await getProposal(id, user);
  if (!result.ok && result.status === 404) notFound();
  if (!result.ok) return (<><PageHeader title="Pricing Proposal" /><Notice tone="danger">{result.message}</Notice></>);
  const p = result.proposal;
  const canEdit = canPage(user, "manage_product.php", "edit");
  const withdrawable = canEdit && ["PENDING", "PARTIAL"].includes(p.status) && p.items.some((i) => ["PENDING", "CLARIFICATION", "ACCEPTED"].includes(i.status));
  const held = p.items.filter((i) => i.status === "ACCEPTED" && i.activationError);

  return (
    <>
      <PageHeader
        title={`${p.proposalNo} · v${p.version}`}
        description={p.productName ?? p.productId}
        meta={<ProposalStatus status={p.status} />}
        actions={withdrawable && <WithdrawProposalButton proposalId={p.id} proposalNo={p.proposalNo} />}
      />
      {held.length > 0 && (
        <Notice tone="danger" className="mb-4" title={`${held.length} accepted variation${held.length === 1 ? "" : "s"} could not go live`}>
          The vendor accepted, but something changed since. Create a new proposal for {held.length === 1 ? "it" : "them"}.
        </Notice>
      )}
      <Card className="mb-4">
        <CardBody>
          <DescriptionList
            columns={3}
            items={[
              { label: "Product", value: <Link href={`/admin/products/${p.productId}`} className="text-brand-700 hover:underline">{p.productName ?? p.productId}</Link> },
              { label: "Vendor", value: p.vendorName ?? p.vendorId },
              { label: "Scope", value: `${SCOPE_LABEL[p.scope] ?? p.scope}${p.scopeFilter ? `: ${p.scopeFilter}` : ""}` },
              { label: "Services", value: p.services.map((s) => `${s.name} (${s.chargeText})`).join(", ") || "—" },
              { label: "Change", value: { ADD: "Add services", REMOVE: "Remove services", SET: "Set services" }[p.operation] ?? p.operation },
              { label: "Base take rate", value: `${p.baseTakeRate}%` },
              { label: "Effective date", value: formatDate(p.effectiveDate) },
              { label: "Created", value: `${formatDateTime(p.createdAt)} by ${p.createdBy ?? "—"}` },
              { label: "Reason", value: p.reason },
            ]}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Variations" description="Each variation is answered and goes live on its own. Display prices do not change." />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-3">Variation</th>
                <th className="py-2 pr-3 text-right">Display price</th>
                <th className="py-2 pr-3 text-right">Take rate</th>
                <th className="py-2 pr-3 text-right">Current NRV</th>
                <th className="py-2 pr-3 text-right">Proposed NRV</th>
                <th className="py-2 pr-3 text-right">Difference</th>
                <th className="py-2">Vendor answer</th>
              </tr>
            </thead>
            <tbody>
              {p.items.map((i) => (
                <tr key={i.id} className="border-b border-line align-top last:border-0">
                  <td className="py-2.5 pr-3">
                    <span className="font-medium text-ink">{i.label}</span>
                    <span className="block text-xs text-ink-muted">{i.sku ?? "—"}{i.pricingVersion ? ` · pricing v${i.pricingVersion}` : ""}</span>
                    {i.serviceLines?.length > 0 && (
                      <span className="mt-0.5 block text-xs text-ink-soft">
                        {i.serviceLines.map((l) => `${l.name} ₹${Number(l.amount ?? 0).toFixed(2)}${l.isNew ? "" : " (already)"}`).join(" · ")}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-right"><Money value={i.displayPrice} /></td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{i.currentTakeRate}% → {i.proposedTakeRate}%</td>
                  <td className="py-2.5 pr-3 text-right"><Money value={i.currentNrv} /></td>
                  <td className="py-2.5 pr-3 text-right"><Money value={i.proposedNrv} className="font-medium" /></td>
                  <td className="py-2.5 pr-3 text-right"><Difference value={i.difference} /></td>
                  <td className="min-w-64 py-2.5">
                    <ItemStatus status={i.status} />
                    {i.respondedAt && <span className="ml-1.5 text-xs text-ink-muted">{formatDateTime(i.respondedAt)}</span>}
                    {i.activatedAt && <span className="block text-xs text-ink-muted">Live since {formatDateTime(i.activatedAt)}</span>}
                    {i.responseNote && (
                      <p className="mt-1 text-xs text-ink-soft">
                        <span className="font-medium">{i.status === "DECLINED" ? "Reason" : "Vendor"}:</span> {i.responseNote}
                      </p>
                    )}
                    {i.adminReply && <p className="mt-1 text-xs text-ink-soft"><span className="font-medium">Our answer:</span> {i.adminReply}</p>}
                    {i.activationError && <p className="mt-1 text-xs text-danger-ink">{i.activationError}</p>}
                    {i.status === "CLARIFICATION" && canEdit && <ClarificationReply proposalId={p.id} itemId={i.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line-strong text-ink-soft">
                <td className="py-2 pr-3 text-xs" colSpan={3}>Total of {p.totals.variations} variations (aggregate, not a product NRV)</td>
                <td className="py-2 pr-3 text-right"><Money value={p.totals.currentNrv} /></td>
                <td className="py-2 pr-3 text-right"><Money value={p.totals.proposedNrv} /></td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
