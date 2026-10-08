# PHP admin → Next.js admin: implementation plan

Prepared 2026-10-08. Covers three codebases:

- **PHP admin (source of truth):** `C:\xampp\htdocs\AMPL.BAadmin`
- **Next.js admin (target UI):** `BharatAgrolink-admin` (Next 16, `/admin/...` routes)
- **Node API (target backend):** `BharatAgrolink-api-backend` (Express 5, `/api/v1/admin/...`)

Scope is functionality only: every column, CRUD operation, action and piece of data the PHP admin shows or changes must work in Next.js through the Node API. No design work in this project.

## 0. Files in this folder

| File | Contents |
| --- | --- |
| `IMPLEMENTATION_PLAN.md` | This plan: rules, definition of done, phases, decisions, risks |
| `PAGE_INVENTORY.md` | All 309 PHP page files: status, proposed Next route, size, and a per-page checklist (columns, filters, form fields, modals, buttons, endpoints, sub-pages, tables) |
| `ENDPOINT_MAP.md` | All 847 PHP endpoint files (`get_*`, `*_process`, `server_*`, `api/…`, module `*/api/…`, crons) with the pages that call them |
| `BACKEND_ADMIN_ROUTES.md` | The 761 routes the Node API already serves under `/admin`, and its 102 config-driven resources |
| `inventory.json` | The same data for scripts |
| `tools/build-inventory.mjs` | Regenerates all of the above |

Re-run after every merged page; the status counts are the progress report:

```bash
cd BharatAgrolink-admin
node docs/php-port/tools/build-inventory.mjs
# PHP_ADMIN_DIR / API_DIR override the default paths
```

## 1. Ground rules

1. **Parity first.** A PHP feature is ported when a user can do the same job in Next.js with the same result: same rows, same numbers, same side effects. Section 4 defines this per page.
2. **No design work.** Use the existing components (`ResourcePage`, `RecordForm`, `components/ui/*`, `data-table/*`). Layout can be plain.
3. **All data through the Node API.** Next.js never queries MySQL, never imports `lib/mock`, never calls a PHP URL.
4. **Same database, both apps live.** PHP and Next run on the same MySQL until each module is cut over. Every write from Node must stay readable by PHP: same columns, status codes, IST wall-clock time strings, JSON shapes and file paths.
5. **Same permissions.** A role's `permissions_json` (keyed by `admin_menus` id, actions view/add/edit/delete) decides access. API routes check `adminCan('<php menu_link>', action)`; Next hides controls with `can()` and server actions re-check with `assertPermission()`.
6. **One page at a time, API + UI together.** A PR ports named PHP files end to end and ticks their checklist.

## 2. Current state

### 2.1 Numbers (from the inventory tool)

| Item | Count |
| --- | --- |
| PHP page files | 309 (204 reachable from the sidebar, module sidebars, header or a reachable page) |
| PHP endpoint files | 847 (491 reachable through those pages; 8 crons/webhook; 26 one-off/test scripts) |
| PHP lines, pages + endpoints they call | ≈ 4.2 lakh |
| Node admin API | 761 routes, 102 config-driven resources |
| PHP tables the Node API never touches | 96 (`inventory.json` → `tablesNotInApi`) |
| Next sidebar entries | 161 unique routes; 153 open a connected screen, 8 do not |

| Page status | Pages | Meaning |
| --- | --: | --- |
| MISSING | 73 | No working Next screen |
| MOCK | 2 | Next route exists, data from the mock store (`profile.php` → `/admin/account`, `b2b_orders/index.php` → `/admin/b2b`) |
| PARTIAL | 96 | Next route + API exist, known or auto-detected gaps |
| AUDIT | 59 | Next route + API exist, no gap auto-detected, not yet verified |
| LEGACY? | 70 | Not reachable in PHP; confirm and drop (decision D2) |
| DROPPED | 3 | Not ported by decision: B2B `users_roles.php`, `role_edit.php`, `nav_manager.php` (D1, D3) |
| INFRA | 6 | Not a screen (header, helpers, background job) |

By module (pages; PHP lines of pages + their endpoints):

| Module | Pages | MISSING | MOCK | PARTIAL | AUDIT | LEGACY? | PHP lines |
| --- | --: | --: | --: | --: | --: | --: | --: |
| Auth & account | 4 | 2 | 1 | 0 | 1 | 0 | 1.6k |
| Orders (B2C) | 15 | 2 | 0 | 4 | 2 | 7 | 50.5k |
| Products | 18 | 2 | 0 | 6 | 3 | 7 | 43.8k |
| Catalog masters & pricing | 30 | 6 | 0 | 6 | 12 | 6 | 22.5k |
| Sellers | 9 | 3 | 0 | 3 | 1 | 2 | 14.6k |
| Customers & users | 8 | 1 | 0 | 2 | 0 | 5 | 5.6k |
| Shipping, logistics & returns | 23 | 1 | 0 | 7 | 9 | 6 | 28.7k |
| Finance & payouts | 40 | 15 | 0 | 10 | 3 | 12 | 34.7k |
| CRM & leads | 13 | 0 | 0 | 12 | 1 | 0 | 31.1k |
| Sales targets & performance | 4 | 0 | 0 | 4 | 0 | 0 | 13.4k |
| Marketing | 4 | 0 | 0 | 3 | 0 | 1 | 9.5k |
| CMS & content | 26 | 1 | 0 | 11 | 1 | 13 | 15.8k |
| B2B | 33 | 14 | 1 | 7 | 7 | 1 | 35.8k (3 dropped) |
| Bulk orders | 24 | 21 | 0 | 1 | 1 | 1 | 26.0k |
| Operations | 12 | 0 | 0 | 6 | 4 | 1 | 15.6k |
| Support, reviews & hiring | 13 | 1 | 0 | 4 | 5 | 2 | 8.4k |
| Admin, roles & settings | 21 | 4 | 0 | 6 | 8 | 3 | 10.3k |
| Dashboards & reports | 6 | 0 | 0 | 4 | 1 | 1 | 43.7k |

