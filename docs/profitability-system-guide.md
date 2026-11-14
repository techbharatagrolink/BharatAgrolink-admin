# Product Profitability & Take-Rate System

Seven pages plus two background behaviors, built on top of the existing NRV/take-rate pricing
engine (PRICING_FACTORS_V1). Nothing here recomputes margin with a new formula — every page
reads the same `product_pricing.platform_margin_bps` the Pricing & Tax tab already writes,
bucketed against the live 12% target.

Repos touched: `BharatAgrolink-admin`, `BharatAgrolink-api-backend`.
Backend tests: 88/88 passing. Verified against the live database, read-only.

## Read before trusting the numbers

- Most of the catalog has never been priced through the new system — only products with a
  `product_pricing` row show up in any report below. Everything else is silently excluded,
  not wrong.
- The listing-gate override (Profitability Audit's blocked approvals) reuses the existing
  approval permission — there was no separate "senior admin" tier in the codebase to gate it
  on instead.
- Service Revenue's permission check is missing its denied-state screen (shows a bare header
  instead) — cosmetic, not a security gap.

## 1. Service discovery & promotion

### Products with Services — Live
`/admin/products/with-services` · Nav: Seller Catalog → Products with Services · Permission: `products` (view)

- Every product with at least one seller-selected service, grouped into clickable cards by service name.
- Click a service card to filter the table to just those products.
- Cross-links to the Marketing-only view below.

### Products with Marketing Services — Live
`/admin/marketing/products-with-services` · Nav: Marketing Dashboard → Products with Marketing Services · Permission: `products` (view)

- Same report, filtered to Marketing-category services only.
- Built for the marketing team to see what's already monetised without wading through Sales/B2B/Catalog services.

### Take-Rate Service Rule — Live
`/admin/pricing/take-rate-services` · Nav: Seller Catalog → Take-Rate Service Rule · Permission: `products` (view to see it, edit to apply)

- Finds products above 40% take rate (needs "sales pitch") and above 45% (needs "sales pitch" + "Marketing" too, take rate drops 5pts per service added).
- Every candidate is run through a live price preview first — only marked "Ready" if display price, MRP and NRV come back completely unchanged, never assumed.
- Blocked reasons shown openly: seller hasn't activated the service yet (with a direct link to fix it), would change price/NRV, product is in Rebuild-from-Actuals mode, or the preview itself failed.
- Apply is manual — select rows, give a reason, click Apply; nothing saves on its own. CSV export of the before-state for a manual revert record.

## 2. Profitability audit & correction

### Profitability Audit — Live
`/admin/pricing/profitability-audit` · Nav: Seller Catalog → Profitability Audit · Permission: `products` (view)

- Every Active, priced product currently loss-making or below the 12% floor margin.
- Per-row "Suggest correction" asks the pricing engine's own Rebuild-from-Actuals solver what take rate would hit the target — shown side by side with the current value, nothing is saved.
- Links straight to the real product editor to actually apply a correction (no second save path was built).
- CSV export of the full flagged list.

## 3. Reports

### Order Profitability — Live
`/admin/pricing/order-profitability` · Nav: Seller Catalog → Order Profitability · Permission: `orders.transactions`

- Per delivered order line: **Target** (12% of line value), **Achievable** (the product's current pricing-screen margin), **Achieved** (actual, after real shipping/payment-gateway costs) and the variance.
- Same filters as the existing Orders report: order ID, status, vendor, date range and date type.

### Vendor Profitability — Live
`/admin/pricing/vendor-profitability` · Nav: Seller Catalog → Vendor Profitability · Permission: `products`

- Per vendor: priced-product count, total contribution, average margin, and how many of their products fall in each verdict bucket (loss / below floor / below target / healthy).

### Service Revenue Allocation — Live
`/admin/pricing/service-revenue` · Nav: Seller Catalog → Service Revenue · Permission: `products`

- Splits revenue from priced products into **Base** (platform take-rate margin), **Sales** service, **Marketing** service and **Other**, with product counts and share of total per bucket.
- NRV-basis services are excluded by design — they're deducted from the seller's payout, not added to the price, so they aren't platform revenue in the same sense.

## 4. Background behaviors (not pages)

### Profitability Alerts — System-wide

- Polls every 60 seconds while any admin tab is open — works backgrounded/unfocused, not when the browser is fully closed.
- Fires a real browser notification only on a **transition** into or out of loss/below-floor/below-target — never on every poll, never on first load (which would otherwise notify for the whole catalog at once).
- Red for a product getting worse, green for one recovering to healthy.

### 12% Minimum-Contribution Listing Gate — System-wide

- Approving a product now checks its live contribution margin — loss or below-floor blocks the approval outright.
- An explicit override + a written reason lets it through anyway, and that override is written to the audit log under module "Pricing".
- Products never priced through the new system are not blocked — most of the catalog is still in that state.

## 5. Existing pages fixed, not new

### Product Dashboard — Fixed
`/admin/dashboards/products`

- The verdict donut chart and the "Loss-making" stat card existed already but always showed nothing — the field behind them was `null`.
- Root cause: both read from a table that's referenced in code but never created or populated anywhere. Rewired to the real pricing data instead.

### All Products list — Fixed
`/admin/products`

- The "Economics" verdict column, the `?verdict=loss` filter and the Contribution Margin column had the same dead-table bug — silently empty for every product, every time.
- Same fix applied here, so filtering and sorting by these columns now does something real.

---

Built and verified in one session against the live database (read-only checks only) — no mock
data, no assumptions about table contents that weren't confirmed by reading the actual schema.
