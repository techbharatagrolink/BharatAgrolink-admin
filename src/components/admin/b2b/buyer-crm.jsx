"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeB2bFollowup, logB2bBuyerActivity, updateB2bBuyerCrm } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { DescriptionList, Notice, Timeline } from "@/components/ui/page";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";

/*
 * Buyer / lead 360 CRM (task #107 subtask 2; spec §4): segment, pipeline stage, owner, next action,
 * procurement intelligence, open follow-ups, activity log and timeline.
 */

const IST = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
const toInput = (iso) => (iso ? IST.format(new Date(iso)).replace(" ", "T").slice(0, 16) : "");
const toDay = (iso) => toInput(iso).slice(0, 10);
const STAGE_TONE = { lost: "danger", order: "success", negotiation: "warning", quote: "info", rfq: "info" };

function useRun() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Saved." } : { tone: "danger", text: res?.message || "That did not work." });
      if (res?.ok) {
        after?.();
        router.refresh();
      }
    });
  return { busy, result, run };
}

/** "Done" with an outcome for one open follow-up (buyer page and sales workspace). */
export function FollowupDone({ taskId, buyerId, label = "Done" }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState("");
  return (
    <>
      <Button size="sm" variant="secondary" disabled={busy} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {result?.tone === "danger" && <span className="ml-2 text-xs text-danger">{result.text}</span>}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Close follow-up"
        footer={
          <Button loading={busy} disabled={outcome.trim().length < 3} onClick={() => run(() => completeB2bFollowup(taskId, outcome.trim(), buyerId), () => setOpen(false))}>
            Mark done
          </Button>
        }
      >
        <Field label="Outcome" hint="What happened, e.g. Called, wants revised rate." required>
          <Input value={outcome} maxLength={80} onChange={(e) => setOutcome(e.target.value)} />
        </Field>
      </Dialog>
    </>
  );
}

