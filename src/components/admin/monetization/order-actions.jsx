"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { bannerOrderAction } from "@/lib/actions/admin/monetization";

/*
 * Review and control buttons of one banner order. Which buttons show follows the order's statuses;
 * the API checks every transition again (doc §7) and logs who did it.
 */

const todayIst = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

function useAction(id) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const run = (action, body, success, done) =>
    startTransition(async () => {
      const res = await bannerOrderAction(id, action, body);
      notify(res.ok ? { message: success } : { tone: "error", message: res.message });
      if (res.ok) {
        done?.();
        router.refresh();
      }
    });
  return { pending, run };
}

function DateDialog({ open, onClose, title, description, label, initial, onSubmit, pending, confirmLabel }) {
  const [date, setDate] = useState(initial || todayIst());
  const [note, setNote] = useState("");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="primary" loading={pending} disabled={!date} onClick={() => onSubmit({ startDate: date, note })}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label={label} required hint="The ad runs from 00:00 IST on this date for the package's number of days.">
          <Input type="date" min={todayIst()} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Note (optional, saved in the history)">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
        </Field>
      </div>
    </Dialog>
  );
}

export function OrderActions({ order, canEdit }) {
  const { pending, run } = useAction(order.id);
  const [open, setOpen] = useState(null);
  const close = () => setOpen(null);
  if (!canEdit) return null;

  const o = order;
  const inReview = o.orderStatus === "PAID" && o.approvalStatus === "PENDING_REVIEW";
  const notLive = !o.adStatus || o.adStatus === "SCHEDULED";
  const canReject = o.orderStatus === "PAID" && ["PENDING_REVIEW", "REVISION_REQUIRED", "APPROVED"].includes(o.approvalStatus) && notLive;
  const buttons = [];
  if (inReview) {
    buttons.push(
      <Button key="approve" size="sm" variant="primary" onClick={() => setOpen("approve")}>
        Approve &amp; schedule
      </Button>,
      <Button key="revision" size="sm" onClick={() => setOpen("revision")}>
        Request changes
      </Button>
    );
  }
  if (canReject)
    buttons.push(
      <Button key="reject" size="sm" variant="danger" onClick={() => setOpen("reject")}>
        Reject (refund)
      </Button>
    );
  if (o.adStatus === "SCHEDULED")
    buttons.push(
      <Button key="reschedule" size="sm" onClick={() => setOpen("reschedule")}>
        Change start date
      </Button>
    );
  if (["SCHEDULED", "ACTIVE"].includes(o.adStatus))
    buttons.push(
      <Button key="pause" size="sm" onClick={() => setOpen("pause")}>
        Pause
      </Button>
    );
  if (o.adStatus === "PAUSED")
    buttons.push(
      <Button key="resume" size="sm" variant="primary" loading={pending && open === null} onClick={() => run("resume", {}, "Resumed.")}>
        Resume
      </Button>
    );
  if (["SCHEDULED", "ACTIVE", "PAUSED"].includes(o.adStatus))
    buttons.push(
      <Button key="stop" size="sm" variant="danger" onClick={() => setOpen("stop")}>
        Stop ad
      </Button>
    );
  if (o.orderStatus === "REFUND_PENDING")
    buttons.push(
      <Button key="refund" size="sm" variant="primary" onClick={() => setOpen("refund")}>
        Issue refund
      </Button>
    );
  if (!buttons.length) return <p className="text-sm text-ink-muted">No action is needed on this order right now.</p>;

  return (
    <>
      <div className="flex flex-wrap gap-2">{buttons}</div>
      {open === "approve" ? (
        <DateDialog
          open
          onClose={close}
          title="Approve and schedule"
          description={`Runs ${o.durationDays} days from the start date. The seller asked for ${o.preferredStartDate ?? "any date"}.`}
          label="Start date"
          initial={o.preferredStartDate && o.preferredStartDate >= todayIst() ? o.preferredStartDate : todayIst()}
          confirmLabel="Approve"
          pending={pending}
          onSubmit={(b) => run("approve", b, "Approved and scheduled.", close)}
        />
      ) : null}
      {open === "reschedule" ? (
        <DateDialog open onClose={close} title="Change start date" label="New start date" confirmLabel="Save" pending={pending} onSubmit={(b) => run("reschedule", b, "Start date changed.", close)} />
      ) : null}
      <ConfirmDialog
        open={open === "revision"}
        onClose={close}
        tone="warning"
        title="Request changes"
        description="The seller sees this reason and can upload a new creative. The order goes back to review after that."
        confirmLabel="Request changes"
        requireReason
        loading={pending}
        onConfirm={(reason) => run("request-revision", { reason }, "Changes requested from the seller.", close)}
      />
      <ConfirmDialog
        open={open === "reject"}
        onClose={close}
        title="Reject this banner?"
        description="The seller sees the reason. The paid amount goes to the refund queue; issue the refund after this."
        confirmLabel="Reject"
        requireReason
        loading={pending}
        onConfirm={(reason) => run("reject", { reason }, "Rejected. The order is waiting for its refund.", close)}
      />
      <ConfirmDialog
        open={open === "pause"}
        onClose={close}
        tone="warning"
        title="Pause this ad?"
        description="It disappears from the homepage until resumed. The end date stays the same."
        confirmLabel="Pause"
        requireReason
        loading={pending}
        onConfirm={(reason) => run("pause", { reason }, "Paused.", close)}
      />
      <ConfirmDialog
        open={open === "stop"}
        onClose={close}
        title="Stop this ad for good?"
        description="It cannot be resumed. No refund once the ad has gone live."
        confirmLabel="Stop ad"
        requireReason
        loading={pending}
        onConfirm={(reason) => run("stop", { reason }, "Ad stopped.", close)}
      />
      <ConfirmDialog
        open={open === "refund"}
        onClose={close}
        title={`Refund ₹${o.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })} to the seller?`}
        description="Razorpay refunds the full amount to the original payment method and a BANCN credit note is issued against the BAN invoice. This cannot be undone."
        confirmLabel="Issue refund"
        loading={pending}
        onConfirm={() => run("refund", {}, "Refund issued.", close)}
      />
    </>
  );
}
