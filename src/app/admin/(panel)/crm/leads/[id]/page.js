import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { DISPOSITIONS, getLead, LEAD_STATUSES } from "@/lib/services/admin/pipeline";
import { leadAttachments, leadChat } from "@/lib/services/admin/crm-sheet";
import { formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { LeadActivityForm } from "@/components/admin/workflows/lead-activity-form";
import { LeadRecordPanels } from "@/components/admin/crm/lead-record-panels";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Lead ${id}` };
}

const duration = (sec) => (sec ? `${Math.floor(sec / 60)}m ${sec % 60}s` : "No connect");

export default async function LeadDetailPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("crm.leads");
  if (!allowed) return (<><PageHeader title="Lead details" /><PermissionDenied module="CRM leads" /></>);
  const data = await getLead(id, user);
  if (!data) notFound();
  const { lead } = data;
  const canEdit = can(user, "crm.leads", "edit");
  const [chat, attachments] = await Promise.all([
    leadChat(id, user).catch(() => ({ messages: [] })),
    leadAttachments(id, user).catch(() => []),
  ]);

  return (
    <>
      <PageHeader
        title={lead.name}
        description={[lead.code || lead.id, [lead.crop, lead.acreage != null ? `${lead.acreage} acre` : null].filter(Boolean).join(", "), [lead.city, lead.state].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
        meta={
          <>
            <StatusBadge status={lead.status} />
            <StatusBadge status={lead.priority} />
            {lead.overdue && <Badge tone="danger">Follow-up overdue</Badge>}
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Lead" />
            <CardBody>
              <DescriptionList
                columns={3}
                items={[
                  { label: "WhatsApp No.", value: lead.mobile ? <a href={`tel:+91${lead.mobile}`} className="font-mono text-brand-700 hover:underline">{lead.mobile}</a> : "—" },
                  { label: "Customer type", value: lead.customerType || "Farmer" },
                  { label: "Source", value: lead.source },
                  { label: "Assigned to", value: lead.assignedTo },
                  { label: "Call attempts", value: lead.attempts },
                  { label: "Last call", value: formatDateTime(lead.lastCallAt) },
                  { label: "Next follow-up", value: formatDateTime(lead.nextFollowUp) },
                  { label: "Current crop", value: lead.crop || "—" },
                  { label: "Season", value: lead.season || "—" },
                  { label: "Next season crop", value: lead.nextSeasonCrop || "—" },
                  { label: "Product interest", value: lead.productInterest || "—" },
                  { label: "Stage", value: lead.stage || "—" },
                  { label: "Action type", value: lead.actionType || "—" },
                  { label: "Scheduled call", value: [formatDateTime(lead.scheduledCallDate), lead.scheduledCallTime].filter(Boolean).join(" ") || "—" },
                  { label: "Order value", value: lead.orderValue ? formatINR(lead.orderValue) : "—" },
                  { label: "System status", value: lead.systemStatus || "—" },
                  { label: "Created", value: formatDateTime(lead.createdAt) },
                  { label: "Last discussion", value: lead.lastNote || "—" },
                  { label: "Agent notes", value: lead.agentNotes || "—" },
                ]}
              />
            </CardBody>
          </Card>
          <LeadRecordPanels leadId={lead.id} mobile={lead.mobile} chat={chat} attachments={attachments} canEdit={canEdit} />
          <Card>
            <CardHeader title="Call history" description={`${data.activities.length} logged activities`} />
            <CardBody>
              <Timeline
                items={data.activities.map((a) => ({
                  id: a.id,
                  title: a.disposition,
                  description: [a.note, `${a.by} · ${duration(a.durationSec)}`].filter(Boolean).join(" — "),
                  meta: formatDateTime(a.at),
                  tone: ["Not reachable", "Switched off", "Wrong number"].includes(a.disposition) ? "warning" : undefined,
                }))}
              />
            </CardBody>
          </Card>
        </div>
        {canEdit && (
          <Card>
            <CardHeader title="Log a call" description="Updates status and follow-up; saved to the audit log." />
            <CardBody>
              <LeadActivityForm id={lead.id} status={lead.status} dispositions={DISPOSITIONS} statuses={LEAD_STATUSES} />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
