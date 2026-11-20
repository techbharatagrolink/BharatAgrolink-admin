"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { runAiCheckAction } from "@/lib/actions/admin/seo";

/** "Run now" for the ChatGPT check. Confirms first because every run calls the paid OpenAI API. */
export function AiRunButton({ promptCount, running }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const res = await runAiCheckAction();
      setOpen(false);
      notify(res.ok ? { message: "ChatGPT check started. Results appear here in a few minutes; refresh to see them." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });

  return (
    <>
      <Button size="sm" variant="primary" onClick={() => setOpen(true)} disabled={running || !promptCount} loading={pending}>
        <Play className="size-4" aria-hidden />
        {running ? "Check running…" : "Run ChatGPT check now"}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={run}
        loading={pending}
        tone="warning"
        title="Run the ChatGPT check?"
        description={`Asks ChatGPT all ${promptCount} active prompts through the OpenAI API (paid: about $0.025 per prompt with web search) and takes a few minutes. After this first run it repeats automatically every 14 days.`}
        confirmLabel="Run now"
      />
    </>
  );
}
