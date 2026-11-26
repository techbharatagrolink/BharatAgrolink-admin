"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  activateB2bSupplierRates,
  createB2bSupplierAuthorization,
  decideB2bSupplierAuthorization,
  getB2bProcurementSellers,
  inviteB2bSuppliers,
  mapB2bSupplierResponseListing,
  moveB2bSupplierRfq,
  reviewB2bSupplierResponse,
  searchB2bProcurementListings,
  searchB2bRfqProducts,
} from "@/lib/actions/admin/b2b-screens";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

/* Supplier procurement RFQ actions and supplier authorizations (task #107 subtask 4 part 2; spec C1, A2). */

function useRun() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Saved.", details: [] } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details || [] });
      if (res?.ok) {
        after?.(res);
        router.refresh();
      }
    });
  return { busy, result, run, setResult };
}

function Problem({ result }) {
  if (result?.tone !== "danger") return null;
  return (
    <Notice tone="danger" className="mt-2">
      {result.text}
      {result.details?.length > 1 && <ul className="mt-1 list-disc pl-5">{result.details.map((d) => <li key={d}>{d}</li>)}</ul>}
    </Notice>
  );
}

const MOVE_LABEL = { open: "Open", close: "Close RFQ", cancel: "Cancel RFQ" };

export function SupplierRfqMove({ rfqId, action }) {
  const { busy, result, run } = useRun();
  return (
    <>
      <Button size="sm" variant={action === "open" ? "primary" : "secondary"} loading={busy} onClick={() => (action === "cancel" && !window.confirm("Cancel this supplier RFQ?") ? null : run(() => moveB2bSupplierRfq(rfqId, action)))}>
        {MOVE_LABEL[action]}
      </Button>
      {result?.tone === "danger" && <span className="ml-2 text-xs text-danger">{result.text}</span>}
    </>
  );
}