### 2.2 What the scan found

1. **Broad but shallow.** Nearly every sidebar entry opens a live screen, but many generic resource screens show only part of the PHP page. Example: `category.php` has image, ad image, Arabic name, commission %, GST, SEO title/description/keywords, sort order, a brand-assign modal and a change timeline. The Next form and the API resource have name, parent and status only. This is why 96 pages are PARTIAL.
2. **Mock data is still wired in.** `getMyAccount`, `getB2BDashboard`, `getInventorySummary` and `globalSearch` read only `lib/mock`. `getOrder`, `getProduct`, `getVendor`, `getCustomer`, `getPayout`, `getReturn`, `getTicket` and their actions fall back to the mock store when there is no token. `lib/content/admin/resources/core.js` imports the mock seed.
3. **Bulk orders are half built.** API services exist (`src/modules/admin/parity/bulk*.js`, about 2,400 lines) but `bulk.routes.js` mounts no routes, and the Next `resources/parity/bulk.js` is empty. Six sidebar links (dashboard, quotations, create order, orders, products, shipments) return 404. Only Bulk Inquiry and Warehouses work.
4. **B2B core flows are missing:** order create (3.4k lines), quotation editor (2.9k), product edit/view, catalog PDF, masters (freight rates/zones, MOQ, package types, shipping policies), packing, inventory, payment attempts, B2B roles and nav manager, audit log. The B2B dashboard is mock.
5. **The finance ledger suite is missing:** ledger management hub, customer/vendor/wallet ledgers, payment history, settlement management, finance reports and print, hold-ledger CN/DN note, service-charge invoice and downloads, wallet transactions.
6. **Auth gaps:** no forgot-password page or endpoint; `/admin/account` is mock.
7. ~~**The sidebar is static.**~~ Done 2026-10-08: the Next sidebar is built from `admin_menus` through `GET /admin/auth/menu` (see §3.3).
8. **Cross-cutting PHP behaviour not in the API yet:** export reason + `export_logs` (`api/log_export.php`), category timeline, header notification bell (`pending_notification.php`), order chat (`order_chat`, `chat_messages`), score settings and product score snapshots, security payments, manual payment attempts, WhatsApp message history (`whatsapp_messages`, `conversation_state_history`).
9. **Old Next code to remove at the end:** the `(console)` route group at `/` and the components it uses (`components/{orders,products,finance,logistics,marketing,sales,settings,support,vendors,profile,screens,shell,auth}`, `components/*.jsx`), `lib/mock/**`, `lib/php-screens.js`, `lib/live-routes.js`, `src/delivered-filters.jsx`.

## 3. How to build

### 3.1 Node API

- One folder per area under `src/modules/admin/<area>/` with `*.service.js` (SQL) and `*.routes.js`, mounted in `src/routes/admin.js`.
- **Plain lists and masters:** a resource in `modules/admin/resources/defs/*`. The engine gives list, export, get, create/update, row and bulk actions, and audit. Extend the engine (new field types, file fields, computed columns) instead of writing one-off list code.
- **Everything else** (detail pages, multi-step workflows, dashboards, imports, prints): explicit routes.
- **Port each PHP endpoint by behaviour:** same SQL filters and joins, same status codes and labels, same validation messages, same side effects. Put the PHP file name in a comment next to the route (`// server_orders.php`); the inventory tool uses these names to mark endpoints as covered.
- **Every route:** `requireAdmin` + `adminCan('<menu_link>', 'view' | 'add' | 'edit' | 'delete')`, zod validation, `withTransaction` for multi-table writes, `writeAudit` for changes.
- **Time:** read stored IST strings; write from Node in `APP_TIMEZONE`; never `NOW()`. Queries must pass `ONLY_FULL_GROUP_BY` and `STRICT_TRANS_TABLES`.
- **Files:** multer → the same storage PHP uses for that field (local `uploads/` path or R2), so both apps show the file.
- **Exports:** server-side CSV/XLSX with the PHP column set, written to `export_logs` with the reason, like `api/log_export.php`.
- **Prints/PDFs** (invoices, labels, manifests, quotations, statements, CN/DN notes, service-charge invoices): one PDF service (decision D4).
- **Notifications** (AiSensy WhatsApp, RapidSMS, SMTP, push): one service with an idempotency key per event, so an action done in Next is not sent again by a PHP hook or cron.
- Add every new endpoint to `npm run smoke`.

### 3.2 Next.js admin

- Routes stay under `/admin/...`. The proposed route for every PHP page is in `PAGE_INVENTORY.md`.
- Reads: server components call `lib/api.js` with `user.token`. Writes: server actions in `lib/actions/admin/*` that call `assertPermission()` and then the API.
- Lists: `ResourcePage` + a definition in `lib/content/admin/resources/*`, registered in `lib/services/admin/live-catalog.js`. Complex screens: a dedicated `page.js` + components under `components/admin/<area>/`.
- Filters, tabs, sort, page and page size live in the URL (`use-query-state.js`), as PHP GET params did.
- Record the PHP file each route replaces in one of the places the tool reads: `page:` in `navigation.js`, `page` in live specs, `pages` in parity files, or a `/** file.php */` comment in `page.js`.

