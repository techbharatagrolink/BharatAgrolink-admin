"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, Lock, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { Input, Select } from "@/components/ui/form";
import { formatDateTime } from "@/lib/format";
import { chargesSyncRangeAction, chargesSyncStatusAction, startChargesSyncAction } from "@/lib/actions/admin/charges-sync";

const POLL_MS = 3000;
/* "Sync all": the order page snapshot last, after both couriers' freight is fresh. Uses each job's default window. */
const SYNC_ALL = ["shiprocket", "delhivery", "order-cost"];

const today = () => new Date().toISOString().slice(0, 10);
const daysAgoIso = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const RANGE_PRESETS = [
  { value: "default", label: "Default window" },
  { value: "30", label: "Last 30 days" },
  { value: "60", label: "Last 60 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 180 days" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
];

function triggerText(trigger) {
  if (!trigger) return "";
  if (trigger === "schedule") return "scheduled";
  return "manual";
}

/** Preset + optional custom From/To, so "Sync now" can widen a job past its hardcoded default window (e.g. to sync every order ever). */
function RangePicker({ earliest, value, onChange }) {
  const { preset, from, to } = value;
  const invalid = preset === "custom" && (!from || !to || from > to);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        aria-label="Sync range"
        className="w-40"
        value={preset}
        onChange={(e) => {
          const next = e.target.value;
          if (next === "custom") onChange({ preset: next, from: from || earliest || daysAgoIso(90), to: to || today() });
          else onChange({ preset: next, from: "", to: "" });
        }}
      >
        {RANGE_PRESETS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </Select>
      {preset === "custom" && (
        <>
          <Input type="date" aria-label="From" className="w-36" value={from} max={to || today()} onChange={(e) => onChange({ preset, from: e.target.value, to })} />
          <Input type="date" aria-label="To" className="w-36" value={to} min={from} max={today()} onChange={(e) => onChange({ preset, from, to: e.target.value })} />
          {invalid && <span className="text-xs text-danger-ink">Pick a valid From–To range.</span>}
        </>
      )}
    </div>
  );
}

/** The {from, to} runChargesSyncJob should use, or undefined for the job's own default window. */
function resolveRange(value, earliest) {
  if (value.preset === "default") return undefined;
  if (value.preset === "custom") return value.from && value.to && value.from <= value.to ? { from: value.from, to: value.to } : null;
  if (value.preset === "all") return { from: earliest || daysAgoIso(365 * 3), to: today() };
  return { from: daysAgoIso(Number(value.preset)), to: today() };
}

function JobCard({ job, canRun, busy, onRun, ranged, earliest }) {
  const last = job.lastRun;
  const running = job.running || busy;
  const [range, setRange] = useState({ preset: "default", from: "", to: "" });
  const resolved = resolveRange(range, earliest);
  return (
    <Card>
      <CardHeader
        title={job.label}
        description={job.description}
        actions={
          canRun && (
            <Button size="sm" variant="primary" loading={running} disabled={running || Boolean(job.blockedReason) || resolved === null} onClick={() => onRun(job.key, resolved)}>
              {!running && <RefreshCw className="size-3.5" aria-hidden />}
              {running ? "Syncing…" : "Sync now"}
            </Button>
          )
        }
      />
      {canRun && ranged && <div className="border-t border-line px-4 py-2.5"><RangePicker earliest={earliest} value={range} onChange={setRange} /></div>}
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
                  <Badge tone={!last.ok ? "danger" : last.warning ? "warning" : "success"}>{!last.ok ? "Failed" : last.warning ? "Done, months skipped" : "Done"}</Badge>
                  <span className="text-xs text-ink-muted">{formatDateTime(last.finishedAt)} · {triggerText(last.trigger)}</span>
                </>
              ) : (
                <span className="text-xs text-ink-muted">Not run since the server started</span>
              )}
            </dd>
          </div>
        </dl>

        {!running && last?.ok && last.summary && (
          <p className={`flex items-start gap-1.5 rounded-md px-3 py-2 text-[13px] ${last.warning ? "bg-warning-bg text-warning-ink" : "bg-success-bg text-success-ink"}`}>
            {last.warning ? <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden /> : <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />}
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
  const [range, setRangeMeta] = useState({ rangedJobs: [], earliest: null });
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  useEffect(() => {
    if (!canRun) return;
    chargesSyncRangeAction().then((r) => r.ok && setRangeMeta(r.data));
  }, [canRun]);

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

  const start = async (key, jobRange) => {
    setMessage(null);
    setStarting((s) => new Set(s).add(key));
    const r = await startChargesSyncAction(key, jobRange);
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
          <JobCard key={job.key} job={job} canRun={canRun} busy={starting.has(job.key)} onRun={start} ranged={range.rangedJobs.includes(job.key)} earliest={range.earliest} />
        ))}
      </div>
    </div>
  );
}