function ProfileDialog({ buyerId, crm, can, options, onClose }) {
  const { busy, result, run } = useRun();
  const [f, setF] = useState({
    segment: crm.segment || "",
    stage: crm.stage || "new",
    lostReason: "",
    ownerId: crm.ownerId ? String(crm.ownerId) : "",
    nextFollowUpAt: toInput(crm.nextFollowUpAt),
    expectedReorderAt: toDay(crm.expectedReorderAt),
    purchaseCycleDays: crm.purchaseCycleDays ?? "",
    monthlyPotential: crm.monthlyPotential ?? "",
    currentSupplier: crm.currentSupplier,
    lastBuyingRateNote: crm.lastBuyingRateNote,
    preferredBrands: crm.preferredBrands,
    topCategories: crm.topCategories,
  });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const initial = {
    segment: crm.segment || "",
    stage: crm.stage || "new",
    ownerId: crm.ownerId ? String(crm.ownerId) : "",
    nextFollowUpAt: toInput(crm.nextFollowUpAt),
    expectedReorderAt: toDay(crm.expectedReorderAt),
    purchaseCycleDays: crm.purchaseCycleDays ?? "",
    monthlyPotential: crm.monthlyPotential ?? "",
    currentSupplier: crm.currentSupplier,
    lastBuyingRateNote: crm.lastBuyingRateNote,
    preferredBrands: crm.preferredBrands,
    topCategories: crm.topCategories,
  };

  const save = () => {
    // Only what changed: the API checks owner rights and the lost reason on what it is sent.
    const body = {};
    for (const [k, v] of Object.entries(initial)) {
      if (k === "ownerId" && !can.assign) continue;
      if (String(f[k] ?? "") === String(v ?? "")) continue;
      if (["purchaseCycleDays", "monthlyPotential", "ownerId"].includes(k)) body[k] = f[k] === "" ? null : Number(f[k]);
      else if (["nextFollowUpAt", "expectedReorderAt", "segment"].includes(k)) body[k] = f[k] === "" ? null : f[k];
      else body[k] = f[k];
    }
    if (body.segment === null) delete body.segment;
    if (body.stage === "lost") body.lostReason = f.lostReason;
    // The version the form opened with: a colleague's newer change is refused (409), not overwritten.
    if (Object.keys(body).length && crm.version) body.version = crm.version;
    run(() => updateB2bBuyerCrm(buyerId, body), onClose);
  };

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title="Edit lead / buyer profile"
      footer={
        <Button loading={busy} disabled={f.stage === "lost" && f.stage !== initial.stage && !f.lostReason} onClick={save}>
          Save
        </Button>
      }
    >
      {result?.tone === "danger" && <Notice tone="danger" className="mb-3">{result.text}</Notice>}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Segment">
          <Select value={f.segment} onChange={set("segment")} placeholder="Not set" options={options.segments} />
        </Field>
        <Field label="Pipeline stage">
          <Select value={f.stage} onChange={set("stage")} options={options.stages} />
        </Field>
        {f.stage === "lost" && f.stage !== initial.stage && (
          <Field label="Lost reason" required className="sm:col-span-2">
            <Select value={f.lostReason} onChange={set("lostReason")} placeholder="Choose a reason" options={options.lostReasons} />
          </Field>
        )}
        {can.assign && (
          <Field label="Owner (sales executive)">
            <Select value={f.ownerId} onChange={set("ownerId")} placeholder="Unassigned" options={options.owners.map((o) => ({ value: String(o.id), label: `${o.name}${o.role ? ` · ${o.role}` : ""}` }))} />
          </Field>
        )}
        <Field label="Next follow-up">
          <Input type="datetime-local" value={f.nextFollowUpAt} onChange={set("nextFollowUpAt")} />
        </Field>
        <Field label="Next expected purchase">
          <Input type="date" value={f.expectedReorderAt} onChange={set("expectedReorderAt")} />
        </Field>
        <Field label="Purchase cycle (days)">
          <Input type="number" min={1} max={730} value={f.purchaseCycleDays} onChange={set("purchaseCycleDays")} />
        </Field>
        <Field label="Monthly purchase potential (₹)">
          <Input type="number" min={0} value={f.monthlyPotential} onChange={set("monthlyPotential")} />
        </Field>
        <Field label="Current supplier">
          <Input value={f.currentSupplier} maxLength={200} onChange={set("currentSupplier")} />
        </Field>
        <Field label="Preferred brands">
          <Input value={f.preferredBrands} maxLength={400} onChange={set("preferredBrands")} />
        </Field>
        <Field label="Top categories / SKUs">
          <Input value={f.topCategories} maxLength={400} onChange={set("topCategories")} />
        </Field>
        <Field label="Current / last buying rate" className="sm:col-span-2">
          <Textarea rows={2} value={f.lastBuyingRateNote} maxLength={400} onChange={set("lastBuyingRateNote")} />
        </Field>
      </div>
    </Dialog>
  );
}

export function BuyerCrmProfile({ buyerId, crm, can, options, lead }) {
  const [edit, setEdit] = useState(false);
  if (!crm) return null;
  return (
    <Card>
      <CardHeader
        title="Lead & procurement"
        actions={can?.edit && options ? <Button size="sm" variant="secondary" onClick={() => setEdit(true)}>Edit</Button> : null}
      />
      <CardBody className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{crm.segmentLabel || "No segment"}</Badge>
          <Badge tone={STAGE_TONE[crm.stage] ?? "neutral"}>{crm.stageLabel}</Badge>
        </div>
        <DescriptionList
          columns={1}
          items={[
            { label: "Owner", value: crm.owner },
            { label: "Next follow-up", value: crm.nextFollowUpAt ? formatDateTime(crm.nextFollowUpAt) : "—" },
            { label: "Next expected purchase", value: crm.expectedReorderAt ? formatDate(crm.expectedReorderAt) : "—" },
            { label: "Purchase cycle", value: crm.purchaseCycleDays ? `${crm.purchaseCycleDays} days` : "—" },
            { label: "Monthly potential", value: crm.monthlyPotential != null ? formatINR(crm.monthlyPotential) : "—" },
            { label: "Current supplier", value: crm.currentSupplier || "—" },
            { label: "Last buying rate", value: crm.lastBuyingRateNote || "—" },
            { label: "Preferred brands", value: crm.preferredBrands || "—" },
            { label: "Top categories", value: crm.topCategories || "—" },
            {
              label: "CRM lead",
              value: lead ? (
                <Link href={`/admin/crm/leads/${lead.id}`} className="text-brand-700 hover:underline">
                  {lead.code || `#${lead.id}`} · {lead.status || "—"}
                </Link>
              ) : (
                "No CRM lead for this mobile"
              ),
            },
          ]}
        />
      </CardBody>
      {edit && <ProfileDialog buyerId={buyerId} crm={crm} can={can} options={options} onClose={() => setEdit(false)} />}
    </Card>
  );
}

