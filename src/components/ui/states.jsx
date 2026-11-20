import Link from "next/link";
import { AlertOctagon, Inbox, Lock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({ title = "Nothing here yet", description, action, icon: Icon = Inbox, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-8 ring-brand-50/40">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description = "We could not load this data. Please try again.", onRetry, action, className }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-danger-bg text-danger-ink">
        <AlertOctagon className="size-5" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {(onRetry || action) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {onRetry && (
            <button type="button" onClick={onRetry} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3 text-small font-medium text-ink hover:bg-surface-muted">
              <RefreshCw className="size-3.5" aria-hidden /> Try again
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

export function ApiUnavailable({ error, what = "this data" }) {
  const status = error?.status;
  const description = status
    ? `The admin API could not load ${what} (${error.message}). Refresh the page to try again.`
    : `The admin API is not reachable right now, so ${what} could not be loaded. Refresh the page in a moment.`;
  return <ErrorState title="Not connected" description={description} className="rounded-2xl border border-line bg-surface" />;
}

export function PermissionDenied({ module = "this page" }) {
  return (
    <div className="mx-auto mt-6 max-w-lg rounded-xl border border-line bg-surface">
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-warning-bg text-warning-ink">
          <Lock className="size-5" aria-hidden />
        </span>
        <h2 className="text-base font-semibold text-ink">You don&apos;t have access to {module}</h2>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">Your role does not include the required permission for this module. Ask a Super Admin to update your role under Staff &amp; Roles.</p>
        <Link href="/admin/dashboard" className="mt-5 inline-flex h-9 items-center rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-brand-fg hover:bg-brand-700">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("ui-shimmer rounded-md", className)} aria-hidden />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-6 w-20" />
            <Skeleton className="mt-2.5 h-3 w-32 max-w-full" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="flex gap-2 border-b border-line p-3">
          <Skeleton className="h-9 w-64 max-w-[60%]" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="border-b border-line bg-surface-muted px-4 py-2.5">
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-0">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="hidden h-3.5 w-28 sm:block" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