### 3.3 Permissions

- **Sidebar (done, D1):** `GET /admin/auth/menu` returns the role's `admin_menus` tree with the same rules as `$_SESSION['menu_permissions']` + `renderMenu()` (active rows the role was granted plus their parents, menu order). `lib/content/admin/sidebar.js` turns it into the Sidebar's shape: top-level menus are sections, `#group` rows are groups, deeper levels are listed under their group. `navigation.js` is now only the route map (`page` → `href`), the group icons, and the Next-only screens added to their group when the role has their permission. A menu link with no Next screen yet opens `/admin/not-ported` (with an "Open in the PHP admin" button when `PHP_ADMIN_URL` is set). If the menu call fails the old filtered `navigation.js` sidebar is used. When a new screen lands: add its leaf with `page:` to `navigation.js`, and remove its route from `PENDING_ROUTES` in `sidebar.js` if it was there.
- **Page:** `checkPermission(key, 'view')` → `PermissionDenied` (replaces `no-premission.php`).
- **Controls:** add/edit/delete buttons hidden when the role lacks the action, matching `has_permission()`.
- **B2B (done, D3): no separate B2B roles.** `src/modules/admin/b2b/b2b-access.js` in the API:
  - B2B pages without an `admin_menus` row use the grants of a governing B2B menu (`B2B_PAGE_GOVERNORS`, e.g. claims → B2B Orders List, payments → B2B Settlements, masters/audit log → Approvals). Adding a Menu Master row for such a page makes it independent.
  - The 55 B2B capability keys map to menu grants (`B2B_CAPABILITIES`, e.g. `quotation.approve` = edit on Approvals, `order.create` = add on B2B Orders List); routes use `b2bCan(key)`, resource actions use `allow`, Next actions use `capability`.
  - Seller cost, margin and discount cap follow the staff role title with the old bridged values (`B2B_ROLE_PROFILES`). Resources hide margin fields with `hiddenFields(admin)`; Next hides columns marked `requires: "b2b.margin"`.
  - Record scope ("own" only) is not carried over: PHP never called `b2bp_scope_sql()`.
- **Ops team RBAC:** `operations_team/ops_access.php` still to port with the Operations phase.

## 4. Definition of done (per page)

Open the PHP page and the Next page side by side on staging and tick every line of the page's section in `PAGE_INVENTORY.md`:

1. **Columns:** every PHP column, same order and formatting (₹, dates, status labels), same computed values.
2. **Sorting and paging:** default sort, sortable columns, page sizes, "load more".
3. **Search:** the same fields are searched.
4. **Filters and tabs:** every filter with its defaults and combinations; tab counts match.
5. **Actions:** every row and bulk action with the same eligibility (which statuses), confirmation, reason prompt and result message.
6. **Forms and modals:** every field, default, dropdown source, dependent dropdown (country → state → city), validation rule and message, file upload (type and size), edit prefill.
7. **Side effects:** rows written to other tables (timelines, histories, ledgers, audit), notifications sent, caches cleared, external APIs called (Shiprocket, Delhivery, NimbusPost, Razorpay, AiSensy, Vapi, R2). Data written by Next reads correctly in PHP and the other way round.
8. **Export, import, print:** same columns and file format; export reason and log; import validation report; print/PDF content.
9. **Links:** every link to another page (row → detail, "view order", "edit seller") opens the Next route.
10. **Permissions:** checked with an admin, a limited role and a role without the page.
11. **Numbers match:** the same filters in PHP and Next give the same row count and totals.
12. **No mock, no "not connected" banner, no console errors.**

## 5. Working loop for one page

1. Open the page's section in `PAGE_INVENTORY.md`: columns, fields, modals, buttons, endpoints, sub-pages, tables, "opened from".
2. Read the PHP page, its includes and modals, its `js/admin/*.js`, and every endpoint it calls. For each endpoint note the SQL, inputs, validations and side effects.
3. **API:** add or extend the resource or routes, with the PHP file names in comments. Add the routes to the smoke test.
4. **Next:** build or extend the route; remove any mock path; wire actions through server actions.
5. **Side-by-side check** on staging: same filters, same counts and totals; perform each action in Next and verify it in PHP, and the other way round.
6. Test the three roles.
7. Tick the checklist, update `MANUAL` in the tool if the status logic needs it, re-run the tool, and commit the API and Next changes with the PHP file names in the message.

## 6. Phases

Order follows daily use and dependencies. Each phase ends when all its pages meet §4 and the team that uses the module signs off. Page sizes (S/M/L/XL) and the full checklist per page are in `PAGE_INVENTORY.md`.

### Phase 0: Groundwork

- [ ] Export `admin_menus` (active and inactive rows) and `user_roles.permissions_json` from production. Every active `menu_link` must map to a Next route. LEGACY? pages that are not in `admin_menus` go on the drop list (D2).
- [ ] Agree the drop list with the users of each module (D2).
- [ ] Freeze new PHP admin features, or log every PHP change so the port can follow it.
- [ ] Staging: PHP admin, Node API and Next admin on the same staging database copy.
- [ ] Remove the mock fallbacks: delete the `if (!user?.token) … getStore()` branches in `lib/services/admin/{orders,products,payouts,returns,support,people}.js`; mock-only functions show "not connected" until ported.
- [ ] CI: `npm run lint` + `npm run build` (Next), `npm run smoke` (API).

