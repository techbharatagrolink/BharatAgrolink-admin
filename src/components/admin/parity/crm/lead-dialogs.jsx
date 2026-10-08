"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, HelpCircle, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice, ProgressBar, Timeline } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { customerReportAction, leadAction, leadReportsAction, leadTimelineAction } from "@/lib/actions/admin/parity/crm";

/*
 * Action sets of each PHP lead page. `agent` is the tile grid of
 * sales_agent_leads.php; the others are the manage_lead_process.php modals.
 */
export const LEAD_ACTIONS = {
  agent: [
    { value: "order_generated", label: "Order Generated/Place", single: true },
    { value: "call_schedule", label: "Scheduled/Follow Up" },
    { value: "requirement", label: "Requirement/Enquiry" },
    { value: "in_progress", label: "In Progress/Issue" },
    { value: "dead", label: "Not Interested/Dead" },
    { value: "submit_report", label: "Submit Report" },
    { value: "call_done", label: "Call Done" },
    { value: "revert", label: "Revert Lead" },
    { value: "done", label: "Done/Order Success" },
  ],
  unassigned: [
    { value: "assign", label: "Assign to Agent" },
    { value: "submit_report", label: "Submit Report" },
    { value: "dead", label: "Mark as Dead Lead" },
    { value: "done", label: "Mark as Done Lead" },
  ],
  dead: [
    { value: "reassign", label: "Reassign" },
    { value: "ask_report", label: "Ask Report" },
  ],
  requested: [
    { value: "assign", label: "Re-Assign to Agent" },
    { value: "dead", label: "Mark as Dead Lead" },
    { value: "done", label: "Mark as Done Lead" },
  ],
};

const ASSIGN = ["assign", "reassign"];

