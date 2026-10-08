"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { previewWhatsAppAction, sendWhatsAppAction } from "@/lib/actions/admin/parity/marketing";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
];

/** engagement_panel.php "Send WhatsApp Message": customer, phone, product, language, the template preview and send. */
export function WhatsAppDialog({ kind, row, canSend, onClose }) {
  const { notify } = useToast();
  const [language, setLanguage] = useState("en");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!row) return undefined;
    let live = true;
    previewWhatsAppAction(kind, row.id, language).then((result) => {
      if (!live) return;
      setPreview(result.ok ? result.data : null);
      setError(result.ok ? "" : result.message);
    });
    return () => {
      live = false;
    };
  }, [kind, row, language]);

  function close() {
    setPreview(null);
    setError("");
    setLanguage("en");
    onClose();
  }

  async function send() {
    setSending(true);
    const result = await sendWhatsAppAction(kind, row.id, language);
    setSending(false);
    if (!result.ok) return notify({ title: "Message not sent", message: result.message, tone: "error" });
    notify({ title: "Message sent", message: result.data?.message ?? "WhatsApp message sent.", tone: "success" });
    close();
  }

  const customer = preview?.customerName ?? row?.fullname ?? (row?.guest ? "Guest User" : "Registered User");
  const blocked = row?.guest ? "Cannot send WhatsApp to a guest user." : preview && !preview.canSend ? "This customer has no valid phone number." : "";

  return (
    <Dialog
      open={row != null}
      onClose={close}
      title={
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="size-4.5 text-[#25d366]" aria-hidden />
          Send WhatsApp Message
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={sending}>Cancel</Button>
          {canSend && (
            <Button variant="primary" onClick={send} loading={sending} disabled={Boolean(blocked) || !preview}>
              <MessageCircle className="size-4" aria-hidden />
              Send Message
            </Button>
          )}
        </>
      }
    >
      {row && (
        <div className="space-y-4">
          <dl className="grid gap-1.5 rounded-lg bg-surface-muted p-3 text-sm">
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-medium text-ink-muted">Customer:</dt><dd className="text-ink">{customer}</dd></div>
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-medium text-ink-muted">Phone:</dt><dd className="text-ink">{preview?.phone || (row.guest ? "N/A" : row.phone) || "-"}</dd></div>
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-medium text-ink-muted">Product:</dt><dd className="text-ink">{preview?.productName ?? row.productName ?? "-"}</dd></div>
          </dl>
          {blocked && <Notice tone="warning">{blocked}</Notice>}
          <Field label="Select Message Language">
            {({ id }) => <Select id={id} value={language} onChange={(e) => setLanguage(e.target.value)} options={LANGUAGES} />}
          </Field>
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-ink-soft">Message Preview</p>
            <div className="rounded-lg border border-[#25d366]/40 bg-[#dcf8c6]/40 p-3 text-sm whitespace-pre-wrap text-ink" aria-live="polite">
              {error ? <span className="text-danger-ink">{error}</span> : preview ? preview.message : <span className="text-ink-muted">Loading preview…</span>}
            </div>
          </div>
          {!canSend && <p className="text-xs text-ink-muted">You can preview this message but do not have permission to send it.</p>}
        </div>
      )}
    </Dialog>
  );
}
