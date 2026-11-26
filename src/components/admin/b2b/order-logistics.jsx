"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bookB2bShipment, loadB2bShipmentOptions, recordB2bShipmentFreight, setB2bShipmentProof, updateB2bShipment, loadB2bShipmentTracking } from "@/lib/actions/admin/b2b-screens";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR, formatNumber, formatPercent } from "@/lib/format";

const MODES = [
  ["courier", "Courier"],
  ["surface_cargo", "Surface cargo"],
  ["ptl", "PTL"],
  ["ftl", "FTL"],
  ["transporter", "Transporter"],
];
const MODE_LABEL = Object.fromEntries(MODES);
const BAND_TONE = { green: "success", healthy: "info", warning: "warning", review: "danger" };
const BAND_LABEL = { green: "On target", healthy: "Healthy", warning: "Warning", review: "Manager review" };
const SHIP_TONE = { created: "neutral", pickup_scheduled: "info", picked: "info", in_transit: "info", delayed: "warning", ofd: "info", delivered: "success", rto: "danger", lost: "danger", damaged: "danger", cancelled: "neutral" };
// Next steps first, exceptions after.
const SHIP_ACTIONS = ["schedule_pickup", "picked", "in_transit", "ofd", "delivered", "hub", "missed_pickup", "delayed", "rto", "lost", "damaged", "cancel"];
const DANGER = new Set(["rto", "lost", "damaged", "cancel", "missed_pickup", "delayed"]);

const newKey = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

function Band({ ns }) {
  if (!ns || ns.pct === null || ns.pct === undefined) return <span className="text-ink-muted">—</span>;
  return (
    <span className="inline-flex items-center gap-1">
      {formatPercent(ns.pct, 2)} <Badge tone={BAND_TONE[ns.band] ?? "neutral"}>{BAND_LABEL[ns.band] ?? ns.band}</Badge>
    </span>
  );
}

/**
 * Logistics of one order (spec §13): booking with rate comparison / transporter quote, pickup,
 * tracking, exceptions, actual freight with net shipping % and realized CM, proof.
 */
const PROVIDER_LABEL = { rate_card: "rate card", manual: "transporter quote", cargo: "live quote · Shiprocket Cargo", delhivery: "live quote · Delhivery B2B", parcel: "live quote · parcel courier" };
const LIVE_PROVIDERS = new Set(["cargo", "delhivery", "parcel"]);

