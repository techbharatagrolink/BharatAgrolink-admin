"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { runAuditAction } from "@/lib/actions/admin/seo";

/** "Run audit now". Free, but it loads every page of the live site one by one, so it confirms first. */
export function AuditRunButton({ running }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const res = await runAuditAction();
      setOpen(false);
      notify(res.ok ? { message: "Website audit started. It takes about 20–30 minutes; refresh this page to see progress." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });

  return (
    <>
      <Button size="sm" variant="primary" onClick={() => setOpen(true)} disabled={running} loading={pending}>
        <Play className="size-4" aria-hidden />
        {running ? "Audit running…" : "Run audit now"}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={run}
        loading={pending}
        tone="warning"
        title="Run the website audit?"
        description="Loads every page in the sitemap and the links on them, one per second (about 20–30 minutes), then checks mobile speed with Google PageSpeed. Free; nothing on the website is changed. After this first run it repeats every 7 days."
        confirmLabel="Run audit"
      />
    </>
  );
}
