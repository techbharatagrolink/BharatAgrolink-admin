"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { allocateB2bReceipt, recordB2bReceipt, recordB2bRefund, reverseB2bReceipt, updateB2bSettlement } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDate, formatDateTime, formatINR, formatPercent } from "@/lib/format";

/*
 * Payment, credit and seller settlement of one order (task #107 subtask 11; spec §16, C3, C7).
 * The amounts come from the ledger on the server; this card only sends what Finance typed.
 */

const RECEIPT_MODES = ["Bank transfer", "NEFT", "RTGS", "IMPS", "UPI", "Cheque", "Cash", "Demand draft"];
const REFUND_MODES = ["Bank transfer", "NEFT", "RTGS", "IMPS", "UPI", "Cheque", "Razorpay refund"];
const PAY_TONE = { pending: "neutral", partial: "warning", paid: "success", overdue: "danger", refunded: "info" };
const SETTLE_TONE = { not_eligible: "neutral", eligible: "info", hold: "warning", processing: "info", paid: "success", adjusted: "brand" };
const SETTLE_ORDER = ["process", "pay", "hold", "release", "deduct", "adjust"];

const newKey = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const today = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
const select = "h-9 w-full rounded-md border border-line bg-surface px-2";

function useRunner() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details });
      if (res?.ok) {
        after?.(res);
        router.refresh();
      }
    });
  return { busy, result, run };
}

