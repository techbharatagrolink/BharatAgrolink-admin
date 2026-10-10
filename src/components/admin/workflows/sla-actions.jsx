"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { assignSlaTicketAction, escalateSlaTicketAction, updateSlaDeadlineAction } from "@/lib/actions/admin/support-sla";

const TABS = [
  { id: "assign", label: "Assign" },
  { id: "escalate", label: "Escalate" },
  { id: "deadline", label: "Deadline" },
];

/** sla_deadline is stored as Asia/Kolkata wall clock; datetime-local wants "YYYY-MM-DDTHH:mm". */
function istLocal(iso) {
  if (!iso) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function SlaTicketActions({ ticket, teams, departments, assignmentsEnabled }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("assign");
  const [busy, startBusy] = useTransition();
  const [form, setForm] = useState({});

  const reset = () =>
    setForm({
      team: ticket.teamExplicit ? ticket.teamKey ?? "" : "",
      agentId: ticket.agentId ?? "",
      department: ticket.department ?? "",
      reason: "",
      deadline: istLocal(ticket.slaDeadline),
      recalculate: false,
    });
  const show = (next) => {
    reset();
    setTab(next);
    setOpen(true);
  };
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const members = teams.find((t) => t.key === form.team)?.members ?? [];
  const reasonOk = String(form.reason ?? "").trim().length >= 5;
  const needsTable = tab !== "deadline" && !assignmentsEnabled;

  const submit = () =>
    startBusy(async () => {
      let result;
      if (tab === "assign") {
        const input = { reason: form.reason };
        const ownerChanged = (ticket.teamExplicit ? ticket.teamKey ?? "" : "") !== form.team || (ticket.agentId ?? "") !== form.agentId;
        if (ownerChanged) Object.assign(input, { team: form.team, agentId: form.agentId });
        if (form.department && form.department !== ticket.department) input.department = form.department;
        result = await assignSlaTicketAction(ticket.id, input);
      } else if (tab === "escalate") {
        result = await escalateSlaTicketAction(ticket.id, { reason: form.reason, team: form.team, agentId: form.agentId });
      } else {
        result = await updateSlaDeadlineAction(ticket.id, { reason: form.reason, deadline: form.deadline.replace("T", " "), recalculate: form.recalculate });
      }
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        setOpen(false);
        router.refresh();
      }
    });

  const assignChanged =
    tab === "assign" &&
    ((ticket.teamExplicit ? ticket.teamKey ?? "" : "") !== form.team || (ticket.agentId ?? "") !== form.agentId || (form.department && form.department !== ticket.department));
  const canSubmit =
    !busy &&
    (tab === "assign" ? Boolean(assignChanged) : tab === "escalate" ? assignmentsEnabled && reasonOk : reasonOk && Boolean(form.recalculate || form.deadline));

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        <Button size="xs" variant="secondary" onClick={() => show("assign")}>
          Assign
        </Button>
        <Button size="xs" variant="danger-outline" onClick={() => show("escalate")}>
          Escalate
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Ticket #${ticket.id}`}
        description={ticket.subject}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant={tab === "escalate" ? "danger" : "primary"} onClick={submit} loading={busy} disabled={!canSubmit}>
              {tab === "assign" ? "Save owner" : tab === "escalate" ? "Escalate" : "Update deadline"}
            </Button>
          </>
        }
      >
        <div role="tablist" aria-label="Ticket SLA action" className="mb-4 inline-flex rounded-lg border border-line bg-surface p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn("rounded-md px-3 py-1.5 text-[13px] font-medium", tab === t.id ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:text-ink")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {needsTable && (
            <p className="rounded-lg bg-warning-bg px-3 py-2 text-[13px] text-warning-ink">
              {tab === "assign" ? "Team and agent ownership needs the support_ticket_sla table (run the API migrations). The department can still be changed." : "Escalation needs the support_ticket_sla table (run the API migrations)."}
            </p>
          )}
          {tab !== "deadline" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Team">
                {({ id }) => (
                  <Select
                    id={id}
                    value={form.team ?? ""}
                    disabled={!assignmentsEnabled}
                    onChange={(e) => set({ team: e.target.value, agentId: "" })}
                    placeholder={tab === "escalate" ? "Keep current team" : "Follow department"}
                    options={teams.map((t) => ({ value: t.key, label: `${t.label} (${t.members.length})` }))}
                  />
                )}
              </Field>
              <Field label="Agent">
                {({ id }) => (
                  <Select
                    id={id}
                    value={form.agentId ?? ""}
                    disabled={!assignmentsEnabled || !form.team}
                    onChange={(e) => set({ agentId: e.target.value })}
                    placeholder={form.team ? "Whole team" : "Choose a team first"}
                    options={members.map((m) => ({ value: m.id, label: `${m.name} · ${m.role}` }))}
                  />
                )}
              </Field>
            </div>
          )}
          {tab === "assign" && (
            <Field label="Department" hint="Changing it notifies the requester, as the PHP ticket screen does.">
              {({ id, describedBy }) => <Select id={id} aria-describedby={describedBy} value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} options={departments} />}
            </Field>
          )}
          {tab === "escalate" && <p className="text-[13px] text-ink-muted">Sets priority to Urgent, raises the escalation level and adds an internal note. The deadline is not moved.</p>}
          {tab === "deadline" && (
            <>
              <Switch checked={Boolean(form.recalculate)} onChange={(v) => set({ recalculate: v })} label={`Restart the SLA clock from now (${ticket.ruleHours ?? "rule"} h for this priority and category)`} />
              {!form.recalculate && (
                <Field label="New deadline (IST)" required>
                  {({ id }) => <Input id={id} type="datetime-local" value={form.deadline ?? ""} onChange={(e) => set({ deadline: e.target.value })} />}
                </Field>
              )}
            </>
          )}
          <Field label="Reason" required={tab !== "assign"} hint={tab === "assign" ? "Optional, saved in the audit log." : "At least 5 characters, saved in the audit log."}>
            {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} rows={2} maxLength={500} value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />}
          </Field>
        </div>
      </Dialog>
    </>
  );
}
