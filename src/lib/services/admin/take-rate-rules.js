import "server-only";
import { scanProductRows } from "./products";
import { getHighTakeRateVariants, getProductPricingFactors, previewProductPricingFactors, saveProductPricingFactors } from "./pricing-factors";
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
 *
 * Variants have their own take rate (a variant can qualify even when its base doesn't),
 * but services are selected on the base product only and apply to every variant — so a
 * variant candidate that's missing a service needs TWO saves: one to the base (add the
 * service, nothing else changes there) and one to the variant itself (the reduced take
 * rate). Both are preview-gated independently before anything is offered as "Ready".
 */

const TAKE_RATE_DROP_PER_SERVICE = 5;
const REQUIRED_SERVICE_NAMES = {
  tier1: ["sales pitch"],
  tier2: ["sales pitch", "marketing"],
};
const MAX_CANDIDATES = 200; // same cap as the generic bulk-action limit elsewhere in this app
const SCAN_CONCURRENCY = 2; // each candidate does a GET + a preview POST; the admin API drops connections outright if pushed harder
const SCAN_MIN_INTERVAL_MS = 250; // paces the actual dispatch rate, not just how many are in flight
// Every apply writes to product_service_charges via a DELETE-then-INSERT — concurrent saves
// landing close together deadlock each other there (seen live: ER_LOCK_DEADLOCK). The reads/
// previews can still run a little ahead of each other, but the actual saves must be serialized.
const APPLY_CONCURRENCY = 1;
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

/** variantId 0 (base): take rate + services together, same save as the manual editor. Non-base: take rate only — the backend ignores gstPercent/hsn/serviceCodes for a variant row. */
function pricingBodyFor(pricing, { takeRate, serviceCodes, variantId }) {
  const body = {
    variantId,
    mode: "TAKE_RATE",
    takeRate: String(takeRate),
    mrp: pricing.input.mrp,
    nrv: pricing.input.nrv,
    factors: (pricing.result.factors || []).map((f) => ({ code: f.code, overridden: f.overridden, actual: f.overridden ? f.actualAmount : null, notes: f.notes || "" })),
  };
  if (variantId === 0) {
    body.gstPercent = pricing.input.gstPercent;
    body.hsn = pricing.input.hsn;
    body.serviceCodes = serviceCodes;
    body.serviceBasis = pricing.services?.basis ?? "ORDER_VALUE";
  }
  return body;
}

/**
 * Pure classification from a loaded pricing record (no network). Exported for the apply
 * step to re-derive the exact same candidate right before saving. `basePricing` is the
 * base product's own loaded record — required when `variantId` isn't 0 and the rule turns
 * out to need a service added (services live on the base only).
 */
export function buildCandidate(pricing, { variantId = 0, basePricing = null } = {}) {
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

  let serviceBody = null;
  if (variantId !== 0) {
    if (!basePricing) return { status: "blocked-load-failed", tier, takeRate, loadMessage: "Could not load the base product's pricing to add the service." };
    // Base's own take rate is left exactly as it is — only its service selection changes.
    serviceBody = pricingBodyFor(basePricing, { takeRate: basePricing.input.takeRate, serviceCodes: proposedServiceCodes, variantId: 0 });
  }

  return {
    status: "candidate",
    tier,
    takeRate,
    proposedTakeRate,
    addingServiceNames: missing.map((r) => r.name),
    body: pricingBodyFor(pricing, { takeRate: proposedTakeRate, serviceCodes: proposedServiceCodes, variantId }),
    serviceBody,
    currentDisplayPrice: pricing.result.displayPrice,
    currentNrv: pricing.input.nrv,
    currentMrp: pricing.input.mrp,
    baseDisplayPrice: basePricing?.result?.displayPrice,
    baseNrv: basePricing?.input?.nrv,
    baseMrp: basePricing?.input?.mrp,
  };
}

async function previewUnchanged(id, body, baseline, user) {
  const preview = await withRetry(() => previewProductPricingFactors(id, body, user));
  if (!preview.ok) return { ok: false, failed: true, message: preview.message };
  const next = preview.pricing;
  const unchanged = sameAmount(next.result?.displayPrice, baseline.displayPrice) && sameAmount(next.input?.nrv, baseline.nrv) && sameAmount(next.input?.mrp, baseline.mrp);
  if (!unchanged) return { ok: false, priceChanged: true, displayPrice: next.result?.displayPrice, nrv: next.input?.nrv, mrp: next.input?.mrp };
  return { ok: true };
}

/** Previews the service-add (if any) and the take-rate change, and only calls it "ready" if BOTH leave price/NRV/MRP untouched. */
async function gateCandidate(id, candidate, user) {
  if (candidate.serviceBody) {
    const svc = await previewUnchanged(id, candidate.serviceBody, { displayPrice: candidate.baseDisplayPrice, nrv: candidate.baseNrv, mrp: candidate.baseMrp }, user);
    if (!svc.ok) {
      return svc.priceChanged
        ? { ...candidate, status: "blocked-price-change", previewDisplayPrice: svc.displayPrice, previewNrv: svc.nrv, previewMrp: svc.mrp }
        : { ...candidate, status: "blocked-preview-failed", previewMessage: svc.message };
    }
  }
  const main = await previewUnchanged(id, candidate.body, { displayPrice: candidate.currentDisplayPrice, nrv: candidate.currentNrv, mrp: candidate.currentMrp }, user);
  if (!main.ok) {
    return main.priceChanged
      ? { ...candidate, status: "blocked-price-change", previewDisplayPrice: main.displayPrice, previewNrv: main.nrv, previewMrp: main.mrp }
      : { ...candidate, status: "blocked-preview-failed", previewMessage: main.message };
  }
  return { ...candidate, status: "ready" };
}

