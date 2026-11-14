import "server-only";
import { scanProductRows } from "./products";
import { getHighTakeRateVariants, getProductPricingFactors, previewProductPricingFactors, saveProductPricingFactors } from "./pricing-factors";
import { mapLimit, withRetry } from "./_query";

/**
 * Take-rate service rule (sales request): products priced well above the ~35% target
 * should pick up paid seller services instead of just sitting on excess margin.
 *   > 40% take rate -> "sales pitch" selected
 *   > 45% take rate -> "sales pitch" + "Marketing" selected
 * The take rate is then lowered by exactly what the added services charge, so MRP, NRV and
 * display price never move. Every candidate is run through the pricing API's own preview
 * endpoint before it's offered as "Ready" — the proposed rate is only a first guess until the
 * preview confirms the price is unchanged.
 *
 * The base product and each variant are judged on their OWN take rate and get their OWN
 * service pick (product_service_charges.variant_id, backend migration 2026-11-13-001): a
 * variant over 40% gets the service even when its base doesn't, and the reverse.
 */

const REQUIRED_SERVICE_NAMES = {
  tier1: ["sales pitch"],
  tier2: ["sales pitch", "marketing"],
};
const MAX_CANDIDATES = 200; // same cap as the generic bulk-action limit elsewhere in this app
const SCAN_CONCURRENCY = 2; // each candidate does a GET + preview POSTs; the admin API drops connections outright if pushed harder
const SCAN_MIN_INTERVAL_MS = 250; // paces the actual dispatch rate, not just how many are in flight
const SOLVE_STEPS = 16; // bisection previews when the first guess misses the price by rounding
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

/** Rupees of service charge inside display price `dp` for `codes` (0 on the NRV basis: those come out of the seller's NRV). */
function serviceRupees(pricing, codes, dp) {
  if ((pricing.services?.basis ?? "ORDER_VALUE") === "NRV") return 0;
  return (pricing.services?.available ?? [])
    .filter((s) => codes.includes(s.code))
    .reduce((sum, s) => sum + (s.chargeType === "FIXED_PER_UNIT" ? Number(s.chargeValue) : (dp * Number(s.chargeValue)) / 100), 0);
}

/** The take rate that keeps display price `dp` once `codes` are selected (first guess, confirmed by preview). */
function takeRateKeepingPrice(pricing, codes, dp) {
  const nrv = Number(pricing.input.nrv);
  return ((dp - nrv - serviceRupees(pricing, codes, dp)) / dp) * 100;
}

const roundRate = (n) => Number(n.toFixed(6));

/** One save body for the base product (variantId 0) or a variant — services are per row. The backend ignores gstPercent/hsn for a variant row. */
function pricingBodyFor(pricing, { takeRate, serviceCodes, variantId }) {
  const body = {
    variantId,
    mode: "TAKE_RATE",
    takeRate: String(takeRate),
    mrp: pricing.input.mrp,
    nrv: pricing.input.nrv,
    serviceCodes,
    factors: (pricing.result.factors || []).map((f) => ({ code: f.code, overridden: f.overridden, actual: f.overridden ? f.actualAmount : null, notes: f.notes || "" })),
  };
  if (variantId === 0) {
    body.gstPercent = pricing.input.gstPercent;
    body.hsn = pricing.input.hsn;
    body.serviceBasis = pricing.services?.basis ?? "ORDER_VALUE";
  }
  return body;
}