### Phase 1: Shell, auth, shared services

| PHP | Next | Status | Work |
| --- | --- | --- | --- |
| `index.php` | `/admin/login` | AUDIT | Remember-me (`panel_remember_tokens`), login audit, lockout messages |
| `forget_password.php`, `forget_password_data.php` | `/admin/forgot-password` | MISSING | API request + reset endpoints, same email/OTP flow |
| `profile.php` | `/admin/account` | MOCK | Profile read/update, photo, change password (`POST /admin/auth/change-password` exists), sessions and logout-all |
| `header.php` | admin shell | INFRA | ~~Sidebar from `admin_menus`~~ (done). Still: notification bell from `pending_notification.php` counts and links, product change-log modal, Ctrl+K search over menus |
| `no-premission.php` | `PermissionDenied` | INFRA | Same behaviour on every page |

Shared API services built here and reused later: export + `export_logs`, PDF, file upload, notifications, timeline/history helper.

Exit: login, forgot password, profile, sidebar and bell behave like PHP for three roles.

### Phase 2: Orders (B2C)

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `manage_orders.php` | `/admin/orders` (+ `/invoices`, `/sr-checkout`, `/rto`) | PARTIAL XL | 10 modals: bulk process, remark, sales agent, OPS verification, export reason, export timeline, responsible, weight discrepancy; Razorpay payment columns; bulk labels; fetch couriers + create shipments; status sync |
| `edit_order.php` | `/admin/orders/[id]` | PARTIAL XL | Largest page (10.7k lines). Order chat, security payment, AWB response, delivery-boy assignment (if kept), Shiprocket update, manual status, WhatsApp/SMS confirmation and cancel, accept/reject, box dimensions, invoice/manifest/label print |
| `create_order.php` | `/admin/orders/new` | AUDIT XL | Customer search/create, address, product + seller, pricing, COD/prepaid/partial, payment link |
| `manual_payment_attempts.php` | `/admin/orders/payment-attempts` | MISSING | Table `manual_order_payment_attempts` + sync endpoints |
| `regenerate_label.php` | action on `/admin/orders/[id]` | MISSING | Also used by ops order details |
| `orders_report.php` | `/admin/orders/report`, `/admin/orders/transactions` | PARTIAL L | Missing columns: item id, customer name/state, invoice id, AWB, SKU, payment gateway, customer invoice |
| `whatsapp_orders.php` | `/admin/orders/whatsapp` | PARTIAL | Phone, shipping address, order type; `wp_orders` |
| `master_delivered_orders.php` | `/admin/orders/delivered` | AUDIT | |
| `order_management_dashboard.php` | `/admin/dashboards/orders` | AUDIT | |
| `invoice.php`, `view_invoice.php` | — | LEGACY? | Invoices download through `api/download_invoice*.php`; confirm |

Exit: the order team runs a full day of orders in Next only.

### Phase 3: Products, catalog masters, pricing

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `manage_product.php` | `/admin/products` (+ `/inventory`, `/cms/faqs`) | PARTIAL XL | Change-log modal (field / previous value), variant, brand, seller, margin, SKU columns |
| `add_product.php` | `/admin/products/new` | AUDIT XL | Every field, variation, attribute, image, SEO and pricing rule |
| `edit_product.php` | `/admin/products/[id]` | PARTIAL XL | 13 of 16 endpoints not named in the API; attribute sets |
| `view_product.php` | `/admin/products/[id]` | PARTIAL L | Product score snapshots |
| `pending_products.php` | `/admin/products/pending` | PARTIAL | Image, SKU, brand, description, HSN, price, stock, weight columns |
| `view_pending_product.php` | `/admin/products/pending/[id]` | MISSING | Approve/reject with changes |
| `import_products_excel.php` | `/admin/products/import` | PARTIAL | Update mode, column mapping (`bulk_products_map.php`), export, `import_worker.php` |
| `product_dashboard.php` | `/admin/dashboards/product-overview` | PARTIAL XL | 3 modals, 5 data endpoints |
| `product_management_dashboard.php` | `/admin/dashboards/products` | AUDIT | |
| `category.php` + `commission.php` | `/admin/catalog/categories` | PARTIAL / MISSING | Image, ad image, Arabic name, commission, GST, SEO, order, brand assign, timeline |
| `brand.php`, `pending_brand.php`, `pending_category.php` | `/admin/catalog/brands`, `…/categories?approval=Pending` | AUDIT / PARTIAL | Approve/reject side effects |
| `manage_conf_attributes.php`, `manage_conf_attributes_val.php`, `pending_attribute_conf.php` | `/admin/catalog/attributes` (+ values) | AUDIT / MISSING | Attribute values screen |
| `pending_attribute_set.php` (+ legacy `manage_attribute_set.php`, `manage_product_info_attributes*.php`) | `/admin/catalog/attribute-sets` | MISSING / LEGACY? | `attribute_set`, `product_info*` are read by product editing; decide with D2 |
| `manage_hsncode.php`, `manage_tax_class.php` + `pending_tax.php`, `manage_return_policy.php` + `pending_return_policy.php` | `/admin/catalog/...` | AUDIT / MISSING | Pending queues |
| `feature_category.php` (+ add/edit), `shop_topics.php` (+ add/edit) | `/admin/catalog/feature-categories`, `/crop-menu` | AUDIT | |
| `add_master_nrv.php` | `/admin/pricing/master-nrv` | PARTIAL L | Excel import; MSP, vendor, brand, technical name, category, variation, image, HSN columns |
| `product_cost_management.php` | `/admin/pricing/cost-config`, `/commission` | PARTIAL L | Budget fields (min contribution %, shipping, PG/COD, RTO, incentive), versions, viability columns |
| `price_calculator.php` | `/admin/pricing` | AUDIT | |
| `vendor_package_boxes.php` | `/admin/shipping/package-boxes` | PARTIAL | Packaging type, dimensions, notes, active |

