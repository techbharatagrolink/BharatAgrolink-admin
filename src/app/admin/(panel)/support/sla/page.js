import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getSlaScreen, slaFilters, SLA_STATES } from "@/lib/services/admin/support-sla";
import { formatDateTime, formatRelative } from "@/lib/format";
import { Notice, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { SlaTicketActions } from "@/components/admin/workflows/sla-actions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Departments & SLA" };

const TITLE = "Departments & SLA";
const DESCRIPTION = "Ticket SLA from calculateSLA() and who owns each ticket: the Operations team, the Sales team or a support department.";

const STATE_BADGE = {
  breached: ["Breached", "danger"],
  at_risk: ["At risk", "warning"],
  on_track: ["On track", "success"],
  no_sla: ["No deadline", "neutral"],
  met: ["Closed in SLA", "success"],
  missed: ["Closed late", "danger"],
  resolved: ["Closed", "neutral"],
};

function href(filters, patch) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...filters, ...patch })) if (v != null && v !== "") params.set(k, String(v));
  const qs = params.toString();
  return `/admin/support/sla${qs ? `?${qs}` : ""}`;
}

const num = (v, tone) => <span className={cn("tabular", v ? tone : "text-ink-muted")}>{v ?? 0}</span>;
const metCell = (r) => (r.metPercent == null ? <span className="text-ink-muted">—</span> : <span className="tabular">{`${r.met}/${r.met + r.missed} (${r.metPercent}%)`}</span>);