async function loadAndClassify(id, variantId, user) {
  const loaded = await withRetry(() => getProductPricingFactors(id, variantId, user));
  if (!loaded.ok) return { candidate: null, status: "blocked-load-failed", loadMessage: loaded.message };
  let basePricing = null;
  if (variantId !== 0) {
    const baseLoaded = await withRetry(() => getProductPricingFactors(id, 0, user));
    if (baseLoaded.ok) basePricing = baseLoaded.pricing;
  }
  const candidate = buildCandidate(loaded.pricing, { variantId, basePricing });
  const resolved = candidate.status === "candidate" ? await gateCandidate(id, candidate, user) : candidate;
  return { candidate: resolved };
}

/**
 * Dry-run scan: every base product or variant whose stored take rate is > 40%, classified
 * into ready / already-applied / blocked-* so an admin can review before anything is saved.
 */
export async function scanTakeRateRuleCandidates(user) {
  const scan = await scanProductRows(user);
  if (scan.message) return { rows: [], scanned: scan.scanned, totalCatalog: scan.totalCatalog, truncated: scan.truncated, message: scan.message };

  const allCandidates = scan.rows.filter((p) => tierFor(Number(p.takeRate)) != null);
  const listCandidates = allCandidates.slice(0, MAX_CANDIDATES);
  const baseRows = await mapLimit(
    listCandidates,
    SCAN_CONCURRENCY,
    async (p) => {
      const { candidate } = await loadAndClassify(p.id, 0, user);
      return { id: p.id, variantId: 0, name: p.name, sku: p.sku, vendor: p.vendor, category: p.category, ...candidate };
    },
    { minIntervalMs: SCAN_MIN_INTERVAL_MS },
  );

  const variantsResult = await getHighTakeRateVariants(user);
  const variantList = (variantsResult.ok ? variantsResult.variants : []).slice(0, MAX_CANDIDATES);
  const variantRows = await mapLimit(
    variantList,
    SCAN_CONCURRENCY,
    async (v) => {
      const { candidate } = await loadAndClassify(v.id, v.variantId, user);
      return { id: v.id, variantId: v.variantId, name: v.name, sku: "", vendor: "", category: "", ...candidate };
    },
    { minIntervalMs: SCAN_MIN_INTERVAL_MS },
  );

  const rows = [...baseRows, ...variantRows].filter((r) => r.status !== "not-applicable");
  return {
    rows,
    scanned: scan.scanned,
    totalCatalog: scan.totalCatalog,
    truncated: scan.truncated || allCandidates.length > MAX_CANDIDATES || variantList.length >= MAX_CANDIDATES,
    variantNote: variantsResult.ok ? null : variantsResult.message,
  };
}

/** Re-derives the candidate fresh (in case anything changed since the scan) and only saves if it's still "ready". */
export async function applyTakeRateRule(id, reason, user, variantId = 0) {
  const { candidate } = await loadAndClassify(id, variantId, user);
  if (!candidate) return { ok: false, message: "Could not load this product's pricing." };
  if (candidate.status !== "ready") {
    if (candidate.status === "blocked-price-change") return { ok: false, message: "Applying this would change the display price, MRP or NRV, so it was not saved." };
    if (candidate.status === "blocked-load-failed") return { ok: false, message: candidate.loadMessage || "Could not load pricing." };
    return { ok: false, message: `This product is no longer a candidate (status: ${candidate.status}).` };
  }
  // product_service_charges writes (any save carrying serviceCodes) are the deadlock-prone ones —
  // worth a few more, longer-spaced retries than the general default before giving up.
  const saveRetryOptions = { attempts: 5, baseDelayMs: 800 };
  if (candidate.serviceBody) {
    const savedService = await withRetry(() => saveProductPricingFactors(id, { ...candidate.serviceBody, reason }, user), saveRetryOptions);
    if (!savedService.ok) return { ok: false, message: `Could not add the service to the base product: ${savedService.message}` };
  }
  const saved = await withRetry(() => saveProductPricingFactors(id, { ...candidate.body, reason }, user), saveRetryOptions);
  if (!saved.ok) return { ok: false, message: candidate.serviceBody ? `Service added, but the take-rate save failed: ${saved.message}` : saved.message };
  return { ok: true, message: `Take rate set to ${candidate.proposedTakeRate}% and ${candidate.addingServiceNames.join(" + ")} selected.` };
}

/**
 * Applies to several rows in one call instead of one server-action round trip per row (that
 * was the slow part — each round trip is a full browser-to-server hop on top of the paced
 * backend calls). `items` is `[{id, variantId}]` so a base candidate and a variant candidate
 * on the same product can be selected and applied independently.
 */
export async function applyTakeRateRuleBatch(items, reason, user) {
  return mapLimit(
    items,
    APPLY_CONCURRENCY,
    ({ id, variantId }) => applyTakeRateRule(id, reason, user, variantId).then((result) => ({ id, variantId, ...result })),
    { minIntervalMs: APPLY_MIN_INTERVAL_MS },
  );
}
