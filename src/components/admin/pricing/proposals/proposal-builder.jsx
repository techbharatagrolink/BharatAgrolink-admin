"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProposalAction, loadProposalOptionsAction, previewProposalAction, searchProposalProductsAction } from "@/lib/actions/admin/pricing-proposals";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { Difference, Money, SCOPE_LABEL } from "./proposal-status";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const OPERATIONS = [
  { value: "ADD", label: "Add these services" },
  { value: "REMOVE", label: "Remove these services" },
];

/**
 * Spec workflow: find product -> review variation pricing -> choose scope -> select services ->
 * preview each variation -> review aggregate -> create proposal (vendor is notified; active pricing untouched).
 */
export function ProposalBuilder({ initialProductId = "", canCreate }) {
  const router = useRouter();
  const { notify } = useToast();
  const [productId, setProductId] = useState(initialProductId);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, startSearch] = useTransition();
  const [options, setOptions] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [scope, setScope] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("");
  const [operation, setOperation] = useState("ADD");
  const [codes, setCodes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(today());
  const [loading, startLoading] = useTransition();
  const [previewing, startPreview] = useTransition();
  const [creating, startCreate] = useTransition();

  const load = (id = productId) =>
    startLoading(async () => {
      setPreview(null);
      setLoadError("");
      const result = await loadProposalOptionsAction(id);
      if (!result.ok) {
        setOptions(null);
        setLoadError(result.message);
        return;
      }
      setOptions(result);
      setSelected([]);
      setCodes([]);
      setScope(result.variations.length === 1 ? "SINGLE" : "ALL");
      if (result.variations.length === 1) setSelected([result.variations[0].variantId]);
    });

  const search = () =>
    startSearch(async () => {
      const result = await searchProposalProductsAction(query);
      setResults(result.ok ? result.products : []);
      if (!result.ok) setLoadError(result.message);
    });

  const pick = (id) => {
    setProductId(id);
    setResults(null);
    load(id);
  };

  useEffect(() => {
    if (initialProductId) load(initialProductId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Any change to the choice makes the last preview stale.
  useEffect(() => setPreview(null), [scope, selected, filter, operation, codes]);

  const request = useMemo(
    () => ({
      productId: options?.product.productId,
      scope,
      variantIds: scope === "SELECTED" || scope === "SINGLE" ? selected : undefined,
      filter: scope === "GROUP" ? filter : undefined,
      operation: scope === "SINGLE" ? "SET" : operation,
      serviceCodes: codes,
    }),
    [options, scope, selected, filter, operation, codes],
  );

  const groupMatches = useMemo(() => {
    if (scope !== "GROUP" || !filter.trim() || !options) return null;
    const needle = filter.trim().toLowerCase();
    return new Set(options.variations.filter((v) => `${v.label} ${v.sku ?? ""}`.toLowerCase().includes(needle)).map((v) => v.variantId));
  }, [scope, filter, options]);

  const chooseSingle = (variantId) => {
    setSelected([variantId]);
    const v = options.variations.find((x) => x.variantId === variantId);
    setCodes(v ? v.services.filter((s) => !s.oldFormula).map((s) => s.code) : []);
  };

  const toggleVariation = (variantId) => {
    if (scope === "SINGLE") return chooseSingle(variantId);
    setSelected((list) => (list.includes(variantId) ? list.filter((x) => x !== variantId) : [...list, variantId]));
  };

  const runPreview = () =>
    startPreview(async () => {
      setPreviewError("");
      const result = await previewProposalAction(request);
      if (!result.ok) {
        setPreview(null);
        setPreviewError(result.message);
        return;
      }
      setPreview(result.preview);
    });

  const create = () =>
    startCreate(async () => {
      const result = await createProposalAction({ ...request, reason: reason.trim(), effectiveDate });
      if (!result.ok) {
        notify({ tone: "error", message: result.message });
        return;
      }
      notify({ message: `Proposal ${result.proposal.proposalNo} sent to the vendor.` });
      router.push(`/admin/pricing/proposals/${result.proposal.id}`);
    });

  const scopeReady =
    scope === "ALL" || (scope === "GROUP" ? filter.trim() : selected.length > 0 && (scope !== "SINGLE" || selected.length === 1));
  const servicesReady = scope === "SINGLE" || codes.length > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="1. Product" description="Search by product name, SKU (product or pack), vendor or category, or enter the product ID." />
        <CardBody>
          <form
            className="mb-3 flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
          >
            <Field label="Search" className="w-full max-w-md">
              {({ id }) => <Input id={id} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Bordeaux, KAT-10KG, Katyayani, Fungicide" />}
            </Field>
            <Button type="submit" loading={searching} disabled={query.trim().length < 2}>
              Search
            </Button>
          </form>
          {results && (
            <div className="mb-4 overflow-hidden rounded-lg border border-line">
              {results.length === 0 ? (
                <p className="px-3 py-2 text-sm text-ink-muted">No products found.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {results.map((r) => (
                    <li key={r.productId}>
                      <button type="button" onClick={() => pick(r.productId)} className="w-full px-3 py-2 text-left hover:bg-surface-muted">
                        <span className="font-medium text-ink">{r.name}</span>
                        {!r.active && <Badge tone="neutral" className="ml-1.5">Inactive</Badge>}
                        {r.openItems > 0 && <Badge tone="warning" className="ml-1.5">{r.openItems} open</Badge>}
                        <span className="block text-xs text-ink-muted">
                          {r.productId} · {r.sku || "no SKU"} · {r.vendorName ?? "—"} · {r.category ?? "—"} · {r.variations} variation{r.variations === 1 ? "" : "s"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <Field label="Product ID" className="w-full max-w-sm">
              {({ id }) => <Input id={id} value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="e.g. PeFO8ykNhVT" />}
            </Field>
            <Button type="submit" variant="primary" loading={loading} disabled={!productId.trim()}>
              Load variations
            </Button>
          </form>
          {loadError && <Notice tone="danger" className="mt-3">{loadError}</Notice>}
          {options && (
            <p className="mt-3 text-sm text-ink-soft">
              <Link href={`/admin/products/${options.product.productId}`} className="font-medium text-brand-700 hover:underline">
                {options.product.name}
              </Link>
              {" · "}Vendor: {options.product.vendorName ?? options.product.vendorId}
              {" · "}{options.variations.length} variation{options.variations.length === 1 ? "" : "s"}
            </p>
          )}
        </CardBody>
      </Card>

      {options && (
        <Card>
          <CardHeader
            title="2. Variations"
            description="Each variation is priced on its own display price. Choose which ones get the proposal."
            actions={
              <Select
                value={scope}
                onChange={(e) => {
                  setScope(e.target.value);
                  setSelected([]);
                  if (e.target.value === "SINGLE") setCodes([]);
                }}
                options={Object.entries(SCOPE_LABEL).map(([value, label]) => ({ value, label }))}
                className="w-48"
                aria-label="Scope"
              />
            }
          />
          <CardBody className="space-y-3">
            {scope === "GROUP" && (
              <Field label="Match variations by attribute or SKU" hint="E.g. 1 KG matches every 1 KG pack.">
                {({ id }) => <Input id={id} value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs" />}
              </Field>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-ink-muted">
                  <tr className="border-b border-line">
                    {(scope === "SELECTED" || scope === "SINGLE") && <th className="w-8 py-2" />}
                    <th className="py-2 pr-3">Variation</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Version</th>
                    <th className="py-2 pr-3 text-right">Display price</th>
                    <th className="py-2 pr-3 text-right">Current NRV</th>
                    <th className="py-2 pr-3 text-right">Take rate</th>
                    <th className="py-2">Services now</th>
                  </tr>
                </thead>
                <tbody>
                  {options.variations.map((v) => {
                    const inGroup = groupMatches ? groupMatches.has(v.variantId) : true;
                    return (
                      <tr key={v.variantId} className={`border-b border-line last:border-0 ${scope === "GROUP" && !inGroup ? "opacity-40" : ""}`}>
                        {(scope === "SELECTED" || scope === "SINGLE") && (
                          <td className="py-2">
                            <Checkbox
                              type={scope === "SINGLE" ? "radio" : "checkbox"}
                              name="variation"
                              checked={selected.includes(v.variantId)}
                              onChange={() => toggleVariation(v.variantId)}
                              disabled={v.disabled}
                              aria-label={`Select ${v.label}`}
                            />
                          </td>
                        )}
                        <td className="py-2 pr-3">
                          <span className="font-medium text-ink">{v.label}</span>
                          {v.disabled && <Badge tone="neutral" className="ml-1.5">Disabled</Badge>}
                          {v.belowBase && <Badge tone="danger" className="ml-1.5">Below 35%: delist after vendor talk</Badge>}
                          {v.openProposal && (
                            <Link href={`/admin/pricing/proposals/${v.openProposal.proposalId}`} className="ml-1.5">
                              <Badge tone="warning">Open: {v.openProposal.proposalNo}</Badge>
                            </Link>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-ink-muted">{v.sku ?? "—"}</td>
                        <td className="py-2 pr-3 text-ink-muted">{v.pricingVersion ? `v${v.pricingVersion}` : "—"}</td>
                        <td className="py-2 pr-3 text-right"><Money value={v.displayPrice} /></td>
                        <td className="py-2 pr-3 text-right"><Money value={v.currentNrv} /></td>
                        <td className="py-2 pr-3 text-right tabular-nums">{v.currentTakeRate == null ? "—" : `${v.currentTakeRate}%`}</td>
                        <td className="py-2">
                          {v.services.length ? (
                            <div className="flex flex-wrap gap-1">
                              {v.services.map((s) => (
                                <Badge key={s.code} tone={s.oldFormula ? "warning" : "info"}>{s.name}{s.oldFormula ? " (old formula)" : ""}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-ink-muted">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {options.variations.some((v) => v.openProposal) && (
              <Notice tone="warning">A variation with an open proposal gets the new one instead: the open one is marked “Replaced by newer”.</Notice>
            )}
          </CardBody>
        </Card>
      )}

      {options && (
        <Card>
          <CardHeader
            title="3. Services"
            description={scope === "SINGLE" ? "Exactly these services will apply to the chosen variation (untick to remove one)." : "Variation-level picks are kept: services are added to (or removed from) each variation's own pick."}
            actions={
              scope !== "SINGLE" && (
                <Select value={operation} onChange={(e) => setOperation(e.target.value)} options={OPERATIONS} className="w-56" aria-label="Operation" />
              )
            }
          />
          <CardBody>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {options.services.map((s) => (
                <Checkbox
                  key={s.code}
                  checked={codes.includes(s.code)}
                  onChange={() => setCodes((list) => (list.includes(s.code) ? list.filter((c) => c !== s.code) : [...list, s.code]))}
                  label={
                    <span>
                      <span className="font-medium text-ink">{s.name}</span> <span className="text-xs text-ink-muted">({s.chargeText})</span>
                    </span>
                  }
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="primary" onClick={runPreview} loading={previewing} disabled={!scopeReady || !servicesReady}>
                Preview impact
              </Button>
              <span className="text-xs text-ink-muted">Nothing is saved or sent until you create the proposal.</span>
            </div>
            {previewError && <Notice tone="danger" className="mt-3">{previewError}</Notice>}
          </CardBody>
        </Card>
      )}

      {preview && (
        <Card>
          <CardHeader
            title="4. Impact per variation"
            description={`Base take rate ${preview.defaultTakeRateBps / 100}% + selected % services. Display prices do not change; the NRV is what the seller gets per unit.`}
          />
          <CardBody className="space-y-3">
            {preview.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-ink-muted">
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3">Variation</th>
                      <th className="py-2 pr-3 text-right">Display price</th>
                      <th className="py-2 pr-3 text-right">Take rate</th>
                      <th className="py-2 pr-3 text-right">Current NRV</th>
                      <th className="py-2 pr-3 text-right">Proposed NRV</th>
                      <th className="py-2 text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.items.map((i) => (
                      <tr key={i.variantId} className="border-b border-line last:border-0">
                        <td className="py-2 pr-3">
                          <span className="font-medium text-ink">{i.label}</span>
                          <span className="block text-xs text-ink-muted">{i.sku ?? "—"} · {i.proposedServiceCodes.join(", ") || "no services"}</span>
                        </td>
                        <td className="py-2 pr-3 text-right"><Money value={i.displayPrice} /></td>
                        <td className="py-2 pr-3 text-right tabular-nums">{i.currentTakeBps / 100}% → {i.proposedTakeBps / 100}%</td>
                        <td className="py-2 pr-3 text-right"><Money value={i.currentNrv} /></td>
                        <td className="py-2 pr-3 text-right"><Money value={i.proposedNrv} className="font-medium" /></td>
                        <td className="py-2 text-right"><Difference value={i.difference} /></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-line-strong text-ink-soft">
                      <td className="py-2 pr-3 text-xs" colSpan={3}>
                        Total of {preview.totals.variations} variation{preview.totals.variations === 1 ? "" : "s"} (aggregate, not a product NRV)
                      </td>
                      <td className="py-2 pr-3 text-right"><Money value={preview.totals.currentNrv} /></td>
                      <td className="py-2 pr-3 text-right"><Money value={preview.totals.proposedNrv} /></td>
                      <td className="py-2 text-right"><Difference value={preview.totals.difference} /></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            {preview.skipped.length > 0 && (
              <Notice tone="warning" title={`${preview.skipped.length} variation${preview.skipped.length === 1 ? "" : "s"} skipped`}>
                <ul className="mt-1 list-disc pl-4">
                  {preview.skipped.map((s) => (
                    <li key={s.variantId}>
                      {s.label}: {s.message}
                    </li>
                  ))}
                </ul>
              </Notice>
            )}
            {preview.items.length === 0 && <Notice tone="danger">None of the selected variations can take this change.</Notice>}
          </CardBody>
        </Card>
      )}

      {preview && preview.items.length > 0 && (
        <Card>
          <CardHeader title="5. Send to vendor" description="The vendor gets one notification with every variation listed and accepts or declines each one. Current pricing stays live until then." />
          <CardBody className="space-y-3">
            <Field label="Reason" required hint="Shown in the proposal and kept in the audit trail.">
              {({ id }) => <Textarea id={id} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} />}
            </Field>
            <Field label="Effective date" required hint="Accepted variations go live on this date, or when accepted if that is later.">
              {({ id }) => <Input id={id} type="date" min={today()} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="max-w-xs" />}
            </Field>
            {!canCreate && <Notice tone="warning">You can preview, but creating a proposal needs edit permission on products.</Notice>}
            <Button variant="primary" onClick={create} loading={creating} disabled={!canCreate || reason.trim().length < 3 || !effectiveDate}>
              Create proposal and notify vendor
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