### Phase 4: Sellers and customers

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `seller.php` | `/admin/vendors` (+ `/verification`, `/reports`) | PARTIAL | Seller code, email, phone, since; Excel export; delete |
| `add_seller.php` | `/admin/vendors/new` | PARTIAL | Seller group, business details, country/state/city |
| `edit_seller_profile.php` | `/admin/vendors/[id]` | PARTIAL L | 7 of 8 endpoints not named in the API |
| `edit-seller-bankdetails.php`, `kyc_document.php`, `send_mail.php` | `/admin/vendors/[id]` tabs/actions | MISSING | Bank, KYC documents, send email |
| `seller_dashboard.php` | `/admin/dashboards/sellers` | AUDIT L | |
| `app-user.php` | `/admin/customers` | PARTIAL L | ID, since, score activity, land holding, addresses, export |
| `edit_user_profile.php` | `/admin/customers/[id]` | PARTIAL | 5 endpoints |
| `order-tracking-logs.php` | `/admin/customers/[id]/tracking-logs` | MISSING | |

### Phase 5: Shipping, logistics, returns

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `shiprocket_orders_report.php` | `/admin/shipping` | PARTIAL L | 9 modals; shipment id, AWB, freight, product columns |
| `shipment_order_delhivery.php` | `/admin/shipping/delhivery` | AUDIT L | |
| `manage_returns.php` | `/admin/returns` | PARTIAL XL | 4 modals; SKU, qty, price, eligibility, AWB |
| `weight_discrapancy.php` | `/admin/shipping/weight-discrepancy` | PARTIAL | Applied/charged weight, difference, loss |
| `courier_serviceability.php`, `servicebilty_delhivery.php` | `/admin/shipping/pincodes`, `/delhivery-serviceability` | PARTIAL | Rate check form; Delhivery columns |
| `courier_cost_slab_master.php` + `courier_scoped_slab_master.php` | `/admin/shipping/courier-slabs` (+ `/scoped`) | AUDIT / MISSING | |
| `other_charges.php` | `/admin/shipping/other-charges` | PARTIAL | 6 endpoints |
| `pickup_addresses.php`, `manage_pickup_requests.php` | `/admin/shipping/pickup-addresses`, `/pickup-requests` | PARTIAL / AUDIT | All address columns and fields |
| `manage_shipping_slabs.php`, `manage_minimum_order.php`, `manage_minimum_cod.php`, `manage_cod_state_rule.php` | `/admin/shipping/...` | AUDIT | |
| `logistics_operations_dashboard.php` | `/admin/dashboards/logistics` | AUDIT | |
| `rebuild_rto_ledger.php`, `track_multiple_awbs.php`, `shipped_orders.php`, `shippment_summary.php`, `returns_order.php` | — | LEGACY? | D2 |

### Phase 6: Finance and payouts

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `payout_new.php`, `payout_new_items.php` | `/admin/payouts`, `/admin/payouts/items`, `/admin/payouts/[id]` | PARTIAL XL | Invoice columns (seller/BAL invoice, dates, place of supply), transaction file upload, cycle movement, item timeline; 7 of 8 endpoints not named in the API |
| `hold_ledger.php` + `hold_ledger_note.php` | `/admin/finance/hold-ledger` (+ note print) | PARTIAL L / MISSING | CN/DN holds, triggers, release modes |
| `finance.php` (+ anchors) | `/admin/finance` | AUDIT | |
| `fixed_expenses.php`, `expense_limit_dashboard.php`, `marketing_expenses.php` | `/admin/finance/...`, `/admin/marketing/expenses` | PARTIAL / AUDIT | Scope / override, notes |
| `returns_refunds_report.php`, `finance_payout_dashboard.php`, `fraud_analysis_dashboard.php` | `/admin/refunds`, `/admin/dashboards/finance`, `/admin/finance/fraud` | PARTIAL | Columns listed in inventory |
| `payout_finance.php` | `/admin/finance/ledger`, `/cod`, `/gst` | PARTIAL | |
| `vendor_payout_access_settings.php` | `/admin/payouts/access` | AUDIT | |
| `finance_ledger_management.php`, `customer_ledger.php`, `vendor_ledger.php`, `wallet_ledger.php`, `payment_history.php`, `settlement_management.php`, `finance_reports.php`, `finance_report_print.php` | `/admin/finance/ledger-management`, `/admin/finance/ledger/*`, `/admin/finance/reports` | MISSING | Whole ledger suite |
| `wallet-withdraw-requests.php`, `wallet-transactions.php` | `/admin/finance/wallet-withdrawals`, `/admin/finance/wallet/transactions` | PARTIAL / MISSING | Approve/reject/pay |
| `service_charge_invoice.php`, `service_charge_order_report_download.php`, `service_charge_settlement_download.php` | `/admin/payouts/[id]/service-charge` | MISSING | Invoice, receipts, two downloads |
| `payment.php`, `manage_order_date_wise_transaction*.php`, `payment1.php`, `seller_transaction.php`, `manage_seller_wise_transaction.php`, `refund_payment.php`, `security_payment.php`, `wallet_balance.php` | — | MISSING / LEGACY? | Old payment screens; `payment.php` and `manage_order_date_wise_transaction.php` are still linked from the header bell. Decide in D2 |

