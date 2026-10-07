"use client";

import Link from "next/link";
import { ErrorState } from "@/components/ui/states";

export default function PanelError({ reset }) {
  return (
    <div className="rounded-xl border border-line bg-surface">
      <h1 className="sr-only">Error</h1>
      <ErrorState
        description="This page could not be loaded. Your data is safe — try again, or go back to the dashboard."
        onRetry={reset}
        action={
          <Link href="/admin/dashboard" className="inline-flex h-8 items-center rounded-md px-3 text-[13px] font-medium text-brand-700 hover:bg-surface-muted hover:underline">
            Go to dashboard
          </Link>
        }
      />
    </div>
  );
}
