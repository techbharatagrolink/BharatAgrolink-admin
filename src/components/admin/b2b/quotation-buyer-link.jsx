"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createB2bQuotationLink, resolveB2bQuotationChange } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR } from "@/lib/format";

const CHANGE_LABEL = { QUANTITY: "Quantity", PRODUCT: "Product", PRICE: "Price", DELIVERY_ADDRESS: "Delivery address", OTHER: "Other" };
const REVOKED = { NEW_LINK: "replaced by a newer link", SUPERSEDED: "quotation replaced", CANCELLED: "quotation cancelled", MANUAL: "revoked" };

/**
 * Buyer link card (spec C6): create the link (the full URL is shown once, then only its last
 * characters), share it on WhatsApp from the sales person's phone, see whether the buyer opened it,
 * and handle the buyer's change requests.
 */
const PAYMENT_TONE = { PAID: "success", CREATED: "neutral", FAILED: "danger", REFUND_DUE: "warning" };
const PAYMENT_LABEL = { PAID: "Paid", CREATED: "Started", FAILED: "Failed", REFUND_DUE: "Refund due" };

export function QuotationBuyerLink({ id, number, buyerName, buyerMobile, validUntil, link, changeRequests, payments = [], action, canEdit }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [created, setCreated] = useState(null);
  const [message, setMessage] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [copied, setCopied] = useState(false);

  const run = (fn, onOk) =>
    start(async () => {
      const res = await fn();
      setConfirm(null);
      if (!res?.ok) return setMessage({ tone: "danger", text: res?.message || "That did not work." });
      setMessage(null);
      onOk?.(res);
      router.refresh();
    });

  const createLink = () => run(() => createB2bQuotationLink(id), (res) => setCreated(res));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(created.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage({ tone: "warning", text: "Copy did not work: select the link and copy it." });
    }
  };

  const mobile = String(buyerMobile || "").replace(/\D/g, "").slice(-10);
  const waText = created
    ? `Namaste ${buyerName || ""}, your Bharat Agrolink quotation ${number} is ready. It is valid until ${formatDateTime(validUntil)}. View, accept or request changes here: ${created.url}`
    : "";
  const waHref = created && mobile.length === 10 ? `https://wa.me/91${mobile}?text=${encodeURIComponent(waText)}` : null;
  const open = changeRequests.filter((c) => c.status === "OPEN");

  return (
    <Card>
      <CardHeader
        title="Buyer link"
        description="The buyer opens the quotation, accepts it with an OTP on the registered mobile, or asks for changes."
        actions={
          link ? (
            <Badge tone={link.active ? "success" : "neutral"}>{link.active ? "Active" : link.revokedReason ? `Inactive: ${REVOKED[link.revokedReason] ?? link.revokedReason}` : "Expired"}</Badge>
          ) : null
        }
      />
      <CardBody className="space-y-3">
        {message && <Notice tone={message.tone}>{message.text}</Notice>}

        {created && (
          <Notice tone="success" title="Link created: copy it now">
            <p className="mb-2">The full link is shown only this once. Creating another link stops this one.</p>
            <Input readOnly value={created.url} onFocus={(e) => e.target.select()} className="font-mono text-xs" />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
              {waHref && (
                <ButtonLink href={waHref} target="_blank" rel="noopener noreferrer" size="sm" variant="primary">
                  Share on WhatsApp
                </ButtonLink>
              )}
            </div>
          </Notice>
        )}

        {link ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-ink-muted">Link</dt>
            <dd className="font-mono text-xs">…{link.hint}</dd>
            <dt className="text-ink-muted">Created</dt>
            <dd>{formatDateTime(link.createdAt)}</dd>
            <dt className="text-ink-muted">Opened</dt>
            <dd>{link.views ? `${link.views} time${link.views === 1 ? "" : "s"} · last ${formatDateTime(link.lastViewedAt)}` : "Not yet"}</dd>
            <dt className="text-ink-muted">Works until</dt>
            <dd>{formatDateTime(link.expiresAt)}</dd>
          </dl>
        ) : (
          <p className="text-sm text-ink-muted">No buyer link yet.</p>
        )}

        {canEdit && action && (
          <Button
            size="sm"
            variant={link ? "secondary" : "primary"}
            disabled={busy || !action.allowed}
            title={action.allowed ? undefined : action.reason}
            onClick={() => (link?.active ? setConfirm({ kind: "link" }) : createLink())}
          >
            {link ? "Create a new link" : "Create buyer link"}
          </Button>
        )}
        {action && !action.allowed && <p className="text-xs text-ink-muted">{action.reason}</p>}

        {payments.length > 0 && (
          <div className="space-y-2 border-t border-line pt-3">
            <p className="text-sm font-medium text-ink">Buyer payments</p>
            {payments.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-2 text-sm">
                <span>
                  {formatINR(p.amount)} · {p.purpose === "ADVANCE" ? "advance" : "full"}
                  <span className="block font-mono text-xs text-ink-muted">{p.razorpayPaymentId || p.razorpayOrderId}</span>
                  {p.failureReason && <span className="block text-xs text-ink-muted">{p.failureReason}</span>}
                </span>
                <span className="text-right">
                  <Badge tone={PAYMENT_TONE[p.status] ?? "neutral"}>{PAYMENT_LABEL[p.status] ?? p.status}</Badge>
                  <span className="block text-xs text-ink-muted">{formatDateTime(p.paidAt || p.createdAt)}</span>
                </span>
              </div>
            ))}
            {payments.some((p) => p.status === "REFUND_DUE") && (
              <p className="text-xs text-warning-ink">Money was received without a new order (the quotation already had an order or was withdrawn). Finance must refund it.</p>
            )}
          </div>
        )}

        {changeRequests.length > 0 && (
          <div className="space-y-2 border-t border-line pt-3">
            <p className="text-sm font-medium text-ink">
              Change requests {open.length > 0 && <Badge tone="warning">{open.length} open</Badge>}
            </p>
            {changeRequests.map((c) => (
              <div key={c.id} className="rounded-md border border-line p-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{CHANGE_LABEL[c.type] ?? c.type}</span>
                  <Badge tone={c.status === "OPEN" ? "warning" : "neutral"}>{c.status === "OPEN" ? "Open" : c.status === "RESOLVED" ? "Resolved" : "Closed"}</Badge>
                </div>
                <p className="mt-1 whitespace-pre-line">{c.message}</p>
                <p className="mt-1 text-xs text-ink-muted">{formatDateTime(c.createdAt)}{c.note ? ` · ${c.note}` : ""}</p>
                {c.status === "OPEN" && canEdit && (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => setConfirm({ kind: "change", changeId: c.id, status: "RESOLVED" })}>
                      Mark resolved
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirm({ kind: "change", changeId: c.id, status: "CLOSED" })}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {open.length > 0 && <p className="text-xs text-ink-muted">To change the offer, use Revise: it creates a new version, which needs its own buyer link.</p>}
          </div>
        )}
      </CardBody>

      <ConfirmDialog
        open={confirm?.kind === "link"}
        onClose={() => setConfirm(null)}
        onConfirm={createLink}
        title="Create a new buyer link?"
        description="The link the buyer already has will stop working. Share the new one with them."
        confirmLabel="Create new link"
        tone="warning"
        loading={busy}
      />
      <ConfirmDialog
        open={confirm?.kind === "change"}
        onClose={() => setConfirm(null)}
        onConfirm={(note) => run(() => resolveB2bQuotationChange(id, confirm.changeId, confirm.status, note))}
        title={confirm?.status === "CLOSED" ? "Close this change request?" : "Mark this change request resolved?"}
        description="Add a short note on what was done. When no request is open, the buyer can accept the quotation again."
        confirmLabel={confirm?.status === "CLOSED" ? "Close request" : "Mark resolved"}
        tone="warning"
        requireReason
        loading={busy}
      />
    </Card>
  );
}
