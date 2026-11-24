"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelB2bQuotation, recalculateB2bQuotation } from "@/lib/actions/admin/b2b-screens";
import { resourceActionAction } from "@/lib/actions/admin/resources";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/page";

/**
 * Sticky action bar of the quotation detail page (spec §22). Which buttons work comes from the
 * API's `actions` (allowed + reason); the API checks again on every call.
 * Send uses the quotation list's resource action, so both screens share one rule.
 */
export function QuotationActions({ id, actions, can }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const run = (fn) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details });
      setConfirm(null);
      if (res?.ok) router.refresh();
    });

  const blockedHint = (action) => (actions?.[action]?.allowed ? undefined : actions?.[action]?.reason);
  const show = (action, permitted) => permitted && actions?.[action];

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
        {show("send", can.edit) && (
          <Button
            variant="primary"
            size="sm"
            disabled={busy || !actions.send.allowed}
            title={blockedHint("send")}
            onClick={() => setConfirm("send")}
          >
            Mark as sent
          </Button>
        )}
        {show("revise", can.add) &&
          (actions.revise.allowed ? (
            <ButtonLink href={`/admin/b2b/quotations/${id}/revise`} size="sm" variant="secondary">
              Revise (new version)
            </ButtonLink>
          ) : (
            <Button size="sm" variant="secondary" disabled title={blockedHint("revise")}>
              Revise (new version)
            </Button>
          ))}
        {show("recalculate", can.add) && (
          <Button size="sm" variant="secondary" disabled={busy || !actions.recalculate.allowed} title={blockedHint("recalculate")} onClick={() => run(() => recalculateB2bQuotation(id))}>
            Recalculate
          </Button>
        )}
        {show("cancel", can.edit) && (
          <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy || !actions.cancel.allowed} title={blockedHint("cancel")} onClick={() => setConfirm("cancel")}>
            Cancel quotation
          </Button>
        )}
        {busy && <span className="text-xs text-ink-muted">Working…</span>}
      </div>

      <ConfirmDialog
        open={confirm === "send"}
        onClose={() => setConfirm(null)}
        onConfirm={() => run(() => resourceActionAction("b2b.quotations", "send", [id]))}
        title="Mark this quotation as sent?"
        description="It becomes a fixed offer: later changes create a new version. (WhatsApp sending comes with the customer link.)"
        confirmLabel="Mark as sent"
        tone="warning"
        loading={busy}
      />
      <ConfirmDialog
        open={confirm === "cancel"}
        onClose={() => setConfirm(null)}
        onConfirm={(reason) => run(() => cancelB2bQuotation(id, reason))}
        title="Cancel this quotation?"
        description="The buyer can no longer accept it. The reason is saved for lost-quote reporting."
        confirmLabel="Cancel quotation"
        requireReason
        loading={busy}
      />
    </div>
  );
}
