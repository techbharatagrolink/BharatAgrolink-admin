import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PROPOSAL = {
  PENDING: { tone: "warning", label: "Waiting for vendor" },
  PARTIAL: { tone: "info", label: "Partly answered" },
  COMPLETED: { tone: "success", label: "Completed" },
  WITHDRAWN: { tone: "neutral", label: "Withdrawn" },
};

const ITEM = {
  PENDING: { tone: "warning", label: "Pending" },
  CLARIFICATION: { tone: "info", label: "Question asked" },
  ACCEPTED: { tone: "brand", label: "Accepted, waiting for date" },
  ACTIVE: { tone: "success", label: "Live" },
  DECLINED: { tone: "danger", label: "Declined" },
  SUPERSEDED: { tone: "neutral", label: "Replaced by newer" },
  WITHDRAWN: { tone: "neutral", label: "Withdrawn" },
};

export const SCOPE_LABEL = { ALL: "All variations", SELECTED: "Selected variations", GROUP: "Variation group", SINGLE: "One variation" };

export function ProposalStatus({ status }) {
  const s = PROPOSAL[status] ?? { tone: "neutral", label: status };
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
}

export function ItemStatus({ status }) {
  const s = ITEM[status] ?? { tone: "neutral", label: status };
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
}

const rupee = (v) => (v == null ? "—" : `₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

export function Money({ value, className }) {
  return <span className={cn("tabular-nums", className)}>{rupee(value)}</span>;
}

/** NRV difference: red when the seller gets less, green when more. */
export function Difference({ value }) {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return <span className="tabular-nums text-ink-muted">₹0.00</span>;
  return <span className={cn("tabular-nums font-medium", n < 0 ? "text-danger-ink" : "text-success-ink")}>{n > 0 ? "+" : "−"}{rupee(Math.abs(n))}</span>;
}

export const formatRupee = rupee;
