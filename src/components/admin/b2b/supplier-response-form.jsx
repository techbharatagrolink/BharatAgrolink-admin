"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { recordB2bSupplierResponse, searchB2bProcurementListings } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

/*
 * Staff entry of a supplier's response from their signed commercial RFQ form (task #107 subtask 4 part 2;
 * spec C1). Every field of the supplier form: offer header, commercial, payment, direct dispatch,
 * declaration; per line pack, logistics, freshness and slabs 1/5/10/25+/50+/100+. A link to the signed
 * form is mandatory. Saving makes a new version; it is reviewed before its rates are used.
 */

const LABEL = {
  ex_factory: "Ex-factory",
  for_destination: "FOR destination",
  other: "Other",
  excluded: "GST extra (excluded)",
  included: "GST included",
  extra: "Freight extra",
  free_above: "Free above an order value",
  advance: "Full advance",
  partial: "Partial advance",
  against_dispatch: "Against dispatch",
  credit: "Credit",
  custom: "Custom",
  supplier: "Supplier",
  platform: "Bharat Agrolink",
  buyer: "Buyer",
};
const opts = (list) => list.map((v) => ({ value: v, label: LABEL[v] ?? v }));
const n = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

function lineState(item) {
  return {
    rfqItemId: item.id,
    listing: null,
    listingUnitsPerCommercialUnit: "1",
    commercialUnit: item.commercialUnit,
    packSize: item.packSize || "",
    unitsPerOuterCase: "",
    moqUnits: "1",
    atsQty: "",
    batchNo: "",
    expiryDate: "",
    minShelfLifeMonths: "",
    licenseRef: "",
    mrp: "",
    tradeRate: "",
    institutionalRate: "",
    maxDiscountPct: "",
    netKgPerUnit: "",
    packagingKgPerUnit: "",
    grossKgPerUnit: "",
    outerCaseGrossKg: "",
    outerLCm: "",
    outerWCm: "",
    outerHCm: "",
    slabs: {},
    skip: false,
  };
}