export function InviteSuppliers({ rfqId, invited }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [sellers, setSellers] = useState(null);
  const [picked, setPicked] = useState(new Set());
  const already = new Set(invited);
  async function show() {
    setOpen(true);
    const res = await getB2bProcurementSellers();
    setSellers(res.ok ? res.sellers : []);
  }
  return (
    <>
      <Button size="sm" variant="secondary" onClick={show}>Invite suppliers</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite suppliers"
        description="Active B2B sellers. They answer from their B2B panel, or you type their signed form in."
        footer={<Button variant="primary" loading={busy} disabled={!picked.size} onClick={() => run(() => inviteB2bSuppliers(rfqId, [...picked]), () => setOpen(false))}>Invite {picked.size || ""}</Button>}
      >
        {!sellers && <p className="text-sm text-ink-muted">Loading…</p>}
        {sellers && (
          <ul className="max-h-80 divide-y divide-line overflow-auto rounded-lg border border-line">
            {sellers.map((s) => (
              <li key={s.id} className="px-3 py-2">
                <Checkbox
                  label={`${s.name}${s.state ? ` · ${s.state}` : ""} · ${s.listings} listings${already.has(s.id) ? " · invited" : ""}`}
                  disabled={already.has(s.id)}
                  checked={picked.has(s.id) || already.has(s.id)}
                  onChange={() =>
                    setPicked((cur) => {
                      const next = new Set(cur);
                      if (next.has(s.id)) next.delete(s.id);
                      else next.add(s.id);
                      return next;
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}
        <Problem result={result} />
      </Dialog>
    </>
  );
}

export function MapResponseLine({ rfqId, responseId, item, sellerId }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [per, setPer] = useState(String(item.listingUnitsPerCommercialUnit || 1));
  const timer = useRef(null);
  const search = (q) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => setRows((await searchB2bProcurementListings(sellerId, q)).listings || []), 250);
  };
  return (
    <>
      <Button size="xs" variant="secondary" onClick={() => { setOpen(true); search(""); }}>{item.listing ? "Change listing" : "Map listing"}</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Map to the supplier's listing" description="Activated rates become the seller cost of this listing.">
        <Field label="Listing units in one commercial unit" hint={`How many of the listing's selling units are in one ${item.commercialUnit}.`}>
          <Input type="number" min="1" step="1" value={per} onChange={(e) => setPer(e.target.value)} />
        </Field>
        <Input className="mt-2" placeholder="Search listings" onChange={(e) => search(e.target.value)} />
        <ul className="mt-2 max-h-64 divide-y divide-line overflow-auto rounded-lg border border-line">
          {rows.map((l) => (
            <li key={`${l.type}-${l.id}`}>
              <button
                type="button"
                disabled={busy}
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                onClick={() => run(() => mapB2bSupplierResponseListing(rfqId, responseId, item.id, { listingType: l.type, listingId: l.id, listingUnitsPerCommercialUnit: Number(per) || 1 }), () => setOpen(false))}
              >
                {l.name} <span className="text-xs text-ink-muted">· {l.sku} · per {l.unit}</span>
              </button>
            </li>
          ))}
        </ul>
        <Problem result={result} />
      </Dialog>
    </>
  );
}

export function ReviewResponse({ rfqId, responseId, checks }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [ticked, setTicked] = useState({});
  const [note, setNote] = useState("");
  const all = checks.every((c) => ticked[c.key]);
  return (
    <>
      <Button size="sm" variant="primary" onClick={() => setOpen(true)}>Review</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Review supplier response"
        description="Check the response against the supplier's signed form before its rates can go live."
        footer={
          <div className="flex gap-2">
            <Button variant="danger" loading={busy} disabled={note.trim().length < 5} onClick={() => run(() => reviewB2bSupplierResponse(rfqId, responseId, { decision: "reject", checks: ticked, note }), () => setOpen(false))}>Reject</Button>
            <Button variant="primary" loading={busy} disabled={!all} onClick={() => run(() => reviewB2bSupplierResponse(rfqId, responseId, { decision: "verify", checks: ticked, note }), () => setOpen(false))}>Verify</Button>
          </div>
        }
      >
        <div className="space-y-2">
          {checks.map((c) => (
            <Checkbox key={c.key} label={c.label} checked={Boolean(ticked[c.key])} onChange={(e) => setTicked((cur) => ({ ...cur, [c.key]: e.target.checked }))} />
          ))}
          <Field label="Note" hint="Required to reject.">
            <Textarea value={note} maxLength={600} rows={2} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <Problem result={result} />
      </Dialog>
    </>
  );
}

export function ActivateRates({ rfqId, responseId, validUntil }) {
  const { busy, result, run } = useRun();
  return (
    <>
      <Button
        size="sm"
        variant="primary"
        loading={busy}
        onClick={() => (window.confirm(`Activate these rates until ${validUntil}? Quotations and orders for the mapped listings will use them as the seller cost.`) ? run(() => activateB2bSupplierRates(rfqId, responseId)) : null)}
      >
        Activate rates
      </Button>
      <Problem result={result} />
    </>
  );
}

// --- Authorizations ----------------------------------------------------------------------------

const AUTH_LABEL = {
  manufacturer_authorization: "Manufacturer authorization",
  insecticide_license: "Insecticide licence",
  fertilizer_license: "Fertilizer licence",
  seed_license: "Seed licence",
  dealer_license: "Dealer licence",
  other: "Other",
};

export function AddAuthorization({ options }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [f, setF] = useState({ sellerId: "", authType: "manufacturer_authorization", brand: "", productId: null, productLabel: "", state: "", documentNumber: "", evidenceUrl: "", validFrom: "", validUntil: "", note: "" });
  const [found, setFound] = useState([]);
  const timer = useRef(null);
  const set = (k) => (e) => setF((c) => ({ ...c, [k]: e.target.value }));
  async function show() {
    setOpen(true);
    const res = await getB2bProcurementSellers();
    setSellers(res.ok ? res.sellers : []);
  }
  const search = (q) => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) return setFound([]);
    timer.current = setTimeout(async () => setFound((await searchB2bRfqProducts(q.trim())).products || []), 300);
  };
  return (
    <>
      <Button variant="primary" size="sm" onClick={show}>Add authorization</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Add seller authorization"
        description="Leave product empty to cover the whole brand; leave state empty for all states. A different manager verifies it against the document."
        footer={
          <Button
            variant="primary"
            loading={busy}
            disabled={!f.sellerId || !f.evidenceUrl}
            onClick={() =>
              run(
                () =>
                  createB2bSupplierAuthorization({
                    sellerId: Number(f.sellerId),
                    authType: f.authType,
                    brand: f.brand,
                    productId: f.productId,
                    state: f.state,
                    documentNumber: f.documentNumber,
                    evidenceUrl: f.evidenceUrl,
                    validFrom: f.validFrom,
                    validUntil: f.validUntil,
                    note: f.note,
                  }),
                () => setOpen(false),
              )
            }
          >
            Save
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Seller" required><Select value={f.sellerId} onChange={set("sellerId")} placeholder="Choose" options={sellers.map((s) => ({ value: String(s.id), label: s.name }))} /></Field>
          <Field label="Type" required><Select value={f.authType} onChange={set("authType")} options={options.authTypes.map((t) => ({ value: t, label: AUTH_LABEL[t] ?? t }))} /></Field>
          <Field label="Brand"><Input value={f.brand} maxLength={150} onChange={set("brand")} /></Field>
          <Field label="Product (optional)" hint={f.productLabel ? `Selected: ${f.productLabel}` : undefined}>
            <Input placeholder="Search product" onChange={(e) => search(e.target.value)} />
            {found.length > 0 && (
              <ul className="max-h-40 overflow-auto rounded-lg border border-line bg-surface">
                {found.map((p) => (
                  <li key={`${p.productId}-${p.variantId}`}>
                    <button type="button" className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-muted" onClick={() => { setF((c) => ({ ...c, productId: p.productId, productLabel: p.name })); setFound([]); }}>{p.name}</button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
          <Field label="State">{options.states?.length ? <Select value={f.state} onChange={set("state")} placeholder="All states" options={options.states} /> : <Input value={f.state} onChange={set("state")} />}</Field>
          <Field label="Document number"><Input value={f.documentNumber} maxLength={120} onChange={set("documentNumber")} /></Field>
          <Field label="Document link" required className="sm:col-span-2"><Input type="url" value={f.evidenceUrl} maxLength={500} onChange={set("evidenceUrl")} /></Field>
          <Field label="Valid from"><Input type="date" value={f.validFrom} onChange={set("validFrom")} /></Field>
          <Field label="Valid until"><Input type="date" value={f.validUntil} onChange={set("validUntil")} /></Field>
          <Field label="Note" className="sm:col-span-2"><Input value={f.note} maxLength={400} onChange={set("note")} /></Field>
        </div>
        <Problem result={result} />
      </Dialog>
    </>
  );
}

export function DecideAuthorization({ id, status }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(null);
  const [note, setNote] = useState("");
  const decisions = status === "pending" ? ["verify", "reject"] : status === "verified" ? ["revoke"] : [];
  if (!decisions.length) return null;
  return (
    <>
      {decisions.map((d) => (
        <Button key={d} size="xs" variant={d === "verify" ? "primary" : "secondary"} className="mr-1" onClick={() => setOpen(d)}>
          {d === "verify" ? "Verify" : d === "reject" ? "Reject" : "Revoke"}
        </Button>
      ))}
      <Dialog
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open === "verify" ? "Verify authorization" : open === "reject" ? "Reject authorization" : "Revoke authorization"}
        description={open === "verify" ? "Confirm you have checked the document: holder, product / brand, state and dates." : undefined}
        footer={
          <Button variant={open === "verify" ? "primary" : "danger"} loading={busy} disabled={open !== "verify" && note.trim().length < 5} onClick={() => run(() => decideB2bSupplierAuthorization(id, { decision: open, note }), () => setOpen(null))}>
            Confirm
          </Button>
        }
      >
        <Field label="Note" hint={open === "verify" ? "Optional." : "Required."}><Textarea value={note} maxLength={400} rows={2} onChange={(e) => setNote(e.target.value)} /></Field>
        <Problem result={result} />
      </Dialog>
    </>
  );
}
