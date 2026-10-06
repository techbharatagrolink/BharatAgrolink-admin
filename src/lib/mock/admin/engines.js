/**
 * Mock stand-ins for server-side business engines documented in the legacy
 * system. Only services (server) may import this file. When the API is
 * connected these results come from the backend and this file is deleted.
 */

const round = (n) => Math.round(n * 100) / 100;

/** includes/nrv_pricing.php — NRV-first selling price. */
export function nrvPricing({ nrv, mrp, gstPercent = 18, takeRate = 35, tcsPercent = 1 }) {
  const errors = [];
  const display = nrv / (1 - takeRate / 100);
  const sale = (display * 100) / (100 + gstPercent);
  const tcs = (tcsPercent / 100) * sale;
  const serviceCharge = display - nrv - tcs;
  const serviceChargeExGst = (serviceCharge * 100) / 118;
  const bsa = nrv - tcs;
  const commissionPercent = sale ? (serviceChargeExGst / sale) * 100 : 0;
  if (!(mrp > 300)) errors.push("MRP must be greater than ₹300.");
  if (display > mrp) errors.push("Display price cannot exceed MRP.");
  if (serviceCharge < 0) errors.push("Service charge cannot be negative.");
  if (takeRate < 25 || takeRate > 45) errors.push("Take rate must be between 25% and 45%.");
  return {
    ok: errors.length === 0,
    errors,
    display: round(display),
    sale: round(sale),
    tcs: round(tcs),
    serviceCharge: round(serviceCharge),
    serviceChargeExGst: round(serviceChargeExGst),
    bsa: round(bsa),
    commissionPercent: round(commissionPercent),
  };
}

/** includes/product_cost_engine.php — listing economics verdict. */
export function listingEconomics({ display, nrv, gstPercent = 18, paymentMode = "prepaid", shipping = 70, codHandling = 30, rtoProvision = 40 }) {
  const d = { prepaid: 0.03, partial: 0.01, cod: 0 }[paymentMode] ?? 0;
  const onlineShare = { prepaid: 1, partial: 0.25, cod: 0 }[paymentMode] ?? 0;
  const rtoFactor = { prepaid: 0.25, partial: 0.6, cod: 1 }[paymentMode] ?? 1;
  const collected = display * (1 - d);
  const netExGst = collected / (1 + gstPercent / 100);
  const tcs = 0.01 * netExGst;
  const serviceIncl = collected - nrv - tcs;
  const gstOnService = (serviceIncl * 18) / 118;
  const platformRevenue = collected - (nrv - Math.min(nrv, 0.01 * netExGst)) - gstOnService;
  const costs =
    shipping +
    (paymentMode === "cod" ? codHandling : 0) +
    collected * onlineShare * 0.01 +
    rtoProvision * rtoFactor +
    collected * (0.06 + 0.02 + 0.01);
  const contribution = platformRevenue - costs;
  const contributionPct = collected ? (contribution / collected) * 100 : 0;
  const verdict = contribution < 0 ? "loss" : contributionPct < 8 ? "below_floor" : contributionPct < 11 ? "below_target" : "ok";
  return { collected: round(collected), platformRevenue: round(platformRevenue), costs: round(costs), contribution: round(contribution), contributionPct: round(contributionPct), verdict };
}

/** event_process2.php — final seller payout (BSA) per payout item. */
export function payoutBreakdown({ gross, taxable, nrv }) {
  const tcs = taxable * 0.01;
  const bsa = nrv - tcs;
  const serviceIncl = gross - bsa - tcs;
  return { tcs: round(tcs), bsa: round(bsa), serviceIncl: round(serviceIncl), serviceExGst: round(serviceIncl / 1.18) };
}

/** process_return_action.php — refund amount (computed server-side, never posted from UI). */
export function refundAmount({ price, gst, shipping, refundShipping, deductPlatformFee }) {
  let amount = price + gst + (refundShipping ? shipping : 0);
  if (deductPlatformFee) amount -= price * 0.03;
  return round(Math.max(0, amount));
}

/** courier_charge_calculator.php — slab total. */
export function courierSlabTotal({ ship, codHandling = 0, rtoMultiplier = 25 }) {
  const rto = ship * 0.018 * rtoMultiplier;
  return round((ship + codHandling + rto) * 1.18);
}

/** Product Management dashboard thresholds: 0 = out, 1–9 = low, 10+ = in stock. */
export const LOW_STOCK_MAX = 9;
export function stockStatus(stock) {
  return stock <= 0 ? "Out of Stock" : stock <= LOW_STOCK_MAX ? "Low Stock" : "In Stock";
}

/** Half-month payout cycle label: 1–15 = 1st Cycle, 16–end = 2nd Cycle. */
export function payoutCycle(iso) {
  const d = new Date(iso);
  const half = d.getUTCDate() <= 15 ? 1 : 2;
  const month = d.toLocaleString("en-IN", { month: "short", timeZone: "UTC" });
  return { label: `${month} ${d.getUTCFullYear()} · ${half === 1 ? "1st" : "2nd"} Cycle`, index: d.getUTCFullYear() * 24 + d.getUTCMonth() * 2 + half };
}
