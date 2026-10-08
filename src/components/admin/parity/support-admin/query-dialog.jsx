"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { resourceActionAction } from "@/lib/actions/admin/resources";

/** Returns a function that drops `?view=` from the URL, closing the detail dialog. */
export function useCloseView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return () => {
    const next = new URLSearchParams(params);
    next.delete("view");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
}

/** Detail dialog driven by the `view` query parameter. */
export function QueryDialog({ title, description, size = "lg", footer, children }) {
  const close = useCloseView();
  return (
    <Dialog open onClose={close} title={title} description={description} size={size} footer={footer}>
      {children}
    </Dialog>
  );
}

/** Resource row actions (approve, delete…) from inside a detail dialog; closes it on success. */
export function RecordActions({ resourceKey, id, actions }) {
  const router = useRouter();
  const close = useCloseView();
  const { notify } = useToast();
  const [pending, setPending] = useState(null);
  const [busy, startBusy] = useTransition();

  const run = (reason) =>
    startBusy(async () => {
      const result = await resourceActionAction(resourceKey, pending.id, [id], reason ?? "");
      notify({ message: result?.message || "Action failed.", tone: result?.ok ? "success" : "error" });
      if (result?.ok) {
        setPending(null);
        close();
        router.refresh();
      }
    });

  return (
    <>
      {actions.map((action) => (
        <Button key={action.id} variant={action.tone === "danger" ? "danger" : "primary"} size="sm" onClick={() => setPending(action)}>
          {action.label}
        </Button>
      ))}
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={run}
        loading={busy}
        tone={pending?.tone === "danger" ? "danger" : "warning"}
        title={pending?.confirm?.title || pending?.label}
        description={pending?.confirm?.description}
        confirmLabel={pending?.label}
      />
    </>
  );
}
