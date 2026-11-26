import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getProcurementOptions, getSupplierRfq } from "@/lib/services/admin/b2b-screens";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { ActivateRates, InviteSuppliers, MapResponseLine, ReviewResponse, SupplierRfqMove } from "@/components/admin/b2b/procurement-actions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Supplier RFQ ${id}` };
}

const RFQ_TONE = { open: "info", closed: "neutral", cancelled: "danger", draft: "neutral" };
const RESP_TONE = { submitted: "warning", verified: "info", activated: "success", rejected: "danger", superseded: "neutral" };
const TERM = {
  ex_factory: "Ex-factory",
  for_destination: "FOR destination",
  other: "Other",
  excluded: "GST extra",
  included: "GST included",
  extra: "Freight extra",
  free_above: "Freight free above",
  advance: "Full advance",
  partial: "Partial advance",
  against_dispatch: "Against dispatch",
  credit: "Credit",
  custom: "Custom",
  supplier: "Supplier",
  platform: "Bharat Agrolink",
  buyer: "Buyer",
};
const t = (v) => TERM[v] ?? v ?? "—";

function ResponseCard({ rfq, supplier, r, options, latest }) {
  const reviewer = rfq.actions.review;
  const cost = rfq.canViewCost;
  const editable = reviewer && ["submitted", "verified"].includes(r.status);
  return (
    <Card className={latest ? "" : "opacity-80"}>
      <CardHeader
        title={`${supplier.seller} · version ${r.version}`}
        description={`${r.source === "seller_panel" ? "Submitted in the seller panel" : "Typed in by staff"} · ${formatDateTime(r.submittedAt)} · valid until ${r.commercial.validUntil ? formatDate(r.commercial.validUntil) : "—"}${r.commercial.expired ? " (expired)" : ""}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={RESP_TONE[r.status] ?? "neutral"}>{r.statusLabel}</Badge>
            {reviewer && r.status === "submitted" && <ReviewResponse rfqId={rfq.id} responseId={r.id} checks={options.reviewChecks} />}
            {reviewer && r.status === "verified" && <ActivateRates rfqId={rfq.id} responseId={r.id} validUntil={r.commercial.validUntil ? formatDate(r.commercial.validUntil) : ""} />}
          </div>
        }
      />
      <CardBody className="space-y-4">
        <DescriptionList
          columns={3}
          items={[
            { label: "Supplier", value: `${r.supplier.legalName}${r.supplier.gstin ? ` · ${r.supplier.gstin}` : ""}` },
            { label: "Contact", value: [r.supplier.contactName, r.supplier.contactMobile].filter(Boolean).join(" · ") || "—" },
            { label: "Evidence", value: r.evidenceUrl ? <a href={r.evidenceUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Signed form</a> : "—" },
            { label: "Price basis", value: `${t(r.commercial.priceBasis)} · ${t(r.commercial.gstTreatment)}` },
            { label: "Freight", value: `${t(r.commercial.freightTerms)}${r.commercial.freightFreeAbove ? ` ${formatINR(r.commercial.freightFreeAbove)}` : ""}${r.commercial.loadingCharge ? ` · loading ${formatINR(r.commercial.loadingCharge)}` : ""}` },
            { label: "Payment", value: `${t(r.payment.terms)}${r.payment.advancePct ? ` ${r.payment.advancePct}%` : ""}${r.payment.creditDays ? ` ${r.payment.creditDays} days` : ""}${r.payment.conditions ? ` · ${r.payment.conditions}` : ""}` },
            { label: "Dispatch", value: `${r.dispatch.dispatchDays != null ? `${r.dispatch.dispatchDays} days` : "—"}${r.dispatch.pickupSlaHours != null ? ` · pickup ready in ${r.dispatch.pickupSlaHours} h` : ""} · ${r.dispatch.location || "—"} ${r.dispatch.pickupPincode}` },
            { label: "Documents", value: [r.dispatch.taxInvoice && "tax invoice", r.dispatch.packingList && "packing list", r.dispatch.batchDetails && "batch details"].filter(Boolean).join(", ") || "—" },
            { label: "Packaging / loading / transit risk", value: `${t(r.dispatch.packagingOwner)} / ${t(r.dispatch.loadingOwner)} / ${t(r.dispatch.transitRiskOwner)}` },
            { label: "Declared by", value: `${r.declaration.name}${r.declaration.designation ? `, ${r.declaration.designation}` : ""} · no volume guarantee accepted` },
            r.declaration.bestOfferNote && { label: "Best offer", value: r.declaration.bestOfferNote },
            r.review && { label: "Review", value: `${formatDateTime(r.review.at)}${r.review.note ? ` · ${r.review.note}` : ""}` },
          ]}
        />
        {r.items.map((it) => {
          const line = rfq.items.find((x) => x.id === it.rfqItemId);
          return (
            <section key={it.id} className="rounded-lg border border-line">
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2 text-sm">
                <span className="font-medium text-ink">{line?.name ?? `Line ${it.rfqItemId}`}</span>
                <span className="flex items-center gap-2 text-xs text-ink-muted">
                  {it.listing ? `Listing: ${it.listing.name} (${it.listingUnitsPerCommercialUnit} per ${it.commercialUnit})` : <span className="text-warning-ink">Not mapped to a listing</span>}
                  {editable && <MapResponseLine rfqId={rfq.id} responseId={r.id} item={it} sellerId={supplier.sellerId} />}
                </span>
              </header>
              <div className="grid gap-3 px-3 py-2 text-xs text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
                <span>Pack {it.packSize || "—"} · {it.unitsPerOuterCase ?? "—"} per outer case · MOQ {it.moqUnits} {it.commercialUnit}</span>
                <span>Available {it.atsQty ?? "—"} · batch {it.batchNo || "—"} · expiry {it.expiryDate || "—"}{it.minShelfLifeMonths != null ? ` · min. ${it.minShelfLifeMonths} months life` : ""}</span>
                <span>MRP {it.mrp != null ? formatINR(it.mrp) : "—"}{cost && it.tradeRate != null ? ` · trade ${formatINR(it.tradeRate)}` : ""}{cost && it.institutionalRate != null ? ` · institutional ${formatINR(it.institutionalRate)}` : ""}{it.licenseRef ? ` · licence ${it.licenseRef}` : ""}</span>
                <span>Gross {it.weights.grossKg ?? "—"} kg · case {it.weights.outerCaseGrossKg ?? "—"} kg · {it.weights.outerCm.every((d) => d) ? `${it.weights.outerCm.join("×")} cm` : "no dims"} · volumetric {it.weights.volumetricKg ?? "—"} kg</span>
              </div>
              <div className="overflow-x-auto px-3 pb-3">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-ink-muted">
                    <tr className="border-b border-line">
                      <th className="py-1 pr-3">Slab</th>
                      <th className="py-1 pr-3">Pack configuration</th>
                      {cost && <th className="py-1 pr-3 text-right">Quoted rate</th>}
                      {cost && <th className="py-1 pr-3 text-right">Cost / listing unit ex-GST</th>}
                      <th className="py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {it.slabs.map((s, k) => (
                      <tr key={s.id} className="border-b border-line last:border-0">
                        <td className="py-1 pr-3">{s.minQty}{k > 0 && s.minQty >= 25 ? "+" : ""} {it.commercialUnit}</td>
                        <td className="py-1 pr-3">{s.packConfig || "—"}</td>
                        {cost && <td className="py-1 pr-3 text-right tabular-nums">{formatINR(s.rate)}</td>}
                        {cost && <td className="py-1 pr-3 text-right tabular-nums">{s.rateExGst != null ? formatINR(s.rateExGst) : "at activation"}</td>}
                        <td className="py-1"><Badge tone={s.status === "active" ? "success" : s.status === "proposed" ? "neutral" : "danger"}>{s.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </CardBody>
    </Card>
  );
}

/** Supplier procurement RFQ detail (task #107 subtask 4 part 2; spec C1 / C9). */
export default async function SupplierRfqPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("b2b.rfqs");
  if (!allowed) return (<><PageHeader title="Supplier RFQ" /><PermissionDenied module="procurement RFQs" /></>);
  const result = await Promise.all([getSupplierRfq(id, user), getProcurementOptions(user)]).then(([rfq, options]) => ({ rfq, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Supplier RFQ" /><ApiUnavailable error={result.error} what="the supplier RFQ" /></>);
  if (!result.rfq) notFound();
  const { rfq, options } = result;
  const a = rfq.actions;

  return (
    <>
      <PageHeader
        title={`${rfq.number} · ${rfq.title}`}
        description={[rfq.manufacturer, rfq.brand, rfq.supplyState, rfq.dispatchLocation, rfq.pickupPincode].filter(Boolean).join(" · ")}
        meta={<Badge tone={RFQ_TONE[rfq.status] ?? "neutral"}>{rfq.statusLabel}</Badge>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {a.open && <SupplierRfqMove rfqId={rfq.id} action="open" />}
            {a.invite && <InviteSuppliers rfqId={rfq.id} invited={rfq.invites.map((v) => v.sellerId)} />}
            {a.recordResponse && rfq.invites.length > 0 && <ButtonLink href={`/admin/b2b/procurement/${rfq.id}/response`} size="sm" variant="primary">Record response</ButtonLink>}
            {a.close && <SupplierRfqMove rfqId={rfq.id} action="close" />}
            {a.cancel && <SupplierRfqMove rfqId={rfq.id} action="cancel" />}
            <ButtonLink href="/admin/b2b/procurement" size="sm">All</ButtonLink>
          </div>
        }
      />
      {!rfq.canViewCost && <Notice tone="info" className="mb-4">Supplier rates are visible to managers only.</Notice>}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="SKU lines" />
            <MiniTable
              columns={[
                { key: "name", label: "Product", render: (it) => <span className="block max-w-96">{it.name}{it.notes && <span className="block text-xs text-ink-muted">{it.notes}</span>}</span> },
                { key: "packSize", label: "Pack", render: (it) => it.packSize || "—" },
                { key: "commercialUnit", label: "Unit" },
                { key: "requiredLicense", label: "Licence needed", render: (it) => it.requiredLicense || "—" },
              ]}
              rows={rfq.items}
            />
          </Card>
          <Card>
            <CardHeader title="Suppliers" description="Invited suppliers answer in their B2B panel; a signed paper / PDF form can be typed in with Record response." />
            <MiniTable
              columns={[
                { key: "seller", label: "Supplier" },
                { key: "status", label: "Status" },
                { key: "invitedAt", label: "Invited", render: (v) => formatDateTime(v.invitedAt) },
                { key: "respondedAt", label: "Last response", render: (v) => (v.respondedAt ? formatDateTime(v.respondedAt) : "—") },
                ...(a.recordResponse ? [{ key: "sellerId", label: "", align: "right", render: (v) => <ButtonLink href={`/admin/b2b/procurement/${rfq.id}/response?seller=${v.sellerId}`} size="xs">Record response</ButtonLink> }] : []),
              ]}
              rows={rfq.invites.map((v) => ({ ...v, id: v.sellerId }))}
              empty="No supplier invited yet."
            />
          </Card>
          {rfq.suppliers.map((s) => s.responses.map((r, i) => <ResponseCard key={r.id} rfq={rfq} supplier={s} r={r} options={options} latest={i === 0} />))}
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Respond by", value: rfq.responseDueAt ? formatDate(rfq.responseDueAt) : "—" },
                  { label: "Created", value: formatDateTime(rfq.createdAt) },
                  { label: "Internal notes", value: rfq.notes || "—" },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Timeline" />
            <CardBody>
              <Timeline items={rfq.timeline.map((x) => ({ id: x.id, title: x.description || x.action, meta: `${x.by} · ${formatDateTime(x.at)}` }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
