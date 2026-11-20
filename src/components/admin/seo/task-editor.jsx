"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/format";
import { createSeoTaskAction, loadSeoTaskAction, saveSeoMilestoneAction, updateSeoTaskAction } from "@/lib/actions/admin/seo";

/* Tasks & milestones editors (task #104, subtasks 9-10). The API re-validates everything. */

export const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "COMPLETED", label: "Completed" },
];
export const PRIORITY_OPTIONS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }));
export const MODULE_OPTIONS = [
  { value: "website_health", label: "Website Health" },
  { value: "product_data", label: "Product Data" },
  { value: "seo_google", label: "SEO & Google" },
  { value: "ai_visibility", label: "AI Recommendations" },
  { value: "orders_revenue", label: "Orders & Revenue" },
  { value: "content", label: "Content" },
  { value: "other", label: "Other" },
];
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));

const EMPTY = { title: "", description: "", module: "other", ownerId: "", priority: "MEDIUM", dueDate: "", milestoneId: "", status: "PENDING", evidence: "", note: "" };

function TaskFields({ form, set, owners, milestones, editing }) {
  const ownerOptions = owners.map((o) => ({ value: o.id, label: o.name }));
  const milestoneOptions = milestones.map((m) => ({ value: String(m.id), label: m.title }));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Title" className="sm:col-span-2" required>
        {({ id }) => <Input id={id} value={form.title} onChange={(e) => set({ title: e.target.value })} maxLength={200} />}
      </Field>
      <Field label="Description" className="sm:col-span-2">
        {({ id }) => <Textarea id={id} rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} />}
      </Field>
      <Field label="Owner">{({ id }) => <Select id={id} placeholder="Unassigned" options={ownerOptions} value={form.ownerId} onChange={(e) => set({ ownerId: e.target.value })} />}</Field>
      <Field label="Due date">{({ id }) => <Input id={id} type="date" value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />}</Field>
      <Field label="Priority">{({ id }) => <Select id={id} options={PRIORITY_OPTIONS} value={form.priority} onChange={(e) => set({ priority: e.target.value })} />}</Field>
      <Field label="Module">{({ id }) => <Select id={id} options={MODULE_OPTIONS} value={form.module} onChange={(e) => set({ module: e.target.value })} />}</Field>
      <Field label="Milestone" className="sm:col-span-2">
        {({ id }) => <Select id={id} placeholder="None" options={milestoneOptions} value={form.milestoneId} onChange={(e) => set({ milestoneId: e.target.value })} />}
      </Field>
      {editing && (
        <>
          <Field label="Status">{({ id }) => <Select id={id} options={STATUS_OPTIONS} value={form.status} onChange={(e) => set({ status: e.target.value })} />}</Field>
          <Field label="Note for the status change" hint="Optional; saved in the history.">
            {({ id }) => <Input id={id} value={form.note} onChange={(e) => set({ note: e.target.value })} maxLength={1000} />}
          </Field>
          <Field label="Completion evidence" className="sm:col-span-2" required={form.status === "COMPLETED"} hint="A link or a short note proving it is done. Needed to mark the task completed.">
            {({ id }) => <Textarea id={id} rows={2} value={form.evidence} onChange={(e) => set({ evidence: e.target.value })} />}
          </Field>
        </>
      )}
    </div>
  );
}

function useSave() {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const run = (fn, success, done) =>
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) return setError(res.message);
      setError("");
      done?.();
      notify({ message: success });
      router.refresh();
    });
  return { pending, error, setError, run };
}

function Footer({ onCancel, onSave, pending, label = "Save" }) {
  return (
    <>
      <Button variant="secondary" onClick={onCancel} disabled={pending}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave} loading={pending}>
        {label}
      </Button>
    </>
  );
}

/**
 * "New task" button. With `issue` it becomes "Create task" for a Website Health issue and is
 * pre-filled from it (the issue stays linked as the task's source).
 */
