"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { deleteLeadImageAction, uploadLeadImageAction } from "@/lib/actions/admin/crm-sheet";

/** Lead drawer sections from crm_leads.php: WhatsApp history and image upload. */
export function LeadRecordPanels({ leadId, mobile, chat, attachments, canEdit }) {
  const messages = chat?.messages || [];
  const photos = Array.isArray(attachments) ? attachments : [];
  return (
    <>
      <Card>
        <CardHeader title="WhatsApp & AiSensy Chat History" description={mobile ? `Messages for ${mobile}` : "No mobile on this lead"} />
        <CardBody>
          {messages.length === 0 ? (
            <p className="text-sm text-ink-muted">No WhatsApp messages synced for this lead yet.</p>
          ) : (
            <ul className="max-h-96 space-y-2 overflow-y-auto">
              {messages.map((message) => (
                <li key={message.id} className={message.direction === "out" ? "ml-8 rounded-lg bg-emerald-50 px-3 py-2" : "mr-8 rounded-lg bg-surface-muted px-3 py-2"}>
                  <p className="text-sm whitespace-pre-wrap text-ink">{message.text}</p>
                  <p className="mt-1 text-[11px] text-ink-muted">{message.direction === "out" ? "Outbound" : "Inbound"} · {formatDateTime(message.at)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Photos & documents" description="JPG, PNG or WebP. Max 10 MB. A remark is required." />
        <CardBody className="space-y-4">
          {photos.length === 0 ? (
            <p className="text-sm text-ink-muted">No images on this lead yet.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {photos.map((photo) => (
                <Photo key={photo.id} leadId={leadId} photo={photo} canEdit={canEdit} />
              ))}
            </ul>
          )}
          {canEdit && <UploadForm leadId={leadId} />}
        </CardBody>
      </Card>
    </>
  );
}

function Photo({ leadId, photo, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, start] = useTransition();
  return (
    <li className="overflow-hidden rounded-lg border border-line">
      {photo.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt={photo.remark || photo.name || "Lead image"} className="h-40 w-full object-cover" />
      ) : null}
      <div className="space-y-1 p-3">
        <p className="text-sm text-ink">{photo.remark || photo.name}</p>
        <p className="text-[11px] text-ink-muted">{[photo.by, formatDateTime(photo.at)].filter(Boolean).join(" · ")}</p>
        {canEdit && (
          <Button size="sm" variant="secondary" loading={pending} onClick={() => start(async () => {
            const result = await deleteLeadImageAction(leadId, photo.id);
            notify({ message: result.message, tone: result.ok ? "success" : "error" });
            if (result.ok) router.refresh();
          })}>Remove</Button>
        )}
      </div>
    </li>
  );
}

function UploadForm({ leadId }) {
  const router = useRouter();
  const { notify } = useToast();
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState(null);
  const [pending, start] = useTransition();

  return (
    <form className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_auto]" onSubmit={(event) => {
      event.preventDefault();
      if (!file) {
        notify({ message: "Please choose an image to upload.", tone: "error" });
        return;
      }
      const body = new FormData();
      body.set("remark", remark);
      body.set("image", file);
      start(async () => {
        const result = await uploadLeadImageAction(leadId, body);
        notify({ message: result.message, tone: result.ok ? "success" : "error" });
        if (result.ok) {
          setRemark("");
          setFile(null);
          event.currentTarget.reset();
          router.refresh();
        }
      });
    }}>
      <Field label="Remark" required className="sm:col-span-2">
        {({ id }) => <Input id={id} value={remark} maxLength={1000} required placeholder="What does this image show?" onChange={(event) => setRemark(event.target.value)} />}
      </Field>
      <Input type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setFile(event.target.files?.[0] || null)} />
      <Button type="submit" variant="primary" loading={pending}>Upload image</Button>
    </form>
  );
}
