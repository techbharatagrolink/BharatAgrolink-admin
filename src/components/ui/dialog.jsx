"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Field, Select, Textarea } from "./form";

function useModalBehaviour(open, onClose, panelRef) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusable = () => panelRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable()?.[0];
    (first || panelRef.current)?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
      if (event.key === "Tab") {
        const nodes = focusable();
        if (!nodes?.length) return;
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === firstNode) {
          event.preventDefault();
          lastNode.focus();
        } else if (!event.shiftKey && document.activeElement === lastNode) {
          event.preventDefault();
          firstNode.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose, panelRef]);
}

function Portal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function Dialog({ open, onClose, title, description, children, footer, size = "md" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useModalBehaviour(open, onClose, panelRef);
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn("relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-xl sm:rounded-2xl", widths[size])}
        >
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-base font-semibold text-ink">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog">
              <X className="size-4" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

export function Drawer({ open, onClose, title, description, children, footer, width = "max-w-xl" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useModalBehaviour(open, onClose, panelRef);
  if (!open) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn("absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-surface shadow-xl", width)}
        >
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-base font-semibold text-ink">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close panel">
              <X className="size-4" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
        </aside>
      </div>
    </Portal>
  );
}

/**
 * Confirmation for destructive or sensitive actions. `requireReason` forces an
 * audit reason (payouts, refunds, price and permission changes).
 */
/** `reasonOptions` (non-empty) turns the reason box into a pick list of predefined reasons, as the PHP reject dropdowns. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", tone = "danger", requireReason = false, reasonOptions, loading = false }) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const pick = Array.isArray(reasonOptions) && reasonOptions.length > 0;
  const invalid = requireReason && (pick ? !reason.trim() : reason.trim().length < 5);
  const close = () => {
    setReason("");
    setTouched(false);
    onClose?.();
  };
  return (
    <Dialog
      open={open}
      onClose={close}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={() => {
              setTouched(true);
              if (invalid) return;
              onConfirm?.(reason.trim());
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", tone === "danger" ? "bg-danger-bg text-danger-ink" : "bg-warning-bg text-warning-ink")}>
          <AlertTriangle className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          {description && <p className="text-sm text-ink-soft">{description}</p>}
          {requireReason && pick && (
            <Field label="Reject reason" required error={touched && invalid ? "Please select a reason." : null}>
              {({ id, invalid: bad, describedBy }) => (
                <Select id={id} value={reason} onChange={(e) => setReason(e.target.value)} aria-invalid={bad || undefined} aria-describedby={describedBy} options={reasonOptions} placeholder="Select Reject Reason" />
              )}
            </Field>
          )}
          {requireReason && !pick && (
            <Field label="Reason (saved in the audit log)" required error={touched && invalid ? "Please enter a reason of at least 5 characters." : null}>
              {({ id, invalid: bad, describedBy }) => (
                <Textarea id={id} value={reason} onChange={(e) => setReason(e.target.value)} aria-invalid={bad || undefined} aria-describedby={describedBy} rows={3} placeholder="Why is this change being made?" />
              )}
            </Field>
          )}
        </div>
      </div>
    </Dialog>
  );
}
