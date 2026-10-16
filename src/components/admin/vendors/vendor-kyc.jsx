"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { saveVendorKycAction } from "@/lib/actions/admin/vendors";

const FILES = [
  {
    key: "logo",
    name: "seller_logo",
    label: "Logo / Images 500x500 pixel",
    accept: "image/jpeg,image/png,image/webp",
    hint: "JPG, PNG or WebP.",
  },
  {
    key: "pan",
    name: "pan_card",
    label: "Upload Pan card (max 5 MB)",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    hint: "JPG, PNG, WebP or PDF.",
  },
  {
    key: "aadhaar",
    name: "aadhar_card",
    label: "Upload Aadhar Card (max 5 MB)",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    hint: "JPG, PNG, WebP or PDF.",
  },
  {
    key: "gst",
    name: "business_proof",
    label: "Upload GST Reg. Certificate Proof (max 5 MB)",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    hint: "JPG, PNG, WebP or PDF.",
  },
];

function Preview({ doc }) {
  if (!doc?.url) {
    return (
      <p className="mt-1.5 rounded-lg border border-dashed border-line px-2 py-8 text-center text-xs text-ink-muted">
        No file chosen
      </p>
    );
  }

  const isPdf =
    typeof doc.url === "string" &&
    (/\.pdf($|\?)/i.test(doc.url) || (doc.key !== "logo" && doc.url.toLowerCase().includes("pdf")));

  if (isPdf) {
    return (
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-1.5 flex h-36 flex-col items-center justify-center rounded-lg border border-line bg-surface-muted p-3 text-center transition-colors hover:border-brand-500 hover:bg-surface-elevated"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 transition-transform group-hover:scale-105">
          <FileText className="size-5" />
        </div>
        <span className="mt-2 line-clamp-1 max-w-full text-xs font-semibold text-ink group-hover:text-brand-700">
          {doc.label} (PDF)
        </span>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 underline">
          View / Open PDF <ExternalLink className="size-3" />
        </span>
      </a>
    );
  }

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 block overflow-hidden rounded-lg border border-line bg-surface-muted"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={doc.url}
        alt={doc.label}
        className="h-36 w-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.innerHTML = `
              <div class="flex h-36 flex-col items-center justify-center p-3 text-center text-xs text-ink-muted">
                <span class="font-medium text-ink">Document Attached</span>
                <span class="mt-1 text-brand-700 underline font-medium">Click to open file</span>
              </div>
            `;
          }
        }}
      />
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
    const formElement = event.currentTarget;
    const body = new FormData(formElement);

    let hasFile = false;
    for (const name of ["seller_logo", "pan_card", "aadhar_card", "business_proof"]) {
      const file = body.get(name);
      if (file && typeof file === "object" && file.size > 0) {
        hasFile = true;
        break;
      }
    }

    if (!hasFile) {
      notify({
        message: "Please select at least one document or image file before saving.",
        tone: "error",
      });
      return;
    }

    startSaving(async () => {
      const result = await saveVendorKycAction(vendorId, body);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        if (result.documents) setDocs(result.documents);
        formElement.reset();
        router.refresh();
      }
    });
  }

  return (
    <Card className="mb-4">
      <CardHeader
        title="KYC documents"
        description="Logo, PAN card, Aadhaar card and GST certificate uploaded for this seller."
      />
      <CardBody>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FILES.map((file) => (
            <div key={file.key} className="min-w-0">
              <p className="text-xs font-medium text-ink-muted">{file.label}</p>
              <Preview doc={byKey.get(file.key)} />
              {canEdit && (
                <Field label={file.label} hint={file.hint} className="mt-2">
                  {({ id, describedBy }) => (
                    <Input
                      id={id}
                      type="file"
                      name={file.name}
                      accept={file.accept}
                      aria-describedby={describedBy}
                      className="h-auto py-1.5"
                    />
                  )}
                </Field>
              )}
            </div>
          ))}
          {canEdit && (
            <div className="sm:col-span-2 xl:col-span-4">
              <Button type="submit" loading={saving}>
                Save KYC documents
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
