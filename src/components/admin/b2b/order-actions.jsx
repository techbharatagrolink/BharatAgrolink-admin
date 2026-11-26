"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { recordB2bOrderSeller, transitionB2bOrder } from "@/lib/actions/admin/b2b-screens";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatINR } from "@/lib/format";

// The next step of the flow first, then the side paths (hold, RTO, cancel).
const ORDER = ["release_gate", "send_to_sellers", "reserve", "start_packing", "mark_packed", "dispatch", "in_transit", "deliver", "close", "release_hold", "rto_received", "hold", "rto", "cancel"];
const DANGER = new Set(["cancel", "rto", "hold"]);

function useRun() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const run = (fn, after) =>
    start(async () => {
      const res = await fn();
      setResult(res?.ok ? { tone: "success", text: res.message || "Done." } : { tone: "danger", text: res?.message || "That did not work.", details: res?.details });
      if (res?.ok) {
        after?.();
        router.refresh();
      }
    });
  return { busy, result, run };
}

/**
 * Order action bar (spec C7, §22). Only actions possible in the current state are shown; a
 * disabled button says why (role, payment, sellers). The API checks everything again.
 */
const BLANK_PACKAGE = { packageCode: "", originalPack: false, lengthCm: "", widthCm: "", heightCm: "", weightKg: "", contents: "" };

