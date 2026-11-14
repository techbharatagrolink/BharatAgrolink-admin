"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { reconcileBannerPaymentAction } from "@/lib/actions/admin/monetization";

/** Re-checks an open / failed banner payment with Razorpay and refreshes the list. */
export function ReconcilePayment({ orderId }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await reconcileBannerPaymentAction(orderId);
          notify(res.ok ? { message: res.data?.message ?? "Checked with Razorpay." } : { tone: "error", message: res.message });
          if (res.ok) router.refresh();
        })
      }
    >
      Check with Razorpay
    </Button>
  );
}
