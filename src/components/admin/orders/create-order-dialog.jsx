"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { ManualOrderForm } from "./manual-order-form";

/**
 * "Create order" button for the All Orders list: opens the same create-order form used on
 * /admin/orders/new (ManualOrderForm — same fields, checks, payment and server actions) in a centred
 * popup over the list. The full page still exists and is linked from the popup.
 *
 * Safeguards: Escape / outside click while the form's own popups are open (e.g. "Add customer") only
 * closes that popup; closing a half-filled order asks first; after an order is created the list
 * refreshes so it shows up.
 */
export function CreateOrderButton({ label = "Create order", href = "/admin/orders/new", primary = true }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [createdId, setCreatedId] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const reset = () => {
    setDirty(false);
    setCreatedId("");
    setFormKey((k) => k + 1); // a fresh, empty form next time
  };
  const close = () => {
    setOpen(false);
    setConfirmDiscard(false);
    if (createdId) router.refresh(); // show the new order in the list
    reset();
  };
  const requestClose = () => {
    // Escape / backdrop also reach this panel while one of the form's own popups is open — let that close first.
    if (document.querySelectorAll('[role="dialog"][aria-modal="true"]').length > 1) return;
    if (dirty && !createdId) setConfirmDiscard(true);
    else close();
  };

  return (
    <>
      <Button size="sm" variant={primary ? "primary" : "secondary"} onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> {label}
      </Button>

      <Dialog open={open} onClose={requestClose} title="Create order" description="Search the customer, add products, then choose courier and payment." size="2xl">
        <div
          // Any typing or picking marks the order as started, so closing asks before throwing it away.
          onInput={() => !dirty && setDirty(true)}
          onChange={() => !dirty && setDirty(true)}
          // Following a link from the success screen (e.g. "Open this order") closes the panel.
          onClickCapture={(e) => {
            const a = e.target.closest?.("a[href]");
            if (a && a.target !== "_blank") close();
          }}
        >
          <p className="mb-4 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span>Need more room?</span>
            <Link href={href} className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
              Open the full page <ExternalLink className="size-3" aria-hidden />
            </Link>
          </p>
          <ManualOrderForm
            key={formKey}
            onCreated={(id) => setCreatedId(id)}
            onCreateAnother={() => {
              router.refresh();
              reset();
            }}
          />
        </div>
      </Dialog>

      <ConfirmDialog
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={close}
        title="Discard this order?"
        description="The details you entered in the create-order form will be lost."
        confirmLabel="Discard"
        tone="danger"
      />
    </>
  );
}
