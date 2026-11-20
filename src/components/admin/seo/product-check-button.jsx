"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { runProductCheckAction } from "@/lib/actions/admin/seo";

/** "Run check now" for Product Data: free and fast (database only), so no confirmation. */
export function ProductCheckButton({ running }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const run = () =>
    startTransition(async () => {
      const res = await runProductCheckAction();
      notify(
        res.ok
          ? { message: `Checked ${res.data.products} products: ${res.data.issues} open issues, score ${res.data.score}.` }
          : { tone: "error", message: res.message }
      );
      if (res.ok) router.refresh();
    });
  return (
    <Button size="sm" variant="primary" onClick={run} loading={pending} disabled={running}>
      <RefreshCw className="size-4" aria-hidden />
      {running ? "Check running…" : "Run check now"}
    </Button>
  );
}