function useLoader(load, deps) {
  const [state, setState] = useState({ loading: true, result: null });
  useEffect(() => {
    let live = true;
    load().then((result) => live && setState({ loading: false, result }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

function Loading() {
  return (
    <div className="flex justify-center py-10 text-ink-muted">
      <Loader2 className="size-5 animate-spin" aria-label="Loading" />
    </div>
  );
}

/**
 * Update-status modal. `target` = { ids, preset? }: single-lead dialogs on the
 * dead page open with the clicked action preset; bulk dialogs hide the
 * single-lead actions (Order Generated) like PHP.
 */
export function LeadActionDialog({ scope, target, agents = [], onClose, onDone }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const bulk = target.ids.length > 1 || target.bulk;
  const options = LEAD_ACTIONS[scope].filter((a) => !(bulk && a.single));
  const listStyle = scope === "unassigned" || scope === "requested";
  const [action, setAction] = useState(target.preset || (listStyle ? options[0].value : ""));
  const [agentId, setAgentId] = useState("");
  const [remark, setRemark] = useState("");
  const [report, setReport] = useState("");
  const [followUp, setFollowUp] = useState("");

  const needsAgent = ASSIGN.includes(action);
  const needsReport = action === "submit_report" || action === "ask_report";
  const needsFollowUp = action === "call_schedule";
  const title = scope === "dead" ? (bulk ? `Bulk ${action === "ask_report" ? "Ask Report" : "Reassign"} (${target.ids.length})` : "Manage Dead Lead") : bulk ? `Bulk Update Leads (${target.ids.length})` : scope === "agent" ? "Update Lead Status" : "Manage Lead";

  const submit = (e) => {
    e.preventDefault();
    if (!action) return notify({ message: "Please select an action.", tone: "error" });
    if (needsAgent && !agentId) return notify({ message: "Please select an agent", tone: "error" });
    startTransition(async () => {
      const result = await leadAction(scope, { ids: target.ids, action, remark, agentId, reportContent: report, nextFollowUp: followUp });
      if (!result.ok) return notify({ message: result.message, tone: "error" });
      notify({ message: result.message, tone: "success" });
      if (action === "order_generated" && result.leadCode) window.open(`/admin/orders/new?lead_code=${encodeURIComponent(result.leadCode)}`, "_blank", "noopener");
      onDone?.();
      onClose();
      router.refresh();
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      size={scope === "agent" ? "lg" : "md"}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="lead-action-form" loading={pending}>
            {scope === "agent" ? "Update Status" : "Submit"}
          </Button>
        </>
      }
    >
      <form id="lead-action-form" onSubmit={submit} className="space-y-4">
        {scope === "agent" ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Action">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={action === o.value}
                onClick={() => setAction(o.value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  action === o.value ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line-strong text-ink-soft hover:bg-surface-muted",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : listStyle ? (
          <Field label="Action">{({ id }) => <Select id={id} value={action} onChange={(e) => setAction(e.target.value)} options={options} />}</Field>
        ) : null}

        {needsAgent && (
          <Field label={scope === "dead" ? "Reassign To" : "Assign To"} required>
            {({ id }) => <Select id={id} value={agentId} onChange={(e) => setAgentId(e.target.value)} options={agents} placeholder="Select Agent" />}
          </Field>
        )}
        {needsFollowUp && (
          <Field label="Next Follow-up Time" required>
            {({ id }) => <Input id={id} type="datetime-local" required value={followUp} onChange={(e) => setFollowUp(e.target.value)} />}
          </Field>
        )}
        {needsReport && (
          <Field label={action === "ask_report" ? "Report Request Message" : "Report Content"} required={scope === "agent"}>
            {({ id }) => (
              <Textarea
                id={id}
                rows={action === "ask_report" ? 3 : 5}
                required={scope === "agent"}
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder={action === "ask_report" ? "Enter what you want to ask..." : "Enter detailed report..."}
              />
            )}
          </Field>
        )}
        {(action || listStyle) && (
          <Field label={scope === "agent" ? "Remark / Note" : "Remark"} required>
            {({ id }) => (
              <Textarea
                id={id}
                required
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={scope === "agent" ? "Enter details about this interaction..." : scope === "dead" ? "Enter reason or instructions..." : undefined}
              />
            )}
          </Field>
        )}
      </form>
    </Dialog>
  );
}

/** get_lead_reports.php: submitted reports and report requests, oldest first. */
export function LeadReportsDialog({ permission, leadId, onClose }) {
  const { loading, result } = useLoader(() => leadReportsAction(permission, leadId), [permission, leadId]);
  return (
    <Dialog open onClose={onClose} title="Submitted Reports">
      {loading ? (
        <Loading />
      ) : !result.ok ? (
        <Notice tone="danger">{result.message || "Error loading reports."}</Notice>
      ) : result.data.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No reports or requests found for this lead.</p>
      ) : (
        <ul className="space-y-3">
          {result.data.map((r) => (
            <li key={r.id} className={cn("rounded-lg border p-3.5", r.requested ? "border-warning-ink/30 bg-warning-bg/40" : "border-line")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  {r.requested ? <HelpCircle className="size-4 text-warning-ink" aria-hidden /> : <CheckCircle2 className="size-4 text-success-ink" aria-hidden />}
                  {r.requested ? "Report Requested By" : "Report Submitted By"} {r.userName || "Unknown"}
                </p>
                <span className="text-xs text-ink-muted">{formatDateTime(r.createdAt)}</span>
              </div>
              {r.content && <p className="mt-1.5 text-sm whitespace-pre-wrap text-ink-soft">{r.content}</p>}
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}

/** get_lead_timeline.php: status history with reports, newest first. */
export function LeadTimelineDialog({ permission, leadId, onClose }) {
  const { loading, result } = useLoader(() => leadTimelineAction(permission, leadId), [permission, leadId]);
  const lead = result?.ok ? result.data.lead : null;
  return (
    <Dialog open onClose={onClose} title="Lead History" description={lead ? `${lead.name || "Lead"} · ${lead.code}` : undefined} size="lg">
      {loading ? (
        <Loading />
      ) : !result.ok ? (
        <Notice tone="danger">{result.message || "Error loading history."}</Notice>
      ) : (
        <Timeline
          items={result.data.items.map((h) => ({
            id: h.key,
            title: <StatusBadge status={h.status} />,
            description: (
              <>
                {h.remark && <span className="block whitespace-pre-wrap">{h.remark}</span>}
                {h.report && <span className="mt-1 block rounded-md bg-surface-muted px-2.5 py-1.5 whitespace-pre-wrap text-ink">{h.report}</span>}
              </>
            ),
            meta: `${h.userName || "System"} · ${formatDateTime(h.createdAt)}`,
            tone: h.status === "Dead" ? "danger" : h.status === "Report Requested" ? "warning" : undefined,
          }))}
        />
      )}
    </Dialog>
  );
}

function Ring({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-line p-3 text-center">
      <p className="text-lg font-semibold text-ink tabular">{value}%</p>
      <ProgressBar value={value} tone={tone} className="mt-1.5" label={label} />
      <p className="mt-1.5 text-xs text-ink-muted">{label}</p>
    </div>
  );
}

/** get_customer_report_data.php: order history of the app user with the lead's phone. */
export function CustomerReportDialog({ permission, mobile, onClose }) {
  const { loading, result } = useLoader(() => customerReportAction(permission, mobile), [permission, mobile]);
  const data = result?.ok ? result.data : null;
  return (
    <Dialog open onClose={onClose} title={data?.found ? data.customerName || "Customer" : "Customer Report"} description={mobile}>
      {loading ? (
        <Loading />
      ) : !result.ok ? (
        <Notice tone="danger">{result.message || "Error loading report."}</Notice>
      ) : !data.found ? (
        <p className="py-6 text-center text-sm text-danger-ink">{data.message}</p>
      ) : (
        <div className="space-y-4">
          <Badge tone={data.dangerZone ? "danger" : "success"} dot>
            {data.dangerZone ? "Danger Customer" : "Safe Customer"}
          </Badge>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Total Revenue", formatINR(data.totalRevenue)],
              ["Total Orders", formatNumber(data.totalOrders)],
              ["Delivered Items", formatNumber(data.totalDelivered)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line p-3">
                <p className="text-base font-semibold text-ink tabular">{value}</p>
                <p className="text-xs text-ink-muted">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Ring label="Success Rate" value={data.successRate} tone="brand" />
            <Ring label="RTO Rate" value={data.rtoRate} tone="danger" />
            <Ring label="Cancelled/Rejected" value={data.cancelledRejectedRate} tone="info" />
          </div>
        </div>
      )}
    </Dialog>
  );
}
