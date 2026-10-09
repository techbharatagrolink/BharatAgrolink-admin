"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { saveVendorKycAction } from "@/lib/actions/admin/vendors";

const FILES = [
  { key: "logo", name: "seller_logo", label: "Logo / Images 500x500 pixel" },
  { key: "pan", name: "pan_card", label: "Upload Pan card (max 5 MB)" },
  { key: "aadhaar", name: "aadhar_card", label: "Upload Aadhar Card (max 5 MB)" },
  { key: "gst", name: "business_proof", label: "Upload GST Reg. Certificate Proof (max 5 MB)" },
];

function Preview({ doc }) {
  if (!doc?.url) return <p className="mt-1.5 rounded-lg border border-dashed border-line px-2 py-8 text-center text-xs text-ink-muted">No file chosen</p>;
  return (
    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="mt-1.5 block overflow-hidden rounded-lg border border-line bg-surface-muted">
      <img src={doc.url} alt={doc.label} className="h-36 w-full object-contain" />
    </a>
  );
}

export function VendorKyc({ vendorId, documents = [], canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [docs, setDocs] = useState(documents);
  const [saving, startSaving] = useTransition();
  const byKey = new Map(docs.map((doc) => [doc.key, doc]));

  function save(event) {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    startSaving(async () => {
      const result = await saveVendorKycAction(vendorId, body);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        if (result.documents) setDocs(result.documents);
        event.target.reset();
        router.refresh();
      }
    });
  }

  return (
    <Card className="mb-4">
      <CardHeader title="KYC documents" description="Logo, PAN card, Aadhaar card and GST certificate uploaded for this seller." />
      <CardBody>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FILES.map((file) => (
            <div key={file.key} className="min-w-0">
              <p className="text-xs font-medium text-ink-muted">{file.label}</p>
              <Preview doc={byKey.get(file.key)} />
              {canEdit && (
                <Field label={file.label} hint="JPG, PNG or WebP." className="mt-2">
                  {({ id, describedBy }) => <Input id={id} type="file" name={file.name} accept="image/jpeg,image/png,image/webp" aria-describedby={describedBy} className="h-auto py-1.5" />}
                </Field>
              )}
            </div>
          ))}
          {canEdit && (
            <div className="sm:col-span-2 xl:col-span-4">
              <Button type="submit" loading={saving}>Save KYC documents</Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
