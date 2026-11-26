"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getB2bRfqSellerMatches,
  inviteB2bRfqSellers,
  openB2bRfq,
  saveB2bRfqSourcing,
  searchB2bRfqSellerListings,
  setB2bRfqOfferListing,
} from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR } from "@/lib/format";

/*
 * RFQ seller sourcing (task #107 subtask 4; spec §8, A2, screens 10-11): invite sellers, compare their
 * quotes (eligibility first, then the weighted rank), choose one or several sellers per line, map an
 * offer to the seller's own listing. Seller rates and landed cost reach this page only for roles with
 * cost visibility; the API enforces it, the page just shows what it gets.
 */

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

function Result({ result }) {
  if (!result) return null;
  return (
    <Notice tone={result.tone} className="mt-2">
      {result.text}
      {result.details?.length > 1 && (
        <ul className="mt-1 list-disc pl-5">
          {result.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </Notice>
  );
}

/** Open a draft RFQ (starts the SLA clock). */
export function OpenRfqButton({ rfqId }) {
  const { busy, result, run } = useRun();
  return (
    <>
      <Button size="sm" variant="primary" loading={busy} onClick={() => run(() => openB2bRfq(rfqId))}>
        Open RFQ
      </Button>
      {result?.tone === "danger" && <span className="ml-2 text-xs text-danger">{result.text}</span>}
    </>
  );
}

/** Seller matching and invites (spec §8): matched sellers first, any active B2B seller can be added. */
export function InviteSellers({ rfqId }) {
  const { busy, result, run, setResult } = useRun();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [picked, setPicked] = useState(new Set());

  async function show() {
    setOpen(true);
    setResult(null);
    setLoading(true);
    const res = await getB2bRfqSellerMatches(rfqId);
    setLoading(false);
    if (!res.ok) {
      setData({ error: res.message });
      return;
    }
    setData(res);
    setPicked(new Set(res.sellers.filter((s) => s.matchedLines.length && !s.invited).map((s) => s.sellerId)));
  }

  const toggle = (id) =>
    setPicked((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <Button size="sm" variant="secondary" onClick={show}>
        Invite sellers
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Invite sellers"
        description="Sellers listing the requested product (or a confirmed-linked one) are matched and pre-ticked. Any active B2B seller can be invited for free-text lines."
        footer={
          <Button variant="primary" loading={busy} disabled={!picked.size} onClick={() => run(() => inviteB2bRfqSellers(rfqId, [...picked]), () => setOpen(false))}>
            Invite {picked.size || ""} seller{picked.size === 1 ? "" : "s"}
          </Button>
        }
      >
        {loading && <p className="text-sm text-ink-muted">Loading sellers…</p>}
        {data?.error && <Notice tone="danger">{data.error}</Notice>}
        {data?.sellers && (
          <ul className="max-h-96 divide-y divide-line overflow-auto rounded-lg border border-line">
            {data.sellers.map((s) => (
              <li key={s.sellerId} className="flex items-start gap-3 px-3 py-2">
                <Checkbox checked={picked.has(s.sellerId)} disabled={Boolean(s.invited)} onChange={() => toggle(s.sellerId)} aria-label={`Invite ${s.seller}`} />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-ink">
                    {s.seller}{" "}
                    {s.matchedLines.length > 0 && (
                      <Badge tone="success">
                        lists {s.matchedLines.length} of {data.lines.length} line{data.lines.length === 1 ? "" : "s"}
                      </Badge>
                    )}{" "}
                    {s.invited && <Badge tone="neutral">invited · {s.invited}</Badge>}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {[s.state, s.pincode].filter(Boolean).join(" · ") || "No location"} · {s.listings} B2B listing{s.listings === 1 ? "" : "s"} · score {s.score ?? "no history"}
                    {!s.b2bEnabled && " · B2B registration not completed"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Dialog>
      <Result result={result?.tone === "success" ? result : null} />
    </>
  );
}

/** Maps an offer to one of the seller's own B2B listings. */
function MapListing({ rfqId, offer }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const timer = useRef(null);
  const search = (q) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await searchB2bRfqSellerListings(rfqId, offer.sellerId, q);
      setRows(res.listings || []);
    }, 250);
  };
  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setOpen(true);
          search("");
        }}
      >
        {offer.listing ? "Change listing" : "Map listing"}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={`${offer.seller}: which listing?`} description="The order line, stock reservation and settlement use this listing of the seller.">
        <Input placeholder="Search the seller's listings" onChange={(e) => search(e.target.value)} />
        <ul className="mt-2 max-h-72 divide-y divide-line overflow-auto rounded-lg border border-line">
          {rows.length === 0 && <li className="px-3 py-2 text-sm text-ink-muted">No active listing found.</li>}
          {rows.map((l) => (
            <li key={`${l.type}-${l.id}`}>
              <button
                type="button"
                disabled={busy}
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                onClick={() => run(() => setB2bRfqOfferListing(rfqId, offer.quoteItemId, { listingType: l.type, listingId: l.id }), () => setOpen(false))}
              >
                <span className="font-medium text-ink">{l.name}</span>
                <span className="block text-xs text-ink-muted">
                  {l.sku} · per {l.unit}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {result?.tone === "danger" && <Notice tone="danger" className="mt-2">{result.text}</Notice>}
      </Dialog>
    </>
  );
}

const FACTOR_LABEL = { landedCost: "Landed cost", dispatchSla: "Dispatch SLA", fulfillment: "Fulfilment", distance: "Distance", claims: "Claims", stockDepth: "Stock depth" };

/** Seller quote comparison and sourcing choice (screen 11). */
export function SourcingBoard({ rfqId, comparison, canSource }) {
  const { busy, result, run } = useRun();
  const cost = comparison.canViewCost;
  const initialQty = () => {
    const out = {};
    for (const line of comparison.lines) {
      const anySelected = line.offers.some((o) => o.selected);
      for (const o of line.offers) {
        const proposed = line.proposal.picks.find((p) => p.quoteItemId === o.quoteItemId);
        out[o.quoteItemId] = anySelected ? (o.selected ? String(o.allocatedQty ?? "") : "") : proposed ? String(proposed.qty) : "";
      }
    }
    return out;
  };
  const [qty, setQty] = useState(initialQty);
  const [reason, setReason] = useState("");
  const anyOffers = comparison.lines.some((l) => l.offers.length);

  function save() {
    run(() =>
      saveB2bRfqSourcing(rfqId, {
        reason,
        lines: comparison.lines.map((line) => ({
          rfqItemId: line.id,
          picks: line.offers.filter((o) => Number(qty[o.quoteItemId]) > 0).map((o) => ({ quoteItemId: o.quoteItemId, qty: Number(qty[o.quoteItemId]) })),
        })),
      }),
    );
  }

  return (
    <Card>
      <CardHeader
        title="Seller quote comparison"
        description={`Eligibility is checked before ranking. Score weights: ${Object.entries(comparison.weights)
          .map(([k, w]) => `${FACTOR_LABEL[k] ?? k} ${w}`)
          .join(", ")}.`}
      />
      <CardBody className="space-y-5">
        {cost && !comparison.freightConfigured && <Notice tone="warning">No freight rate card is configured, so landed cost is the seller rate alone. Add rate cards under Logistics to include freight.</Notice>}
        {cost && comparison.freightSource === "courier_slabs" && (
          <Notice tone="info">No B2B freight rate card yet: freight is an estimate from the courier cost slabs (the B2C master) by courier zone. Add rate cards under Logistics for real B2B freight.</Notice>
        )}
        {!cost && <Notice tone="info">Seller rates and landed cost are visible to managers only. A manager chooses the sourcing.</Notice>}
        {!anyOffers && <p className="text-sm text-ink-muted">No seller has quoted yet. Invited sellers answer from their B2B panel.</p>}
        {comparison.lines.map((line) => {
          const chosen = line.offers.reduce((s, o) => s + (Number(qty[o.quoteItemId]) || 0), 0);
          return (
            <section key={line.id} className="rounded-lg border border-line">
              <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-3 py-2">
                <p className="text-sm font-medium text-ink">
                  {line.requirement} {line.pack && <span className="text-ink-muted">· {line.pack}</span>}
                </p>
                <p className="text-xs text-ink-muted">
                  Need {line.quantity} {line.uom}
                  {cost && line.targetRate != null && ` · buyer target ${formatINR(line.targetRate)}`}
                  {canSource && ` · chosen ${chosen}`}
                  {line.proposal.shortBy > 0 && line.offers.length > 0 && <span className="ml-1 text-warning-ink">· eligible offers are short by {line.proposal.shortBy}: split, reduce, or source another seller</span>}
                </p>
              </header>
              {line.offers.length === 0 ? (
                <p className="px-3 py-3 text-sm text-ink-muted">No quotes for this line.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs text-ink-muted">
                      <tr className="border-b border-line">
                        <th className="px-3 py-2">Rank</th>
                        <th className="px-3 py-2">Seller / listing</th>
                        {cost && <th className="px-3 py-2 text-right">Rate</th>}
                        {cost && <th className="px-3 py-2 text-right">Freight / unit</th>}
                        {cost && <th className="px-3 py-2 text-right">Landed</th>}
                        <th className="px-3 py-2 text-right">Available</th>
                        <th className="px-3 py-2 text-right">MOQ</th>
                        <th className="px-3 py-2 text-right">Dispatch</th>
                        <th className="px-3 py-2">Valid until</th>
                        <th className="px-3 py-2 text-right">Score</th>
                        {canSource && <th className="px-3 py-2 text-right">Take qty</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {line.offers.map((o) => (
                        <tr key={o.quoteItemId} className={`border-b border-line align-top last:border-0 ${o.eligible ? "" : "bg-surface-muted/60"}`}>
                          <td className="px-3 py-2">
                            {o.eligible ? <Badge tone={o.rank === 1 ? "success" : "neutral"}>#{o.rank}</Badge> : <Badge tone="danger">Not eligible</Badge>}
                            {o.cheapest && <span className="mt-1 block text-xs text-success-ink">Cheapest</span>}
                            {o.selected && <span className="mt-1 block text-xs font-medium text-brand-700">Selected {o.allocatedQty}</span>}
                          </td>
                          <td className="px-3 py-2">
                            <p className="font-medium text-ink">{o.seller}</p>
                            <p className="text-xs text-ink-muted">
                              {o.listing ? `${o.listing.name}${o.listing.auto ? " (auto-matched)" : ""}` : "No listing mapped"}
                              {o.batchNo && ` · batch ${o.batchNo}`}
                              {o.expiryDate && ` · exp ${o.expiryDate}`}
                              {o.taxTreatment && ` · ${o.taxTreatment}`}
                              {o.zoneLabel && ` · ${o.zoneLabel}`}
                            </p>
                            {!o.eligible && <p className="text-xs text-danger-ink">{o.reasons.map((r) => r.message).join(" ")}</p>}
                            {o.terms && <p className="text-xs text-ink-muted">Terms: {o.terms}</p>}
                            {canSource && <div className="mt-1"><MapListing rfqId={rfqId} offer={o} /></div>}
                          </td>
                          {cost && <td className="px-3 py-2 text-right tabular-nums">{formatINR(o.rate)}</td>}
                          {cost && <td className="px-3 py-2 text-right tabular-nums">{o.freightPerUnit == null ? "—" : formatINR(o.freightPerUnit)}</td>}
                          {cost && <td className="px-3 py-2 text-right font-medium tabular-nums">{formatINR(o.landedRate)}</td>}
                          <td className="px-3 py-2 text-right tabular-nums">{o.availableQty}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{o.moq}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{o.dispatchHours ? `${o.dispatchHours} h` : "—"}</td>
                          <td className="px-3 py-2 text-xs">{o.validUntil ? formatDateTime(o.validUntil) : "—"}</td>
                          <td className="px-3 py-2 text-right tabular-nums" title={o.factors ? Object.entries(o.factors).filter(([, v]) => v != null).map(([k, v]) => `${FACTOR_LABEL[k] ?? k}: ${v}`).join("\n") : undefined}>
                            {o.score ?? "—"}
                          </td>
                          {canSource && (
                            <td className="px-3 py-2 text-right">
                              <Input
                                aria-label={`Quantity from ${o.seller}`}
                                className="w-24 text-right"
                                type="number"
                                min="0"
                                step="1"
                                disabled={!o.eligible}
                                value={qty[o.quoteItemId] ?? ""}
                                onChange={(e) => setQty((cur) => ({ ...cur, [o.quoteItemId]: e.target.value }))}
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
        {canSource && anyOffers && (
          <div className="space-y-2">
            <Field label="Reason" hint="Required when a seller other than the cheapest eligible one is chosen, or a line gets less than its quantity.">
              <Textarea value={reason} maxLength={400} rows={2} onChange={(e) => setReason(e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <Button variant="primary" loading={busy} onClick={save}>
                Save sourcing
              </Button>
            </div>
            <Result result={result} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
