"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatNumber } from "@/lib/format";
import { b2bCatalogAction, vendorCatalogAction } from "@/lib/actions/admin/parity/seller";

const STOCK_LABEL = { in: "In Stock", low: "Low Stock", out: "Out of Stock" };

const COLUMNS = [
  { key: "id", label: "ID", type: "mono" },
  { key: "name", label: "Product Name", emphasis: true, sub: "tags", wrap: true, width: 280 },
  { key: "sku", label: "SKU", type: "mono" },
  { key: "category", label: "Category" },
  { key: "sellerLabel", label: "Seller", sub: "vendorId" },
  { key: "mrp", label: "MRP", type: "currency" },
  { key: "salePrice", label: "Sale Price", type: "currency" },
  { key: "purchasePrice", label: "Purchase Price", type: "currency" },
  { key: "gstPct", label: "GST %", type: "percent" },
  { key: "nrv", label: "NRV", type: "currency" },
  { key: "bsa", label: "BSA", type: "currency" },
  { key: "stockStatus", label: "Stock", type: "status", sub: "stockText" },
  { key: "state", label: "Status", type: "status", sub: "draftNote" },
  { key: "hsn", label: "HSN", type: "mono", hidden: true },
  { key: "technicalName", label: "Technical Name", hidden: true },
  { key: "createdAt", label: "Created", type: "date" },
];

function AttachPdfDialog({ target, onClose, onDone }) {
  const { notify } = useToast();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, startSaving] = useTransition();

  const submit = () => {
    const value = url.trim();
    if (!value) return setError("Catalog URL is required.");
    try {
      if (!/^https?:$/.test(new URL(value).protocol)) throw new Error();
    } catch {
      return setError("Enter a valid URL.");
    }
    setError("");
    startSaving(async () => {
      const r = await b2bCatalogAction("assign-url", target.ids, { url: value, title });
      notify({ message: r.message || (r.ok ? "Catalog attached." : "Failed to attach catalog."), tone: r.ok ? "success" : "error" });
      if (r.ok) onDone();
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title="Attach Catalog PDF"
      description={`Attach an already hosted PDF URL to ${formatNumber(target.ids.length)} selected product(s).`}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={saving}>
            Apply Catalog to Batch
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <ul className="max-h-32 overflow-y-auto rounded-lg border border-line px-3 py-2 text-[13px] text-ink-soft">
          {target.rows.map((r) => (
            <li key={r.id} className="truncate">
              {r.name} <span className="font-mono text-xs text-ink-muted">{r.sku}</span>
            </li>
          ))}
        </ul>
        <Field label="Direct Catalog PDF URL" required error={error}>
          {({ id, invalid }) => <Input id={id} type="url" value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={invalid || undefined} placeholder="https://.../catalog.pdf" maxLength={500} />}
        </Field>
        <Field label="Title" hint="Shown in the uploaded catalog history. Defaults to the file name.">
          {({ id, describedBy }) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} aria-describedby={describedBy} maxLength={255} />}
        </Field>
      </div>
    </Dialog>
  );
}

