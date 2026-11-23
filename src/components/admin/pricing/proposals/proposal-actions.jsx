"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyToClarificationAction, withdrawProposalAction } from "@/lib/actions/admin/pricing-proposals";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/form";

/** Withdraw: every variation not yet live is withdrawn; live ones stay. */
export function WithdrawProposalButton({ proposalId, proposalNo }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <>
      <Button variant="danger-outline" onClick={() => setOpen(true)}>
        Withdraw proposal
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Withdraw ${proposalNo}?`}
        description="Variations the vendor has not answered, and accepted ones that are not live yet, are withdrawn. Live variations stay as they are. The vendor is notified."
        confirmLabel="Withdraw"
        requireReason
        loading={pending}
        onConfirm={(reason) =>
          start(async () => {
            const result = await withdrawProposalAction(proposalId, reason);
            if (!result.ok) return notify({ tone: "error", message: result.message });
            setOpen(false);
            notify({ message: `${proposalNo} withdrawn.` });
            router.refresh();
          })
        }
      />
    </>
  );
}

/** Answer a vendor's question on one variation: it opens again for accept / decline. */
export function ClarificationReply({ proposalId, itemId }) {
  const router = useRouter();
  const { notify } = useToast();
  const [reply, setReply] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="mt-2 space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const result = await replyToClarificationAction(proposalId, itemId, reply);
          if (!result.ok) return notify({ tone: "error", message: result.message });
          setReply("");
          notify({ message: "Answer sent. The vendor can accept or decline this variation now." });
          router.refresh();
        });
      }}
    >
      <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} maxLength={1000} placeholder="Your answer to the vendor" aria-label="Answer" />
      <Button type="submit" size="sm" variant="primary" loading={pending} disabled={reply.trim().length < 2}>
        Send answer
      </Button>
    </form>
  );
}