### Phase 7: CRM and sales

All 13 CRM pages and all 4 sales pages are PARTIAL.

| PHP | Next | Main work |
| --- | --- | --- |
| `crm_leads.php` (XL, 5.4k lines) | `/admin/crm/leads` (+ `/follow-ups`, `/circles`, `/leads/[id]`) | 11 of 18 endpoints not named in the API; order history tab, WhatsApp fields, season, product interest, agent |
| `lead_dashboard.php` | `/admin/crm` | AUDIT L |
| `add_lead.php` | `/admin/crm/add-lead` | Lead source, agent, sheet import |
| `manage_engagement_leads.php` | `/admin/crm/convert` | Engagement → lead conversion columns |
| `sales_agent_leads.php`, `manager_all_leads.php`, `pending_leads.php`, `dead_leads.php`, `report_requested_leads.php` | `/admin/crm/{agent-leads,legacy-leads,unassigned,dead,requested}` | Shared lead modals: single/bulk assign, status, dead, report request; circles |
| `customer_search_tracking.php` | `/admin/crm/customer-tracking` | Customer/mobile/type/first-last seen/activity columns |
| `whatsapp_leads.php` | `/admin/crm/whatsapp` | `whatsapp_messages`, `conversation_state_history` |
| `vapi_calls.php`, `call_audit.php` | `/admin/crm/ai-calls`, `/admin/crm/call-audit` | Vapi settings (batch size, attempts, retry gap, toggles), score, summary, recording; call audit upload and scores |
| `sales_target_management.php` (XL) | `/admin/sales` (+ targets, salary, achievements, payouts, team) | 10 modals; ratio share, progress, daily delivered sales |
| `my_sales_performance.php` (XL), `sales_performance_report.php` | `/admin/sales/my-performance`, `/team-performance` | Order-level tables, conversion |
| `sales_prepaid_incentive_setup.php` | `/admin/sales/prepaid-incentive` | Config key/value/type editor |

### Phase 8: Marketing and CMS

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `social_media_dashboard.php` | `/admin/marketing` | PARTIAL XL | Trend reports (generated, scope, categories, regions) |
| `engagement_panel.php` | `/admin/marketing/engagement` | PARTIAL L | Cart / recently viewed columns |
| `coupon.php` | `/admin/customers/coupons` | PARTIAL L | 4 modals; name, expiry, view |
| `newhomepage_website.php` | `/admin/cms/home-sections` | PARTIAL XL | 14 of 16 endpoints not named in the API: top bar, home SEO, sections, banners, previews |
| `homepagebanner-website.php` | `/admin/cms/home-sections` | PARTIAL L | |
| `notification.php` | `/admin/cms/notifications` | PARTIAL L | Push with seller, upsell, product images |
| `blogs.php`, `add_blog.php`, `edit_blog.php` | `/admin/cms/blogs` | PARTIAL | Editor, image, SEO |
| `meta.php`, `edit_custom_page.php` | `/admin/cms/seo` | PARTIAL / MISSING | |
| `pages_custom.php`, `pages.php`, `page_edit.php`, `page_delete.php` | `/admin/cms/pages` | AUDIT / PARTIAL | |
| `banners.php` | `/admin/cms/banners` | PARTIAL | Image, type, category/product |
| old homepage builder, `popular_product.php`, `offer-products.php`, `home-notifications.php`, `add_events.php`, `manage_events.php` | — | LEGACY? | D2 |

### Phase 9: Operations, support, hiring, admin settings

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `operations_center/index.php`, `ndr_escalations.php`, `recordings.php`, `settings.php` | `/admin/operations/...` | PARTIAL / AUDIT | Escalation, remark and call modals; NDR actions (reschedule, vendor response) |
| `operations_team/dashboard.php`, `setup.php`, `agent_orders.php`, `agent_report.php`, `overall_report.php` | `/admin/operations/team/...` | AUDIT / PARTIAL | 5 modals on agent orders; KPI/KRI tables |
| `operations_team/order_details.php` | `/admin/operations/team/orders/[id]` | LEGACY? | 2.5k lines, no PHP link found; ask the ops team how they open it |
| `support/admin_dashboard.php`, `support/admin_ticket_details.php` | `/admin/support`, `/admin/support/[id]` | AUDIT / PARTIAL | Remove mock fallback; replies, attachments, status, assignment |
| `chat_logs.php`, `requirement_requests.php` | `/admin/support/chat-logs`, `/requirements` | AUDIT | |
| `support_chat.php` | `/admin/support/chat` | MISSING | Linked from the header bell |
| `manage_review.php`, `product_review.php`, `add_product_review.php` | `/admin/customers/reviews` (+ `/pending`, `/new`) | PARTIAL / AUDIT / MISSING | Edit user name, title, images |
| `vacancies.php` (+ add/edit), `vacancy_applications.php` | `/admin/hiring/...` | AUDIT / PARTIAL | |
| `manage-role.php` | `/admin/roles` | PARTIAL | Permission matrix with sub-permissions per page |
| `menu-master.php` | `/admin/roles/menus` | AUDIT | Drives the sidebar after D1 |
| `manage-staff.php`, `add-staff.php`, `edit_staff_user_data.php` | `/admin/users`, `/new`, `/[id]/edit` | AUDIT / PARTIAL / MISSING | Role, experience level, location, photo |
| `system_settings.php` | `/admin/settings` (+ footer, geography) | PARTIAL | Default language, currency, timezone, affiliate commission, default shipping fee, footer text |
| `language_settings.php` + `language_phrase.php` | `/admin/settings/languages` (+ phrases) | AUDIT / MISSING | |
| `email_template.php` + `edit_email_template.php`, `currency_settings.php`, `smtp_settings.php`, `sms_settings.php`, `reject-reason.php` | `/admin/settings/...`, `/admin/masters/...` | AUDIT / MISSING | Template edit form |
| `signup_modal_settings.php`, `script_settings.php` | `/admin/settings/login-modal`, `/scripts` | PARTIAL | Modal title/subtitle/image/type; Google script, Facebook pixel, Tag Manager |
| `manage_state.php`, `manage_city.php` (+ `manage_country.php`) | `/admin/masters/geography` | PARTIAL / MISSING | Add/edit; the resource is read-only |