/** The "Vendor Catalogs" modal: a vendor's master catalog PDF and the recent uploaded catalogs. */
function VendorCatalogDialog({ sellers, onClose }) {
  const { notify } = useToast();
  const [vendorId, setVendorId] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, startLoading] = useTransition();

  const load = (id) => {
    setVendorId(id);
    setInfo(null);
    if (!id) return;
    startLoading(async () => {
      const r = await vendorCatalogAction(id);
      if (!r.ok) notify({ message: r.message, tone: "error" });
      else setInfo(r.data);
    });
  };

  return (
    <Dialog open onClose={onClose} title="Vendor Master Catalog" size="lg" footer={<Button onClick={onClose}>Close</Button>}>
      <div className="space-y-4">
        <Field label="Select Vendor / Seller">
          {({ id }) => <Select id={id} value={vendorId} onChange={(e) => load(e.target.value)} placeholder="-- Select a Vendor --" options={sellers} />}
        </Field>
        {loading && <p className="text-sm text-ink-muted">Loading…</p>}
        {info && (
          <>
            {info.vendor.pdf ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-success-ink/20 bg-success-bg px-3 py-2 text-sm text-success-ink">
                <span className="inline-flex items-center gap-2">
                  <FileText className="size-4" aria-hidden /> Vendor Master Catalog Attached — {info.vendor.name}
                </span>
                <a href={info.vendor.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium underline">
                  View Existing PDF <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            ) : (
              <p className="rounded-lg border border-line px-3 py-2 text-sm text-ink-muted">{info.vendor.name} has no master catalog PDF.</p>
            )}
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-soft">Recent catalogs</p>
              {info.recent.length ? (
                <ul className="divide-y divide-line rounded-lg border border-line text-[13px]">
                  {info.recent.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                      <span className="min-w-0">
                        <span className="font-medium text-ink">{c.title || c.fileName}</span>
                        <span className="ml-2 text-xs text-ink-muted">
                          {c.type} · {formatNumber(c.affected)} products · {formatDateTime(c.createdAt)}
                        </span>
                      </span>
                      {/^https?:\/\//i.test(c.url) && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                          Open <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">No catalogs uploaded yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

export function B2bCatalogTable({ data, options, canEdit, canDelete }) {
  const router = useRouter();
  const [attach, setAttach] = useState(null);
  const [vendorOpen, setVendorOpen] = useState(false);

  const rows = useMemo(
    () =>
      data.rows.map((r) => ({
        ...r,
        tags: [r.technicalName, r.variantCount > 0 ? `${r.variantCount} variants` : null, r.pdf ? "PDF attached" : null].filter(Boolean).join(" · "),
        sellerLabel: r.seller || "—",
        stockStatus: STOCK_LABEL[r.stockState],
        stockText: r.stockState === "out" ? "Out" : `${formatNumber(r.stock)} ${r.stockUnit || "pcs"}`,
        draftNote: r.draftEdits ? "Has unpublished draft changes" : "",
        hasPdf: Boolean(r.pdf),
      })),
    [data.rows],
  );

  const rowActions = [
    { id: "pdf", label: "Open catalog PDF", kind: "form", when: { field: "hasPdf", in: [true] } },
    ...(canDelete ? [{ id: "delete", label: "Delete product", tone: "danger", confirm: { title: "Delete this product?", description: "The product, its variants and category links are removed. This cannot be undone." } }] : []),
  ];
  const bulkActions = canEdit
    ? [
        { id: "assign-url", label: "Attach Catalog PDF", kind: "form" },
        { id: "clear-url", label: "Detach PDF", tone: "danger", confirm: { title: "Detach catalog PDF?", description: "The catalog PDF link is removed from the selected products." } },
      ]
    : [];

  const onCustomAction = (action, ids, selectedRows, clear) => {
    if (action.id === "pdf") {
      const pdf = selectedRows[0]?.pdf;
      if (pdf) window.open(pdf, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.id === "assign-url") setAttach({ ids, rows: selectedRows, clear });
  };

  return (
    <>
      <DataTable
        id="b2b-catalog"
        columns={COLUMNS}
        data={{ ...data, rows }}
        search="Search name, SKU, technical formulation or HSN..."
        filters={[
          { key: "category", label: "Category", options: options.categories },
          { key: "seller", label: "Seller", options: options.sellers },
          {
            key: "status",
            label: "Status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
              { value: "draft", label: "Drafts Only" },
            ],
          },
        ]}
        rowActions={rowActions}
        bulkActions={bulkActions}
        onAction={(actionId, ids) => b2bCatalogAction(actionId, ids)}
        onCustomAction={onCustomAction}
        toolbar={
          <Button size="sm" onClick={() => setVendorOpen(true)}>
            <FileText className="size-4" aria-hidden /> Vendor Catalogs
          </Button>
        }
        emptyTitle="No B2B products yet"
      />
      {attach && (
        <AttachPdfDialog
          target={attach}
          onClose={() => setAttach(null)}
          onDone={() => {
            attach.clear();
            setAttach(null);
            router.refresh();
          }}
        />
      )}
      {vendorOpen && <VendorCatalogDialog sellers={options.sellers} onClose={() => setVendorOpen(false)} />}
    </>
  );
}
