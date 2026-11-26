import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getProcurementOptions, listSupplierAuthorizations } from "@/lib/services/admin/b2b-screens";
import { formatDate } from "@/lib/format";
import { LinkTabs, Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { AddAuthorization, DecideAuthorization } from "@/components/admin/b2b/procurement-actions";

export const metadata = { title: "Seller Authorizations" };

const TONE = { pending: "warning", verified: "success", rejected: "danger", revoked: "danger" };
const TYPE = {
  manufacturer_authorization: "Manufacturer authorization",
  insecticide_license: "Insecticide licence",
  fertilizer_license: "Fertilizer licence",
  seed_license: "Seed licence",
  dealer_license: "Dealer licence",
  other: "Other",
};
const TABS = [["pending", "Pending"], ["verified", "Verified"], ["", "All"], ["rejected", "Rejected"], ["revoked", "Revoked"]];

/**
 * Seller / brand / product / state authorizations (task #107 subtask 4 part 2; spec A2 "Authorization", A3
 * fail closed). A product marked regulated (SKU Links & Case Sizes) is offered only by a seller with a verified,
 * unexpired authorization for the delivery state.
 */
export default async function AuthorizationsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.catalog");
  if (!allowed) return (<><PageHeader title="Seller Authorizations" /><PermissionDenied module="seller authorizations" /></>);
  const { status = "pending" } = (await searchParams) ?? {};
  const result = await Promise.all([listSupplierAuthorizations({ status }, user), getProcurementOptions(user).catch(() => null)]).then(([rows, options]) => ({ rows, options }), (error) => ({ error }));
  const canAdd = can(user, "b2b.catalog", "edit") && result.options;
  const header = (
    <PageHeader
      title="Seller Authorizations"
      description="Licences and manufacturer authorizations with their documents. Verified by a manager other than the one who added it."
      actions={canAdd ? <AddAuthorization options={result.options} /> : null}
    />
  );
  if (result.error) return (<>{header}<ApiUnavailable error={result.error} what="authorizations" /></>);
  return (
    <>
      {header}
      <Notice tone="info" className="mb-3">Only products marked regulated need an authorization. Mark them on SKU Links &amp; Case Sizes.</Notice>
      <LinkTabs active={status} tabs={TABS.map(([value, label]) => ({ value, label, href: `/admin/b2b/authorizations?status=${value}` }))} />
      <Card className="mt-3">
        <MiniTable
          columns={[
            { key: "seller", label: "Seller" },
            { key: "authType", label: "Type", render: (a) => TYPE[a.authType] ?? a.authType },
            { key: "scope", label: "Covers", render: (a) => <span className="block max-w-72">{a.product || a.brand || "Any brand"}<span className="block text-xs text-ink-muted">{a.state || "All states"}</span></span> },
            { key: "documentNumber", label: "Document", render: (a) => <a href={a.evidenceUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">{a.documentNumber || "Open"}</a> },
            { key: "validUntil", label: "Valid", render: (a) => <span className={a.expired ? "text-danger-ink" : ""}>{a.validFrom ? formatDate(a.validFrom) : "—"} → {a.validUntil ? formatDate(a.validUntil) : "no end"}{a.expired ? " (expired)" : ""}</span> },
            { key: "status", label: "Status", render: (a) => <><Badge tone={TONE[a.status] ?? "neutral"}>{a.statusLabel}</Badge>{a.reviewNote && <span className="block text-xs text-ink-muted">{a.reviewNote}</span>}</> },
            { key: "id", label: "", align: "right", render: (a) => <DecideAuthorization id={a.id} status={a.status} /> },
          ]}
          rows={result.rows}
          empty="Nothing here."
        />
      </Card>
    </>
  );
}
