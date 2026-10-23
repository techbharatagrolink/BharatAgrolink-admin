"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Script from "next/script";
import { formatINR } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import {
  completePaymentAttemptAction,
  failPaymentAttemptAction,
  listPaymentAttemptsAction,
  retryPaymentAttemptAction,
  syncPaymentAttemptAction,
} from "@/lib/actions/admin/payment-attempts";

const STATUSES = [
  { value: "", label: "All" },
  { value: "Payment Pending", label: "Pending" },
  { value: "Payment Failed", label: "Failed" },
  { value: "Payment Expired", label: "Expired" },
  { value: "Payment Captured - Order Pending", label: "Captured – Order Pending" },
  { value: "Placed", label: "Placed" },
];

const STATUS_TONE = {
  "Payment Pending": "pending",
  "Payment Failed": "warning",
  "Payment Expired": "danger",
  "Payment Captured - Order Pending": "info",
  "Placed": "success",
};

function fmt(v) {
  return v || <span className="text-ink-muted">—</span>;
}

function fmtDatetime(v) {
  if (!v) return <span className="text-ink-muted">—</span>;
  try {
    return new Date(v).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return v;
  }
}

/* ---- Sync dialog ---- */
function SyncDialog({ attempt, onClose, onDone }) {
  const [step, setStep] = useState("loading"); // loading | input | preview | error
  const [message, setMessage] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const doSync = useCallback(
    async (body = {}, previewOnly = false) => {
      setBusy(true);
      const res = await syncPaymentAttemptAction(attempt.pendingOrderId, { ...body, previewOnly });
      setBusy(false);
      if (res?.status === "preview") {
        setPreview(res.payment);
        setStep("preview");
        return;
      }
      if (res?.ok) {
        onDone(res.message || "Order synced.");
        return;
      }
      const msg = res?.message ?? "Unable to sync paid order.";
      if (msg.includes("No captured Razorpay payment found")) {
        setMessage(msg);
        setStep("input");
      } else {
        setMessage(msg);
        setStep("error");
      }
    },
    [attempt.pendingOrderId, onDone]
  );

  useEffect(() => {
    doSync();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmSync = async () => {
    setBusy(true);
    const body = {};
    if (/^pay_[A-Za-z0-9]+$/.test(paymentRef.trim())) body.razorpayPaymentId = paymentRef.trim();
    else if (paymentRef.trim()) body.paymentReference = paymentRef.trim();
    const res = await syncPaymentAttemptAction(attempt.pendingOrderId, body);
    setBusy(false);
    if (res?.ok) { onDone(res.message || "Order synced."); return; }
    setMessage(res?.message ?? "Sync failed.");
    setStep("error");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-base">Sync Paid Order</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-lg leading-none">×</button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-ink-muted">
            Pending order: <code className="font-mono text-ink">{attempt.pendingOrderId}</code>
            &ensp;Amount: <strong>{formatINR(attempt.amount)}</strong>
          </p>

          {step === "loading" && (
            <p className="text-sm text-ink-muted">Searching for captured payment…</p>
          )}

          {step === "input" && (
            <div className="space-y-3">
              <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2">{message}</p>
              <label className="block text-sm font-medium">Enter Razorpay Payment ID or UTR / reference</label>
              <Input
                className="font-mono text-sm"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="pay_XXXX  or  RRNNUMBER"
              />
              <Button
                disabled={busy || !paymentRef.trim()}
                onClick={() => {
                  const trimmed = paymentRef.trim();
                  const body = /^pay_[A-Za-z0-9]+$/.test(trimmed)
                    ? { razorpayPaymentId: trimmed }
                    : { paymentReference: trimmed };
                  doSync(body, true);
                }}
                variant="primary"
                size="sm"
              >
                {busy ? "Searching…" : "Preview"}
              </Button>
            </div>
          )}

          {step === "preview" && preview && (
            <div className="space-y-3">
              {!preview.isAmountMatch && (
                <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
                  The Razorpay amount does not match the order amount. Do not sync this payment.
                </p>
              )}
              {preview.willCaptureOnSync && (
                <p className="text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2">
                  This payment is authorized. It will be captured automatically on sync.
                </p>
              )}
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ["Payment ID", <code key="pid" className="font-mono">{preview.paymentId}</code>],
                    ["Status", <strong key="st">{String(preview.status).toUpperCase()}</strong>],
                    ["Method", String(preview.method).toUpperCase()],
                    ["Order Amount", <strong key="oa">{formatINR(preview.expectedAmount)}</strong>],
                    ["Razorpay Amount", <strong key="ra">{formatINR(preview.amount)}</strong>],
                    preview.matchFieldLabel && ["Matched By", preview.matchFieldLabel],
                    preview.matchValue && ["Reference", preview.matchValue],
                    preview.vpa && ["VPA", preview.vpa],
                    preview.rrn && ["RRN", preview.rrn],
                    preview.upiTransactionId && ["UPI Txn ID", preview.upiTransactionId],
                    preview.createdAtText && ["Created At", preview.createdAtText],
                  ].filter(Boolean).map(([label, value]) => (
                    <tr key={label} className="border-b border-line/50">
                      <th className="text-left py-1.5 pr-3 text-ink-muted font-medium w-1/3">{label}</th>
                      <td className="py-1.5">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 pt-1">
                <Button
                  disabled={busy || !preview.isCaptureReady || !preview.isAmountMatch}
                  onClick={confirmSync}
                  variant="primary"
                  size="sm"
                >
                  {busy ? "Syncing…" : "Confirm & Sync"}
                </Button>
                <Button onClick={onClose} variant="ghost" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">{message}</p>
              <Button onClick={onClose} variant="ghost" size="sm">Close</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Fail dialog ---- */
function FailDialog({ attempt, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const handleFail = async () => {
    setBusy(true);
    const res = await failPaymentAttemptAction(attempt.pendingOrderId, { reason });
    setBusy(false);
    if (res?.ok) onDone("Attempt marked as failed.");
    else onDone(null, res?.message ?? "Could not fail attempt.");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-base">Mark as Failed</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-lg leading-none">×</button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-ink-muted">Pending order: <code className="font-mono">{attempt.pendingOrderId}</code></p>
          <label className="block text-sm font-medium">Reason (optional)</label>
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this attempt failed?"
          />
          <div className="flex gap-2">
            <Button disabled={busy} onClick={handleFail} variant="danger" size="sm">{busy ? "Saving…" : "Mark Failed"}</Button>
            <Button onClick={onClose} variant="ghost" size="sm">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main table ---- */
export function PaymentAttemptsTable({ initialRows = [], statusCounts = {}, initialStatus = "" }) {
  const { notify } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [dialog, setDialog] = useState(null); // { type: 'sync'|'fail', attempt }
  const [, startTransition] = useTransition();
  const razorpayReady = useRef(false);

  const reload = useCallback(
    (status) => {
      startTransition(async () => {
        const res = await listPaymentAttemptsAction({ status });
        setRows(res?.rows ?? []);
      });
    },
    [startTransition]
  );

  const onTabChange = (status) => {
    setActiveStatus(status);
    reload(status);
  };

  const handleSyncDone = (message, error) => {
    setDialog(null);
    if (error) { notify({ message: error, tone: "danger" }); return; }
    notify({ message: message || "Order synced successfully.", tone: "success" });
    reload(activeStatus);
  };

  const handleFailDone = (message, error) => {
    setDialog(null);
    if (error) { notify({ message: error, tone: "danger" }); return; }
    notify({ message: message || "Attempt marked as failed.", tone: "warning" });
    reload(activeStatus);
  };

  const handleRetry = useCallback(
    async (attempt) => {
      if (!window.Razorpay) { notify({ message: "Razorpay checkout is not loaded.", tone: "danger" }); return; }
      const res = await retryPaymentAttemptAction(attempt.pendingOrderId);
      if (!res?.razorpayOrderId) { notify({ message: res?.message ?? "Could not start payment.", tone: "danger" }); return; }

      const options = {
        key: res.keyId,
        amount: res.amount,
        currency: res.currency,
        order_id: res.razorpayOrderId,
        name: "Agrolink Manufacturing PVT. LTD.",
        description: "Manual Order Retry",
        prefill: res.prefill,
        theme: { color: "#1829e3" },
        handler: async function (response) {
          const cRes = await completePaymentAttemptAction(attempt.pendingOrderId, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (cRes?.ok) {
            notify({ message: cRes.message || "Order created successfully.", tone: "success" });
            reload(activeStatus);
          } else {
            await failPaymentAttemptAction(attempt.pendingOrderId, { reason: "Payment captured, but order sync failed." });
            notify({ message: cRes?.message ?? "Payment captured but order sync failed.", tone: "warning" });
            reload(activeStatus);
          }
        },
        modal: {
          ondismiss: async function () {
            await failPaymentAttemptAction(attempt.pendingOrderId, { reason: "Payment dismissed by admin." });
            notify({ message: "Payment was not completed.", tone: "warning" });
            reload(activeStatus);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        const err = response.error ?? {};
        await failPaymentAttemptAction(attempt.pendingOrderId, {
          reason: err.description || err.reason || "Razorpay payment failed.",
        });
        notify({ message: err.description || "Payment failed.", tone: "danger" });
        reload(activeStatus);
      });
      rzp.open();
    },
    [activeStatus, notify, reload]
  );

  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => { razorpayReady.current = true; }}
      />

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => {
          const count = s.value === "" ? totalCount : (statusCounts[s.value] ?? 0);
          return (
            <button
              key={s.value}
              onClick={() => onTabChange(s.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeStatus === s.value
                  ? "bg-brand text-white"
                  : "bg-surface-raised text-ink-muted hover:text-ink"
              }`}
            >
              {s.label}
              {count > 0 && <span className="ml-1.5 opacity-75">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-ink-muted">
              {["Attempt / Order", "Mode", "Amount", "Status", "Razorpay Order", "Payment ID", "Updated", "Reason", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-ink-muted">No payment attempts found.</td>
              </tr>
            )}
            {rows.map((row) => {
              const canRetry = ["Payment Failed", "Payment Expired"].includes(row.status);
              const canSync = row.status !== "Placed" && row.razorpayOrderId;
              return (
                <tr key={row.pendingOrderId} className="border-b border-line/50 hover:bg-surface-raised/50">
                  <td className="px-4 py-3">
                    {row.orderId ? (
                      <a href={`/admin/orders/${row.orderId}`} className="font-mono text-xs text-brand hover:underline">{row.orderId}</a>
                    ) : (
                      <code className="font-mono text-xs text-ink-muted">{row.pendingOrderId}</code>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{String(row.paymentMode || "").toUpperCase()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatINR(row.amount)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={STATUS_TONE[row.status] ?? "neutral"} dot>{row.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3"><code className="font-mono text-xs">{fmt(row.razorpayOrderId)}</code></td>
                  <td className="px-4 py-3"><code className="font-mono text-xs">{fmt(row.razorpayPaymentId)}</code></td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted text-xs">{fmtDatetime(row.updatedAt)}</td>
                  <td className="px-4 py-3 max-w-[180px] text-xs text-ink-muted truncate" title={row.failureReason ?? ""}>{fmt(row.failureReason)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {canSync && (
                        <Button
                          onClick={() => setDialog({ type: "sync", attempt: row })}
                          variant="secondary"
                          size="xs"
                        >
                          Sync Paid Order
                        </Button>
                      )}
                      {canRetry && (
                        <Button
                          onClick={() => handleRetry(row)}
                          variant="primary"
                          size="xs"
                        >
                          Retry Payment
                        </Button>
                      )}
                      {!canSync && !canRetry && row.status !== "Placed" && (
                        <Button
                          onClick={() => setDialog({ type: "fail", attempt: row })}
                          variant="ghost"
                          size="xs"
                        >
                          Mark Failed
                        </Button>
                      )}
                      {row.status === "Placed" && (
                        row.orderId ? (
                          <a href={`/admin/orders/${row.orderId}`} className="text-xs text-success font-medium hover:underline">{row.orderId}</a>
                        ) : row.razorpayPaymentId ? (
                          <a href={`/admin/orders?q=${row.razorpayPaymentId}`} className="text-xs text-success font-medium hover:underline">View Order ↗</a>
                        ) : (
                          <span className="text-xs text-success font-medium">Completed</span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dialog?.type === "sync" && (
        <SyncDialog attempt={dialog.attempt} onClose={() => setDialog(null)} onDone={handleSyncDone} />
      )}
      {dialog?.type === "fail" && (
        <FailDialog attempt={dialog.attempt} onClose={() => setDialog(null)} onDone={handleFailDone} />
      )}
    </>
  );
}
