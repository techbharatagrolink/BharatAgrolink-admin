"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { formatDateTime } from "@/lib/format";
import { payoutSyncStatusAction, startPayoutSyncAction } from "@/lib/actions/admin/payout-sync";

const POLL_MS = 3000;

const triggerText = (trigger) => (trigger === "schedule" ? "scheduled" : trigger ? "manual" : "");

function JobCard({ job, canRun, busy, onRun }) {
  const last = job.lastRun;
  const running = job.running || busy;
  return (
    <Card>
      <CardHeader
        title={job.label}
        description={job.description}
        actions={
          canRun && (
            <Button size="sm" variant="primary" loading={running} disabled={running || Boolean(job.blockedReason)} onClick={() => onRun(job.key)}>
              {!running && <RefreshCw className="size-3.5" aria-hidden />}
              {running ? "Syncing…" : "Sync now"}
            </Button>
          )
        }
      />
      <CardBody className="space-y-3 text-sm">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1 text-xs text-ink-muted"><CalendarClock className="size-3.5" aria-hidden /> Schedule</dt>
            <dd className="mt-0.5 font-medium text-ink">{job.schedule}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Last run</dt>
            <dd className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {running ? (
                <Badge tone="info">Running{job.runningSince ? ` since ${formatDateTime(job.runningSince)}` : ""}</Badge>
              ) : last ? (
                <>
                  <Badge tone={last.ok ? "success" : "danger"}>{last.ok ? "Done" : "Failed"}</Badge>
                  <span className="flex items-center gap-1 text-xs text-ink-muted">
                    <Clock className="size-3 shrink-0" aria-hidden />
                    {formatDateTime(last.finishedAt)} · {triggerText(last.trigger)}
                  </span>
                </>
              ) : (
                <span className="text-xs text-ink-muted">Not run since the server started</span>
              )}
            </dd>
          </div>
        </dl>

        {!running && last?.ok && last.summary && (
          <p className="flex items-start gap-1.5 rounded-md bg-success-bg px-3 py-2 text-[13px] text-success-ink">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {last.summary}
          </p>
        )}
        {!running && last && !last.ok && last.error && (
          <p className="flex items-start gap-1.5 rounded-md bg-danger-bg px-3 py-2 text-[13px] text-danger-ink">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {last.error}
          </p>
        )}
        {job.blockedReason && (
          <p className="flex items-start gap-1.5 rounded-md bg-warning-bg px-3 py-2 text-[13px] text-warning-ink">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {job.blockedReason}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export function PayoutSyncPanel({ initial = [], error = null, canRun = false }) {
  const [jobs, setJobs] = useState(initial);
  const [message, setMessage] = useState(error);
  const [starting, setStarting] = useState(() => new Set());

  const refresh = useCallback(async () => {
    const r = await payoutSyncStatusAction();
    if (r.ok) setJobs(r.data);
    else setMessage(r.message);
  }, []);

  const anyRunning = jobs.some((j) => j.running) || starting.size > 0;
  useEffect(() => {
    if (!anyRunning) return undefined;
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [anyRunning, refresh]);

  const start = async (key) => {
    setMessage(null);
    setStarting((s) => new Set(s).add(key));
    const r = await startPayoutSyncAction(key);
    if (!r.ok) setMessage(r.message);
    await refresh();
    setStarting((s) => {
      const next = new Set(s);
      next.delete(key);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {message && <Notice tone="danger">{message}</Notice>}
      <Notice tone="info" title="What this creates">
        Every delivered order line gets one vendor_payout_items row, which is what Vendor Payout Items, Vendor Payout Summary and the dashboard &ldquo;Delivered&rdquo;
        count read from. A line stays off those pages until its row exists. Running this is safe to repeat &mdash; a line that already has a row is left alone.
      </Notice>
      <div className="grid gap-4 xl:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.key} job={job} canRun={canRun} busy={starting.has(job.key)} onRun={start} />
        ))}
      </div>
    </div>
  );
}
