import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { listSupplierRfqs } from "@/lib/services/admin/b2b-screens";
import { formatDate } from "@/lib/format";
import { LinkTabs, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Procurement RFQs" };

const TONE = { open: "info", closed: "neutral", cancelled: "danger", draft: "neutral" };
const TABS = [["", "All"], ["open", "Open"], ["draft", "Draft"], ["closed", "Closed"], ["cancelled", "Cancelled"]];

/** Supplier procurement RFQs (task #107 subtask 4 part 2; spec C1, C11 "Procurement RFQ"). */
export default async function ProcurementListPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.rfqs");
  if (!allowed) return (<><PageHeader title="Procurement RFQs" /><PermissionDenied module="procurement RFQs" /></>);
  const { status = "" } = (await searchParams) ?? {};
  const result = await listSupplierRfqs({ status }, user).then((rows) => ({ rows }), (error) => ({ error }));
  const actions = (
    <div className="flex gap-2">
      <ButtonLink href="/admin/b2b/authorizations" size="sm">Authorizations</ButtonLink>
      {can(user, "b2b.rfqs", "add") && <ButtonLink href="/admin/b2b/procurement/new" size="sm" variant="primary">New supplier RFQ</ButtonLink>}
    </div>
  );
  const header = <PageHeader title="Procurement RFQs" description="Supplier-facing RFQs: suppliers quote slab rates and terms; a manager reviews and activates them as the approved seller cost." actions={actions} />;
  if (result.error) return (<>{header}<ApiUnavailable error={result.error} what="procurement RFQs" /></>);
  return (
    <>
      {header}
      <LinkTabs active={status} tabs={TABS.map(([value, label]) => ({ value, label, href: value ? `/admin/b2b/procurement?status=${value}` : "/admin/b2b/procurement" }))} />
      <Card className="mt-3">
        <MiniTable
          columns={[
            { key: "number", label: "RFQ", render: (r) => <Link href={`/admin/b2b/procurement/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.number}</Link> },
            { key: "title", label: "Title", render: (r) => <span className="block max-w-80">{r.title}<span className="block text-xs text-ink-muted">{[r.manufacturer, r.brand].filter(Boolean).join(" · ")}</span></span> },
            { key: "lines", label: "Lines", align: "right" },
            { key: "invited", label: "Suppliers", align: "right", render: (r) => `${r.responded} / ${r.invited}` },
            { key: "toReview", label: "To review", align: "right", render: (r) => (r.toReview ? <Badge tone="warning">{r.toReview}</Badge> : "—") },
            { key: "activeResponses", label: "Rates live", align: "right", render: (r) => r.activeResponses || "—" },
            { key: "responseDueAt", label: "Respond by", render: (r) => (r.responseDueAt ? formatDate(r.responseDueAt) : "—") },
            { key: "status", label: "Status", render: (r) => <Badge tone={TONE[r.status] ?? "neutral"}>{r.statusLabel}</Badge> },
          ]}
          rows={result.rows}
          empty="No supplier RFQs yet."
        />
      </Card>
    </>
  );
}
