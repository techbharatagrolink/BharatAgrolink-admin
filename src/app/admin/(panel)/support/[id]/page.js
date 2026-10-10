import { notFound } from "next/navigation";
import { List, Mail, Phone, User } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { CONTROL_DEPARTMENTS, CONTROL_STATUSES, getTicket } from "@/lib/services/admin/support";
import { formatPhpDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PermissionDenied } from "@/components/ui/states";
import { TicketAdminControls, TicketChat } from "@/components/admin/workflows/ticket-panel";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Ticket ${id}` };
}

function SectionHeader({ children }) {
  return <h2 className="mb-4 border-b-2 border-brand-600 pb-2 text-[0.85rem] font-bold tracking-wide text-brand-700 uppercase">{children}</h2>;
}

function Detail({ label, children }) {
  return (
    <div>
      <div className="mb-0.5 text-xs font-bold tracking-wide text-ink-muted uppercase">{label}</div>
      <div className="mb-3 text-[0.95rem] font-medium wrap-break-word text-ink">{children}</div>
    </div>
  );
}

const orNA = (value, fallback = "N/A") => value || fallback;

/** PHP support/admin_ticket_details.php: ticket info + admin controls, requester profile, live chat. */
export default async function TicketDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/support/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("support");
  if (!allowed) return (<><PageHeader title="Ticket" /><PermissionDenied module="support" /></>);
  const data = await getTicket(id, user);
  if (!data) notFound();
  const t = data.ticket;
  const r = data.requester ?? {};
  const vendor = t.userType === "vendor";
  const canEdit = can(user, "support", "edit");
  const canReply = can(user, "support", "add") || canEdit;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold tracking-tight text-ink">Ticket #{t.id}</h1>
        <ButtonLink href="/admin/support" variant="outline" size="sm">
          <List className="size-4" aria-hidden /> All Tickets
        </ButtonLink>
      </div>

      <div className="flex flex-col gap-4 lg:h-[calc(100dvh-9.5rem)] lg:min-h-[560px] lg:flex-row">
        <Card as="aside" aria-label="Ticket info" className="max-h-[400px] shrink-0 overflow-y-auto p-4 lg:max-h-none lg:w-[280px]">
          {canEdit && (
            <TicketAdminControls key={`${t.status}|${t.department}`} id={t.id} status={t.status} department={t.department} statuses={CONTROL_STATUSES} departments={CONTROL_DEPARTMENTS} />
          )}
          <SectionHeader>Ticket Info</SectionHeader>
          <div className="grid grid-cols-2 gap-x-3">
            <Detail label="ID">#{t.id}</Detail>
            <Detail label="Status">
              <Badge tone="warning">{t.status}</Badge>
            </Detail>
          </div>
          <Detail label="Subject">{t.subject}</Detail>
          <Detail label="Category">{t.category}</Detail>
          <Detail label="Department">{t.department ?? "Not Assigned"}</Detail>
          <Detail label="SLA Deadline">
            <span className="font-bold text-danger-ink">{formatPhpDate(t.slaDeadline, "M d, H:i") || "N/A"}</span>
          </Detail>
          {t.description && (
            <Detail label="Description">
              <span className="text-sm whitespace-pre-wrap">{t.description}</span>
            </Detail>
          )}
        </Card>

        <Card as="aside" aria-label={vendor ? "Vendor profile" : "Customer profile"} className="max-h-[400px] shrink-0 overflow-y-auto p-4 lg:max-h-none lg:w-[300px]">
          <SectionHeader>{vendor ? "Vendor Profile" : "Customer Profile"}</SectionHeader>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-muted text-surface">
              <User className="size-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-ink">{orNA(r.name, "Unknown")}</div>
              <div className="text-sm text-ink-muted capitalize">{t.userType}</div>
            </div>
          </div>
          {vendor ? (
            <>
              <Detail label="GST Number">{orNA(r.gstNumber)}</Detail>
              <Detail label="Contact Info">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0 text-ink-muted" aria-label="Phone" /> {orNA(r.phone)}
                </span>
                <span className="flex items-center gap-1.5 break-all">
                  <Mail className="size-3.5 shrink-0 text-ink-muted" aria-label="Email" /> {orNA(r.email)}
                </span>
              </Detail>
              <Detail label="Registered Address">
                <span className="text-sm text-ink-muted">{orNA(r.address, "Not provided")}</span>
              </Detail>
            </>
          ) : (
            <>
              <Detail label="Customer Since">{formatPhpDate(r.joinedAt, "M Y") || "N/A"}</Detail>
              <Detail label="Phone">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0 text-ink-muted" aria-hidden /> {orNA(r.phone)}
                </span>
              </Detail>
              <Detail label="Delivery Address">
                <span className="text-sm text-ink-muted">{orNA(r.address, "No address found")}</span>
              </Detail>
            </>
          )}
        </Card>

        <div className="h-[70vh] min-h-[400px] min-w-0 lg:h-auto lg:flex-1">
          <TicketChat id={t.id} subject={t.subject} requesterName={r.name || ""} messages={data.messages} viewer={data.viewer} realtime={data.realtime} canReply={canReply} />
        </div>
      </div>
    </>
  );
}
