"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, ExternalLink, FileText, Trash2, Upload, X } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import {
  deleteVendorLicenseDocumentAction,
  reviewVendorLicenseDocumentAction,
  reviewVendorSellerDocumentAction,
  uploadVendorLicenseDocumentAction,
  uploadVendorSellerDocumentAction,
} from "@/lib/actions/admin/vendors";

const BUSINESS_TYPES = {
  proprietorship: "Proprietorship",
  partnership: "Partnership Firm",
  llp: "Limited Liability Partnership (LLP)",
  "private-limited": "Private Limited Company",
  "public-limited": "Public Limited Company",
  other: "Other",
};
const SELLER_TYPES = { manufacturer: "Manufacturer", distributor: "Distributor", wholesaler: "Wholesaler", retailer: "Agri Retailer", brand: "Agri Brand", other: "Other" };
const CATEGORIES = { seeds: "Seeds", fertilizers: "Fertilizers", pesticides: "Pesticides", "bio-products": "Bio Products", "agri-machinery": "Agri Machinery", "tools-equipment": "Tools & Equipment", other: "Other" };
const KINDS = [
  { value: "license", label: "License" },
  { value: "certificate", label: "Certificate" },
  { value: "registration", label: "Registration" },
  { value: "authorization", label: "Authorization" },
  { value: "agreement", label: "Agreement" },
  { value: "other", label: "Other" },
];

/** Seller panel document status -> label (StatusBadge picks the tone from the label). */
const SELLER_DOC_STATUS = { verified: "Approved", "under-review": "Pending Verification", rejected: "Rejected", "not-uploaded": "Not Uploaded" };
const LICENSE_STATUS = { approved: "Approved", pending: "Pending Verification", rejected: "Rejected", expired: "Expired" };
const ACCEPT = "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";

function FileLink({ url, name }) {
  if (!url) return <span className="text-xs text-ink-muted">No file</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-xs font-medium text-brand-700 hover:underline">
      <FileText className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{name || "View file"}</span>
      <ExternalLink className="size-3 shrink-0" aria-hidden />
    </a>
  );
}

/**
 * Every document of a seller in one place: the seller panel's documents
 * (sellerlogin columns) and the licenses & extra documents, each with review
 * (approve / reject with a reason) and upload on the seller's behalf.
 */