export function NewTaskButton({ owners, milestones, issue, size = "sm", label }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const { pending, error, setError, run } = useSave();
  const set = (p) => setForm((f) => ({ ...f, ...p }));

  const start = () => {
    setError("");
    setForm(
      issue
        ? {
            ...EMPTY,
            title: `${issue.label}: ${issue.path}`.slice(0, 200),
            description: [`URL: ${issue.url}`, issue.evidence && `Evidence: ${issue.evidence}`, issue.fix && `Fix: ${issue.fix}`].filter(Boolean).join("\n"),
            module: "website_health",
            priority: issue.severity === "CRITICAL" ? "CRITICAL" : issue.severity === "HIGH" ? "HIGH" : issue.severity === "MEDIUM" ? "MEDIUM" : "LOW",
          }
        : EMPTY
    );
    setOpen(true);
  };
  const save = () =>
    run(
      () => createSeoTaskAction({ ...form, sourceType: issue ? "audit_issue" : "manual", sourceId: issue?.id }),
      "Task created.",
      () => setOpen(false)
    );

  return (
    <>
      <Button size={size} variant={issue ? "outline" : "primary"} onClick={start}>
        {issue ? <ListPlus className="size-3.5" aria-hidden /> : <Plus className="size-4" aria-hidden />}
        {label ?? (issue ? "Create task" : "New task")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={issue ? "Create a task for this issue" : "New task"} size="lg" footer={<Footer onCancel={() => setOpen(false)} onSave={save} pending={pending} label="Create task" />}>
        <TaskFields form={form} set={set} owners={owners} milestones={milestones} />
        {error && (
          <p className="mt-3 text-sm text-danger-ink" role="alert">
            {error}
          </p>
        )}
      </Dialog>
    </>
  );
}

/** Opens a task: edit fields, change status (with evidence) and see its history. */
export function EditTaskButton({ taskId, owners, milestones, children }) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, startLoading] = useTransition();
  const { pending, error, setError, run } = useSave();
  const set = (p) => setForm((f) => ({ ...f, ...p }));

  const start = () => {
    setError("");
    setTask(null);
    setOpen(true);
    startLoading(async () => {
      const res = await loadSeoTaskAction(taskId);
      if (!res.ok) return setError(res.message);
      const t = res.data;
      setTask(t);
      setForm({
        title: t.title ?? "",
        description: t.description ?? "",
        module: t.module,
        ownerId: t.owner_id ?? "",
        priority: t.priority,
        dueDate: t.due_date ? String(t.due_date).slice(0, 10) : "",
        milestoneId: t.milestone_id ? String(t.milestone_id) : "",
        status: t.status,
        evidence: t.evidence ?? "",
        note: "",
      });
    });
  };
  const save = () => {
    const patch = { ...form };
    if (patch.status === task.status) delete patch.status;
    if (!patch.note) delete patch.note;
    run(() => updateSeoTaskAction(taskId, patch), "Task saved.", () => setOpen(false));
  };

  return (
    <>
      <button type="button" onClick={start} className="text-left text-ink hover:text-brand-700 hover:underline">
        {children ?? (
          <span className="inline-flex items-center gap-1 text-xs">
            <Pencil className="size-3.5" aria-hidden /> Edit
          </span>
        )}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={task ? `Task #${task.id}` : "Task"} size="lg" footer={task ? <Footer onCancel={() => setOpen(false)} onSave={save} pending={pending} /> : null}>
        {loading || !task ? (
          <p className="text-sm text-ink-muted">{error || "Loading…"}</p>
        ) : (
          <>
            {task.source_url && (
              <p className="mb-3 text-xs text-ink-muted">
                From audit issue:{" "}
                <a href={task.source_url} target="_blank" rel="noreferrer" className="break-all text-brand-700 hover:underline">
                  {task.source_url}
                </a>
              </p>
            )}
            <TaskFields form={form} set={set} owners={owners} milestones={milestones} editing />
            {error && (
              <p className="mt-3 text-sm text-danger-ink" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4 border-t border-line pt-3">
              <p className="mb-1 text-xs font-medium text-ink-muted">History</p>
              <ul className="space-y-1 text-xs text-ink-soft">
                {task.history.map((h, i) => (
                  <li key={i}>
                    {formatDateTime(h.created_at)} · {h.actor_name ?? `Admin ${h.actor_id}`} · {h.from_status ? `${STATUS_LABEL[h.from_status]} → ` : ""}
                    {STATUS_LABEL[h.to_status]}
                    {h.note ? ` · ${h.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}

const M_EMPTY = { title: "", description: "", completionCriteria: "", ownerId: "", targetDate: "", status: "PENDING", sortOrder: "" };

/** New / edit milestone. */
export function MilestoneButton({ milestone, owners }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(M_EMPTY);
  const { pending, error, setError, run } = useSave();
  const set = (p) => setForm((f) => ({ ...f, ...p }));
  const ownerOptions = owners.map((o) => ({ value: o.id, label: o.name }));

  const start = () => {
    setError("");
    setForm(
      milestone
        ? {
            title: milestone.title ?? "",
            description: milestone.description ?? "",
            completionCriteria: milestone.completion_criteria ?? "",
            ownerId: milestone.owner_id ?? "",
            targetDate: milestone.target_date ? String(milestone.target_date).slice(0, 10) : "",
            status: milestone.status,
            sortOrder: String(milestone.sort_order ?? ""),
          }
        : M_EMPTY
    );
    setOpen(true);
  };
  const save = () => run(() => saveSeoMilestoneAction(milestone?.id, form), milestone ? "Milestone saved." : "Milestone created.", () => setOpen(false));

  return (
    <>
      {milestone ? (
        <button type="button" onClick={start} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-brand-700">
          <Pencil className="size-3.5" aria-hidden /> Edit
        </button>
      ) : (
        <Button size="sm" variant="outline" onClick={start}>
          <Plus className="size-3.5" aria-hidden />
          New milestone
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title={milestone ? "Edit milestone" : "New milestone"} size="lg" footer={<Footer onCancel={() => setOpen(false)} onSave={save} pending={pending} />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2" required>
            {({ id }) => <Input id={id} value={form.title} onChange={(e) => set({ title: e.target.value })} maxLength={200} />}
          </Field>
          <Field label="Completion criteria" className="sm:col-span-2" hint="What must be true for this milestone to count as done.">
            {({ id }) => <Textarea id={id} rows={2} value={form.completionCriteria} onChange={(e) => set({ completionCriteria: e.target.value })} />}
          </Field>
          <Field label="Owner">{({ id }) => <Select id={id} placeholder="Unassigned" options={ownerOptions} value={form.ownerId} onChange={(e) => set({ ownerId: e.target.value })} />}</Field>
          <Field label="Target date">{({ id }) => <Input id={id} type="date" value={form.targetDate} onChange={(e) => set({ targetDate: e.target.value })} />}</Field>
          <Field label="Status">
            {({ id }) => (
              <Select
                id={id}
                options={STATUS_OPTIONS.filter((o) => o.value !== "BLOCKED")}
                value={form.status}
                onChange={(e) => set({ status: e.target.value })}
              />
            )}
          </Field>
          <Field label="Order" hint="Lower shows first.">
            {({ id }) => <Input id={id} type="number" min={0} max={999} value={form.sortOrder} onChange={(e) => set({ sortOrder: e.target.value })} />}
          </Field>
        </div>
        {error && (
          <p className="mt-3 text-sm text-danger-ink" role="alert">
            {error}
          </p>
        )}
      </Dialog>
    </>
  );
}