export function BuyerActivity({ buyerId, openTasks = [], timeline = [], options, canLog }) {
  const { busy, result, run } = useRun();
  const blank = { type: "call", subject: "", note: "", outcome: "", followUpAt: "", closeTaskId: "" };
  const [f, setF] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = () => {
    const body = { type: f.type, note: f.note.trim() };
    for (const k of ["subject", "outcome", "followUpAt"]) if (f[k]) body[k] = f[k];
    if (f.closeTaskId) body.closeTaskId = Number(f.closeTaskId);
    run(() => logB2bBuyerActivity(buyerId, body), () => setF(null));
  };

  return (
    <Card>
      <CardHeader
        title="Follow-ups & activity"
        description="Calls, WhatsApp, visits, notes and complaints. Schedule the next follow-up while logging."
        actions={canLog && options ? <Button size="sm" onClick={() => setF(blank)}>Log activity</Button> : null}
      />
      <CardBody className="space-y-4">
        {result && <Notice tone={result.tone}>{result.text}</Notice>}
        {openTasks.length > 0 && (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {openTasks.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="font-medium text-ink">{t.subject}</span>
                  <span className="block text-xs text-ink-muted">
                    Due {t.dueAt ? formatDateTime(t.dueAt) : "now"} · {t.by}
                    {t.related?.type === "quotation" && (
                      <>
                        {" · "}
                        <Link href={`/admin/b2b/quotations/${t.related.id}`} className="text-brand-700 hover:underline">quotation</Link>
                      </>
                    )}
                  </span>
                </span>
                <FollowupDone taskId={t.id} buyerId={buyerId} />
              </li>
            ))}
          </ul>
        )}
        <Timeline
          items={timeline.map((a) => ({
            id: a.id,
            title: `${a.subject}${a.outcome && a.type !== "update" ? ` · ${a.outcome}` : ""}`,
            description: a.note,
            meta: `${a.type === "followup" ? "Follow-up done" : a.type} · ${a.by} · ${formatDateTime(a.at)}`,
            tone: a.type === "lost" || a.type === "complaint" ? "danger" : undefined,
          }))}
        />
      </CardBody>
      {f && (
        <Dialog
          open
          onClose={() => setF(null)}
          title="Log activity"
          footer={
            <Button loading={busy} disabled={f.note.trim().length < 3} onClick={submit}>
              Save
            </Button>
          }
        >
          {result?.tone === "danger" && <Notice tone="danger" className="mb-3">{result.text}</Notice>}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Type" required>
              <Select value={f.type} onChange={set("type")} options={options.activityTypes} />
            </Field>
            <Field label="Outcome">
              <Input value={f.outcome} maxLength={80} onChange={set("outcome")} placeholder="e.g. Interested, call back" />
            </Field>
            <Field label="Subject" className="sm:col-span-2">
              <Input value={f.subject} maxLength={200} onChange={set("subject")} />
            </Field>
            <Field label="What happened" required className="sm:col-span-2">
              <Textarea rows={3} value={f.note} maxLength={2000} onChange={set("note")} />
            </Field>
            <Field label="Next follow-up" hint="Creates a follow-up task.">
              <Input type="datetime-local" value={f.followUpAt} onChange={set("followUpAt")} />
            </Field>
            {openTasks.length > 0 && (
              <Field label="Closes follow-up">
                <Select value={f.closeTaskId} onChange={set("closeTaskId")} placeholder="None" options={openTasks.map((t) => ({ value: String(t.id), label: t.subject }))} />
              </Field>
            )}
          </div>
        </Dialog>
      )}
    </Card>
  );
}
