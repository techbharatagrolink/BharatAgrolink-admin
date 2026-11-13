import "server-only";
import { scanProductRows } from "./products";
import { getProductPricingFactors, previewProductPricingFactors, saveProductPricingFactors } from "./pricing-factors";
import { mapLimit, withRetry } from "./_query";

/**
 * Take-rate service rule (sales request): products priced well above the ~35% target
 * should pick up paid seller services instead of just sitting on excess margin.
 *   > 40% take rate -> "sales pitch" selected
 *   > 45% take rate -> "sales pitch" + "Marketing" selected, take rate drops 5pts per
 *                      service newly added (so 45% -> 35% once both are on)
 * MRP, NRV and display price must never move as a side effect, so every candidate is
 * run through the pricing API's own preview endpoint before it's offered as "Ready" —
 * nothing here assumes how the backend's NRV/take-rate formula behaves.
 */

const TAKE_RATE_DROP_PER_SERVICE = 5;
const REQUIRED_SERVICE_NAMES = {
  tier1: ["sales pitch"],
  tier2: ["sales pitch", "marketing"],
};
const MAX_CANDIDATES = 200; // same cap as the generic bulk-action limit elsewhere in this app
const SCAN_CONCURRENCY = 2; // each candidate does a GET + a preview POST; the admin API drops connections outright if pushed harder
const SCAN_MIN_INTERVAL_MS = 250; // paces the actual dispatch rate, not just how many are in flight
// Apply's selection is admin-curated (far smaller than a full scan) and each save was already
// re-verified once during the scan, so a bit more headroom here is safe.
const APPLY_CONCURRENCY = 3;
const APPLY_MIN_INTERVAL_MS = 150;

function tierFor(takeRate) {
  if (!Number.isFinite(takeRate)) return null;
  if (takeRate > 45) return "tier2";
  if (takeRate > 40) return "tier1";
  return null;
}

function findServiceByName(available, name) {
  return (available ?? []).find((s) => String(s.name || "").trim().toLowerCase() === name) || null;
}

/** Numbers/money-strings close enough to call "unchanged" (API returns 2-decimal strings). */
function sameAmount(a, b) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return String(a) === String(b);
  return Math.abs(x - y) < 0.01;
}

function pricingBodyFor(pricing, { takeRate, serviceCodes }) {
  return {
    variantId: 0,
    mode: "TAKE_RATE",
    takeRate: String(takeRate),
    mrp: pricing.input.mrp,
    nrv: pricing.input.nrv,
    gstPercent: pricing.input.gstPercent,
    hsn: pricing.input.hsn,
    serviceCodes,
    serviceBasis: pricing.services?.basis ?? "ORDER_VALUE",
    factors: (pricing.result.factors || []).map((f) => ({ code: f.code, overridden: f.overridden, actual: f.overridden ? f.actualAmount : null, notes: f.notes || "" })),
  };
}

/**
 * Pure classification from a loaded pricing record (no network). Exported for the apply
 * step to re-derive the exact same candidate right before saving.
 */
export function buildCandidate(pricing) {
  if (pricing.input.mode !== "TAKE_RATE") {
    const liveTakeRate = Number(pricing.result?.takeRate);
    return { status: "blocked-actuals-mode", takeRate: Number.isFinite(liveTakeRate) ? liveTakeRate : undefined };
  }
  const takeRate = Number(pricing.input.takeRate);
  const tier = tierFor(takeRate);
  if (!tier) return { status: "not-applicable", takeRate };

  const available = pricing.services?.available ?? [];
  const selectedCodes = pricing.services?.selected ?? [];
  const requiredNames = REQUIRED_SERVICE_NAMES[tier];
  const resolved = requiredNames.map((name) => ({ name, service: findServiceByName(available, name) }));
  const notActive = resolved.filter((r) => !r.service);
  if (notActive.length) {
    return { status: "blocked-seller-inactive", tier, takeRate, missingServiceNames: notActive.map((r) => r.name) };
  }

  const missing = resolved.filter((r) => !selectedCodes.includes(r.service.code));
  if (!missing.length) return { status: "already-applied", tier, takeRate };

  const proposedTakeRate = Math.max(0, takeRate - TAKE_RATE_DROP_PER_SERVICE * missing.length);
  const proposedServiceCodes = [...selectedCodes, ...missing.map((r) => r.service.code)];
  return {
    status: "candidate",
    tier,
    takeRate,
    proposedTakeRate,
    addingServiceNames: missing.map((r) => r.name),
    body: pricingBodyFor(pricing, { takeRate: proposedTakeRate, serviceCodes: proposedServiceCodes }),
    currentDisplayPrice: pricing.result.displayPrice,
    currentNrv: pricing.input.nrv,
    currentMrp: pricing.input.mrp,
  };
}

