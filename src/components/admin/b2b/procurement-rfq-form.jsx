"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { saveB2bSupplierRfq, searchB2bRfqProducts } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";

/*
 * Supplier procurement RFQ create (task #107 subtask 4 part 2; spec C1 header + SKU lines). The supplier
 * answers per line with commercial-unit slabs 1/5/10/25+/50+/100+; this form only says what is asked.
 */

const blank = { productId: 0, variantId: 0, productName: "", packSize: "", commercialUnit: "case", requiredLicense: "", notes: "" };

export function ProcurementRfqForm({ options }) {
  const router = useRouter();
  const [saving, start] = useTransition();
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [f, setF] = useState({ title: "", manufacturer: "", brand: "", supplyState: "", dispatchLocation: "", pickupPincode: "", responseDueAt: "", notes: "" });
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [found, setFound] = useState([]);
  const timer = useRef(null);
  const set = (k) => (e) => setF((cur) => ({ ...cur, [k]: e.target.value }));
  const upd = (i, patch) => setItems((cur) => cur.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  function search(value) {
    setQ(value);
    clearTimeout(timer.current);
    if (value.trim().length < 2) return setFound([]);
    timer.current = setTimeout(async () => setFound((await searchB2bRfqProducts(value.trim())).products || []), 300);
  }

  function submit(status) {
    setError("");
    setDetails([]);
    start(async () => {
      const res = await saveB2bSupplierRfq({ ...f, status, items });
      if (!res.ok) {
        setError(res.message || "Could not save.");
        setDetails(res.details || []);
        return;
      }
      router.push(`/admin/b2b/procurement/${res.id}`);
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit("draft");
      }}
    >
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger-ink" role="alert">
          <p>{error}</p>
          {details.length > 1 && <ul className="mt-1 list-disc pl-5">{details.map((d) => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}
      <Card>
        <CardHeader title="Supplier RFQ" description="Who is asked, for what supply, and by when. Internal notes are never shown to suppliers." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Title" required className="sm:col-span-2 lg:col-span-3"><Input value={f.title} maxLength={200} onChange={set("title")} placeholder="e.g. Startek insecticides – Q1 supply rates" /></Field>
          <Field label="Manufacturer"><Input value={f.manufacturer} maxLength={200} onChange={set("manufacturer")} /></Field>
          <Field label="Brand"><Input value={f.brand} maxLength={150} onChange={set("brand")} /></Field>
          <Field label="Supply state">
            {options.states?.length ? <Select value={f.supplyState} onChange={set("supplyState")} placeholder="Any" options={options.states} /> : <Input value={f.supplyState} onChange={set("supplyState")} />}
          </Field>
          <Field label="Dispatch location"><Input value={f.dispatchLocation} maxLength={200} onChange={set("dispatchLocation")} /></Field>
          <Field label="Pickup pincode"><Input value={f.pickupPincode} inputMode="numeric" maxLength={6} onChange={(e) => setF((c) => ({ ...c, pickupPincode: e.target.value.replace(/\D/g, "") }))} /></Field>
          <Field label="Respond by"><Input type="date" value={f.responseDueAt} onChange={set("responseDueAt")} /></Field>
          <Field label="Internal notes" className="sm:col-span-2 lg:col-span-3"><Textarea value={f.notes} maxLength={2000} onChange={set("notes")} /></Field>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="SKU lines" description="A catalog product, or a described product. Each pack configuration is its own line." />
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Add catalog product" className="min-w-64 flex-1">
              <Input value={q} onChange={(e) => search(e.target.value)} placeholder="Product name or SKU" autoComplete="off" />
              {found.length > 0 && (
                <ul className="max-h-56 overflow-auto rounded-lg border border-line bg-surface">
                  {found.map((p) => (
                    <li key={`${p.productId}-${p.variantId}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                        onClick={() => {
                          setItems((cur) => [...cur, { ...blank, productId: p.productId, variantId: p.variantId, productName: p.name }]);
                          setQ("");
                          setFound([]);
                        }}
                      >
                        <span className="font-medium text-ink">{p.name}</span>
                        <span className="block text-xs text-ink-muted">{p.sku} · {p.category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
            <Button variant="secondary" onClick={() => setItems((cur) => [...cur, { ...blank }])}>Add described product</Button>
          </div>
          {items.length === 0 && <p className="text-sm text-ink-muted">No lines yet.</p>}
          {items.map((it, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-6">
              <div className="flex items-start justify-between gap-2 sm:col-span-6">
                <p className="text-sm font-medium text-ink">{i + 1}. {it.productId ? it.productName : "Described product"}</p>
                <button type="button" aria-label={`Remove line ${i + 1}`} className="text-ink-muted hover:text-danger" onClick={() => setItems((cur) => cur.filter((_, j) => j !== i))}><Trash2 className="size-4" /></button>
              </div>
              {!it.productId && <Field label="Product" required className="sm:col-span-3"><Input value={it.productName} maxLength={300} onChange={(e) => upd(i, { productName: e.target.value })} /></Field>}
              <Field label="Pack size" className="sm:col-span-1"><Input value={it.packSize} maxLength={80} onChange={(e) => upd(i, { packSize: e.target.value })} /></Field>
              <Field label="Commercial unit" className="sm:col-span-1"><Select value={it.commercialUnit} onChange={(e) => upd(i, { commercialUnit: e.target.value })} options={options.commercialUnits} /></Field>
              <Field label="Licence / registration needed" className="sm:col-span-2"><Input value={it.requiredLicense} maxLength={200} onChange={(e) => upd(i, { requiredLicense: e.target.value })} /></Field>
              <Field label="Notes" className="sm:col-span-3"><Input value={it.notes} maxLength={400} onChange={(e) => upd(i, { notes: e.target.value })} /></Field>
            </div>
          ))}
        </CardBody>
      </Card>
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface/95 py-3 backdrop-blur">
        <Link href="/admin/b2b/procurement" className="mr-auto text-sm text-ink-muted hover:underline">Cancel</Link>
        <Button type="submit" loading={saving} disabled={!f.title.trim() || !items.length}>Save as draft</Button>
        <Button variant="primary" loading={saving} disabled={!f.title.trim() || !items.length} onClick={() => submit("open")}>Create and open</Button>
      </div>
    </form>
  );
}
