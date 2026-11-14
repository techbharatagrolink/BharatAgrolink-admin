"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { adjustStockAction } from "@/lib/actions/admin/inventory";
import { ADJUST_ACTIONS, ADJUST_REASONS, DEFAULT_REASON, itemName, qty } from "@/lib/content/admin/inventory";
import { cn } from "@/lib/utils";

const newKey = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/**
 * "Adjust stock" button + dialog (SRS §6.1, §12.2): add, reduce or set a physical count, with a
 * reason and a required note, then a confirm step. One idempotency key per opened dialog, so a
 * double click or a retry never applies the change twice.
 */
export function AdjustStock({ item, initialAction = "ADD", label = "Adjust", size = "sm", variant = "secondary" }) {
  const router = useRouter();
  const { notify } = useToast();
  const ids = useId();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(initialAction);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(DEFAULT_REASON[initialAction]);
  const [note, setNote] = useState("");
  const [step, setStep] = useState("form");
  const [error, setError] = useState(null);
  const [key, setKey] = useState(newKey);

  const q = Number(quantity);
  const validQty = quantity !== "" && Number.isInteger(q) && q >= (action === "SET" ? 0 : 1);
  const next = !validQty ? null : action === "ADD" ? item.onHandQty + q : action === "REDUCE" ? item.onHandQty - q : q;
  const belowReserved = next !== null && next < item.reservedQty;
  const noteOk = note.trim().length >= 3;
  const canSubmit = validQty && !belowReserved && noteOk && !pending;

  function show() {
    setAction(initialAction);
    setReason(DEFAULT_REASON[initialAction]);
    setQuantity("");
    setNote("");
    setStep("form");
    setError(null);
    setKey(newKey());
    setOpen(true);
  }

  function choose(value) {
    setAction(value);
    setReason(DEFAULT_REASON[value]);
  }

  function submit(event) {
    event?.preventDefault();
    if (!canSubmit) return;
    if (step === "form") return setStep("confirm");
    setError(null);
    startTransition(async () => {
      const res = await adjustStockAction({ balanceId: item.id, action, quantity: q, reason, note: note.trim(), idempotencyKey: key });
      if (!res.ok) {
        setError(res.message);
        setStep("form");
        return;
      }
      setOpen(false);
      notify({ title: "Stock updated", message: `${itemName(item)}: ${qty(res.data?.balance?.onHandQty ?? next)} on hand${res.data?.replayed ? " (already saved)" : ""}.` });
      router.refresh();
    });
  }

  const name = [item.productName, item.variantLabel].filter(Boolean).join(" · ") || item.sku;

  return (
    <>
      <Button size={size} variant={variant} onClick={show}>
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => !pending && setOpen(false)}
        title="Adjust stock"
        description={`${name} · SKU ${item.sku}`}
        size="sm"
        footer={
          <>
            {step === "confirm" ? (
              <Button variant="secondary" onClick={() => setStep("form")} disabled={pending}>
                Back
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            )}
            <Button variant="primary" onClick={submit} disabled={!canSubmit} loading={pending}>
              {step === "form" ? "Review" : "Confirm & save"}
            </Button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <dl className="grid grid-cols-3 gap-2 rounded-lg bg-surface-muted p-3 text-center text-sm">
            {[
              ["On hand", item.onHandQty],
              ["Reserved", item.reservedQty],
              ["Available", item.availableQty],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-ink-muted">{k}</dt>
                <dd className="font-semibold text-ink tabular">{qty(v)}</dd>
              </div>
            ))}
          </dl>

          {step === "form" ? (
            <>
              <fieldset>
                <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">What happened?</legend>
                <div className="grid gap-1.5">
                  {ADJUST_ACTIONS.map((a) => (
                    <label
                      key={a.value}
                      className={cn("flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm", action === a.value ? "border-brand-600 bg-brand-50" : "border-line")}
                    >
                      <input type="radio" name={`${ids}-action`} value={a.value} checked={action === a.value} onChange={() => choose(a.value)} className="mt-0.5 accent-brand-600" />
                      <span>
                        <span className="font-medium text-ink">{a.label}</span>
                        <span className="block text-xs text-ink-muted">{a.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field
                label={action === "SET" ? "Counted quantity" : "Quantity"}
                htmlFor={`${ids}-qty`}
                required
                error={belowReserved ? `Stock cannot go below the ${qty(item.reservedQty)} unit(s) held for open orders.` : quantity !== "" && !validQty ? "Enter a whole number." : null}
                hint={next !== null ? `On hand will be ${qty(next)}.` : null}
              >
                <Input id={`${ids}-qty`} inputMode="numeric" autoFocus value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/[^\d]/g, ""))} className="tabular" />
              </Field>
              <Field label="Reason" htmlFor={`${ids}-reason`}>
                <Select id={`${ids}-reason`} value={reason} onChange={(e) => setReason(e.target.value)} options={ADJUST_REASONS} />
              </Field>
              <Field label="Note" htmlFor={`${ids}-note`} required hint="Saved in the audit trail with your name (at least 3 characters).">
                <Textarea id={`${ids}-note`} rows={2} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
            </>
          ) : (
            <Notice tone="warning" title="Confirm this change">
              <p>
                {ADJUST_ACTIONS.find((a) => a.value === action)?.label}: on hand {qty(item.onHandQty)} → <strong className="tabular">{qty(next)}</strong>
              </p>
              <p>Reason: {ADJUST_REASONS.find((r) => r.value === reason)?.label}</p>
              <p className="break-words">Note: {note}</p>
            </Notice>
          )}

          {error && <Notice tone="danger">{error}</Notice>}
          <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
        </form>
      </Dialog>
    </>
  );
}