/** Runs the candidate's body through preview and only calls it "ready" if price/NRV/MRP hold still. */
async function gateCandidate(id, pricing, candidate, user) {
  const preview = await withRetry(() => previewProductPricingFactors(id, candidate.body, user));
  if (!preview.ok) return { ...candidate, status: "blocked-preview-failed", previewMessage: preview.message };
  const next = preview.pricing;
  const unchanged = sameAmount(next.result?.displayPrice, candidate.currentDisplayPrice) && sameAmount(next.input?.nrv, candidate.currentNrv) && sameAmount(next.input?.mrp, candidate.currentMrp);
  if (!unchanged) {
    return { ...candidate, status: "blocked-price-change", previewDisplayPrice: next.result?.displayPrice, previewNrv: next.input?.nrv, previewMrp: next.input?.mrp };
  }
  return { ...candidate, status: "ready" };
}

/**
 * Dry-run scan: every product whose stored take rate is > 40%, classified into
 * ready / already-applied / blocked-* so an admin can review before anything is saved.
 */
export async function scanTakeRateRuleCandidates(user) {
  const scan = await scanProductRows(user);
  if (scan.message) return { rows: [], scanned: scan.scanned, totalCatalog: scan.totalCatalog, truncated: scan.truncated, message: scan.message };

  const allCandidates = scan.rows.filter((p) => tierFor(Number(p.takeRate)) != null);
  const listCandidates = allCandidates.slice(0, MAX_CANDIDATES);
  const rows = await mapLimit(
    listCandidates,
    SCAN_CONCURRENCY,
    async (p) => {
      const loaded = await withRetry(() => getProductPricingFactors(p.id, 0, user));
      if (!loaded.ok) return { id: p.id, name: p.name, sku: p.sku, vendor: p.vendor, category: p.category, status: "blocked-load-failed", loadMessage: loaded.message };
      const candidate = buildCandidate(loaded.pricing);
      const resolved = candidate.status === "candidate" ? await gateCandidate(p.id, loaded.pricing, candidate, user) : candidate;
      return { id: p.id, name: p.name, sku: p.sku, vendor: p.vendor, category: p.category, ...resolved };
    },
    { minIntervalMs: SCAN_MIN_INTERVAL_MS },
  );

  return {
    rows: rows.filter((r) => r.status !== "not-applicable"),
    scanned: scan.scanned,
    totalCatalog: scan.totalCatalog,
    truncated: scan.truncated || allCandidates.length > MAX_CANDIDATES,
  };
}

/** Re-derives the candidate fresh (in case anything changed since the scan) and only saves if it's still "ready". */
export async function applyTakeRateRule(id, reason, user) {
  const loaded = await withRetry(() => getProductPricingFactors(id, 0, user));
  if (!loaded.ok) return { ok: false, message: loaded.message };
  const candidate = buildCandidate(loaded.pricing);
  if (candidate.status !== "candidate") return { ok: false, message: `This product is no longer a candidate (status: ${candidate.status}).` };
  const gated = await gateCandidate(id, loaded.pricing, candidate, user);
  if (gated.status !== "ready") return { ok: false, message: gated.status === "blocked-price-change" ? "Applying this would change the display price, MRP or NRV, so it was not saved." : (gated.previewMessage || "This product is not ready to apply.") };
  const saved = await withRetry(() => saveProductPricingFactors(id, { ...candidate.body, reason }, user));
  if (!saved.ok) return { ok: false, message: saved.message };
  return { ok: true, message: `Take rate set to ${candidate.proposedTakeRate}% and ${candidate.addingServiceNames.join(" + ")} selected.` };
}

/**
 * Applies to several products in one call instead of one server-action round trip per product
 * (that was the slow part — each round trip is a full browser-to-server hop on top of the
 * paced backend calls). Still paced/retried the same way per item, just without the extra hop.
 */
export async function applyTakeRateRuleBatch(ids, reason, user) {
  return mapLimit(ids, APPLY_CONCURRENCY, (id) => applyTakeRateRule(id, reason, user).then((result) => ({ id, ...result })), { minIntervalMs: APPLY_MIN_INTERVAL_MS });
}