/** Pure classification from a loaded pricing record (no network). Exported for the apply step to re-derive the exact same candidate right before saving. */
export function buildCandidate(pricing, { variantId = 0 } = {}) {
  if (pricing.input.mode !== "TAKE_RATE") {
    const liveTakeRate = Number(pricing.result?.takeRate);
    return { status: "blocked-actuals-mode", takeRate: Number.isFinite(liveTakeRate) ? liveTakeRate : undefined };
  }
  const takeRate = Number(pricing.input.takeRate);
  const tier = tierFor(takeRate);
  if (!tier) return { status: "not-applicable", takeRate };

  const available = pricing.services?.available ?? [];
  const selectedCodes = pricing.services?.selected ?? [];
  const resolved = REQUIRED_SERVICE_NAMES[tier].map((name) => ({ name, service: findServiceByName(available, name) }));
  const notActive = resolved.filter((r) => !r.service);
  if (notActive.length) {
    return { status: "blocked-seller-inactive", tier, takeRate, missingServiceNames: notActive.map((r) => r.name) };
  }

  const missing = resolved.filter((r) => !selectedCodes.includes(r.service.code));
  if (!missing.length) return { status: "already-applied", tier, takeRate };

  const proposedServiceCodes = [...selectedCodes, ...missing.map((r) => r.service.code)];
  const dp = Number(pricing.result.displayPrice);
  const guess = Number.isFinite(dp) && dp > 0 ? takeRateKeepingPrice(pricing, proposedServiceCodes, dp) : NaN;
  if (!(guess > 0 && guess < 100)) return { status: "blocked-preview-failed", tier, takeRate, previewMessage: "Could not work out a take rate that keeps the price." };
  const proposedTakeRate = roundRate(guess);

  return {
    status: "candidate",
    tier,
    takeRate,
    proposedTakeRate,
    proposedServiceCodes,
    addingServiceNames: missing.map((r) => r.service.name || r.name),
    body: pricingBodyFor(pricing, { takeRate: proposedTakeRate, serviceCodes: proposedServiceCodes, variantId }),
    currentDisplayPrice: pricing.result.displayPrice,
    currentNrv: pricing.input.nrv,
    currentMrp: pricing.input.mrp,
  };
}

async function previewOf(id, body, user) {
  const preview = await withRetry(() => previewProductPricingFactors(id, body, user));
  if (!preview.ok) return { ok: false, message: preview.message };
  return { ok: true, pricing: preview.pricing };
}

/**
 * Confirms the proposed take rate against the live preview; when rounding makes the first guess
 * miss the display price, bisects around it until the preview lands on the same price. "Ready"
 * only if price, NRV and MRP all come back unchanged.
 */
async function gateCandidate(id, candidate, user) {
  const target = Number(candidate.currentDisplayPrice);
  const withRate = (rate) => ({ ...candidate.body, takeRate: String(roundRate(rate)) });
  let rate = candidate.proposedTakeRate;
  let res = await previewOf(id, withRate(rate), user);
  if (!res.ok) return { ...candidate, status: "blocked-preview-failed", previewMessage: res.message };
  if (!sameAmount(res.pricing.result?.displayPrice, target)) {
    let lo = Math.max(0, rate - 2);
    let hi = Math.min(99.9, rate + 2);
    for (let step = 0; step < SOLVE_STEPS && res.ok && !sameAmount(res.pricing.result?.displayPrice, target); step++) {
      if (Number(res.pricing.result?.displayPrice) < target) lo = rate;
      else hi = rate;
      rate = (lo + hi) / 2;
      res = await previewOf(id, withRate(rate), user);
    }
    if (!res.ok) return { ...candidate, status: "blocked-preview-failed", previewMessage: res.message };
  }
  const next = res.pricing;
  const unchanged = sameAmount(next.result?.displayPrice, target) && sameAmount(next.input?.nrv, candidate.currentNrv) && sameAmount(next.input?.mrp, candidate.currentMrp);
  if (!unchanged) {
    return { ...candidate, status: "blocked-price-change", previewDisplayPrice: next.result?.displayPrice, previewNrv: next.input?.nrv, previewMrp: next.input?.mrp };
  }
  const proposedTakeRate = roundRate(rate);
  return { ...candidate, status: "ready", proposedTakeRate, body: withRate(proposedTakeRate) };
}

async function loadAndClassify(id, variantId, user) {
  const loaded = await withRetry(() => getProductPricingFactors(id, variantId, user));
  if (!loaded.ok) return { candidate: null, status: "blocked-load-failed", loadMessage: loaded.message };
  const candidate = buildCandidate(loaded.pricing, { variantId });
  const resolved = candidate.status === "candidate" ? await gateCandidate(id, candidate, user) : candidate;
  return { candidate: resolved };
}

/**
 * Dry-run scan: every base product or variant whose take rate is > 40%, classified
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
  const allVariants = variantsResult.ok ? variantsResult.variants : [];
  const variantList = allVariants.slice(0, MAX_CANDIDATES);
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
    truncated: scan.truncated || allCandidates.length > MAX_CANDIDATES || allVariants.length > MAX_CANDIDATES,
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
  const saved = await withRetry(() => saveProductPricingFactors(id, { ...candidate.body, reason }, user), { attempts: 5, baseDelayMs: 800 });
  if (!saved.ok) return { ok: false, message: saved.message };
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
