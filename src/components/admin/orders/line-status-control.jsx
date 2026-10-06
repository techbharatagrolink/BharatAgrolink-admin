"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { changeLineStatusAction } from "@/lib/actions/admin/orders";

const DANGER = ["Cancelled", "Rejected", "RTO", "Undelivered"];

export function LineStatusControl({ orderId, lineId, transitions }) {
  const router = useRouter();
  const { notify } = useToast();
  const [target, setTarget] = useState(null);
  const [running, startRunning] = useTransition();
  if (!transitions.length) return null;

  const run = (reason) =>
    startRunning(async () => {
      const result = await changeLineStatusAction(orderId, lineId, target?.status, reason);
      if (result.ok) {
        notify({ message: result.message, tone: "success" });
        setTarget(null);
        router.refresh();
      } else notify({ message: result.message, tone: "error" });
    });

  return (
    <>
      <Popover
        label={`Change status of line ${lineId}`}
        panelClassName="w-52"
        trigger={({ toggle, props }) => (
          <Button size="xs" onClick={toggle} {...props}>
            Update status <ChevronDown className="size-3.5" aria-hidden />
          </Button>
        )}
      >
        <ul className="py-1">
          {transitions.map((t) => (
            <li key={t.status}>
              <button type="button" data-close onClick={() => setTarget(t)} className={`w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted ${DANGER.includes(t.status) ? "text-danger-ink" : "text-ink"}`}>
                Mark {t.status}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
      <ConfirmDialog
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={run}
        loading={running}
        title={target ? `Mark line as ${target.status}?` : ""}
        description={target && DANGER.includes(target.status) ? "The customer and vendor are notified. The parent order status is recalculated." : "The parent order status is recalculated from all lines."}
        confirmLabel={target ? `Mark ${target.status}` : "Confirm"}
        tone={target && DANGER.includes(target.status) ? "danger" : "warning"}
        requireReason={target?.requireReason}
      />
    </>
  );
}