export function OrderLogistics({ orderId, logistics }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const [booking, setBooking] = useState(null); // { key, quote, selected, manual, packageIds, ... }
  const [act, setAct] = useState(null); // { shipment, action, note, pickupAt, location }
  const [freight, setFreight] = useState(null); // { shipment, amount, invoiceRef }
  const [proof, setProof] = useState(null); // { shipment, url }
  const [tracking, setTracking] = useState({}); // shipmentId -> live carrier tracking result

  if (!logistics) return null;
  const L = logistics;
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details });
      if (res?.ok) {
        after?.(res);
        router.refresh();
      }
    });

  const openBooking = () =>
    start(async () => {
      const ids = L.unshippedPackages.map((p) => p.id);
      const quote = await loadB2bShipmentOptions(orderId, ids);
      if (!quote.ok) return setResult({ tone: "danger", text: quote.message });
      const best = quote.recommended?.bestOverall ?? null;
      setBooking({ key: newKey(), quote, packageIds: ids, selected: best, manual: !quote.options?.length, carrier: "", mode: "transporter", freightEstimate: "", etaDays: "", awbLr: "", bookingRef: "", pickupAt: "", reviewReason: "", live: false, fromPincode: "" });
    });

  const reloadOptions = (packageIds, live = booking?.live, fromPincode = booking?.fromPincode) =>
    start(async () => {
      const quote = await loadB2bShipmentOptions(orderId, packageIds, { live, fromPincode });
      if (!quote.ok) return setResult({ tone: "danger", text: quote.message });
      setBooking((b) => ({ ...b, quote, packageIds, live: Boolean(live), selected: quote.recommended?.bestOverall ?? null, manual: quote.options?.length ? false : b.manual }));
    });

  // Live carrier quotes: a call to Shiprocket Cargo / Delhivery B2B / parcel couriers, only on request.
  const getLiveRates = () => reloadOptions(booking.packageIds, true, booking.fromPincode);

  const showTracking = (sh) =>
    start(async () => {
      const res = await loadB2bShipmentTracking(sh.id);
      setTracking((t) => ({ ...t, [sh.id]: res.ok ? res : { available: false, message: res.message } }));
    });

  const chosen = booking && !booking.manual ? booking.quote.options.find((o) => o.key === booking.selected) : null;
  const impact = chosen?.impact;
  const needsReview = Boolean(impact?.reviewRequired);
  const bookValid =
    booking &&
    booking.packageIds.length > 0 &&
    (booking.awbLr.trim() || booking.bookingRef.trim()) &&
    (booking.manual ? booking.carrier.trim() && booking.freightEstimate !== "" && Number(booking.freightEstimate) >= 0 : Boolean(chosen?.available)) &&
    (!needsReview || booking.reviewReason.trim().length >= 5);

  const submitBooking = () =>
    run(
      () =>
        bookB2bShipment(orderId, {
          idempotencyKey: booking.key,
          packageIds: booking.packageIds,
          provider: booking.manual ? "manual" : chosen.live ? "live" : "rate_card",
          ...(booking.manual
            ? { carrier: booking.carrier.trim(), mode: booking.mode, freightEstimate: Number(booking.freightEstimate), ...(booking.etaDays ? { etaDays: Number(booking.etaDays) } : {}) }
            : chosen.live
              ? { liveKey: chosen.liveKey, ...(/^\d{6}$/.test(booking.fromPincode) ? { fromPincode: booking.fromPincode } : {}) }
              : { rateId: chosen.rateId }),
          awbLr: booking.awbLr.trim(),
          bookingRef: booking.bookingRef.trim(),
          ...(booking.pickupAt ? { pickupAt: booking.pickupAt } : {}),
          reviewReason: booking.reviewReason.trim(),
        }),
      () => setBooking(null),
    );

  const s = L.summary;
  return (
    <Card>
      <CardHeader
        title="Logistics"
        description="Shipments, freight and net shipping % (target / warning / review thresholds are B2B settings)."
        actions={
          L.bookable && L.canBook ? (
            <Button size="sm" variant="primary" disabled={busy} onClick={openBooking}>
              Book shipment
            </Button>
          ) : null
        }
      />
      <CardBody className="space-y-3">
        {result && (
          <Notice tone={result.tone}>
            {result.text}
            {result.details?.length > 1 && (
              <ul className="mt-1 list-disc pl-5">
                {result.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </Notice>
        )}

        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div><dt className="text-ink-muted">Shipping in the offer</dt><dd>{formatINR(s.shippingExpected)} · <Band ns={s.expected} /></dd></div>
          <div><dt className="text-ink-muted">Booked freight (estimate)</dt><dd>{formatINR(s.freightEstimate)}</dd></div>
          <div><dt className="text-ink-muted">Billed freight</dt><dd>{s.freightActual === null ? "Not billed yet" : <>{formatINR(s.freightActual)} · <Band ns={s.realized} /></>}</dd></div>
          {s.variance !== null && <div><dt className="text-ink-muted">Freight variance</dt><dd className={s.variance > 0 ? "text-danger-ink" : "text-success-ink"}>{formatINR(s.variance)}</dd></div>}
          {s.realizedCmPct !== null && <div><dt className="text-ink-muted">Realized CM</dt><dd>{formatPercent(s.realizedCmPct, 2)}</dd></div>}
        </dl>

        {L.unshippedPackages.length > 0 && (
          <p className="text-sm text-ink-soft">
            Not shipped yet: {L.unshippedPackages.map((p) => (p.originalPack ? "Original pack" : p.code)).join(", ")} ({L.unshippedPackages.length} package{L.unshippedPackages.length === 1 ? "" : "s"})
          </p>
        )}

        {L.shipments.length === 0 && <p className="text-sm text-ink-muted">No shipment yet.</p>}
        {L.shipments.map((sh) => (
          <div key={sh.id} className="space-y-2 rounded-md border border-line p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="font-medium text-ink">{sh.carrier || "Carrier"}</span> · {MODE_LABEL[sh.mode] ?? sh.mode}
                {sh.zone ? ` · zone ${sh.zone}` : ""} · {PROVIDER_LABEL[sh.provider] ?? "transporter quote"}
                <span className="block font-mono text-xs text-ink-muted">{[sh.awbLr && `AWB/LR ${sh.awbLr}`, sh.bookingRef && `Ref ${sh.bookingRef}`].filter(Boolean).join(" · ")}</span>
                <span className="block text-xs text-ink-muted">
                  {sh.packageCount} package{sh.packageCount === 1 ? "" : "s"} · {formatNumber(sh.chargeableKg)} kg chargeable
                  {sh.freightEstimate !== null ? ` · estimate ${formatINR(sh.freightEstimate)}` : ""}
                  {sh.freightActual !== null ? ` · billed ${formatINR(sh.freightActual)} (${sh.freightInvoiceRef})` : ""}
                  {sh.etaDays !== null ? ` · ETA ${sh.etaDays} day${sh.etaDays === 1 ? "" : "s"}` : ""}
                </span>
                {sh.pickupAt && sh.status === "pickup_scheduled" && <span className="block text-xs text-ink-muted">Pickup {formatDateTime(sh.pickupAt)}</span>}
                {sh.missedPickups > 0 && <span className="block text-xs text-warning-ink">Pickup missed {sh.missedPickups}×</span>}
                {sh.reviewRequired && <span className="block text-xs text-danger-ink">Above the net shipping review threshold: {sh.reviewReason}</span>}
                {sh.exception && <span className="block text-xs text-danger-ink">{sh.exception.type.replace(/_/g, " ")}: {sh.exception.note}</span>}
                {sh.podUrl && (
                  <a href={sh.podUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-700 hover:underline">
                    Proof (POD / LR)
                  </a>
                )}
              </div>
              <Badge tone={SHIP_TONE[sh.status] ?? "neutral"}>{sh.label}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SHIP_ACTIONS.filter((k) => sh.actions[k]?.inState).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={DANGER.has(k) ? "ghost" : "secondary"}
                  className={DANGER.has(k) ? "text-danger-ink" : undefined}
                  disabled={busy || !sh.actions[k].allowed}
                  title={sh.actions[k].allowed ? undefined : sh.actions[k].reason}
                  onClick={() =>
                    sh.actions[k].needsNote || sh.actions[k].needs.length
                      ? setAct({ shipment: sh, action: k, note: "", pickupAt: "", location: "" })
                      : run(() => updateB2bShipment(orderId, sh.id, k))
                  }
                >
                  {sh.actions[k].label}
                </Button>
              ))}
              {L.canRecordFreight && sh.status !== "cancelled" && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => setFreight({ shipment: sh, amount: sh.freightActual ?? "", invoiceRef: sh.freightInvoiceRef })}>
                  {sh.freightActual === null ? "Record billed freight" : "Correct billed freight"}
                </Button>
              )}
              {sh.status !== "cancelled" && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => setProof({ shipment: sh, url: sh.podUrl })}>
                  {sh.podUrl ? "Change proof" : "Attach proof"}
                </Button>
              )}
              {LIVE_PROVIDERS.has(sh.provider) && sh.awbLr && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => showTracking(sh)}>
                  Live tracking
                </Button>
              )}
            </div>
            {tracking[sh.id] && (
              <div className="rounded-md bg-surface-muted p-2 text-xs">
                {tracking[sh.id].available ? (
                  <>
                    <p className="font-medium text-ink">
                      {tracking[sh.id].courierName || sh.carrier}: {tracking[sh.id].status || "no status yet"}
                      {tracking[sh.id].edd ? ` · expected ${tracking[sh.id].edd}` : ""}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {(tracking[sh.id].events ?? []).slice(0, 12).map((e, i) => (
                        <li key={i}>
                          <span className="text-ink-muted">{e.at}</span> · {e.status}
                          {e.location ? ` @ ${e.location}` : ""}
                          {e.remark ? ` · ${e.remark}` : ""}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-ink-muted">{tracking[sh.id].message}</p>
                )}
              </div>
            )}
            {sh.events.length > 0 && (
              <details>
                <summary className="cursor-pointer text-xs text-ink-muted">Tracking history ({sh.events.length})</summary>
                <ul className="mt-1 space-y-0.5 text-xs">
                  {sh.events.map((e) => (
                    <li key={e.id}>
                      <span className="text-ink-muted">{formatDateTime(e.at)}</span> · {e.event.replace(/_/g, " ")}
                      {e.location ? ` @ ${e.location}` : ""}
                      {e.note ? ` · ${e.note}` : ""}
                      {e.actor ? ` · ${e.actor}` : ""}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </CardBody>

      {/* Booking */}
      <Dialog
        open={Boolean(booking)}
        onClose={() => setBooking(null)}
        size="lg"
        title="Book shipment"
        description={booking ? `Zone ${booking.quote.zone ?? "unknown"} · ${formatNumber(booking.quote.weights?.chargeableKg)} kg (actual ${formatNumber(booking.quote.weights?.actualKg)} kg)` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBooking(null)} disabled={busy}>Back</Button>
            <Button variant="primary" loading={busy} disabled={!bookValid} onClick={submitBooking}>Book</Button>
          </>
        }
      >
        {booking && (
          <div className="space-y-3 text-sm">
            {booking.quote.serviceability?.known && booking.quote.serviceability.serviceable === false && (
              <Notice tone="danger">This pincode is marked not serviceable for B2B in the pincode master.</Notice>
            )}
            <fieldset className="space-y-1">
              <legend className="text-label font-medium text-ink-soft">Packages</legend>
              {L.unshippedPackages.map((p) => (
                <label key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={booking.packageIds.includes(p.id)}
                    onChange={(e) => {
                      const ids = e.target.checked ? [...booking.packageIds, p.id] : booking.packageIds.filter((x) => x !== p.id);
                      setBooking({ ...booking, packageIds: ids });
                      if (ids.length) reloadOptions(ids);
                    }}
                  />
                  {p.originalPack ? "Original pack" : `${p.code} · ${p.type}`} · {formatNumber(p.weightKg)} kg
                  {p.lengthCm ? ` · ${p.lengthCm}×${p.widthCm}×${p.heightCm} cm` : ""}
                </label>
              ))}
            </fieldset>

            <div className="flex gap-2">
              <Button size="sm" variant={booking.manual ? "secondary" : "primary"} disabled={!booking.quote.options?.length} onClick={() => setBooking({ ...booking, manual: false })}>Rate options</Button>
              <Button size="sm" variant={booking.manual ? "primary" : "secondary"} onClick={() => setBooking({ ...booking, manual: true })}>Transporter quote</Button>
            </div>
            <div className="flex flex-wrap items-end gap-2 rounded-md border border-line p-2">
              <Field label="Pickup pincode (optional)" className="w-44">
                {({ id }) => <Input id={id} inputMode="numeric" maxLength={6} placeholder="seller's" value={booking.fromPincode} onChange={(e) => setBooking({ ...booking, fromPincode: e.target.value.replace(/\D/g, "") })} />}
              </Field>
              <Button size="sm" variant="secondary" loading={busy} disabled={!booking.packageIds.length || (booking.fromPincode !== "" && booking.fromPincode.length !== 6)} onClick={getLiveRates}>
                {booking.live ? "Refresh live carrier rates" : "Get live carrier rates"}
              </Button>
              <span className="text-xs text-ink-muted">Shiprocket Cargo, Delhivery B2B and parcel couriers quote this load. Nothing is booked at the carrier.</span>
            </div>
            {booking.quote.live && (
              <div className="text-xs text-ink-muted">
                Live from {booking.quote.live.from?.pincode || "?"}
                {booking.quote.live.from?.source === "seller" ? " (seller address)" : ""}: {booking.quote.live.count} quote{booking.quote.live.count === 1 ? "" : "s"}.
                {booking.quote.live.notes?.length > 0 && (
                  <ul className="mt-0.5 list-disc pl-4">
                    {booking.quote.live.notes.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                )}
              </div>
            )}
            {booking.quote.message && <Notice tone="info">{booking.quote.message}</Notice>}
            {booking.quote.zoneEstimate && (
              <Notice tone="info" title="Estimate from courier cost slabs">
                {booking.quote.zoneEstimate.amount != null ? (
                  <>
                    {booking.quote.zoneEstimate.zoneLabel} ({booking.quote.zoneEstimate.fromPincode} → {booking.quote.pincode}), {booking.quote.zoneEstimate.chargeableKg} kg: about {formatINR(booking.quote.zoneEstimate.amount)}
                    {booking.quote.zoneEstimate.impact?.pct != null ? ` · net shipping ${formatPercent(booking.quote.zoneEstimate.impact.pct)}` : ""}.
                    <span className="mt-1 block text-xs">The B2C courier master, not a carrier quote. Book with the transporter&apos;s real quote.</span>
                    <Button size="sm" variant="secondary" className="mt-2" onClick={() => setBooking({ ...booking, manual: true, freightEstimate: String(booking.quote.zoneEstimate.amount) })}>Use as freight estimate</Button>
                  </>
                ) : (
                  <>No courier slab covers this weight{booking.quote.zoneEstimate.zone ? "" : ", or a pincode is not in the pincode master"}.</>
                )}
              </Notice>
            )}

            {!booking.manual && booking.quote.options?.length > 0 && (
              <div className="space-y-1.5">
                {booking.quote.options.map((o) => {
                  const tags = [booking.quote.recommended.bestOverall === o.key && "Best overall", booking.quote.recommended.bestCost === o.key && "Best cost", booking.quote.recommended.fastest === o.key && "Fastest"].filter(Boolean);
                  return (
                    <label key={o.key} className={`flex cursor-pointer items-start justify-between gap-2 rounded-md border p-2 ${booking.selected === o.key ? "border-brand-600 bg-brand-50" : "border-line"} ${o.available ? "" : "opacity-50"}`}>
                      <span className="flex items-start gap-2">
                        <input type="radio" name="rate" disabled={!o.available} checked={booking.selected === o.key} onChange={() => setBooking({ ...booking, selected: o.key })} />
                        <span>
                          <span className="font-medium text-ink">{o.carrier}</span> · {MODE_LABEL[o.mode] ?? o.mode}
                          {o.live && <Badge tone="success" className="ml-1">Live</Badge>}
                          <span className="block text-xs text-ink-muted">
                            {formatNumber(o.chargeableKg)} kg chargeable · ETA {o.transitDays ?? "?"} day(s){o.pickupSlaHours ? ` · pickup within ${o.pickupSlaHours} h` : ""}
                            {o.codSupported ? " · COD" : ""}
                          </span>
                          {!o.available && <span className="block text-xs text-danger-ink">{o.unavailableReason}</span>}
                          {tags.length > 0 && (
                            <span className="mt-0.5 flex gap-1">
                              {tags.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-medium">{formatINR(o.exGst)}</span>
                        <span className="block text-xs text-ink-muted" title={o.live && !o.gstFromCarrier ? "Carrier quoted one amount; GST worked out at the freight GST rate" : undefined}>
                          + GST {formatINR(o.gst)}{o.live && !o.gstFromCarrier ? " (est.)" : ""}
                        </span>
                        <span className="block text-xs"><Band ns={o.impact} /></span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {booking.manual && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Carrier / transporter" required>
                  {({ id }) => <Input id={id} value={booking.carrier} maxLength={120} onChange={(e) => setBooking({ ...booking, carrier: e.target.value })} />}
                </Field>
                <Field label="Mode" required>
                  {({ id }) => (
                    <select id={id} className="h-9 w-full rounded-md border border-line bg-surface px-2" value={booking.mode} onChange={(e) => setBooking({ ...booking, mode: e.target.value })}>
                      {MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Quoted freight (ex-GST)" required>
                  {({ id }) => <Input id={id} inputMode="decimal" value={booking.freightEstimate} onChange={(e) => setBooking({ ...booking, freightEstimate: e.target.value })} />}
                </Field>
                <Field label="ETA (days)">
                  {({ id }) => <Input id={id} inputMode="numeric" value={booking.etaDays} onChange={(e) => setBooking({ ...booking, etaDays: e.target.value })} />}
                </Field>
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-3">
              <Field label="AWB / LR number" hint="This, or the booking reference">
                {({ id }) => <Input id={id} value={booking.awbLr} maxLength={80} onChange={(e) => setBooking({ ...booking, awbLr: e.target.value })} />}
              </Field>
              <Field label="Booking reference">
                {({ id }) => <Input id={id} value={booking.bookingRef} maxLength={80} onChange={(e) => setBooking({ ...booking, bookingRef: e.target.value })} />}
              </Field>
              <Field label="Pickup (optional)">
                {({ id }) => <Input id={id} type="datetime-local" value={booking.pickupAt} onChange={(e) => setBooking({ ...booking, pickupAt: e.target.value })} />}
              </Field>
            </div>
            {(needsReview || booking.manual) && (
              <Field label={needsReview ? "Reason (net shipping above the review threshold; the manager is alerted)" : "Reason if net shipping goes above the review threshold"} required={needsReview}>
                {({ id }) => <Textarea id={id} value={booking.reviewReason} maxLength={400} onChange={(e) => setBooking({ ...booking, reviewReason: e.target.value })} />}
              </Field>
            )}
            <p className="text-xs text-ink-muted">Rate-card freight is priced again on the server; booking twice with this form is not possible.</p>
          </div>
        )}
      </Dialog>

      {/* Shipment action with a note / date / location */}
      <Dialog
        open={Boolean(act)}
        onClose={() => setAct(null)}
        title={act ? act.shipment.actions[act.action].label : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAct(null)} disabled={busy}>Back</Button>
            <Button
              variant={act && DANGER.has(act.action) ? "danger" : "primary"}
              loading={busy}
              disabled={
                !act ||
                (act.shipment.actions[act.action].needsNote && act.note.trim().length < 5) ||
                (act.shipment.actions[act.action].needs.includes("pickupAt") && !act.pickupAt) ||
                (act.shipment.actions[act.action].needs.includes("location") && !act.location.trim())
              }
              onClick={() => run(() => updateB2bShipment(orderId, act.shipment.id, act.action, { note: act.note.trim(), pickupAt: act.pickupAt || undefined, location: act.location.trim() }), () => setAct(null))}
            >
              Save
            </Button>
          </>
        }
      >
        {act && (
          <div className="space-y-3">
            {act.shipment.actions[act.action].needs.includes("pickupAt") && (
              <Field label="Pickup date and time" required>
                {({ id }) => <Input id={id} type="datetime-local" value={act.pickupAt} onChange={(e) => setAct({ ...act, pickupAt: e.target.value })} />}
              </Field>
            )}
            {act.shipment.actions[act.action].needs.includes("location") && (
              <Field label="Hub / location" required>
                {({ id }) => <Input id={id} value={act.location} maxLength={150} onChange={(e) => setAct({ ...act, location: e.target.value })} />}
              </Field>
            )}
            {act.shipment.actions[act.action].needsNote && (
              <Field label="Note (saved in the tracking history)" required hint="At least 5 characters.">
                {({ id }) => <Textarea id={id} value={act.note} maxLength={400} onChange={(e) => setAct({ ...act, note: e.target.value })} />}
              </Field>
            )}
          </div>
        )}
      </Dialog>

      {/* Billed freight */}
      <Dialog
        open={Boolean(freight)}
        onClose={() => setFreight(null)}
        title="Billed freight"
        description="Ex-GST amount on the carrier's invoice. The estimate stays; realized CM is recalculated."
        footer={
          <>
            <Button variant="secondary" onClick={() => setFreight(null)} disabled={busy}>Back</Button>
            <Button
              variant="primary"
              loading={busy}
              disabled={!freight || freight.amount === "" || Number(freight.amount) < 0 || String(freight.invoiceRef ?? "").trim().length < 2}
              onClick={() => run(() => recordB2bShipmentFreight(orderId, freight.shipment.id, freight.amount, freight.invoiceRef), () => setFreight(null))}
            >
              Save
            </Button>
          </>
        }
      >
        {freight && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Amount (ex-GST)" required>
              {({ id }) => <Input id={id} inputMode="decimal" value={freight.amount} onChange={(e) => setFreight({ ...freight, amount: e.target.value })} />}
            </Field>
            <Field label="Invoice number" required>
              {({ id }) => <Input id={id} value={freight.invoiceRef} maxLength={80} onChange={(e) => setFreight({ ...freight, invoiceRef: e.target.value })} />}
            </Field>
          </div>
        )}
      </Dialog>

      {/* Proof */}
      <Dialog
        open={Boolean(proof)}
        onClose={() => setProof(null)}
        title="Proof of delivery / LR"
        description="Link (https) of the stored POD, LR copy or photo."
        footer={
          <>
            <Button variant="secondary" onClick={() => setProof(null)} disabled={busy}>Back</Button>
            <Button variant="primary" loading={busy} disabled={!proof || !/^https:\/\/\S{8,}$/.test(String(proof.url ?? "").trim())} onClick={() => run(() => setB2bShipmentProof(orderId, proof.shipment.id, proof.url), () => setProof(null))}>
              Save
            </Button>
          </>
        }
      >
        {proof && <Input value={proof.url} placeholder="https://…" onChange={(e) => setProof({ ...proof, url: e.target.value })} />}
      </Dialog>
    </Card>
  );
}
