"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { recordB2bOrderSeller, transitionB2bOrder } from "@/lib/actions/admin/b2b-screens";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR } from "@/lib/format";

// The next step of the flow first, then the side paths (hold, RTO, cancel).
const ORDER = ["release_gate", "send_to_sellers", "reserve", "start_packing", "mark_packed", "dispatch", "in_transit", "deliver", "close", "release_hold", "rto_received", "hold", "rto", "cancel"];
const DANGER = new Set(["cancel", "rto", "hold"]);

function useRun() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details });
      if (res?.ok) {
        after?.();
        router.refresh();
      }
    });
  return { busy, result, run };
}

/**
 * Order action bar (spec C7, §22). Only actions possible in the current state are shown; a
 * disabled button says why (role, payment, sellers). The API checks everything again.
 */
export function OrderActions({ id, actions }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ reason: "", awbNumber: "", courierName: "" });

  const visible = ORDER.filter((k) => actions?.[k]?.inState);
  const current = open ? actions[open] : null;
  const needsForm = current && (current.needsReason || current.needs.length > 0);
  const valid = !current || ((!current.needsReason || form.reason.trim().length >= 5) && current.needs.every((f) => form[f].trim()));

  const click = (key) => {
    const a = actions[key];
    setForm({ reason: "", awbNumber: "", courierName: "" });
    if (a.needsReason || a.needs.length) setOpen(key);
    else run(() => transitionB2bOrder(id, key));
  };
  const submit = () =>
    run(
      () => transitionB2bOrder(id, open, { reason: form.reason.trim(), awbNumber: form.awbNumber.trim(), courierName: form.courierName.trim() }),
      () => setOpen(null),
    );

  if (!visible.length) return <p className="text-sm text-ink-muted">This order is closed: no further steps.</p>;

  return (
    <div className="space-y-3">
      {result && (
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
      )}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface/95 p-3 backdrop-blur">
        {visible.map((key, i) => {
          const a = actions[key];
          return (
            <Button
              key={key}
              size="sm"
              variant={DANGER.has(key) ? "ghost" : i === 0 ? "primary" : "secondary"}
              className={DANGER.has(key) ? "text-danger-ink" : undefined}
              disabled={busy || !a.allowed}
              title={a.allowed ? undefined : a.reason}
              onClick={() => click(key)}
            >
              {a.label}
            </Button>
          );
        })}
        {busy && <span className="text-xs text-ink-muted">Working…</span>}
      </div>
      {visible.some((k) => !actions[k].allowed) && (
        <ul className="space-y-0.5 text-xs text-ink-muted">
          {visible
            .filter((k) => !actions[k].allowed)
            .map((k) => (
              <li key={k}>
                <span className="font-medium">{actions[k].label}:</span> {actions[k].reason}
              </li>
            ))}
        </ul>
      )}

      <Dialog
        open={Boolean(needsForm)}
        onClose={() => setOpen(null)}
        title={current?.label}
        description={open === "cancel" ? "The order and its lines are cancelled. Money already received is flagged for refund." : open === "release_gate" ? "Payment is not received: confirm only when Finance approved credit." : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(null)} disabled={busy}>Back</Button>
            <Button variant={DANGER.has(open) ? "danger" : "primary"} loading={busy} disabled={!valid} onClick={submit}>
              {current?.label}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {current?.needs.includes("awbNumber") && (
            <Field label="AWB / LR number" required>
              {({ id: fid }) => <Input id={fid} value={form.awbNumber} maxLength={80} onChange={(e) => setForm({ ...form, awbNumber: e.target.value })} />}
            </Field>
          )}
          {current?.needs.includes("courierName") && (
            <Field label="Courier / transporter" required>
              {({ id: fid }) => <Input id={fid} value={form.courierName} maxLength={100} onChange={(e) => setForm({ ...form, courierName: e.target.value })} />}
            </Field>
          )}
          {current?.needsReason && (
            <Field label="Reason (saved in the order history)" required hint="At least 5 characters.">
              {({ id: fid }) => <Textarea id={fid} value={form.reason} maxLength={400} onChange={(e) => setForm({ ...form, reason: e.target.value })} />}
            </Field>
          )}
        </div>
      </Dialog>
    </div>
  );
}

const SELLER_TONE = { ACCEPTED: "success", REJECTED: "danger", PENDING: "warning", NOT_SENT: "neutral", NO_SELLER: "danger" };
const SELLER_LABEL = { ACCEPTED: "Accepted", REJECTED: "Rejected", PENDING: "Waiting", NOT_SENT: "Not sent yet", NO_SELLER: "No seller" };

/** Per-seller sub-orders; staff record each seller's answer until the seller portal does (subtask 12). */
export function OrderSellers({ id, sellers, waiting, canEdit }) {
  const { busy, result, run } = useRun();
  const [reject, setReject] = useState(null);
  const [note, setNote] = useState("");

  return (
    <div className="space-y-2">
      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      {sellers.map((s) => (
        <div key={s.sellerId} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-2 text-sm">
          <span>
            <span className="font-medium text-ink">{s.name}</span>
            <span className="block text-xs text-ink-muted">
              {s.lines} line{s.lines === 1 ? "" : "s"} · {formatINR(s.subTotal)}
              {s.respondedAt ? ` · ${s.respondedBy || "Staff"} ${formatDateTime(s.respondedAt)}` : ""}
            </span>
            {s.note && <span className="block text-xs text-ink-muted">{s.note}</span>}
          </span>
          <span className="flex items-center gap-2">
            <Badge tone={SELLER_TONE[s.status] ?? "neutral"}>{SELLER_LABEL[s.status] ?? s.status}</Badge>
            {waiting && canEdit && s.status === "PENDING" && (
              <>
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(() => recordB2bOrderSeller(id, s.sellerId, "ACCEPTED", ""))}>
                  Accepted
                </Button>
                <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy} onClick={() => { setNote(""); setReject(s); }}>
                  Rejected
                </Button>
              </>
            )}
          </span>
        </div>
      ))}
      {waiting && <p className="text-xs text-ink-muted">Record each seller&apos;s answer (by phone or message). Stock can be reserved when every seller accepted.</p>}

      <Dialog
        open={Boolean(reject)}
        onClose={() => setReject(null)}
        title={`${reject?.name ?? "Seller"} rejected the order`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReject(null)} disabled={busy}>Back</Button>
            <Button variant="danger" loading={busy} disabled={note.trim().length < 5} onClick={() => run(() => recordB2bOrderSeller(id, reject.sellerId, "REJECTED", note), () => setReject(null))}>
              Record rejection
            </Button>
          </>
        }
      >
        <Field label="Why (saved in the order history)" required hint="At least 5 characters.">
          {({ id: fid }) => <Textarea id={fid} value={note} maxLength={400} onChange={(e) => setNote(e.target.value)} />}
        </Field>
      </Dialog>
    </div>
  );
}
