"use client";

import { ErrorState } from "@/components/ui/states";

export default function PanelError({ reset }) {
  return (
    <div className="rounded-xl border border-line bg-surface">
      <h1 className="sr-only">Error</h1>
      <ErrorState description="This page could not be loaded. Your data is safe — try again, or go back to the dashboard." onRetry={reset} />
    </div>
  );
}