function SlaBadge({ state }) {
  const [label, tone] = STATE_BADGE[state] ?? [state, "neutral"];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

export default async function SupportSlaPage({ searchParams }) {
  const { user, allowed } = await checkPermission("support.settings");
  if (!allowed)
    return (
      <>
        <PageHeader title={TITLE} />
        <PermissionDenied module="support SLA" />
      </>
    );

  const filters = slaFilters(await searchParams);
  const data = await getSlaScreen(user, filters);
  const header = (
    <PageHeader
      title={TITLE}
      description={DESCRIPTION}
      actions={
        <Link href="/admin/support" className={buttonClasses({ size: "sm" })}>
          All tickets
        </Link>
      }
    />
  );
  if (data.error)
    return (
      <>
        {header}
        <ApiUnavailable error={data.error} what="the ticket SLA" />
      </>
    );

  const { overview, tickets, meta, teams } = data;
  const t = overview.totals;
  const canEdit = can(user, "support.settings", "edit");
  const state = filters.state || "attention";
  const ownerOptions = [
    ...teams.teams.map((x) => ({ value: x.key, label: `${x.label} team` })),
    ...teams.departments.map((d) => ({ value: `dept:${d}`, label: `${d} (no team)` })),
  ];
  const agentOptions = [{ value: "none", label: "No agent" }, ...teams.teams.flatMap((x) => x.members.map((m) => ({ value: m.id, label: `${m.name} · ${x.label}` })))];
  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const stateLabel = SLA_STATES.find((s) => s.value === state)?.label ?? "Tickets";

  return (
    <>
      {header}

      {!overview.assignmentsEnabled && (
        <Notice tone="warning" className="mb-4" title="Team assignment is not set up yet">
          The support_ticket_sla table has not been created, so tickets are grouped by department only (Logistics counts as Operations). Run the API migrations to assign tickets to Operations or Sales agents and to escalate them.
        </Notice>
      )}

      <StatGrid className="xl:grid-cols-5">
        <StatCard label="Open tickets" value={t.open} tone="neutral" href={href({}, { state: "open" })} hint={`${t.total} in range`} />
        <StatCard label="Breached" value={t.breached} tone="danger" href={href({}, { state: "breached" })} hint="Past the SLA deadline" />
        <StatCard label="At risk" value={t.atRisk} tone="warning" href={href({}, { state: "at_risk" })} hint={`${overview.warnPercent}% of the SLA used`} />
        <StatCard label="On track" value={t.onTrack} tone="info" href={href({}, { state: "on_track" })} />
        <StatCard
          label="Closed within SLA"
          value={t.metPercent == null ? "—" : `${t.metPercent}%`}
          tone="brand"
          href={href({}, { state: "closed" })}
          hint={t.met + t.missed ? `${t.met} of ${t.met + t.missed}, by last update` : "No closed tickets"}
          className="col-span-2 md:col-span-1"
        />
      </StatGrid>

      <Card className="mt-4">
        <CardHeader title="By team" description="Operations agents come from Operations Setup, Sales from the sales roles. Tickets without a team stay with their department." />
        <MiniTable
          columns={[
            {
              key: "label",
              label: "Team / department",
              render: (r) => (
                <span className="flex flex-wrap items-center gap-2">
                  <Link href={href({}, { team: r.key, state: "open" })} className="font-medium text-brand-700 hover:underline">
                    {r.label}
                  </Link>
                  <Badge tone={r.kind === "team" ? "brand" : "neutral"}>{r.kind === "team" ? `${r.members} members` : "Department"}</Badge>
                </span>
              ),
            },
            { key: "open", label: "Open", align: "right" },
            { key: "atRisk", label: "At risk", align: "right", render: (r) => num(r.atRisk, "font-medium text-warning-ink") },
            { key: "breached", label: "Breached", align: "right", render: (r) => num(r.breached, "font-medium text-danger-ink") },
            { key: "onTrack", label: "On track", align: "right" },
            { key: "met", label: "Closed in SLA", align: "right", render: metCell },
          ]}
          rows={overview.byTeam}
        />
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader title="By priority" />
          <MiniTable
            columns={[
              { key: "priority", label: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
              { key: "open", label: "Open", align: "right" },
              { key: "atRisk", label: "At risk", align: "right", render: (r) => num(r.atRisk, "font-medium text-warning-ink") },
              { key: "breached", label: "Breached", align: "right", render: (r) => num(r.breached, "font-medium text-danger-ink") },
              { key: "met", label: "Closed in SLA", align: "right", render: metCell },
            ]}
            rows={overview.byPriority}
          />
        </Card>
        <Card className="min-w-0">
          <CardHeader title="By agent" />
          <MiniTable
            columns={[
              {
                key: "name",
                label: "Agent",
                render: (r) =>
                  r.id ? (
                    <Link href={href({}, { agentId: r.id, state: "open" })} className="font-medium text-brand-700 hover:underline">
                      {r.name}
                    </Link>
                  ) : (
                    <span className="text-ink-muted">No agent</span>
                  ),
              },
              { key: "team", label: "Team" },
              { key: "open", label: "Open", align: "right" },
              { key: "breached", label: "Breached", align: "right", render: (r) => num(r.breached, "font-medium text-danger-ink") },
              { key: "met", label: "Closed in SLA", align: "right", render: metCell },
            ]}
            rows={overview.byAssignee}
            empty="No tickets in this range."
          />
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title={stateLabel} description={`${meta?.total ?? tickets.length} ticket${(meta?.total ?? tickets.length) === 1 ? "" : "s"} · most urgent first`} />
        <CardBody className="border-b border-line">
          <form method="get" action="/admin/support/sla" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>SLA</span>
              <Select name="state" defaultValue={state} options={SLA_STATES} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Team</span>
              <Select name="team" defaultValue={filters.team ?? ""} placeholder="All" options={ownerOptions} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Agent</span>
              <Select name="agentId" defaultValue={filters.agentId ?? ""} placeholder="All" options={agentOptions} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Priority</span>
              <Select name="priority" defaultValue={filters.priority ?? ""} placeholder="All" options={teams.priorities} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Status</span>
              <Select name="status" defaultValue={filters.status ?? ""} placeholder="All" options={teams.statuses} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Created from</span>
              <Input type="date" name="from" defaultValue={filters.from ?? ""} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Created to</span>
              <Input type="date" name="to" defaultValue={filters.to ?? ""} />
            </label>
            <label className="min-w-0 space-y-1 text-[13px] font-medium text-ink-soft">
              <span>Search</span>
              <Input type="search" name="q" defaultValue={filters.q ?? ""} placeholder="Ticket #, subject, requester" />
            </label>
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-4 2xl:col-span-8">
              <button type="submit" className={buttonClasses({ variant: "primary", size: "sm" })}>
                Apply filters
              </button>
              <Link href="/admin/support/sla" className={buttonClasses({ size: "sm" })}>
                Reset
              </Link>
            </div>
          </form>
        </CardBody>
        {tickets.length ? (
          <MiniTable
            columns={[
              {
                key: "id",
                label: "Ticket",
                render: (r) => (
                  <span className="block min-w-0 max-w-[16rem] whitespace-normal">
                    <Link href={`/admin/support/${r.id}`} className="font-medium text-brand-700 hover:underline">
                      #{r.id} {r.subject}
                    </Link>
                    <span className="block truncate text-xs text-ink-muted">
                      {r.requester} · {r.userType} · {r.category}
                    </span>
                  </span>
                ),
              },
              {
                key: "slaState",
                label: "SLA",
                render: (r) => (
                  <span className="block">
                    <SlaBadge state={r.slaState} />
                    <span className="mt-0.5 block text-xs text-ink-muted">{r.slaDeadline ? formatDateTime(r.slaDeadline) : "No deadline"}</span>
                    {r.slaDeadline && <span className="block text-xs text-ink-muted">{formatRelative(r.slaDeadline)}</span>}
                  </span>
                ),
              },
              {
                key: "status",
                label: "Priority / status",
                render: (r) => (
                  <span className="flex flex-col items-start gap-1">
                    <StatusBadge status={r.priority} />
                    <StatusBadge status={r.status} />
                  </span>
                ),
              },
              {
                key: "team",
                label: "Owner",
                render: (r) => (
                  <span className="block">
                    <span className="font-medium text-ink">{r.team ?? r.department}</span>
                    {r.escalationLevel > 0 && (
                      <Badge tone="danger" className="ml-1.5">
                        L{r.escalationLevel}
                      </Badge>
                    )}
                    <span className="block text-xs text-ink-muted">{r.agentName ?? (r.team ? `${r.department} dept · no agent` : "No team")}</span>
                  </span>
                ),
              },
              ...(canEdit
                ? [
                    {
                      key: "actions",
                      label: "Actions",
                      wrap: true,
                      render: (r) =>
                        ["met", "missed", "resolved"].includes(r.slaState) ? (
                          <span className="text-xs text-ink-muted">Closed</span>
                        ) : (
                          <SlaTicketActions ticket={r} teams={teams.teams} departments={teams.departments} assignmentsEnabled={overview.assignmentsEnabled} />
                        ),
                    },
                  ]
                : []),
            ]}
            rows={tickets}
          />
        ) : (
          <EmptyState title="No tickets match" description={state === "attention" ? "Nothing is breached or at risk for these filters." : "Try a different SLA state or clear the filters."} />
        )}
        {totalPages > 1 && (
          <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted">
            <span>
              Page {page} of {totalPages}
            </span>
            <span className="flex gap-2">
              {page > 1 && (
                <Link href={href(filters, { page: page - 1 })} className={buttonClasses({ size: "sm" })}>
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={href(filters, { page: page + 1 })} className={buttonClasses({ size: "sm" })}>
                  Next
                </Link>
              )}
            </span>
          </nav>
        )}
      </Card>

      <Card className="mt-4">
        <CardHeader title="SLA rules" description={`Fixed in ${overview.rules.source}; the first matching row sets the deadline when a ticket is created. A ticket is at risk once ${overview.rules.warnPercent}% of its window has passed.`} />
        <MiniTable
          columns={[
            { key: "priority", label: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
            { key: "requester", label: "Requester" },
            { key: "category", label: "Category" },
            { key: "hours", label: "Resolve within", align: "right", render: (r) => `${r.hours} h` },
          ]}
          rows={overview.rules.rules}
        />
        <p className="border-t border-line px-4 py-3 text-xs text-ink-muted">
          Department to team: {overview.rules.departmentTeams.map((d) => `${d.department} → ${d.teamLabel}`).join(", ")}. Any other department keeps the ticket until it is assigned to Operations or Sales.
        </p>
      </Card>
    </>
  );
}