### Phase 10: Bulk orders

The API services already exist, so this module moves fast once routes are mounted.

1. Mount routes in `parity/bulk.routes.js` for what `bulk.service.js` already does: dashboard, orders (list, export, detail, status, sales agent, remark, delete, label, tracking, sync, invoice), shipments (list, waybill, payment, prefill, create), seller/product/customer lookups. Then quotations (`bulk-quotations.js`), order create (`bulk-orders-create.js`), products (`bulk-products.js`), couriers (`bulk-couriers.js`).
2. Fill `lib/content/admin/resources/parity/bulk.js` and add dedicated pages.

| PHP | Next | Size |
| --- | --- | --- |
| `index.php` | `/admin/bulk-orders/dashboard` | M |
| `orders.php`, `view_order.php` | `/admin/bulk-orders/orders`, `/orders/[id]` | L, XL |
| `create_order.php` | `/admin/bulk-orders/new` | L |
| `quotations.php`, `create_quotation.php`, `generate_quotation.php`, `quotation_to_order.php` | `/admin/bulk-orders/quotations` (+ new, PDF, convert) | S, L, M, M |
| `products.php`, `create_product.php`, `product_audit_log.php` | `/admin/bulk-orders/products` (+ new, audit) | M, M, S |
| `categories.php`, `create_category.php`, `b2b_commission.php` | `/admin/bulk-orders/categories` (+ new, commission) | S |
| `shipments.php`, `tracking.php` | `/admin/bulk-orders/shipments`, `/tracking` | L, S |
| `payouts.php`, `service_charge_invoice.php` | `/admin/bulk-orders/payouts` (+ service charge) | M |
| `operations.php`, `calculator.php`, `settings.php`, `analytics.php` | `/admin/bulk-orders/...` | S–M |
| `bulk_inquiry.php`, `warehouses.php` | `/admin/bulk-orders`, `/warehouses` | PARTIAL / AUDIT |

### Phase 11: B2B

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `index.php` | `/admin/b2b` | MOCK | Dashboard + `b2b_dashboard_modals.php` from the API |
| `buyers.php` | `/admin/b2b/buyers` (+ `/[id]`) | PARTIAL | Create-customer modal, customer types |
| `rfqs.php`, `b2b_quotations.php` | `/admin/b2b/rfqs`, `/quotations` | AUDIT | Seller quotes (`b2b_sp_seller_quotes`) |
| `quotation_edit.php`, `generate_quotation.php`, root `generate_quotation.php` | `/admin/b2b/quotations/[id]` (+ PDF) | MISSING | Quotation builder: items, packages, freight, MOQ, margin card, share |
| `catalog.php`, `view_product.php`, `product_edit.php`, `catalog_generator.php` | `/admin/b2b/catalog` (+ `/[id]`, `/[id]/edit`, `/generate`) | PARTIAL / MISSING | Variants, margin analyzer, catalog PDF |
| `b2b_order_list.php`, `order_create.php`, `view_order.php` | `/admin/b2b/orders` (+ new, `/[id]`) | PARTIAL / MISSING / PARTIAL | Order create (XL), freight zones and rates, package types, shipping policy, invoice split by vendor |
| `approvals.php`, `b2b_payment_attempts.php`, `payments.php` | `/admin/b2b/approvals`, `/payment-attempts`, `/payments` | PARTIAL / MISSING / AUDIT | Razorpay payment link flow |
| `ops_queue.php`, `logistics.php`, `b2b_shipments.php`, `packing.php` | `/admin/b2b/ops-queue`, `/logistics`, `/shipments`, `/packing` | PARTIAL / AUDIT / MISSING | Courier selection modal, labels |
| `inventory.php`, `sellers.php`, `masters.php` | `/admin/b2b/inventory`, `/sellers`, `/masters` | MISSING | Stock alerts, seller scores, master tables |
| `claims.php`, `alerts.php`, `settlements.php`, `reports.php`, `audit_log.php` | `/admin/b2b/...` | AUDIT / PARTIAL / MISSING | |
| `users_roles.php`, `role_edit.php`, `nav_manager.php` | — | DROPPED | D3: B2B access comes from main roles; sidebar from Menu Master |

Before B2B screens go live in Next, fix the main roles' B2B grants: `npm run b2b-access-report` in the API lists per role what it gains or loses against the PHP B2B panel and the Manage Role grants to set. On staging (2026-10-08) HR, Social Media Manager, Marketing Manager, Tester, Developer Test and `operationexecutiveba@gmail.com` hold view/add/edit on every B2B menu (PHP's B2B layer blocked them), while Sales Manager, Senior Sales Executive, Sales Intern, Accounts, General Manager, Logistics Manager and both Operation roles have almost no B2B menu grants.

