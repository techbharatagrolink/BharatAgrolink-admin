"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Switch, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import { ticketMessageAction, updateTicketAction } from "@/lib/actions/admin/workflows";

export function TicketConversation({ id, messages, canReply }) {
  const router = useRouter();
  const { notify } = useToast();
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const [busy, startBusy] = useTransition();

  const send = (event) => {
    event.preventDefault();
    startBusy(async () => {
      const r = await ticketMessageAction(id, text, internal);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setText("");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col">
      <ol className="space-y-3 p-4" aria-label="Conversation">
        {messages.map((m) => {
          const mine = m.senderType === "admin";
          return (
            <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm", m.internal ? "border border-dashed border-warning-ink/40 bg-warning-bg text-warning-ink" : mine ? "bg-brand-50 text-ink" : "bg-surface-muted text-ink")}>
                <p className="mb-0.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  {m.internal && <Lock className="size-3" aria-hidden />}
                  {m.sender} · {formatDateTime(m.at)}
                  {m.internal && <span className="sr-only">(internal note)</span>}
                </p>
                <p className="whitespace-pre-wrap">{m.message}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {canReply && (
        <form onSubmit={send} className="space-y-3 border-t border-line p-4">
          <Field label={internal ? "Internal note (team only)" : "Reply to requester"}>
            {({ id: fid }) => <Textarea id={fid} rows={3} value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} placeholder={internal ? "Visible only to admin staff" : "The requester sees this message"} />}
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Switch checked={internal} onChange={setInternal} label="Internal note" />
            <Button type="submit" variant="primary" loading={busy} disabled={text.trim().length < 2}>
              {internal ? "Add note" : "Send reply"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export function TicketControls({ id, ticket, options }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState({ status: ticket.status, department: ticket.department, priority: ticket.priority, assignee: ticket.assignee ?? "", reason: "" });
  const [busy, startBusy] = useTransition();
  const changed = ["status", "department", "priority", "assignee"].some((k) => (ticket[k] ?? "") !== form[k]);

  const save = () =>
    startBusy(async () => {
      const patch = {};
      for (const k of ["status", "department", "priority", "assignee"]) if ((ticket[k] ?? "") !== form[k]) patch[k] = form[k];
      if (form.reason) patch.reason = form.reason;
      const r = await updateTicketAction(id, patch);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) router.refresh();
    });

  return (
    <div className="space-y-3">
      {[
        ["status", "Status", options.statuses],
        ["department", "Department", options.departments],
        ["priority", "Priority", options.priorities],
        ["assignee", "Assignee", options.assignees],
      ].map(([key, label, opts]) => (
        <Field key={key} label={label}>
          {({ id: fid }) => <Select id={fid} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} options={opts} placeholder={key === "assignee" ? "Unassigned" : undefined} />}
        </Field>
      ))}
      {form.status === "Rejected" && ticket.status !== "Rejected" && (
        <Field label="Reason for rejecting" required>
          {({ id: fid }) => <Textarea id={fid} rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />}
        </Field>
      )}
      <Button className="w-full" variant="primary" onClick={save} loading={busy} disabled={!changed}>
        Save changes
      </Button>
    </div>
  );
}