function Result({ result }) {
  if (!result) return null;
  return (
    <Notice tone={result.tone}>
      {result.text}
      {result.details?.length > 1 && (
        <ul className="mt-1 list-disc pl-5">
          {result.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </Notice>
  );
}

/** Payment position, ledger (allocations, refunds), record / allocate / reverse / refund, credit. */
export function OrderFinance({ orderId, buyerId, finance }) {
  const { busy, result, run } = useRunner();
  const [receipt, setReceipt] = useState(null);
  const [refund, setRefund] = useState(null);
  const [reverse, setReverse] = useState(null);
  if (!finance) return null;
  const F = finance;
  const canRecord = F.can?.record && buyerId;

  const openReceipt = () =>
    setReceipt({ key: newKey(), amount: F.outstanding > 0 ? String(F.outstanding) : "", mode: "NEFT", reference: "", receivedOn: today(), note: "", toThis: true });
  const submitReceipt = () =>
    run(
      () =>
        recordB2bReceipt(orderId, {
          buyerId,
          amount: Number(receipt.amount),
          mode: receipt.mode,
          reference: receipt.reference.trim(),
          receivedOn: receipt.receivedOn,
          note: receipt.note.trim(),
          idempotencyKey: receipt.key,
          ...(receipt.toThis ? { allocations: [{ orderId: Number(orderId), amount: Math.min(Number(receipt.amount), F.outstanding) }] } : { auto: true }),
        }),
      () => setReceipt(null),
    );
  const receiptValid = receipt && Number(receipt.amount) > 0 && receipt.reference.trim().length >= 3 && receipt.receivedOn;
  const submitRefund = () =>
    run(
      () => recordB2bRefund(orderId, { orderId: Number(orderId), amount: Number(refund.amount), mode: refund.mode, reference: refund.reference.trim(), note: refund.note.trim(), idempotencyKey: refund.key }),
      () => setRefund(null),
    );

  return (
    <Card>
      <CardHeader
        title="Payment & credit"
        description="From the payment ledger. Sales cannot approve credit; Finance records receipts, refunds and payouts."
        actions={
          <div className="flex gap-1.5">
            {canRecord && F.outstanding > 0 && (
              <Button size="sm" variant="primary" disabled={busy} onClick={openReceipt}>
                Record payment
              </Button>
            )}
            {F.can?.refund && (
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => setRefund({ key: newKey(), amount: String(F.refundDue), mode: "NEFT", reference: "", note: "" })}>
                Record refund
              </Button>
            )}
          </div>
        }
      />
      <CardBody className="space-y-3">
        <Result result={result} />
        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div><dt className="text-ink-muted">Status</dt><dd><Badge tone={PAY_TONE[F.status] ?? "neutral"}>{F.statusLabel}</Badge>{F.mode ? ` · ${F.mode}` : ""}</dd></div>
          <div><dt className="text-ink-muted">Order total</dt><dd>{formatINR(F.total)}</dd></div>
          <div><dt className="text-ink-muted">Received</dt><dd>{formatINR(F.received)}{F.refunded > 0 ? ` (refunded ${formatINR(F.refunded)})` : ""}</dd></div>
          <div><dt className="text-ink-muted">Outstanding</dt><dd className={F.outstanding > 0 ? "font-medium text-ink" : ""}>{formatINR(F.outstanding)}</dd></div>
          <div>
            <dt className="text-ink-muted">Due date</dt>
            <dd>
              {F.dueDate ? formatDate(F.dueDate) : "—"}
              {F.daysOverdue > 0 && <span className="text-danger-ink"> · {F.daysOverdue} day(s) overdue ({F.aging})</span>}
            </dd>
          </div>
          <div><dt className="text-ink-muted">Credit</dt><dd>{F.onCredit ? `Confirmed on credit (${F.creditDays} days) ${formatDateTime(F.creditApprovedAt)}` : "Not on credit"}</dd></div>
          {F.refundDue > 0 && <div><dt className="text-ink-muted">Refund due</dt><dd className="font-medium text-danger-ink">{formatINR(F.refundDue)}</dd></div>}
        </dl>

        {F.credit && (
          <p className="text-xs text-ink-muted">
            Buyer credit: {F.credit.statusLabel}
            {F.credit.status !== "none" && ` · limit ${formatINR(F.credit.limit)} · ${F.credit.days} days · exposure ${formatINR(F.credit.exposure)} · available ${formatINR(F.credit.available)}`}
            {F.credit.utilisationPct !== null && ` (${formatPercent(F.credit.utilisationPct, 0)} used)`}
            {F.credit.overdueAmount > 0 && <span className="text-danger-ink"> · overdue {formatINR(F.credit.overdueAmount)}</span>}
          </p>
        )}

        {F.allocations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-ink-muted">
                <tr><th className="py-1">Payment</th><th>Mode / reference</th><th>Received</th><th className="text-right">Amount</th><th /></tr>
              </thead>
              <tbody>
                {F.allocations.map((a) => (
                  <tr key={a.id} className={`border-t border-line ${a.released ? "text-ink-muted line-through" : ""}`}>
                    <td className="py-1 font-mono text-xs">#{a.paymentId}</td>
                    <td>{a.mode} <span className="font-mono text-xs">{a.reference}</span>{a.released && <span className="block text-xs no-underline">{a.releaseReason}</span>}</td>
                    <td>{formatDate(a.receivedAt)}</td>
                    <td className="text-right">{formatINR(a.amount)}</td>
                    <td className="text-right">
                      {canRecord && !a.released && !a.mode.startsWith("Online") && (
                        <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy} onClick={() => setReverse({ paymentId: a.paymentId, reason: "" })}>
                          Bounced / reverse
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {F.allocations.length === 0 && <p className="text-sm text-ink-muted">No payment received yet.</p>}

        {F.refunds.length > 0 && (
          <ul className="space-y-0.5 text-sm">
            {F.refunds.map((r) => (
              <li key={r.id}>
                Refund {formatINR(r.amount)} · {r.mode} <span className="font-mono text-xs">{r.reference}</span> · {formatDateTime(r.at)}{r.by ? ` · ${r.by}` : ""}
              </li>
            ))}
          </ul>
        )}

        {canRecord && F.outstanding > 0 && F.onAccount?.length > 0 && (
          <div className="rounded-md border border-line p-2 text-sm">
            <p className="text-ink-soft">The buyer has money on account, not yet allocated:</p>
            <ul className="mt-1 space-y-1">
              {F.onAccount.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>#{p.id} · {p.mode} <span className="font-mono text-xs">{p.reference}</span> · {formatINR(p.unallocated)} left{p.status === "refund_due" ? " (refund due)" : ""}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => run(() => allocateB2bReceipt(orderId, p.id, { allocations: [{ orderId: Number(orderId), amount: Math.min(p.unallocated, F.outstanding) }] }))}
                  >
                    Allocate {formatINR(Math.min(p.unallocated, F.outstanding))} here
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {F.history.length > 0 && (
          <details>
            <summary className="cursor-pointer text-xs text-ink-muted">Finance history ({F.history.length})</summary>
            <ul className="mt-1 space-y-0.5 text-xs">
              {F.history.map((h, i) => (
                <li key={i}>
                  <span className="text-ink-muted">{formatDateTime(h.at)}</span> · {h.action.replace(/_/g, " ")}
                  {h.from || h.to ? ` ${h.from ?? ""} → ${h.to ?? ""}` : ""}
                  {h.amount !== null ? ` · ${formatINR(h.amount)}` : ""}
                  {h.reason ? ` · ${h.reason}` : ""} · {h.by}
                </li>
              ))}
            </ul>
          </details>
        )}
      </CardBody>

      <Dialog
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        title="Record payment"
        description="An offline receipt (bank transfer, UPI, cheque ...). Online payments are recorded automatically."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReceipt(null)} disabled={busy}>Back</Button>
            <Button variant="primary" loading={busy} disabled={!receiptValid} onClick={submitReceipt}>Record</Button>
          </>
        }
      >
        {receipt && (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <Field label="Amount received" required>
              {({ id }) => <Input id={id} inputMode="decimal" value={receipt.amount} onChange={(e) => setReceipt({ ...receipt, amount: e.target.value })} />}
            </Field>
            <Field label="Mode" required>
              {({ id }) => (
                <select id={id} className={select} value={receipt.mode} onChange={(e) => setReceipt({ ...receipt, mode: e.target.value })}>
                  {RECEIPT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
            </Field>
            <Field label="UTR / cheque / reference no." required>
              {({ id }) => <Input id={id} value={receipt.reference} maxLength={120} onChange={(e) => setReceipt({ ...receipt, reference: e.target.value })} />}
            </Field>
            <Field label="Received on" required>
              {({ id }) => <Input id={id} type="date" max={today()} value={receipt.receivedOn} onChange={(e) => setReceipt({ ...receipt, receivedOn: e.target.value })} />}
            </Field>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={receipt.toThis} onChange={(e) => setReceipt({ ...receipt, toThis: e.target.checked })} />
              Allocate to this order (up to {formatINR(F.outstanding)}); otherwise to the buyer&apos;s oldest dues first. Anything left stays on account.
            </label>
            <Field label="Note" className="sm:col-span-2">
              {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={receipt.note} onChange={(e) => setReceipt({ ...receipt, note: e.target.value })} />}
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(refund)}
        onClose={() => setRefund(null)}
        title="Record refund"
        description={`Up to ${formatINR(F.refundDue)} is due back to the buyer. Record the refund after it was made (bank / Razorpay dashboard).`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefund(null)} disabled={busy}>Back</Button>
            <Button variant="primary" loading={busy} disabled={!refund || !(Number(refund.amount) > 0) || refund.reference.trim().length < 3} onClick={submitRefund}>Record</Button>
          </>
        }
      >
        {refund && (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <Field label="Amount refunded" required>
              {({ id }) => <Input id={id} inputMode="decimal" value={refund.amount} onChange={(e) => setRefund({ ...refund, amount: e.target.value })} />}
            </Field>
            <Field label="Mode" required>
              {({ id }) => (
                <select id={id} className={select} value={refund.mode} onChange={(e) => setRefund({ ...refund, mode: e.target.value })}>
                  {REFUND_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
            </Field>
            <Field label="Refund reference (UTR / refund id)" required className="sm:col-span-2">
              {({ id }) => <Input id={id} value={refund.reference} maxLength={120} onChange={(e) => setRefund({ ...refund, reference: e.target.value })} />}
            </Field>
            <Field label="Note" className="sm:col-span-2">
              {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={refund.note} onChange={(e) => setRefund({ ...refund, note: e.target.value })} />}
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(reverse)}
        onClose={() => setReverse(null)}
        title="Reverse payment"
        description="For a bounced cheque or a returned transfer: every order this payment was allocated to owes the amount again."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReverse(null)} disabled={busy}>Back</Button>
            <Button variant="danger" loading={busy} disabled={!reverse || reverse.reason.trim().length < 5} onClick={() => run(() => reverseB2bReceipt(orderId, reverse.paymentId, reverse.reason), () => setReverse(null))}>
              Reverse
            </Button>
          </>
        }
      >
        {reverse && (
          <Field label="Reason" required>
            {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={reverse.reason} onChange={(e) => setReverse({ ...reverse, reason: e.target.value })} />}
          </Field>
        )}
      </Dialog>
    </Card>
  );
}

/** The sellers' settlement rows of the order (shown to roles with seller cost rights). */
export function OrderSettlements({ orderId, settlements }) {
  const { busy, result, run } = useRunner();
  const [act, setAct] = useState(null); // { row, action, reason, reference, amount }
  if (!settlements || settlements.length === 0) return null;

  const needsInput = (a) => a.needsReason || a.needs.length > 0;
  const valid = act && (!act.def.needsReason || act.reason.trim().length >= 5) && (!act.def.needs.includes("reference") || act.reference.trim().length >= 3) && (!act.def.needs.includes("amount") || Number(act.amount) > 0);

  return (
    <Card>
      <CardHeader title="Seller settlement" description="Seller payable less claim and other deductions. Eligible after delivery; held while a claim is open." />
      <CardBody className="space-y-3">
        <Result result={result} />
        {settlements.map((s) => (
          <div key={s.id} className="space-y-2 rounded-md border border-line p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="font-medium text-ink">{s.seller}</span> · {s.lines} line{s.lines === 1 ? "" : "s"}
                <span className="block text-xs text-ink-muted">
                  Gross {formatINR(s.gross)}
                  {s.claimDeductions > 0 ? ` − claims ${formatINR(s.claimDeductions)}` : ""}
                  {s.manualDeductions > 0 ? ` − deductions ${formatINR(s.manualDeductions)}` : ""} = <span className="font-medium text-ink">{formatINR(s.net)}</span>
                </span>
                {s.deductionNote && <span className="block text-xs text-ink-muted">Deductions: {s.deductionNote}</span>}
                {s.holdReason && <span className="block text-xs text-warning-ink">On hold: {s.holdReason}</span>}
                {s.paidReference && <span className="block text-xs text-ink-muted">Paid {formatDateTime(s.paidAt)} · ref <span className="font-mono">{s.paidReference}</span></span>}
                {s.adjustment > 0 && <span className="block text-xs text-ink-muted">Recovered after payment {formatINR(s.adjustment)}: {s.adjustmentNote}</span>}
              </div>
              <Badge tone={SETTLE_TONE[s.status] ?? "neutral"}>{s.label}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SETTLE_ORDER.filter((k) => s.actions[k]?.allowed).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={k === "hold" ? "ghost" : "secondary"}
                  disabled={busy}
                  onClick={() => (needsInput(s.actions[k]) ? setAct({ row: s, action: k, def: s.actions[k], reason: "", reference: "", amount: "" }) : run(() => updateB2bSettlement(orderId, s.id, k)))}
                >
                  {s.actions[k].label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardBody>

      <Dialog
        open={Boolean(act)}
        onClose={() => setAct(null)}
        title={act ? `${act.def.label}: ${act.row.seller}` : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAct(null)} disabled={busy}>Back</Button>
            <Button
              variant="primary"
              loading={busy}
              disabled={!valid}
              onClick={() =>
                run(
                  () => updateB2bSettlement(orderId, act.row.id, act.action, { reason: act.reason.trim(), reference: act.reference.trim(), ...(act.amount ? { amount: Number(act.amount) } : {}) }),
                  () => setAct(null),
                )
              }
            >
              Save
            </Button>
          </>
        }
      >
        {act && (
          <div className="space-y-2 text-sm">
            {act.def.needs.includes("amount") && (
              <Field label="Amount" required>
                {({ id }) => <Input id={id} inputMode="decimal" value={act.amount} onChange={(e) => setAct({ ...act, amount: e.target.value })} />}
              </Field>
            )}
            {act.def.needs.includes("reference") && (
              <Field label="Payout reference (UTR / bank reference)" required>
                {({ id }) => <Input id={id} value={act.reference} maxLength={120} onChange={(e) => setAct({ ...act, reference: e.target.value })} />}
              </Field>
            )}
            {act.def.needsReason && (
              <Field label="Reason" required>
                {({ id }) => <Textarea id={id} rows={2} maxLength={400} value={act.reason} onChange={(e) => setAct({ ...act, reason: e.target.value })} />}
              </Field>
            )}
          </div>
        )}
      </Dialog>
    </Card>
  );
}
