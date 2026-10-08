"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, FileOutput, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { convertQuotationAction, decideQuotationAction } from "@/lib/actions/admin/parity/seller";

const APPROVAL_TONE = { pending: "warning", blocked: "danger", approved: "success", auto_approved: "success", rejected: "danger" };
const HEALTH_RING = { success: "border-success-ink/30", warning: "border-warning-ink/30", danger: "border-danger-ink/30" };

function Kpi({ label, value, sub, tone }) {
  return (
    <div className={cn("min-w-0 rounded-lg border border-line p-3", tone && HEALTH_RING[tone])}>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-0.5 truncate text-[15px] font-semibold text-ink tabular">{value}</p>
      {sub && <p className="truncate text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

/** One quotation in the approvals.php queue: commercials, decision form and convert form. */
export function ApprovalCard({ quote, rules, canDecide }) {
  const router = useRouter();
  const { notify } = useToast();
  const [reason, setReason] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(null);

  const decide = (decision) => {
    if (!reason.trim()) {
      notify({ message: "A reason is required on every approval decision.", tone: "error" });
      return;
    }
    setBusy(decision);
    startTransition(async () => {
      const r = await decideQuotationAction(quote.id, decision, reason);
      notify({ message: r.message || (r.ok ? "Saved." : "Could not save the decision."), tone: r.ok ? "success" : "error" });
      setBusy(null);
      if (r.ok) router.refresh();
    });
  };

  const convert = () => {
    setBusy("convert");
    startTransition(async () => {
      const r = await convertQuotationAction(quote.id, poNumber);
      notify({ message: r.message || (r.ok ? "Order created." : "Could not convert the quotation."), tone: r.ok ? "success" : "error" });
      setBusy(null);
      if (r.ok) router.refresh();
    });
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <h3 className="text-[15px] font-semibold text-ink">{quote.number}</h3>
        <Badge tone={quote.cmHealth}>CM {formatPercent(quote.cmPct)}</Badge>
        <Badge tone={APPROVAL_TONE[quote.approvalStatus] ?? "neutral"} dot>
          {String(quote.approvalStatus || "").replace(/_/g, " ")}
        </Badge>
        {quote.status === "converted" && <Badge tone="info">converted</Badge>}
        <span className="ml-auto text-xs text-ink-muted">
          {quote.agent || "—"} · {formatDateTime(quote.createdAt)}
        </span>
      </div>
      <CardBody className="space-y-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
          <Kpi label="Buyer" value={quote.buyer} sub={quote.mobile} />
          <Kpi label="Quote Value" value={formatINR(quote.value)} sub={`${quote.lines} line(s)`} />
          <Kpi label="Platform Revenue" value={formatINR(quote.platformRevenue)} sub={`${formatPercent(quote.takeRatePct)} take rate`} />
          <Kpi label="Contribution Margin" value={formatINR(quote.contribution)} sub={`${formatPercent(quote.cmPct)} CM · floor ${formatPercent(rules.minCmPct, 0)}`} tone={quote.cmHealth} />
          <Kpi label="Triggering Rule" value={quote.rule} />
        </div>
        {quote.note && (
          <p className="text-[13px] text-ink-soft">
            Last note: <em>{quote.note}</em>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink size="sm" href={`/admin/b2b/quotations?q=${encodeURIComponent(quote.number)}`}>
            <Eye className="size-3.5" aria-hidden /> Open quotation
          </ButtonLink>
          {quote.awaiting && canDecide && (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for the decision (required)" aria-label={`Reason for ${quote.number}`} maxLength={1000} className="h-8 min-w-60 flex-1" />
              <Button size="sm" variant="primary" onClick={() => decide("approved")} loading={pending && busy === "approved"} disabled={pending}>
                <Check className="size-3.5" aria-hidden /> Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => decide("rejected")} loading={pending && busy === "rejected"} disabled={pending}>
                <X className="size-3.5" aria-hidden /> Reject
              </Button>
            </div>
          )}
          {quote.awaiting && !canDecide && <span className="text-xs text-ink-muted">Awaiting a decision from someone with approval rights.</span>}
          {quote.readyToConvert && canDecide && (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="Buyer PO number (optional)" aria-label={`PO number for ${quote.number}`} maxLength={100} className="h-8 min-w-48 flex-1" />
              <Button size="sm" variant="primary" onClick={convert} loading={pending && busy === "convert"} disabled={pending || quote.needsPayment}>
                <FileOutput className="size-3.5" aria-hidden /> Convert to Order
              </Button>
            </div>
          )}
        </div>
        {quote.readyToConvert && quote.needsPayment && (
          <p className="text-xs text-warning-ink">
            {quote.paymentMode} quotation: {formatINR(quote.dueAmount)} must be captured through Razorpay (Pay Now / Sync Payment on the legacy panel) before it can become an order.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
