"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, Lock, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { formatDateTime } from "@/lib/format";
import { chargesSyncStatusAction, startChargesSyncAction } from "@/lib/actions/admin/charges-sync";

const POLL_MS = 3000;
/* "Sync all": the order page snapshot last, after both couriers' freight is fresh */
const SYNC_ALL = ["shiprocket", "delhivery", "order-cost"];

function triggerText(trigger) {
  if (!trigger) return "";
  if (trigger === "schedule") return "scheduled";
  return "manual";
}

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
        <dl className="grid gap-2 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1 text-xs text-ink-muted"><CalendarClock className="size-3.5" aria-hidden /> Schedule</dt>
            <dd className="mt-0.5 font-medium text-ink">{job.schedule}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-xs text-ink-muted"><Clock className="size-3.5" aria-hidden /> Last data written</dt>
            <dd className="mt-0.5 font-medium text-ink">{formatDateTime(job.lastWrittenAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Last run</dt>
            <dd className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {running ? (
                <Badge tone="info">Running{job.runningSince ? ` since ${formatDateTime(job.runningSince)}` : ""}</Badge>
              ) : last ? (
                <>
                  <Badge tone={last.ok ? "success" : "danger"}>{last.ok ? "Done" : "Failed"}</Badge>
                  <span className="text-xs text-ink-muted">{formatDateTime(last.finishedAt)} · {triggerText(last.trigger)}</span>
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
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {job.blockedReason}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export function ChargesSyncPanel({ initial = [], error = null, canRun = false }) {
  const [jobs, setJobs] = useState(initial);
  const [message, setMessage] = useState(error);
  const [starting, setStarting] = useState(() => new Set());
  const [syncingAll, setSyncingAll] = useState(false);
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  const refresh = useCallback(async () => {
    const r = await chargesSyncStatusAction();
    if (r.ok) setJobs(r.data);
    else setMessage(r.message);
    return r.ok ? r.data : null;
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
    const r = await startChargesSyncAction(key);
    if (!r.ok) setMessage(r.message);
    await refresh();
    setStarting((s) => {
      const next = new Set(s);
      next.delete(key);
      return next;
    });
    return r.ok;
  };

  /* Starts one job and waits until the server reports it finished. */
  const runAndWait = async (key) => {
    if (!(await start(key))) return false;
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      const data = await refresh();
      const job = data?.find((j) => j.key === key);
      if (!job || !job.running) return job?.lastRun?.ok !== false;
    }
  };

  const syncAll = async () => {
    setSyncingAll(true);
    for (const key of SYNC_ALL) {
      const job = jobsRef.current.find((j) => j.key === key);
      if (!job || job.blockedReason) continue; // e.g. Delhivery login not set: skip, keep going
      await runAndWait(key);
    }
    setSyncingAll(false);
  };

  return (
    <div className="space-y-4">
      {message && <Notice tone="danger">{message}</Notice>}
      <Notice tone="info" title="Delhivery login">
        The Delhivery sync logs in to the Delhivery One panel once per run (once a day, or when you click Sync now). If Delhivery refuses the
        password, it is never tried again with that password — on any server, even after a restart — because Delhivery locks the account after
        5 wrong passwords. Fix DELHIVERY_PANEL_PASSWORD and restart to try again. &ldquo;Delhivery from stored ledger&rdquo; recalculates from the
        wallet entries already saved, without logging in.
      </Notice>
      {canRun && (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" loading={syncingAll} disabled={syncingAll || anyRunning} onClick={syncAll}>
            {!syncingAll && <RefreshCw className="size-4" aria-hidden />}
            Sync all
          </Button>
          <span className="text-xs text-ink-muted">Shiprocket, then Delhivery, then the order page charges.</span>
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.key} job={job} canRun={canRun} busy={starting.has(job.key)} onRun={start} />
        ))}
      </div>
    </div>
  );
}
