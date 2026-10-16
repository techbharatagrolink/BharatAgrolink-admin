"use client";

import { useRef } from "react";
import { CheckCircle2, Download, Printer, X, FileText, ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  agreementDetails,
  agreementMeta,
  agreementSections,
  formatLongDate,
  keySections,
  sectionHeading,
} from "@/lib/content/admin/seller-agreement";

function TableBlock({ head, rows }) {
  return (
    <div className="my-3 overflow-x-auto rounded border border-[#ddd8cc]">
      <table className="w-full border-collapse text-xs">
        {head ? (
          <thead>
            <tr>
              {head.map((cell, idx) => (
                <th key={idx} className="bg-[#1f3b57] px-3 py-2 text-left font-semibold text-white">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, index) => {
            const cells = Array.isArray(row) ? row : row.cells;
            return (
              <tr
                key={index}
                className={cn(
                  row.total ? "bg-[#e8eef4] font-bold text-[#152a3e]" : index % 2 ? "bg-[#f9f7f2]" : "bg-white"
                )}
              >
                {cells.map((cell, column) => (
                  <td
                    key={column}
                    className={cn(
                      "border-b border-[#ddd8cc] px-3 py-2 align-top text-ink-soft",
                      column === 0 && "font-medium text-[#1f3b57]"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlocks({ blocks }) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "sub":
        return (
          <h5 key={index} className="mt-4 mb-1.5 flex items-baseline gap-2 font-semibold text-[#8a6d1d]">
            <span className="shrink-0 rounded border border-[#ddd8cc] bg-[#f3f0e7] px-1.5 text-xs font-bold text-[#1f3b57]">
              {block.number}
            </span>
            {block.title}
          </h5>
        );
      case "heading":
        return (
          <p key={index} className="mt-2 text-xs font-bold text-[#8a6d1d]">
            {block.text}
          </p>
        );
      case "list":
        return (
          <ul key={index} className="my-2 flex list-disc flex-col gap-1 pl-5 text-sm text-ink-soft marker:text-[#1a7d3f]">
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      case "table":
        return <TableBlock key={index} head={block.head} rows={block.rows} />;
      case "callout":
        return (
          <div
            key={index}
            className={cn(
              "my-3 flex flex-col gap-2 rounded-lg border border-l-4 border-[#ddd8cc] p-4 text-sm",
              block.tone === "key" ? "border-l-[#1f3b57] bg-[#f3f0e7]" : "border-l-[#8a6d1d] bg-amber-50/40"
            )}
          >
            {block.title ? <p className="font-bold text-[#1f3b57]">{block.title}</p> : null}
            <SectionBlocks blocks={block.blocks} />
          </div>
        );
      default:
        return (
          <p
            key={index}
            className={cn(
              "my-2 text-sm leading-relaxed text-ink-soft",
              block.tone === "note" && "text-xs text-ink-muted",
              block.tone === "em" && "italic text-[#1f3b57]",
              block.tone === "strong" && "mt-3 border-t border-[#ddd8cc] pt-3 font-semibold text-[#172033]"
            )}
          >
            {block.text}
          </p>
        );
    }
  });
}

export function AgreementDocumentModal({ seller, open, onClose }) {
  const contentRef = useRef(null);
  if (!seller) return null;

  const isAccepted = seller.status === "Accepted";
  const acceptance = isAccepted
    ? {
        name: seller.signatory,
        designation: seller.designation,
        acceptedAt: seller.acceptedAt,
        ipAddress: seller.ipAddress,
      }
    : null;

  const details = agreementDetails(
    {
      vendorName: seller.vendorName,
      vendorId: seller.vendorId,
      companyName: seller.vendorName,
      sellerName: seller.signatory,
      address: seller.address,
      gstin: seller.gstin,
      signatory: seller.signatory,
      designation: seller.designation,
      phone: seller.phone,
      email: seller.email,
      ipAddress: seller.ipAddress,
    },
    acceptance
  );

  const handlePrint = () => {
    if (!contentRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${agreementMeta.title} - ${seller.vendorName || seller.vendorId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #172033; line-height: 1.5; font-size: 13px; }
            h1, h2, h3, h4, h5 { color: #1f3b57; }
            table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
            th, td { border: 1px solid #ddd8cc; padding: 6px 10px; text-align: left; }
            th { background: #1f3b57; color: white; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; }
            .badge-accepted { background: #effaf2; color: #156634; border: 1px solid #c3e6cb; }
            .badge-pending { background: #fff8e6; color: #8a6d1d; border: 1px solid #ffeeba; }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const jumpToSection = (sectionId) => {
    const el = document.getElementById(`modal-sec-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="wide"
      title={
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="size-5 text-brand-600" />
          <span>Seller SLA & Business Agreement</span>
          <StatusBadge status={isAccepted ? "delivered" : "pending"} dot>
            {isAccepted ? "Accepted (v2.0)" : "Pending Acceptance"}
          </StatusBadge>
        </div>
      }
      description={`Vendor: ${seller.vendorName} (${seller.vendorId})`}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Quick Jump:</span>
            <select
              aria-label="Jump to agreement section"
              className="rounded border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft focus:ring-1 focus:ring-brand-500 focus:outline-none"
              onChange={(e) => e.target.value && jumpToSection(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select Key Section...
              </option>
              {keySections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.key}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              <Printer className="mr-1.5 size-4" />
              Print / Save PDF
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl py-2">
        {/* Printable Paper Document Container */}
        <div
          ref={contentRef}
          className="rounded-xl border border-[#ddd8cc] bg-[#faf8f5] p-6 shadow-sm sm:p-10"
        >
          {/* Document Header */}
          <div className="border-b border-[#ddd8cc] pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8a6d1d] uppercase">
                  Bharat AgroLink Marketplace
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1f3b57]">
                  Seller SLA & Business Agreement
                </h1>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Agrolink Manufacturing Private Limited • Version {agreementMeta.version}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    isAccepted
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  )}
                >
                  {isAccepted ? <CheckCircle2 className="size-3.5" /> : null}
                  {isAccepted ? "Accepted by Seller" : "Pending Acceptance"}
                </span>
                {isAccepted && seller.acceptedAt && (
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Accepted on {formatDateTime(seller.acceptedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-white/70 p-3 text-xs sm:grid-cols-4 border border-[#eee8dc]">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase tracking-wide">Version</span>
                <span className="font-semibold text-ink">{agreementMeta.version}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase tracking-wide">Effective Date</span>
                <span className="font-semibold text-ink">14 October 2026</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase tracking-wide">Vendor ID</span>
                <span className="font-mono font-semibold text-ink">{seller.vendorId}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase tracking-wide">Acceptance IP</span>
                <span className="font-mono text-ink">{seller.ipAddress || "—"}</span>
              </div>
            </div>
          </div>

          {/* Parties to the Agreement */}
          <div className="my-6 rounded-lg border border-[#e5dfd3] bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#1f3b57] uppercase tracking-wide">
              Parties to the Agreement
            </h3>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              This Seller SLA & Business Agreement (&quot;Agreement&quot;) is executed between:
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-[#e8e4dc] bg-[#fbf9f6] p-3 text-xs">
                <span className="font-bold text-[#1f3b57] block mb-1">Party 1: The Platform</span>
                <p className="font-semibold text-ink">{agreementMeta.platform}</p>
                <p className="text-ink-muted mt-0.5">Corporate Office: Bhopal, Madhya Pradesh</p>
                <p className="text-ink-muted">Website: www.bharatagrolink.com</p>
              </div>

              <div className="rounded border border-[#e8e4dc] bg-[#fbf9f6] p-3 text-xs">
                <span className="font-bold text-[#1f3b57] block mb-1">Party 2: The Seller</span>
                <p className="font-semibold text-ink">{seller.vendorName || seller.vendorId}</p>
                <p className="text-ink-muted mt-0.5">
                  <span className="font-medium text-ink">Address:</span>{" "}
                  {seller.address || "As registered in seller profile"}
                </p>
                <p className="text-ink-muted mt-0.5">
                  <span className="font-medium text-ink">GST Number:</span>{" "}
                  <span className="font-mono">{seller.gstin || "—"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Sections */}
          <div className="space-y-6">
            {agreementSections
              .filter((sec) => sec.id !== "parties" && sec.id !== "signatures")
              .map((section) => (
                <div
                  key={section.id}
                  id={`modal-sec-${section.id}`}
                  className="border-b border-[#eee8dc] pb-5 last:border-0"
                >
                  <h4 className="text-base font-bold text-[#1f3b57]">
                    {sectionHeading(section)}
                  </h4>
                  <SectionBlocks blocks={section.blocks} />
                </div>
              ))}
          </div>

          {/* Signatures & Execution Block */}
          <div className="mt-8 rounded-xl border-2 border-[#1f3b57]/20 bg-white p-6 shadow-sm">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-[#1f3b57]">
              Seller Details & Signatures
            </h3>
            <p className="mt-1 text-center text-xs text-ink-muted">
              Executed electronically via Bharat AgroLink Seller Onboarding & SLA Verification System
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* Platform Signature */}
              <div className="rounded-lg border border-line bg-surface-muted p-4 text-xs">
                <div className="flex items-center justify-between border-b border-line pb-2 font-semibold text-[#1f3b57]">
                  <span>For Bharat Agrolink</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    Verified
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-ink-soft">
                  <p>
                    <span className="font-medium text-ink">Signatory:</span> Authorized Representative
                  </p>
                  <p>
                    <span className="font-medium text-ink">Entity:</span> Agrolink Manufacturing Pvt. Ltd.
                  </p>
                  <p>
                    <span className="font-medium text-ink">Effective Date:</span> 14 October 2026
                  </p>
                  <p className="text-[11px] text-ink-muted italic pt-2">
                    System-certified platform digital endorsement
                  </p>
                </div>
              </div>

              {/* Seller Signature */}
              <div
                className={cn(
                  "rounded-lg border p-4 text-xs",
                  isAccepted
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-amber-300 bg-amber-50/50"
                )}
              >
                <div className="flex items-center justify-between border-b border-line pb-2 font-semibold">
                  <span className="text-[#1f3b57]">For {seller.vendorName}</span>
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[11px] font-bold",
                      isAccepted
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    )}
                  >
                    {isAccepted ? "Digitally Signed" : "Pending Sign"}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-ink-soft">
                  <p>
                    <span className="font-medium text-ink">Signatory Name:</span>{" "}
                    {seller.signatory || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-ink">Designation:</span>{" "}
                    {seller.designation || "Authorized Signatory"}
                  </p>
                  <p>
                    <span className="font-medium text-ink">Date & Time:</span>{" "}
                    {seller.acceptedAt ? formatDateTime(seller.acceptedAt) : "Not yet accepted"}
                  </p>
                  <p>
                    <span className="font-medium text-ink">IP Address:</span>{" "}
                    <span className="font-mono">{seller.ipAddress || "—"}</span>
                  </p>
                  <p>
                    <span className="font-medium text-ink">Vendor Code:</span>{" "}
                    <span className="font-mono">{seller.vendorId}</span>
                  </p>
                </div>
              </div>
            </div>

            {isAccepted && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>
                  The seller has digitally reviewed and agreed to all terms of Seller SLA Version{" "}
                  {seller.version || agreementMeta.version}.
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-[#ddd8cc] pt-4 text-center text-[11px] text-ink-muted">
            {agreementMeta.footer}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