### Phase 12: Dashboards and reports

Done after the data modules, because these screens reuse their queries and checking them is reconciliation work.

| PHP | Next | Status | Main work |
| --- | --- | --- | --- |
| `dashboard.php` | `/admin/dashboard` | PARTIAL XL | About 50 data endpoints and 32 drill-down modals (`dashboard_modals.php`), the `#dashboard_*_overview` sections, filters |
| `main_dashboard.php` | `/admin/dashboards/business` | AUDIT | |
| `ceo_decision_matrix.php` | `/admin/ceo-matrix` | PARTIAL L | Matrix columns, AI recommendations cache |
| `score_management.php` | `/admin/vendors/scores` | PARTIAL XL | `score_settings`, product score snapshots, compute |
| `reports.php` | `/admin/reports` | PARTIAL XL | Every PHP report and export |

### Phase 13: Background jobs

| PHP | What it does | Plan |
| --- | --- | --- |
| `order_update_cron.php` | Updates `order_product` statuses | Move with Orders |
| `order_card_cron.php` | Order SMS (max 2 per number at a time) | Move with the notification service |
| `payment_cron.php` | Seller payment calculation on `order_product` | Move with Finance |
| `operations_center/cron_escalation_engine.php` | Fills the escalation panel every 30–60 min | Move with Operations |
| `operations_team/auto_assign_orders_cron.php` | Daily auto-assign of orders to agents | Move with Operations |
| `b2b_orders/cron/sync_tracking_cron.php` | Polls Shiprocket/Delhivery/Blue Dart for B2B orders | Move with B2B |
| `operations_team/sync_shipment_status.php` | Shipment status sync | Node already has `npm run sync-shipments`; make one of them the owner |
| `webhook.php` | Empty file | Drop |

Rule (D5): a job keeps running in PHP until its module is cut over, then moves to Node in the same release, and the PHP schedule is removed the same day. Never run both.

### Phase 14: Cutover and cleanup

- Per module, after sign-off: point the PHP menu link to the Next route, then redirect the PHP URL (nginx map from `inventory.json` → `route`).
- One week of daily count/total reconciliation per module after cutover.
- Delete the old Next code listed in §2.2 point 9, the "not connected" banner logic and `resource-fallback.js`.
- Finished when the inventory shows 0 MISSING, MOCK, PARTIAL and AUDIT, and every LEGACY? page is either dropped by decision or ported.

## 7. Decisions needed

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Sidebar source: `admin_menus` (like PHP) or static `navigation.js` | **Decided and done (2026-10-08):** `admin_menus` via `GET /admin/auth/menu` (§3.3) |
| D2 | Which LEGACY? pages to drop. Groups: delivery-boy module (6 pages); other-country/Turkey orders (4); old homepage builder (6); old payment and transaction screens (~10); `*_old`/copy/test files (7); duplicate `pages/` folder (3); `manage_roles.php`; `edit_brand.php`/`edit_category.php` (modals replace them); attribute-set and product-info masters; `operations_team/order_details.php`; `track_multiple_awbs.php`; `rebuild_rto_ledger.php`; `order_notification_settings.php` | Drop only after the `admin_menus` export and a yes from each module's users. Data some of them manage (`security_payment`, `attribute_set`) is still shown on order and product pages, so those reads must be ported even if the master screen is dropped |
| D3 | B2B panel RBAC (`b2b_sp_roles`, permissions, nav manager): keep separate or fold into main roles | **Decided and done (2026-10-08):** no separate B2B roles; folded into main roles (§3.3). Role grants still need review (Phase 11 note) |
| D4 | PDF generation | Server-side HTML → PDF (headless Chromium) so the PHP invoice/quotation HTML can be reused |
| D5 | Background jobs | Keep in PHP until the module's cutover, then move to Node; one owner per job |
| D6 | Old PHP URLs in bookmarks, WhatsApp/SMS templates and emails | Redirect each `*.php` URL to its Next route at cutover |
| D7 | Next-only screens (Reports hub, Inventory, Stock History, Global Search, Audit Log, Integrations, Help, Departments & SLA, …) | Out of parity scope; keep only those wired to the API (Inventory summary and Global Search are mock today) |

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Business rules hidden in very large PHP files (`edit_order.php` 10.7k lines, `crm_leads.php` 5.4k, `order_create.php` 3.4k, `payout_new_items.php` 3.2k) | Port endpoint by endpoint from the inventory; side-by-side numbers check |
| Duplicate side effects while both systems run (WhatsApp/SMS sent twice, cron reprocessing) | Idempotency keys in the notification service; one owner per job (D5) |
| Data written by Node not readable by PHP (status codes, IST strings, JSON shapes, file paths) | Rule 4 in §1; check every write from the PHP side (§4 point 7) |
| Permission drift | Three-role test per page; sidebar from `admin_menus` |
| PHP keeps changing during the port | Freeze or log PHP changes; re-run the tool weekly |
| Heavy DataTables queries on the shared DB | Port the SQL as is first; add indexes only together with the PHP owners |

## 9. Tracking

- Progress = status counts from `node docs/php-port/tools/build-inventory.mjs`, per module.
- Each PR names the PHP files it ports and pastes their ticked checklist.
- A module is closed when its users sign off after the side-by-side check and the cutover week.