export function VendorDocuments({ vendorId, businessType, sellerType, categories = [], sellerDocuments = [], licenseDocuments, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(null); // { kind: 'seller' | 'license', id, title }
  const [deleting, setDeleting] = useState(null); // { id, title }
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const [fileTarget, setFileTarget] = useState(null);

  function run(promise, after) {
    startTransition(async () => {
      const result = await promise();
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        after?.();
        router.refresh();
      }
    });
  }

  const approveSeller = (doc) => run(() => reviewVendorSellerDocumentAction(vendorId, doc.column, "approve"));
  const approveLicense = (upload) => run(() => reviewVendorLicenseDocumentAction(vendorId, upload.id, "approve"));

  // Takes the target as an argument: the React Compiler reads a callback's
  // dependencies during render, when `rejecting` is still null.
  function confirmReject(target, reason) {
    run(
      () => (target.kind === "seller" ? reviewVendorSellerDocumentAction(vendorId, target.column, "reject", reason) : reviewVendorLicenseDocumentAction(vendorId, target.id, "reject", reason)),
      () => setRejecting(null),
    );
  }

  function chooseSellerFile(doc) {
    setFileTarget(doc);
    fileInput.current?.click();
  }

  function uploadSellerFile(event) {
    const file = event.target.files?.[0];
    const docId = fileTarget?.id;
    event.target.value = "";
    if (!file || !docId) return;
    const body = new FormData();
    body.append("file", file, file.name);
    run(() => uploadVendorSellerDocumentAction(vendorId, docId, body));
  }

  const summary = licenseDocuments?.summary;
  const facts = [
    { label: "Business type", value: BUSINESS_TYPES[businessType] ?? "Not set" },
    { label: "Seller type", value: SELLER_TYPES[sellerType] ?? "Not set" },
    { label: "Categories", value: categories.length ? categories.map((c) => CATEGORIES[c] ?? c).join(", ") : "Not declared" },
  ];

  return (
    <Card className="mb-4">
      <CardHeader
        title="Seller documents & licenses"
        description="Documents the seller uploaded in the seller panel, plus business registration documents, regulatory licenses and other documents. None is required to approve the seller."
        actions={
          canEdit && licenseDocuments ? (
            <Button size="sm" variant="primary" onClick={() => setUploading(true)}>
              <Upload className="size-4" aria-hidden />
              Upload document
            </Button>
          ) : null
        }
      >
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
          {facts.map((fact) => (
            <span key={fact.label}>
              <span className="text-ink-muted">{fact.label}:</span> <span className="font-medium text-ink">{fact.value}</span>
            </span>
          ))}
        </div>
        {summary ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="neutral">{summary.uploaded} uploaded</Badge>
            {summary.pending ? <Badge tone="warning">{summary.pending} pending</Badge> : null}
            {summary.approved ? <Badge tone="success">{summary.approved} approved</Badge> : null}
            {summary.rejected ? <Badge tone="danger">{summary.rejected} rejected</Badge> : null}
            {summary.expired ? <Badge tone="danger">{summary.expired} expired</Badge> : null}
            {summary.expiringSoon ? <Badge tone="warning">{summary.expiringSoon} expiring soon</Badge> : null}
          </div>
        ) : null}
      </CardHeader>

      <CardBody className="space-y-6">
        <section aria-labelledby="seller-panel-docs">
          <h3 id="seller-panel-docs" className="text-[13px] font-semibold text-ink">
            Seller panel documents
          </h3>
          <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
            {sellerDocuments.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="text-sm font-medium text-ink">
                    {doc.title}
                    {doc.required ? <span className="ml-0.5 text-danger-ink" aria-hidden>*</span> : null}
                  </p>
                  <FileLink url={doc.file?.previewSrc} name={doc.file?.fileName} />
                  {doc.status === "rejected" && doc.reason ? <p className="mt-0.5 text-xs text-danger-ink">Reason: {doc.reason}</p> : null}
                </div>
                <StatusBadge status={SELLER_DOC_STATUS[doc.status] ?? doc.status} />
                {canEdit ? (
                  <div className="flex flex-wrap gap-1.5">
                    {doc.file && doc.column && doc.status !== "verified" ? (
                      <Button size="xs" variant="secondary" onClick={() => approveSeller(doc)} disabled={pending}>
                        <Check className="size-3.5" aria-hidden />
                        Approve
                      </Button>
                    ) : null}
                    {doc.file && doc.column && doc.status !== "rejected" ? (
                      <Button size="xs" variant="danger-outline" onClick={() => setRejecting({ kind: "seller", column: doc.column, title: doc.title })} disabled={pending}>
                        <X className="size-3.5" aria-hidden />
                        Reject
                      </Button>
                    ) : null}
                    <Button size="xs" variant="secondary" onClick={() => chooseSellerFile(doc)} disabled={pending}>
                      <Upload className="size-3.5" aria-hidden />
                      {doc.file ? "Replace" : "Upload"}
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <input ref={fileInput} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden onChange={uploadSellerFile} />
        </section>

        {licenseDocuments ? (
          licenseDocuments.groups.map((group) => (
            <section key={group.id} aria-labelledby={`license-group-${group.id}`}>
              <h3 id={`license-group-${group.id}`} className="text-[13px] font-semibold text-ink">
                {group.title}
              </h3>
              <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
                {group.documents.map((doc) => (
                  <li key={doc.type} className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-sm font-medium text-ink">{doc.title}</p>
                      {doc.applicable ? null : <Badge tone="neutral">No longer applies</Badge>}
                      {doc.matchedCategories.map((c) => (
                        <Badge key={c} tone="warning">
                          Sells {CATEGORIES[c] ?? c}
                        </Badge>
                      ))}
                      {doc.uploads.length ? null : <StatusBadge status="Not Uploaded" />}
                    </div>
                    {doc.uploads.length ? (
                      <ul className="mt-2 space-y-2">
                        {doc.uploads.map((upload) => (
                          <LicenseUpload
                            key={upload.id}
                            doc={doc}
                            upload={upload}
                            canEdit={canEdit}
                            busy={pending}
                            onApprove={() => approveLicense(upload)}
                            onReject={() => setRejecting({ kind: "license", id: upload.id, title: upload.name || doc.title })}
                            onDelete={() => setDeleting({ id: upload.id, title: upload.name || doc.title })}
                          />
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p className="flex items-center gap-2 text-sm text-warning-ink">
            <AlertTriangle className="size-4" aria-hidden />
            Licenses and extra documents are not available yet (run the API migration 2026-10-27-001-seller-license-documents.sql).
          </p>
        )}
      </CardBody>

      {rejecting ? (
        <ConfirmDialog
          open
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => confirmReject(rejecting, reason)}
          title={`Reject ${rejecting.title}?`}
          description="The seller sees this reason and can upload a corrected document."
          confirmLabel="Reject document"
          requireReason
          loading={pending}
        />
      ) : null}
      {deleting ? (
        <ConfirmDialog
          open
          onClose={() => setDeleting(null)}
          onConfirm={() => run(() => deleteVendorLicenseDocumentAction(vendorId, deleting.id), () => setDeleting(null))}
          title={`Delete ${deleting.title}?`}
          description="The file is removed from the seller's account. This cannot be undone."
          confirmLabel="Delete"
          loading={pending}
        />
      ) : null}
      {uploading && licenseDocuments ? (
        <UploadDialog vendorId={vendorId} groups={licenseDocuments.groups} onClose={() => setUploading(false)} onDone={() => router.refresh()} />
      ) : null}
    </Card>
  );
}

function LicenseUpload({ doc, upload, canEdit, busy, onApprove, onReject, onDelete }) {
  const details = [
    upload.name,
    upload.kind ? KINDS.find((k) => k.value === upload.kind)?.label : null,
    upload.number ? `${doc.number?.label ?? "No."} ${upload.number}` : null,
    upload.issuingAuthority,
    upload.issueDate ? `Issued ${formatDate(upload.issueDate)}` : null,
    upload.expiryDate ? `Expires ${formatDate(upload.expiryDate)}` : null,
  ].filter(Boolean);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md bg-surface-muted px-3 py-2">
      <div className="min-w-0 flex-1 basis-56">
        <FileLink url={upload.file.url} name={upload.file.fileName} />
        {details.length ? <p className="text-xs text-ink-soft">{details.join(" · ")}</p> : null}
        <p className="text-xs text-ink-muted">
          Uploaded {formatDate(upload.uploadedOn)} by {upload.uploadedBy === "admin" ? "admin" : "seller"}
          {upload.reviewedOn ? ` · reviewed ${formatDate(upload.reviewedOn)}` : ""}
        </p>
        {upload.remarks ? <p className="text-xs text-ink-soft">Remarks: {upload.remarks}</p> : null}
        {upload.status === "rejected" && upload.rejectionReason ? <p className="text-xs text-danger-ink">Reason: {upload.rejectionReason}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={LICENSE_STATUS[upload.status] ?? upload.status} />
        {upload.expiringSoon ? <StatusBadge status="Expiring Soon" /> : null}
      </div>
      {canEdit ? (
        <div className="flex flex-wrap gap-1.5">
          {upload.status !== "approved" && upload.status !== "expired" ? (
            <Button size="xs" variant="secondary" onClick={onApprove} disabled={busy}>
              <Check className="size-3.5" aria-hidden />
              Approve
            </Button>
          ) : null}
          {upload.status !== "rejected" ? (
            <Button size="xs" variant="danger-outline" onClick={onReject} disabled={busy}>
              <X className="size-3.5" aria-hidden />
              Reject
            </Button>
          ) : null}
          <Button size="xs" variant="ghost" onClick={onDelete} disabled={busy} aria-label={`Delete ${upload.name || doc.title}`}>
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
        </div>
      ) : null}
    </li>
  );
}

function UploadDialog({ vendorId, groups, onClose, onDone }) {
  const { notify } = useToast();
  const [saving, startSaving] = useTransition();
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const docs = groups.flatMap((group) => group.documents.map((doc) => ({ ...doc, groupTitle: group.title })));
  const doc = docs.find((d) => d.type === type);

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    if (!type) return setError("Choose a document type.");
    const file = form.get("file");
    if (!file || typeof file !== "object" || !file.size) return setError("Choose a file to upload.");
    startSaving(async () => {
      const result = await uploadVendorLicenseDocumentAction(vendorId, form);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      notify({ message: result.message, tone: "success" });
      onDone();
      onClose();
    });
  }

  return (
    <Dialog
      open
      onClose={saving ? () => {} : onClose}
      title="Upload document for this seller"
      description="It is saved as Pending Verification; approve it after checking."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="vendor-document-upload" variant="primary" loading={saving}>
            Upload
          </Button>
        </>
      }
    >
      <form id="vendor-document-upload" onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <Field label="Document" required className="sm:col-span-2">
          {({ id }) => (
            <Select id={id} name="docType" value={type} onChange={(e) => setType(e.target.value)} placeholder="Select document">
              {groups.map((group) => (
                <optgroup key={group.id} label={group.title}>
                  {group.documents.map((d) => (
                    <option key={d.type} value={d.type}>
                      {d.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          )}
        </Field>
        {doc?.needsName || doc?.multiple ? (
          <Field label={doc.needsName ? "Document name" : "Name / reference"} required={doc.needsName}>
            {({ id }) => <Input id={id} name="docName" maxLength={150} />}
          </Field>
        ) : null}
        {doc?.needsName ? (
          <Field label="Document type" required>
            {({ id }) => <Select id={id} name="docKind" options={KINDS} placeholder="Select type" />}
          </Field>
        ) : null}
        <Field label={doc?.number?.label ?? "Document / license number"} hint={doc?.number ? `e.g. ${doc.number.example}` : undefined}>
          {({ id, describedBy }) => <Input id={id} name="docNumber" maxLength={60} aria-describedby={describedBy} />}
        </Field>
        <Field label="Issuing authority">{({ id }) => <Input id={id} name="issuingAuthority" maxLength={150} />}</Field>
        <Field label="Issue date">{({ id }) => <Input id={id} name="issueDate" type="date" />}</Field>
        {doc?.expiry ? <Field label="Expiry date">{({ id }) => <Input id={id} name="expiryDate" type="date" />}</Field> : null}
        <Field label="Remarks" className="sm:col-span-2">
          {({ id }) => <Textarea id={id} name="remarks" rows={2} maxLength={500} />}
        </Field>
        <Field label="File (PDF, JPG or PNG, max 5 MB)" required className="sm:col-span-2">
          {({ id }) => <Input id={id} name="file" type="file" accept={ACCEPT} className="h-auto py-1.5" />}
        </Field>
        {error ? (
          <p role="alert" className="text-sm text-danger-ink sm:col-span-2">
            {error}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