export function OrderActions({ id, actions, packageTypes = [], suggestion = null }) {
  const { busy, result, run } = useRun();
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ reason: "", awbNumber: "", courierName: "" });
  const [packages, setPackages] = useState([{ ...BLANK_PACKAGE }]);

  const visible = ORDER.filter((k) => actions?.[k]?.inState);
  const current = open ? actions[open] : null;
  const isBag = (code) => packageTypes.find((t) => t.code === code)?.type === "Bag";
  const packageOk = (p) =>
    Number(p.weightKg) > 0 && (p.originalPack || p.packageCode) && (isBag(p.packageCode) || [p.lengthCm, p.widthCm, p.heightCm].every((v) => Number(v) > 0));
  const needsForm = current && (current.needsReason || current.needs.length > 0 || current.packing);
  const valid =
    !current ||
    ((!current.needsReason || form.reason.trim().length >= 5) && current.needs.every((f) => form[f].trim()) && (!current.packing || (packages.length > 0 && packages.every(packageOk))));

  const click = (key) => {
    const a = actions[key];
    setForm({ reason: "", awbNumber: "", courierName: "" });
    setPackages([{ ...BLANK_PACKAGE }]);
    if (a.needsReason || a.needs.length || a.packing) setOpen(key);
    else run(() => transitionB2bOrder(id, key));
  };
  const submit = () =>
    run(
      () =>
        transitionB2bOrder(id, open, {
          reason: form.reason.trim(),
          awbNumber: form.awbNumber.trim(),
          courierName: form.courierName.trim(),
          ...(current?.packing
            ? {
                packages: packages.map((p) => ({
                  packageCode: p.originalPack ? "" : p.packageCode,
                  originalPack: p.originalPack,
                  lengthCm: Number(p.lengthCm) || undefined,
                  widthCm: Number(p.widthCm) || undefined,
                  heightCm: Number(p.heightCm) || undefined,
                  weightKg: Number(p.weightKg),
                  contents: p.contents.trim(),
                })),
              }
            : {}),
        }),
      () => setOpen(null),
    );
  // Package rows from the suggestion (spec §12): original cases with their size, then one row per
  // suggested carton / bag. Weight stays empty: the packer enters the actual weight.
  const applySuggestion = () => {
    const rows = [];
    const dims = (cm) => (cm ? { lengthCm: String(cm[0]), widthCm: String(cm[1]), heightCm: String(cm[2]) } : {});
    for (const c of suggestion?.originalCases ?? []) {
      for (let n = 0; n < Math.min(c.cases, 50); n++) rows.push({ ...BLANK_PACKAGE, originalPack: true, ...dims(c.caseCm), contents: `${c.unitsPerCase} × ${c.name}` });
    }
    for (const g of suggestion?.groups ?? []) {
      const type = packageTypes.find((t) => t.code === g.packageCode);
      for (let n = 0; n < Math.min(g.packages || 1, 50); n++) {
        rows.push({ ...BLANK_PACKAGE, packageCode: g.packageCode || "", ...(type?.type === "Bag" ? {} : dims(type?.cm ?? g.cm)), contents: (g.items ?? []).join(", ").slice(0, 400) });
      }
    }
    if (rows.length) setPackages(rows.slice(0, 200));
  };
  const setPackage = (i, patch) => setPackages((list) => list.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  if (!visible.length) return <p className="text-sm text-ink-muted">This order is closed: no further steps.</p>;

  return (
    <div className="space-y-3">
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
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface/95 p-3 backdrop-blur">
        {visible.map((key, i) => {
          const a = actions[key];
          return (
            <Button
              key={key}
              size="sm"
              variant={DANGER.has(key) ? "ghost" : i === 0 ? "primary" : "secondary"}
              className={DANGER.has(key) ? "text-danger-ink" : undefined}
              disabled={busy || !a.allowed}
              title={a.allowed ? undefined : a.reason}
              onClick={() => click(key)}
            >
              {a.label}
            </Button>
          );
        })}
        {busy && <span className="text-xs text-ink-muted">Working…</span>}
      </div>
      {visible.some((k) => !actions[k].allowed) && (
        <ul className="space-y-0.5 text-xs text-ink-muted">
          {visible
            .filter((k) => !actions[k].allowed)
            .map((k) => (
              <li key={k}>
                <span className="font-medium">{actions[k].label}:</span> {actions[k].reason}
              </li>
            ))}
        </ul>
      )}

      <Dialog
        open={Boolean(needsForm)}
        onClose={() => setOpen(null)}
        size={current?.packing ? "lg" : "md"}
        title={current?.label}
        description={open === "cancel" ? "The order and its lines are cancelled. Money already received is flagged for refund." : open === "release_gate" ? "Payment is not received: confirm only when Finance approved credit." : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(null)} disabled={busy}>Back</Button>
            <Button variant={DANGER.has(open) ? "danger" : "primary"} loading={busy} disabled={!valid} onClick={submit}>
              {current?.label}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {current?.packing && (
            <div className="space-y-3">
              {suggestion && (suggestion.originalCases?.length > 0 || suggestion.groups?.length > 0 || suggestion.loose) && (
                <Notice tone="info" title="Suggested packing">
                  <ul className="list-disc space-y-1 pl-5">
                    {suggestion.originalCases?.map((c) => (
                      <li key={`case-${c.name}`}>
                        {c.name}: {c.cases} original case{c.cases === 1 ? "" : "s"} of {c.unitsPerCase} (no repacking)
                        {c.caseCm ? ` · ${c.caseCm.join(" × ")} cm` : ""}
                        {c.caseKg ? ` · about ${c.caseKg} kg each` : ""}
                        {c.liquid ? " · liquid: keep upright" : ""}
                        {c.hazardous ? " · hazardous: label it" : ""}
                      </li>
                    ))}
                    {(suggestion.groups ?? []).map((g) => (
                      <li key={`group-${g.kind}`}>
                        {g.kind === "liquid" ? "Loose liquids" : "Loose dry goods"} ({g.lines} line{g.lines === 1 ? "" : "s"}{g.weightKg ? `, about ${g.weightKg} kg` : ""})
                        {g.packageCode ? `: ${g.packages} × ${g.packageCode}${g.perPackageKg && g.packages > 1 ? ` (about ${g.perPackageKg} kg each)` : ""}` : ": weigh, then choose a carton or bag"}
                        {g.notes?.length > 0 && (
                          <ul className="mt-0.5 list-none pl-0 text-xs text-ink-soft">
                            {g.notes.map((n) => <li key={n}>{n}</li>)}
                          </ul>
                        )}
                      </li>
                    ))}
                    {!suggestion.groups && suggestion.loose && (
                      <li>
                        Loose items ({suggestion.loose.lines} line{suggestion.loose.lines === 1 ? "" : "s"}{suggestion.loose.weightKg ? `, about ${suggestion.loose.weightKg} kg` : ""})
                        {suggestion.loose.packageCode ? `: ${suggestion.loose.packages} × ${suggestion.loose.packageCode}` : ": choose a carton or bag"}
                      </li>
                    )}
                  </ul>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={applySuggestion}>Use suggestion</Button>
                    <span className="text-xs">Fills the package rows. Weigh each package and enter its actual weight.</span>
                  </div>
                </Notice>
              )}
              {packages.map((p, i) => (
                <div key={i} className="space-y-2 rounded-md border border-line p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">Package {i + 1}</span>
                    <span className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-xs text-ink-soft">
                        <input type="checkbox" checked={p.originalPack} onChange={(e) => setPackage(i, { originalPack: e.target.checked })} /> Original manufacturer pack
                      </label>
                      {packages.length > 1 && (
                        <Button size="sm" variant="ghost" onClick={() => setPackages((list) => list.filter((_, j) => j !== i))}>Remove</Button>
                      )}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-6">
                    {!p.originalPack && (
                      <Field label="Type" className="sm:col-span-2">
                        {({ id: fid }) => (
                          <select id={fid} className="h-9 w-full rounded-md border border-line bg-surface px-2 text-sm" value={p.packageCode} onChange={(e) => setPackage(i, { packageCode: e.target.value })}>
                            <option value="">Choose…</option>
                            {packageTypes.map((t) => (
                              <option key={t.code} value={t.code}>{t.code} · {t.type}{t.capacityKg ? ` (up to ${t.capacityKg} kg)` : ""}</option>
                            ))}
                          </select>
                        )}
                      </Field>
                    )}
                    {!isBag(p.packageCode) &&
                      [["lengthCm", "L cm"], ["widthCm", "W cm"], ["heightCm", "H cm"]].map(([k, label]) => (
                        <Field key={k} label={label}>
                          {({ id: fid }) => <Input id={fid} inputMode="decimal" value={p[k]} onChange={(e) => setPackage(i, { [k]: e.target.value })} />}
                        </Field>
                      ))}
                    <Field label="Weight kg">
                      {({ id: fid }) => <Input id={fid} inputMode="decimal" value={p.weightKg} onChange={(e) => setPackage(i, { weightKg: e.target.value })} />}
                    </Field>
                  </div>
                  <Input placeholder="Contents (optional)" value={p.contents} maxLength={400} onChange={(e) => setPackage(i, { contents: e.target.value })} />
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={() => setPackages((list) => [...list, { ...BLANK_PACKAGE }])}>Add package</Button>
            </div>
          )}
          {current?.needs.includes("awbNumber") && (
            <Field label="AWB / LR number" required>
              {({ id: fid }) => <Input id={fid} value={form.awbNumber} maxLength={80} onChange={(e) => setForm({ ...form, awbNumber: e.target.value })} />}
            </Field>
          )}
          {current?.needs.includes("courierName") && (
            <Field label="Courier / transporter" required>
              {({ id: fid }) => <Input id={fid} value={form.courierName} maxLength={100} onChange={(e) => setForm({ ...form, courierName: e.target.value })} />}
            </Field>
          )}
          {current?.needsReason && (
            <Field label="Reason (saved in the order history)" required hint="At least 5 characters.">
              {({ id: fid }) => <Textarea id={fid} value={form.reason} maxLength={400} onChange={(e) => setForm({ ...form, reason: e.target.value })} />}
            </Field>
          )}
        </div>
      </Dialog>
    </div>
  );
}

const SELLER_TONE = { ACCEPTED: "success", REJECTED: "danger", PENDING: "warning", NOT_SENT: "neutral", NO_SELLER: "danger" };
const SELLER_LABEL = { ACCEPTED: "Accepted", REJECTED: "Rejected", PENDING: "Waiting", NOT_SENT: "Not sent yet", NO_SELLER: "No seller" };

/** Per-seller sub-orders; staff record each seller's answer until the seller portal does (subtask 12). */
export function OrderSellers({ id, sellers, waiting, canEdit }) {
  const { busy, result, run } = useRun();
  const [reject, setReject] = useState(null);
  const [note, setNote] = useState("");

  return (
    <div className="space-y-2">
      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      {sellers.map((s) => (
        <div key={s.sellerId} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-2 text-sm">
          <span>
            <span className="font-medium text-ink">{s.name}</span>
            <span className="block text-xs text-ink-muted">
              {s.lines} line{s.lines === 1 ? "" : "s"} · {formatINR(s.subTotal)}
              {s.respondedAt ? ` · ${s.respondedBy || "Staff"} ${formatDateTime(s.respondedAt)}` : ""}
            </span>
            {s.note && <span className="block text-xs text-ink-muted">{s.note}</span>}
          </span>
          <span className="flex items-center gap-2">
            <Badge tone={SELLER_TONE[s.status] ?? "neutral"}>{SELLER_LABEL[s.status] ?? s.status}</Badge>
            {waiting && canEdit && s.status === "PENDING" && (
              <>
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(() => recordB2bOrderSeller(id, s.sellerId, "ACCEPTED", ""))}>
                  Accepted
                </Button>
                <Button size="sm" variant="ghost" className="text-danger-ink" disabled={busy} onClick={() => { setNote(""); setReject(s); }}>
                  Rejected
                </Button>
              </>
            )}
          </span>
        </div>
      ))}
      {waiting && <p className="text-xs text-ink-muted">Record each seller&apos;s answer (by phone or message). Stock can be reserved when every seller accepted.</p>}

      <Dialog
        open={Boolean(reject)}
        onClose={() => setReject(null)}
        title={`${reject?.name ?? "Seller"} rejected the order`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReject(null)} disabled={busy}>Back</Button>
            <Button variant="danger" loading={busy} disabled={note.trim().length < 5} onClick={() => run(() => recordB2bOrderSeller(id, reject.sellerId, "REJECTED", note), () => setReject(null))}>
              Record rejection
            </Button>
          </>
        }
      >
        <Field label="Why (saved in the order history)" required hint="At least 5 characters.">
          {({ id: fid }) => <Textarea id={fid} value={note} maxLength={400} onChange={(e) => setNote(e.target.value)} />}
        </Field>
      </Dialog>
    </div>
  );
}
