"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { saveB2bRfq, searchB2bRfqBuyers, searchB2bRfqProducts } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { formatINR } from "@/lib/format";

/*
 * Buyer RFQ create / edit (task #107 subtask 4; spec §7 RFQ fields, screen 9). A line is a catalog
 * unit (its quantity counts in that unit's selling unit, e.g. boxes) or a free-text requirement for
 * sourcing. Target rate is the buyer's ask, ex-GST per unit; it is never shown to sellers.
 * `initial` (edit) is the RFQ detail; lines are locked once a seller has quoted.
 */

const blankText = { productId: 0, variantId: 0, name: "", unit: "unit", requirementText: "", packSize: "", quantity: 1, targetRate: "" };

function useSearch(fn, key) {
  const timer = useRef(null);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const search = (value) => {
    clearTimeout(timer.current);
    if (value.trim().length < 2) {
      setRows([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setBusy(true);
      const res = await fn(value.trim());
      setBusy(false);
      setRows(res?.[key] ?? []);
    }, 300);
  };
  return { rows, busy, search, clear: () => setRows([]) };
}

export function RfqForm({ options, initial = null, linesLocked = false }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [saving, startSave] = useTransition();
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);

  const [buyerQuery, setBuyerQuery] = useState("");
  const [buyer, setBuyer] = useState(initial ? { id: initial.buyer.id, label: initial.buyer.businessName || initial.buyer.name } : null);
  const [customerTypeId, setCustomerTypeId] = useState(initial?.buyer.typeId ? String(initial.buyer.typeId) : "");
  const [pincode, setPincode] = useState(initial?.delivery.pincode ?? "");
  const [district, setDistrict] = useState(initial?.delivery.district ?? "");
  const [state, setState] = useState(initial?.delivery.state ?? "");
  const [requiredDate, setRequiredDate] = useState(initial?.requiredDate ?? "");
  const [paymentMode, setPaymentMode] = useState(initial?.paymentMode || "Prepaid");
  const [creditDays, setCreditDays] = useState(String(initial?.creditDays ?? 0));
  const [preferredBrands, setPreferredBrands] = useState(initial?.preferredBrands ?? "");
  const [internalNotes, setInternalNotes] = useState(initial?.internalNotes ?? "");
  const [lines, setLines] = useState(
    initial
      ? initial.lines.map((l) => ({
          productId: l.productId || 0,
          variantId: l.variantId || 0,
          name: l.product,
          unit: l.uom,
          requirementText: l.requirement,
          packSize: l.pack,
          quantity: l.quantity,
          targetRate: l.targetRate ?? "",
        }))
      : [],
  );
  const [productQuery, setProductQuery] = useState("");

  const buyers = useSearch(searchB2bRfqBuyers, "buyers");
  const products = useSearch(searchB2bRfqProducts, "products");

  function chooseBuyer(b) {
    setBuyer({ id: b.id, label: `${b.businessName || b.name} (${b.mobile})` });
    setBuyerQuery("");
    buyers.clear();
    if (b.customerTypeId) setCustomerTypeId(String(b.customerTypeId));
    if (b.pincode) setPincode(b.pincode);
    if (b.district) setDistrict(b.district);
    if (b.state) setState(b.state);
  }

  function addProduct(p) {
    setLines((cur) =>
      cur.some((l) => l.productId === p.productId && l.variantId === p.variantId)
        ? cur
        : [...cur, { ...blankText, productId: p.productId, variantId: p.variantId, name: p.name, unit: p.unit || "unit", requirementText: p.name }],
    );
    setProductQuery("");
    products.clear();
  }

  const update = (i, patch) => setLines((cur) => cur.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const estimate = lines.reduce((s, l) => s + (Number(l.targetRate) || 0) * (Number(l.quantity) || 0), 0);

  function submit(status) {
    setError("");
    setDetails([]);
    const body = {
      customerTypeId: Number(customerTypeId) || 0,
      pincode: pincode.trim(),
      district: district.trim(),
      state: state.trim(),
      requiredDate,
      paymentMode,
      creditDays: paymentMode === "Credit" ? Number(creditDays) || 0 : 0,
      preferredBrands,
      internalNotes,
      ...(editing ? {} : { customerId: buyer?.id || 0, status }),
      ...(linesLocked
        ? {}
        : {
            lines: lines.map((l) => ({
              productId: l.productId || 0,
              variantId: l.variantId || 0,
              requirementText: l.requirementText || "",
              packSize: l.productId ? "" : l.packSize || "",
              quantity: Number(l.quantity) || 0,
              targetRate: l.targetRate === "" ? null : Number(l.targetRate),
            })),
          }),
    };
    startSave(async () => {
      const res = await saveB2bRfq(body, editing ? initial.id : null);
      if (!res.ok) {
        setError(res.message || "The RFQ could not be saved.");
        setDetails(res.details || []);
        return;
      }
      router.push(`/admin/b2b/rfqs/${editing ? initial.id : res.id}`);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit("open");
      }}
      className="space-y-4"
    >
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger-ink" role="alert">
          <p>{error}</p>
          {details.length > 1 && (
            <ul className="mt-1 list-disc pl-5">
              {details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Card>
        <CardHeader title="Buyer and delivery" description="The delivery pincode drives freight, landed cost and seller distance." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {editing ? (
            <Field label="Buyer" className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm font-medium text-ink">{buyer?.label}</p>
            </Field>
          ) : (
            <Field label="Buyer" required className="sm:col-span-2 lg:col-span-3" hint={buyer ? `Selected: ${buyer.label}` : "Search a registered buyer by name, mobile or pincode."}>
              <Input
                value={buyerQuery}
                onChange={(e) => {
                  setBuyerQuery(e.target.value);
                  buyers.search(e.target.value);
                }}
                placeholder="Name, mobile or pincode"
                autoComplete="off"
              />
              {buyers.busy && <p className="text-xs text-ink-muted">Searching…</p>}
              {buyers.rows.length > 0 && (
                <ul className="max-h-48 overflow-auto rounded-lg border border-line bg-surface">
                  {buyers.rows.map((b) => (
                    <li key={b.id}>
                      <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => chooseBuyer(b)}>
                        <span className="font-medium text-ink">{b.businessName || b.name}</span>
                        <span className="block text-xs text-ink-muted">
                          {b.name} · {b.mobile} · {b.pincode}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
          )}
          <Field label="Buyer type" required>
            <Select value={customerTypeId} onChange={(e) => setCustomerTypeId(e.target.value)} placeholder="Select buyer type" options={options.customerTypes.map((t) => ({ value: String(t.id), label: t.name }))} />
          </Field>
          <Field label="Delivery pincode" required>
            <Input value={pincode} inputMode="numeric" maxLength={6} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} />
          </Field>
          <Field label="District">
            <Input value={district} onChange={(e) => setDistrict(e.target.value)} />
          </Field>
          <Field label="State">
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </Field>
          <Field label="Required by" required>
            <Input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} />
          </Field>
          <Field label="Payment mode" required>
            <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={options.paymentModes} />
          </Field>
          {paymentMode === "Credit" && (
            <Field label="Credit days requested" required hint="A request only: Finance approves credit, Sales cannot.">
              <Input type="number" min="1" max="180" value={creditDays} onChange={(e) => setCreditDays(e.target.value)} />
            </Field>
          )}
          <Field label="Preferred / allowed brands" className="sm:col-span-2" hint="For substitute sourcing.">
            <Input value={preferredBrands} maxLength={400} onChange={(e) => setPreferredBrands(e.target.value)} />
          </Field>
          <Field label="Internal notes" className="sm:col-span-2 lg:col-span-3" hint="Never shown to sellers or the buyer.">
            <Textarea value={internalNotes} maxLength={2000} onChange={(e) => setInternalNotes(e.target.value)} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Requirement lines"
          description={linesLocked ? "Sellers have quoted on these lines, so they can no longer be changed." : "Catalog products count in their selling unit (box, kg …). Free-text lines describe a requirement to source."}
        />
        <CardBody className="space-y-3">
          {!linesLocked && (
            <div className="flex flex-wrap items-end gap-2">
              <Field label="Add catalog product" className="min-w-64 flex-1">
                <Input
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    products.search(e.target.value);
                  }}
                  placeholder="Product name, SKU or technical name"
                  autoComplete="off"
                />
                {products.busy && <p className="text-xs text-ink-muted">Searching…</p>}
                {products.rows.length > 0 && (
                  <ul className="max-h-56 overflow-auto rounded-lg border border-line bg-surface">
                    {products.rows.map((p) => (
                      <li key={`${p.productId}-${p.variantId}`}>
                        <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => addProduct(p)}>
                          <span className="font-medium text-ink">{p.name}</span>
                          <span className="block text-xs text-ink-muted">
                            {p.sku} · {p.category} · per {p.unit} · stock {p.stock}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
              <Button variant="secondary" onClick={() => setLines((cur) => [...cur, { ...blankText }])}>
                Add free-text requirement
              </Button>
            </div>
          )}
          {lines.length === 0 ? (
            <p className="text-sm text-ink-muted">No lines yet.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map((l, i) => (
                <li key={i} className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-6">
                  <div className="sm:col-span-6 flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">
                      {i + 1}. {l.productId ? l.name : "Free-text requirement"}
                    </p>
                    {!linesLocked && (
                      <button type="button" className="text-ink-muted hover:text-danger" aria-label={`Remove line ${i + 1}`} onClick={() => setLines((cur) => cur.filter((_, j) => j !== i))}>
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  {!l.productId && (
                    <>
                      <Field label="Requirement" required className="sm:col-span-4">
                        <Input value={l.requirementText} disabled={linesLocked} maxLength={400} placeholder="e.g. Glyphosate 41% SL, any brand, 1 L" onChange={(e) => update(i, { requirementText: e.target.value })} />
                      </Field>
                      <Field label="Pack" className="sm:col-span-2">
                        <Input value={l.packSize} disabled={linesLocked} maxLength={60} onChange={(e) => update(i, { packSize: e.target.value })} />
                      </Field>
                    </>
                  )}
                  <Field label={`Quantity (${l.unit || "unit"})`} required className="sm:col-span-2">
                    <Input type="number" min="1" step="1" value={l.quantity} disabled={linesLocked} onChange={(e) => update(i, { quantity: e.target.value })} />
                  </Field>
                  <Field label="Buyer target rate (₹ / unit, ex-GST)" className="sm:col-span-2">
                    <Input type="number" min="0" step="0.01" value={l.targetRate} disabled={linesLocked} onChange={(e) => update(i, { targetRate: e.target.value })} />
                  </Field>
                </li>
              ))}
            </ul>
          )}
          {estimate > 0 && <p className="text-xs text-ink-muted">Estimated value at target rates: {formatINR(estimate)} (ex-GST).</p>}
        </CardBody>
      </Card>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface/95 py-3 backdrop-blur">
        <Link href={editing ? `/admin/b2b/rfqs/${initial.id}` : "/admin/b2b/rfqs"} className="mr-auto text-sm text-ink-muted hover:underline">
          Cancel
        </Link>
        {!editing && (
          <Button variant="secondary" loading={saving} disabled={!buyer || lines.length === 0} onClick={() => submit("draft")}>
            Save as draft
          </Button>
        )}
        <Button type="submit" variant="primary" loading={saving} disabled={!buyer || lines.length === 0}>
          {editing ? "Save changes" : `Create RFQ (SLA ${options.slaMinutes} min)`}
        </Button>
      </div>
    </form>
  );
}
