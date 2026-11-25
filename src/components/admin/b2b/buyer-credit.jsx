"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { decideB2bCredit, requestB2bCredit, setB2bCreditStatus } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR, formatPercent } from "@/lib/format";

/*
 * The buyer's credit account (task #107 subtask 11; spec §16 Credit Account, C3, §19 case 5):
 * Sales asks for a limit and days, Finance approves (never their own request), holds or suspends.
 */

const STATUS_TONE = { none: "neutral", active: "success", hold: "warning", suspended: "danger" };
const REQUEST_TONE = { PENDING: "warning", APPROVED: "success", REJECTED: "danger", CANCELLED: "neutral" };
const DAY_OPTIONS = [7, 15, 30];

export function BuyerCredit({ buyerId, credit }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const [ask, setAsk] = useState(null);
  const [decide, setDecide] = useState(null);
  const [status, setStatus] = useState(null);
  if (!credit) return null;
  const P = credit.position;
  const pending = credit.requests.find((r) => r.status === "PENDING");

  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work." });
      if (res?.ok) {
        after?.();
        router.refresh();
      }
    });

  return (
    <Card>
      <CardHeader
        title="Credit account"
        description="Sales can request credit; only Finance can approve it."
        actions={
          credit.can.request ? (
            <Button size="sm" variant="secondary" disabled={busy} onClick={() => setAsk({ limit: "", days: "15", custom: "", reason: "" })}>
              Request credit
            </Button>
          ) : null
        }
      />
      <CardBody className="space-y-3 text-sm">
        {result && <Notice tone={result.tone}>{result.text}</Notice>}
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONE[P.status] ?? "neutral"}>{P.statusLabel}</Badge>
          {credit.approvedBy && <span className="text-xs text-ink-muted">by {credit.approvedBy} · {formatDateTime(credit.approvedAt)}</span>}
        </div>
        {P.status !== "none" && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div><dt className="text-ink-muted">Limit</dt><dd>{formatINR(P.limit)}</dd></div>
            <div><dt className="text-ink-muted">Credit days</dt><dd>{P.days}</dd></div>
            <div><dt className="text-ink-muted">Exposure</dt><dd>{formatINR(P.exposure)}{P.utilisationPct !== null ? ` (${formatPercent(P.utilisationPct, 0)})` : ""}</dd></div>
            <div><dt className="text-ink-muted">Available</dt><dd className="font-medium">{formatINR(P.available)}</dd></div>
            <div><dt className="text-ink-muted">Overdue</dt><dd className={P.overdueAmount > 0 ? "text-danger-ink" : ""}>{P.overdueAmount > 0 ? `${formatINR(P.overdueAmount)} on ${P.overdueOrders} order(s)` : "None"}</dd></div>
          </dl>
        )}
        {P.status === "none" && <p className="text-ink-muted">No approved credit: orders need payment (prepaid / advance) before confirmation. Exposure now {formatINR(P.exposure)}.</p>}
        {credit.note && <p className="text-xs text-ink-muted">Finance note: {credit.note}</p>}

        {credit.can.changeStatus && (
          <div className="flex flex-wrap gap-1.5">
            {P.status !== "active" && <Button size="sm" variant="secondary" disabled={busy} onClick={() => setStatus({ to: "active", reason: "" })}>Reactivate</Button>}
            {P.status === "active" && <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus({ to: "hold", reason: "" })}>Put on hold</Button>}
            {P.status !== "suspended" && <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy} onClick={() => setStatus({ to: "suspended", reason: "" })}>Suspend</Button>}
          </div>
        )}

        {credit.requests.length > 0 && (
          <div>
            <p className="text-label font-medium text-ink-soft">Requests</p>
            <ul className="mt-1 space-y-1.5">
              {credit.requests.map((r) => (
                <li key={r.id} className="rounded-md border border-line p-2">
                  <div className="flex items-start justify-between gap-2">
                    <span>
                      {formatINR(r.requestedLimit)} for {r.requestedDays} days
                      <span className="block text-xs text-ink-muted">{r.requestedBy} · {formatDateTime(r.createdAt)} · {r.reason}</span>
                      {r.status !== "PENDING" && (
                        <span className="block text-xs text-ink-muted">
                          {r.status === "APPROVED" ? `Approved ${formatINR(r.approvedLimit)} / ${r.approvedDays} days` : "Rejected"} by {r.decidedBy}: {r.decisionNote}
                        </span>
                      )}
                    </span>
                    <Badge tone={REQUEST_TONE[r.status] ?? "neutral"}>{r.status.toLowerCase()}</Badge>
                  </div>
                  {r.status === "PENDING" && credit.can.decide && (
                    <div className="mt-1.5 flex gap-1.5">
                      <Button size="sm" variant="primary" disabled={busy} onClick={() => setDecide({ request: r, decision: "APPROVED", limit: String(r.requestedLimit), days: String(r.requestedDays), note: "" })}>Approve</Button>
                      <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy} onClick={() => setDecide({ request: r, decision: "REJECTED", limit: "", days: "", note: "" })}>Reject</Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {pending && !credit.can.decide && <p className="text-xs text-ink-muted">Waiting for Finance.</p>}
      </CardBody>

      <Dialog
        open={Boolean(ask)}
        onClose={() => setAsk(null)}
        title="Request credit"
        description="Finance decides. The limit and days are the most the buyer may get."
        footer={
          <>
            <Button variant="secondary" onClick={() => setAsk(null)} disabled={busy}>Back</Button>
            <Button
              variant="primary"
              loading={busy}
              disabled={!ask || !(Number(ask.limit) > 0) || ask.reason.trim().length < 5 || !(Number(ask.days === "custom" ? ask.custom : ask.days) >= 1)}
              onClick={() =>
                run(
                  () => requestB2bCredit(buyerId, { requestedLimit: Number(ask.limit), requestedDays: Number(ask.days === "custom" ? ask.custom : ask.days), reason: ask.reason.trim() }),
                  () => setAsk(null),
                )
              }
            >
              Send to Finance
            </Button>
          </>
        }
      >
        {ask && (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <Field label="Credit limit" required>
              {({ id }) => <Input id={id} inputMode="decimal" value={ask.limit} onChange={(e) => setAsk({ ...ask, limit: e.target.value })} />}
            </Field>
            <Field label="Credit days" required>
              {({ id }) => (
                <select id={id} className="h-9 w-full rounded-md border border-line bg-surface px-2" value={ask.days} onChange={(e) => setAsk({ ...ask, days: e.target.value })}>
                  {DAY_OPTIONS.map((d) => <option key={d} value={String(d)}>{d} days</option>)}
                  <option value="custom">Custom</option>
                </select>
              )}
            </Field>
            {ask.days === "custom" && (
              <Field label="Custom days (1-180)" required>
                {({ id }) => <Input id={id} inputMode="numeric" value={ask.custom} onChange={(e) => setAsk({ ...ask, custom: e.target.value })} />}
              </Field>
            )}
            <Field label="Why (buying pattern, references, trade history)" required className="sm:col-span-2">
              {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={ask.reason} onChange={(e) => setAsk({ ...ask, reason: e.target.value })} />}
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(decide)}
        onClose={() => setDecide(null)}
        title={decide?.decision === "APPROVED" ? "Approve credit" : "Reject credit request"}
        description={decide ? `Asked: ${formatINR(decide.request.requestedLimit)} for ${decide.request.requestedDays} days by ${decide.request.requestedBy}.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDecide(null)} disabled={busy}>Back</Button>
            <Button
              variant={decide?.decision === "APPROVED" ? "primary" : "danger"}
              loading={busy}
              disabled={!decide || decide.note.trim().length < 3}
              onClick={() =>
                run(
                  () =>
                    decideB2bCredit(buyerId, decide.request.id, {
                      decision: decide.decision,
                      note: decide.note.trim(),
                      ...(decide.decision === "APPROVED" ? { approvedLimit: Number(decide.limit), approvedDays: Number(decide.days) } : {}),
                    }),
                  () => setDecide(null),
                )
              }
            >
              {decide?.decision === "APPROVED" ? "Approve" : "Reject"}
            </Button>
          </>
        }
      >
        {decide && (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {decide.decision === "APPROVED" && (
              <>
                <Field label="Approved limit" hint="Up to what was asked">
                  {({ id }) => <Input id={id} inputMode="decimal" value={decide.limit} onChange={(e) => setDecide({ ...decide, limit: e.target.value })} />}
                </Field>
                <Field label="Approved days" hint="Up to what was asked">
                  {({ id }) => <Input id={id} inputMode="numeric" value={decide.days} onChange={(e) => setDecide({ ...decide, days: e.target.value })} />}
                </Field>
              </>
            )}
            <Field label="Note" required className="sm:col-span-2">
              {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={decide.note} onChange={(e) => setDecide({ ...decide, note: e.target.value })} />}
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(status)}
        onClose={() => setStatus(null)}
        title={status ? `Credit: ${status.to === "active" ? "reactivate" : status.to === "hold" ? "put on hold" : "suspend"}` : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatus(null)} disabled={busy}>Back</Button>
            <Button variant="primary" loading={busy} disabled={!status || status.reason.trim().length < 5} onClick={() => run(() => setB2bCreditStatus(buyerId, { status: status.to, reason: status.reason.trim() }), () => setStatus(null))}>
              Save
            </Button>
          </>
        }
      >
        {status && (
          <Field label="Reason" required>
            {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={status.reason} onChange={(e) => setStatus({ ...status, reason: e.target.value })} />}
          </Field>
        )}
      </Dialog>
    </Card>
  );
}