function ListingPicker({ sellerId, value, onChange }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const search = (q) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => setRows((await searchB2bProcurementListings(sellerId, q)).listings || []), 250);
  };
  if (!sellerId) return <p className="text-xs text-ink-muted">Choose the supplier first.</p>;
  return (
    <div className="space-y-1">
      <p className="text-sm text-ink">{value ? value.name : "Not mapped (can be mapped at review)"}</p>
      <Input
        placeholder="Search the supplier's B2B listings"
        onFocus={() => {
          setOpen(true);
          search("");
        }}
        onChange={(e) => search(e.target.value)}
      />
      {open && rows.length > 0 && (
        <ul className="max-h-48 overflow-auto rounded-lg border border-line bg-surface">
          {rows.map((l) => (
            <li key={`${l.type}-${l.id}`}>
              <button
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-muted"
                onClick={() => {
                  onChange(l);
                  setOpen(false);
                }}
              >
                {l.name} <span className="text-xs text-ink-muted">· {l.sku} · per {l.unit}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SupplierResponseForm({ rfq, options, sellerId: presetSeller }) {
  const router = useRouter();
  const [saving, start] = useTransition();
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [h, setH] = useState({
    sellerId: presetSeller ? String(presetSeller) : "",
    evidenceUrl: "",
    supplierLegalName: "",
    supplierGstin: "",
    contactName: "",
    contactMobile: "",
    dispatchLocation: rfq.dispatchLocation || "",
    pickupPincode: rfq.pickupPincode || "",
    priceBasis: "ex_factory",
    gstTreatment: "excluded",
    freightTerms: "extra",
    freightFreeAbove: "",
    loadingCharge: "",
    validUntil: "",
    dispatchDays: "",
    paymentTerms: "advance",
    advancePct: "",
    creditDays: "",
    proposedCreditLimit: "",
    paymentConditions: "",
    pickupSlaHours: "",
    packagingOwner: "",
    loadingOwner: "",
    transitRiskOwner: "",
    taxInvoice: true,
    packingList: true,
    batchDetails: true,
    dispatchAvailability: "",
    dispatchConditions: "",
    bestOfferNote: "",
    platformFeeNote: "",
    noVolumeGuaranteeAck: false,
    declaredByName: "",
    declaredByDesignation: "",
  });
  const [lines, setLines] = useState(rfq.items.map(lineState));
  const set = (k) => (e) => setH((c) => ({ ...c, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const upd = (i, patch) => setLines((cur) => cur.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const setSlab = (i, step, key, v) => setLines((cur) => cur.map((l, j) => (j === i ? { ...l, slabs: { ...l.slabs, [step]: { ...l.slabs[step], [key]: v } } } : l)));

  function submit(e) {
    e.preventDefault();
    setError("");
    setDetails([]);
    const body = {
      ...h,
      sellerId: Number(h.sellerId) || undefined,
      freightFreeAbove: n(h.freightFreeAbove),
      loadingCharge: n(h.loadingCharge),
      dispatchDays: n(h.dispatchDays),
      advancePct: n(h.advancePct),
      creditDays: n(h.creditDays),
      proposedCreditLimit: n(h.proposedCreditLimit),
      pickupSlaHours: n(h.pickupSlaHours),
      packagingOwner: h.packagingOwner || null,
      loadingOwner: h.loadingOwner || null,
      transitRiskOwner: h.transitRiskOwner || null,
      items: lines
        .filter((l) => !l.skip)
        .map((l) => ({
          rfqItemId: l.rfqItemId,
          listingType: l.listing?.type ?? null,
          listingId: l.listing?.id ?? null,
          listingUnitsPerCommercialUnit: Number(l.listingUnitsPerCommercialUnit) || 1,
          commercialUnit: l.commercialUnit,
          packSize: l.packSize,
          unitsPerOuterCase: n(l.unitsPerOuterCase),
          moqUnits: Number(l.moqUnits) || 1,
          atsQty: n(l.atsQty),
          batchNo: l.batchNo,
          expiryDate: l.expiryDate,
          minShelfLifeMonths: n(l.minShelfLifeMonths),
          licenseRef: l.licenseRef,
          mrp: n(l.mrp),
          tradeRate: n(l.tradeRate),
          institutionalRate: n(l.institutionalRate),
          maxDiscountPct: n(l.maxDiscountPct),
          netKgPerUnit: n(l.netKgPerUnit),
          packagingKgPerUnit: n(l.packagingKgPerUnit),
          grossKgPerUnit: n(l.grossKgPerUnit),
          outerCaseGrossKg: n(l.outerCaseGrossKg),
          outerLCm: n(l.outerLCm),
          outerWCm: n(l.outerWCm),
          outerHCm: n(l.outerHCm),
          slabs: options.slabSteps
            .filter((step) => Number(l.slabs[step]?.rate) > 0)
            .map((step) => ({ minQty: step, rate: Number(l.slabs[step].rate), packConfig: l.slabs[step]?.packConfig || "" })),
        })),
    };
    start(async () => {
      const res = await recordB2bSupplierResponse(rfq.id, body);
      if (!res.ok) {
        setError(res.message || "Could not save.");
        setDetails(res.details || []);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(`/admin/b2b/procurement/${rfq.id}`);
      router.refresh();
    });
  }

  const num = (label, value, onChange, props = {}) => (
    <Field label={label} className={props.className}>
      <Input type="number" min="0" step={props.step ?? "0.01"} value={value} onChange={onChange} />
    </Field>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger-ink" role="alert">
          <p>{error}</p>
          {details.length > 1 && <ul className="mt-1 list-disc pl-5">{details.map((d) => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}
      <Notice tone="info">Type exactly what the supplier quoted. Rates are used only after a manager reviews and activates them.</Notice>

      <Card>
        <CardHeader title="Supplier and offer" />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Supplier (seller)" required>
            <Select value={h.sellerId} onChange={set("sellerId")} placeholder="Choose an invited supplier" options={rfq.invites.map((v) => ({ value: String(v.sellerId), label: v.seller }))} />
          </Field>
          <Field label="Signed form / message link" required className="sm:col-span-2" hint="Drive / e-mail / WhatsApp export link of the supplier's signed offer.">
            <Input type="url" value={h.evidenceUrl} maxLength={500} onChange={set("evidenceUrl")} />
          </Field>
          <Field label="Supplier legal name" required><Input value={h.supplierLegalName} maxLength={200} onChange={set("supplierLegalName")} /></Field>
          <Field label="GSTIN"><Input value={h.supplierGstin} maxLength={15} onChange={set("supplierGstin")} /></Field>
          <Field label="Contact name"><Input value={h.contactName} maxLength={120} onChange={set("contactName")} /></Field>
          <Field label="Contact mobile"><Input value={h.contactMobile} maxLength={20} onChange={set("contactMobile")} /></Field>
          <Field label="Dispatch location"><Input value={h.dispatchLocation} maxLength={200} onChange={set("dispatchLocation")} /></Field>
          <Field label="Pickup pincode"><Input value={h.pickupPincode} maxLength={6} inputMode="numeric" onChange={set("pickupPincode")} /></Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Commercial terms" />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price basis" required><Select value={h.priceBasis} onChange={set("priceBasis")} options={opts(options.priceBases)} /></Field>
          <Field label="GST" required><Select value={h.gstTreatment} onChange={set("gstTreatment")} options={opts(options.gstTreatments)} /></Field>
          <Field label="Freight" required><Select value={h.freightTerms} onChange={set("freightTerms")} options={opts(options.freightTerms)} /></Field>
          {h.freightTerms === "free_above" ? num("Free freight above (₹)", h.freightFreeAbove, set("freightFreeAbove")) : <div />}
          {num("Loading charge (₹)", h.loadingCharge, set("loadingCharge"))}
          <Field label="Offer valid until" required><Input type="date" value={h.validUntil} onChange={set("validUntil")} /></Field>
          {num("Dispatch time (days)", h.dispatchDays, set("dispatchDays"), { step: "1" })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Payment terms" description="Supplier credit terms never grant credit to a buyer." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Terms" required><Select value={h.paymentTerms} onChange={set("paymentTerms")} options={opts(options.paymentTerms)} /></Field>
          {h.paymentTerms === "partial" && num("Advance %", h.advancePct, set("advancePct"))}
          {h.paymentTerms === "credit" && num("Credit days", h.creditDays, set("creditDays"), { step: "1" })}
          {num("Supplier-proposed credit limit (₹)", h.proposedCreditLimit, set("proposedCreditLimit"))}
          <Field label="Conditions" className="sm:col-span-2 lg:col-span-4"><Input value={h.paymentConditions} maxLength={400} onChange={set("paymentConditions")} /></Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Direct dispatch" />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {num("Pickup readiness (hours)", h.pickupSlaHours, set("pickupSlaHours"), { step: "1" })}
          <Field label="Packaging by"><Select value={h.packagingOwner} onChange={set("packagingOwner")} placeholder="—" options={opts(options.parties)} /></Field>
          <Field label="Loading by"><Select value={h.loadingOwner} onChange={set("loadingOwner")} placeholder="—" options={opts(options.parties)} /></Field>
          <Field label="Transit risk on"><Select value={h.transitRiskOwner} onChange={set("transitRiskOwner")} placeholder="—" options={opts(options.parties)} /></Field>
          <div className="flex flex-wrap gap-4 sm:col-span-2 lg:col-span-4">
            <Checkbox label="Tax invoice" checked={h.taxInvoice} onChange={set("taxInvoice")} />
            <Checkbox label="Packing list" checked={h.packingList} onChange={set("packingList")} />
            <Checkbox label="Batch details" checked={h.batchDetails} onChange={set("batchDetails")} />
          </div>
          <Field label="Factory / warehouse availability" className="sm:col-span-2"><Input value={h.dispatchAvailability} maxLength={200} onChange={set("dispatchAvailability")} /></Field>
          <Field label="Dispatch conditions" className="sm:col-span-2"><Input value={h.dispatchConditions} maxLength={400} onChange={set("dispatchConditions")} /></Field>
        </CardBody>
      </Card>

      {lines.map((l, i) => {
        const item = rfq.items[i];
        return (
          <Card key={item.id}>
            <CardHeader
              title={`${i + 1}. ${item.name}`}
              description={`${item.packSize || "Pack not specified"} · per ${item.commercialUnit}${item.requiredLicense ? ` · licence: ${item.requiredLicense}` : ""}`}
              actions={<Checkbox label="Not quoted" checked={l.skip} onChange={(e) => upd(i, { skip: e.target.checked })} />}
            />
            {!l.skip && (
              <CardBody className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Supplier's B2B listing" className="sm:col-span-2"><ListingPicker sellerId={Number(h.sellerId)} value={l.listing} onChange={(listing) => upd(i, { listing })} /></Field>
                  <Field label="Commercial unit"><Select value={l.commercialUnit} onChange={(e) => upd(i, { commercialUnit: e.target.value })} options={options.commercialUnits} /></Field>
                  <Field label="Listing units per commercial unit" hint="e.g. 1 if the listing sells by the case."><Input type="number" min="1" step="1" value={l.listingUnitsPerCommercialUnit} onChange={(e) => upd(i, { listingUnitsPerCommercialUnit: e.target.value })} /></Field>
                  <Field label="Pack size"><Input value={l.packSize} maxLength={80} onChange={(e) => upd(i, { packSize: e.target.value })} /></Field>
                  {num("Units per outer case", l.unitsPerOuterCase, (e) => upd(i, { unitsPerOuterCase: e.target.value }), { step: "1" })}
                  {num("MOQ (commercial units)", l.moqUnits, (e) => upd(i, { moqUnits: e.target.value }), { step: "1" })}
                  {num("Available to sell", l.atsQty, (e) => upd(i, { atsQty: e.target.value }), { step: "1" })}
                  <Field label="Batch"><Input value={l.batchNo} maxLength={80} onChange={(e) => upd(i, { batchNo: e.target.value })} /></Field>
                  <Field label="Expiry"><Input type="date" value={l.expiryDate} onChange={(e) => upd(i, { expiryDate: e.target.value })} /></Field>
                  {num("Min. shelf life (months)", l.minShelfLifeMonths, (e) => upd(i, { minShelfLifeMonths: e.target.value }), { step: "1" })}
                  <Field label="Licence / registration ref."><Input value={l.licenseRef} maxLength={200} onChange={(e) => upd(i, { licenseRef: e.target.value })} /></Field>
                  {num("MRP (₹)", l.mrp, (e) => upd(i, { mrp: e.target.value }))}
                  {num("Trade rate (₹)", l.tradeRate, (e) => upd(i, { tradeRate: e.target.value }))}
                  {num("Institutional rate (₹)", l.institutionalRate, (e) => upd(i, { institutionalRate: e.target.value }))}
                  {num("Max discount %", l.maxDiscountPct, (e) => upd(i, { maxDiscountPct: e.target.value }))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-ink-muted uppercase">Logistics (per commercial unit; volumetric weight is calculated by us)</p>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
                    {num("Net kg", l.netKgPerUnit, (e) => upd(i, { netKgPerUnit: e.target.value }), { step: "0.001" })}
                    {num("Packaging kg", l.packagingKgPerUnit, (e) => upd(i, { packagingKgPerUnit: e.target.value }), { step: "0.001" })}
                    {num("Gross kg", l.grossKgPerUnit, (e) => upd(i, { grossKgPerUnit: e.target.value }), { step: "0.001" })}
                    {num("Outer case gross kg", l.outerCaseGrossKg, (e) => upd(i, { outerCaseGrossKg: e.target.value }), { step: "0.001" })}
                    {num("Outer L cm", l.outerLCm, (e) => upd(i, { outerLCm: e.target.value }))}
                    {num("Outer W cm", l.outerWCm, (e) => upd(i, { outerWCm: e.target.value }))}
                    {num("Outer H cm", l.outerHCm, (e) => upd(i, { outerHCm: e.target.value }))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-ink-muted uppercase">Slab rates (₹ per {l.commercialUnit}, as quoted)</p>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {options.slabSteps.map((step, k) => (
                      <div key={step} className="space-y-1 rounded-lg border border-line p-2">
                        <p className="text-xs font-medium text-ink">{step}{k > 1 ? "+" : ""} {l.commercialUnit}</p>
                        <Input aria-label={`Rate for ${step}`} type="number" min="0" step="0.01" placeholder="Rate" value={l.slabs[step]?.rate ?? ""} onChange={(e) => setSlab(i, step, "rate", e.target.value)} />
                        <Input aria-label={`Pack configuration for ${step}`} placeholder="Pack config" value={l.slabs[step]?.packConfig ?? ""} onChange={(e) => setSlab(i, step, "packConfig", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            )}
          </Card>
        );
      })}

      <Card>
        <CardHeader title="Best offer and declaration" />
        <CardBody className="grid gap-3 sm:grid-cols-2">
          <Field label="Best offer notes" className="sm:col-span-2"><Textarea value={h.bestOfferNote} maxLength={600} onChange={set("bestOfferNote")} /></Field>
          <Field label="Platform service fee (if any)" className="sm:col-span-2"><Input value={h.platformFeeNote} maxLength={300} onChange={set("platformFeeNote")} /></Field>
          <Checkbox className="sm:col-span-2" label="Supplier accepts: independent sourcing, no guaranteed volumes unless agreed in writing" checked={h.noVolumeGuaranteeAck} onChange={set("noVolumeGuaranteeAck")} />
          <Field label="Declared by (name)" required><Input value={h.declaredByName} maxLength={120} onChange={set("declaredByName")} /></Field>
          <Field label="Designation"><Input value={h.declaredByDesignation} maxLength={120} onChange={set("declaredByDesignation")} /></Field>
        </CardBody>
      </Card>

      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-line bg-surface/95 py-3 backdrop-blur">
        <Link href={`/admin/b2b/procurement/${rfq.id}`} className="mr-auto text-sm text-ink-muted hover:underline">Cancel</Link>
        <Button type="submit" variant="primary" loading={saving} disabled={!h.sellerId || !h.noVolumeGuaranteeAck}>Save response</Button>
      </div>
    </form>
  );
}
