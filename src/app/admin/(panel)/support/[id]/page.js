import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { ASSIGNEES, DEPARTMENTS, getTicket, PRIORITIES, TICKET_STATUSES } from "@/lib/services/admin/support";
import { formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { TicketControls, TicketConversation } from "@/components/admin/workflows/ticket-panel";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Ticket ${id}` };
}

export default async function TicketDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/support/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("support");
  if (!allowed) return (<><PageHeader title="Ticket" /><PermissionDenied module="support" /></>);
  const data = await getTicket(id, user);
  if (!data) notFound();
  const t = data.ticket;
  const canEdit = can(user, "support", "edit");

  return (
    <>
      <PageHeader
        title={t.subject}
        description={`${t.id} · ${t.user} (${t.userType}) · ${t.category}`}
        meta={
          <>
            <StatusBadge status={t.status} />
            <StatusBadge status={t.priority} />
            <Badge tone="neutral">{t.department}</Badge>
          </>
        }
      />
      {t.slaBreached && (
        <Notice tone="danger" className="mb-4" title="SLA breached">
          This ticket was due {formatDateTime(t.slaDeadline)}.
        </Notice>
      )}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Conversation" description="Internal notes (dashed) are visible to staff only" />
          <TicketConversation id={t.id} messages={data.messages} canReply={can(user, "support", "add") || canEdit} />
        </Card>
        <div className="min-w-0 space-y-4">
          {canEdit && (
            <Card>
              <CardHeader title="Manage" />
              <CardBody>
                <TicketControls id={t.id} ticket={t} options={{ statuses: TICKET_STATUSES, departments: DEPARTMENTS, priorities: PRIORITIES, assignees: ASSIGNEES }} />
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Requester", value: `${t.user} (${t.userType})` },
                  { label: "Assignee", value: t.assignee ?? "Unassigned" },
                  { label: "Created", value: formatDateTime(t.createdAt) },
                  { label: "SLA due", value: formatDateTime(t.slaDeadline) },
                  data.order && { label: "Order", value: <Link href={`/admin/orders/${data.order.id}`} className="font-mono text-xs text-brand-700 hover:underline">{data.order.id}</Link> },
                  data.order && { label: "Order status", value: `${data.order.status} · ${formatINR(data.order.total)}` },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
