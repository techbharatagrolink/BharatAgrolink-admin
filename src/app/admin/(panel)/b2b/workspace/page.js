import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getSalesWorkspace } from "@/lib/services/admin/b2b-screens";
import { formatDateTime, formatINR } from "@/lib/format";
import { LinkTabs, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { FollowupDone } from "@/components/admin/b2b/buyer-crm";

export const metadata = { title: "Sales Workspace" };

const BUCKET = { overdue: { tone: "danger", label: "Overdue" }, today: { tone: "warning", label: "Today" }, upcoming: { tone: "neutral", label: "Upcoming" } };
const buyerLink = (id, text) => (id ? <Link href={`/admin/b2b/buyers/${id}`} className="font-medium text-brand-700 hover:underline">{text}</Link> : text);

/** Sales workspace (task #107 subtask 2; spec §3): My Follow-ups, Hot Opportunities, Repeat Due, High-value Escalation. */
export default async function SalesWorkspacePage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.buyers");
  if (!allowed) return (<><PageHeader title="Sales Workspace" /><PermissionDenied module="B2B buyers" /></>);
  const { scope } = await searchParams;
  let w = null;
  let error = null;
  try {
    w = await getSalesWorkspace(user, scope);
  } catch (err) {
    error = err?.message || "Could not load the workspace.";
  }
  if (error) return (<><PageHeader title="Sales Workspace" /><ErrorState title="Could not load the workspace" description={error} /></>);
  const c = w.counts;

  return (
    <>
      <PageHeader title="Sales Workspace" description={w.scope === "team" ? "Everyone's follow-ups and opportunities." : "Your follow-ups, hot quotes and buyers due to reorder."} />
      {w.canSeeTeam && (
        <LinkTabs
          active={w.scope}
          tabs={[
            { value: "mine", label: "Mine", href: "/admin/b2b/workspace" },
            { value: "team", label: "Team", href: "/admin/b2b/workspace?scope=team" },
          ]}
        />
      )}
      <StatGrid>
        <StatCard label="Overdue follow-ups" value={c.overdue} tone={c.overdue ? "danger" : "neutral"} />
        <StatCard label="Due today" value={c.today} hint={`${c.upcoming} in the next 7 days`} tone={c.today ? "warning" : "neutral"} />
        <StatCard label="Hot opportunities" value={c.hot} tone="info" />
        <StatCard label="Repeat due" value={c.repeatDue} tone="info" />
      </StatGrid>
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader title="My follow-ups" description="Overdue first, then today and the next 7 days; highest value first." />
          <MiniTable
            columns={[
              { key: "bucket", label: "Due", render: (r) => <><Badge tone={BUCKET[r.bucket].tone}>{BUCKET[r.bucket].label}</Badge><span className="mt-0.5 block text-xs text-ink-muted">{r.dueAt ? formatDateTime(r.dueAt) : "now"}</span></> },
              { key: "firm", label: "Buyer", render: (r) => buyerLink(r.buyerId, r.firm) },
              {
                key: "subject",
                label: "Follow-up",
                render: (r) => (
                  <span className="block max-w-80">
                    {r.subject}
                    {r.source.type === "quotation" && (
                      <Link href={`/admin/b2b/quotations/${r.source.id}`} className="block font-mono text-xs text-brand-700 hover:underline">{r.source.number}</Link>
                    )}
                  </span>
                ),
              },
              { key: "value", label: "Value", align: "right", render: (r) => (r.value ? formatINR(r.value, { compact: true }) : "—") },
              ...(w.scope === "team" ? [{ key: "owner", label: "Owner" }] : []),
              { key: "id", label: "", align: "right", render: (r) => <FollowupDone taskId={r.id} buyerId={r.buyerId} /> },
            ]}
            rows={w.followups}
            empty="No follow-ups due. Schedule one from a buyer's page."
          />
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title="Hot opportunities" description="Quote viewed, change asked, accepted but not ordered, or high value." />
            <MiniTable
              columns={[
                { key: "number", label: "Quotation", render: (r) => <Link href={`/admin/b2b/quotations/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.number}</Link> },
                { key: "firm", label: "Buyer", render: (r) => buyerLink(r.buyerId, r.firm) },
                { key: "reason", label: "Why" },
                { key: "value", label: "Value", align: "right", render: (r) => formatINR(r.value, { compact: true }) },
              ]}
              rows={w.hot}
              empty="No hot quotations."
            />
          </Card>
          <Card>
            <CardHeader title="Repeat due" description="Expected reorder date passed with no new order. A follow-up task is created for the owner." />
            <MiniTable
              columns={[
                { key: "firm", label: "Buyer", render: (r) => buyerLink(r.buyerId, r.firm) },
                { key: "title", label: "Due", render: (r) => <span className="block max-w-72 text-xs">{r.title}</span> },
                { key: "potential", label: "Potential", align: "right", render: (r) => (r.potential != null ? formatINR(r.potential, { compact: true }) : "—") },
                { key: "owner", label: "Owner" },
              ]}
              rows={w.repeatDue}
              empty="No buyer is due to reorder."
            />
          </Card>
        </div>
        {w.scope === "team" && (
          <Card>
            <CardHeader title="High-value escalation" description={`Open quotations and unpaid orders of ${formatINR(w.threshold)} or more.`} />
            <MiniTable
              columns={[
                {
                  key: "number",
                  label: "Record",
                  render: (r) => (
                    <Link href={r.kind === "quotation" ? `/admin/b2b/quotations/${r.id}` : `/admin/b2b/orders/${r.number}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">
                      {r.number}
                    </Link>
                  ),
                },
                { key: "kind", label: "Type", render: (r) => (r.kind === "quotation" ? "Quotation" : "Order") },
                { key: "firm", label: "Buyer" },
                { key: "status", label: "Status" },
                { key: "value", label: "Value", align: "right", render: (r) => formatINR(r.value) },
                { key: "touchedAt", label: "Last change", render: (r) => (r.touchedAt ? formatDateTime(r.touchedAt) : "—") },
              ]}
              rows={w.highValue}
              empty="Nothing above the threshold."
            />
          </Card>
        )}
      </div>
    </>
  );
}
