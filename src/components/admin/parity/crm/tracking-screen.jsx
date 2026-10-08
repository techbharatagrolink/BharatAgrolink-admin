"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { formatDateTime, formatNumber } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { exportTrackingAction, trackingCustomersAction } from "@/lib/actions/admin/parity/crm";
import { UrlInput } from "./url-input";

const productHref = `${site.url.replace(/\/$/, "")}/product/{product_url}`;

const VIEWS = {
  activity: {
    label: "All Activity",
    title: "Customer Activity",
    hint: "Searches and product opens in one table - one row per customer and item, with how many times they did it.",
    file: "customer_search_and_clicks",
    columns: [
      { key: "activity_type", label: "Activity", type: "status", sortable: true },
      { key: "customer_name", label: "Customer", emphasis: true, sortable: true },
      { key: "phone", label: "Mobile Number", sortable: true },
      { key: "email", label: "Email", hidden: true },
      { key: "customer_type", label: "Type", type: "status", sortable: true },
      { key: "search_term", label: "Search Term", sortable: true },
      { key: "product_name", label: "Product Opened", href: productHref, sub: "product_sku", sortable: true, width: 260 },
      { key: "product_sku", label: "SKU", hidden: true },
      { key: "activity_count", label: "Times", type: "number", sortable: true },
      { key: "source", label: "Came From", type: "status", sortable: true },
      { key: "results_count", label: "Results Found", type: "number", sortable: true },
      { key: "updated_at", label: "Last Activity", type: "datetime", sortable: true },
      { key: "created_at", label: "First Activity", type: "datetime", sortable: true, hidden: true },
      { key: "device_type", label: "Device", sortable: true },
      { key: "city", label: "City", sub: "region", sortable: true },
      { key: "region", label: "Region", hidden: true },
      { key: "user_id", label: "User ID", type: "mono", hidden: true },
    ],
  },
  products: {
    label: "Product Summary",
    title: "Product Summary",
    hint: 'Per product: how many times it was searched for and opened, and by how many customers. Click "Customers" to see who.',
    file: "product_search_summary",
    columns: [
      { key: "product_name", label: "Product", href: productHref, emphasis: true, sortable: true, width: 280 },
      { key: "product_sku", label: "SKU", sortable: true },
      { key: "total_searches", label: "Times Searched", type: "number" },
      { key: "total_opens", label: "Times Opened", type: "number", sortable: true },
      { key: "opens_from_search", label: "Opened From Search", type: "number", sortable: true },
      { key: "unique_customers", label: "Customers", type: "number", sortable: true },
      { key: "registered_customers", label: "Registered Customers", type: "number", sortable: true },
      { key: "search_terms", label: "Search Terms Used", wrap: true, width: 260 },
      { key: "last_opened_at", label: "Last Opened", type: "datetime", sortable: true },
      { key: "first_opened_at", label: "First Opened", type: "datetime", sortable: true, hidden: true },
      { key: "product_id", label: "Product ID", type: "mono", hidden: true },
    ],
  },
  terms: {
    label: "Search Term Summary",
    title: "Search Term Summary",
    hint: "Per term: how many times it was searched, by how many customers, and how many products they opened afterwards.",
    file: "search_term_summary",
    columns: [
      { key: "search_term", label: "Search Term", emphasis: true, sortable: true },
      { key: "total_searches", label: "Times Searched", type: "number", sortable: true },
      { key: "unique_customers", label: "Customers", type: "number", sortable: true },
      { key: "registered_customers", label: "Registered Customers", type: "number", sortable: true },
      { key: "product_opens", label: "Products Opened After", type: "number" },
      { key: "products_opened", label: "Distinct Products", type: "number" },
      { key: "last_results_count", label: "Results Found", type: "number", sortable: true },
      { key: "last_searched_at", label: "Last Searched", type: "datetime", sortable: true },
      { key: "first_searched_at", label: "First Searched", type: "datetime", sortable: true, hidden: true },
    ],
  },
};

const ACTIVITY_OPTIONS = [
  { value: "Search", label: "Searches Only" },
  { value: "Product Open", label: "Product Opens Only" },
];
const USER_TYPES = [
  { value: "registered", label: "Registered Only" },
  { value: "guest", label: "Guest Only" },
];
const DEVICES = [
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
];
const MIN_LABEL = { activity: "Min Times", products: "Min Times Opened", terms: "Min Times Searched" };
const FILTER_KEYS = ["activity", "term", "product", "sku", "phone", "name", "userType", "source", "device", "city", "minTimes", "from", "to"];

function ParamSelect({ name, label, options, placeholder }) {
  const { get, setParams } = useQueryState();
  return (
    <Field label={label}>
      {({ id }) => <Select id={id} value={get(name)} options={options} placeholder={placeholder} onChange={(e) => setParams({ [name]: e.target.value })} />}
    </Field>
  );
}

function ParamText({ name, label, placeholder, type }) {
  return (
    <Field label={label}>
      {({ id }) => <UrlInput id={id} name={name} label={label} placeholder={placeholder} type={type} />}
    </Field>
  );
}

function ParamDate({ name, label }) {
  const { get, setParams } = useQueryState();
  return (
    <Field label={label}>
      {({ id }) => (
        <input id={id} type="date" value={get(name)} onChange={(e) => setParams({ [name]: e.target.value })} className="h-9 w-full rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
      )}
    </Field>
  );
}

/** Customers behind one product (opens) or one search term (searches). */
function CustomersDialog({ target, sources, onClose }) {
  const [state, setState] = useState({ loading: true, result: null });
  useEffect(() => {
    let live = true;
    trackingCustomersAction(target.kind === "product" ? { productId: target.productId } : { term: target.term }).then((result) => live && setState({ loading: false, result }));
    return () => {
      live = false;
    };
  }, [target]);
  const product = target.kind === "product";
  const sourceLabel = (v) => sources.find((s) => s.value === v)?.label || v || "-";
  const rows = state.result?.ok ? state.result.data.rows : [];
  return (
    <Dialog open onClose={onClose} size="xl" title={product ? `Customers who opened: ${target.label}` : `Customers who searched: "${target.term}"`}>
      {state.loading ? (
        <div className="flex justify-center py-10 text-ink-muted">
          <Loader2 className="size-5 animate-spin" aria-label="Loading" />
        </div>
      ) : !state.result.ok ? (
        <Notice tone="danger">{state.result.message}</Notice>
      ) : rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No customers found.</p>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-max text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted text-xs text-ink-muted">
                {["Customer", "Mobile Number", "Type", product ? "Times Opened" : "Times Searched", ...(product ? ["Clicked From", "Search Term", "City"] : ["Results Found", "Searched From", "City"]), "First Seen", "Last Seen"].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-medium text-ink">{r.customer_name || "Guest Visitor"}</td>
                  <td className="px-3 py-2">{r.phone || "-"}</td>
                  <td className="px-3 py-2">
                    <Badge tone={r.customer_type === "Registered" ? "success" : "neutral"}>{r.customer_type}</Badge>
                  </td>
                  <td className="px-3 py-2 tabular">{formatNumber(r.times)}</td>
                  {product ? (
                    <>
                      <td className="px-3 py-2">{sourceLabel(r.source)}</td>
                      <td className="px-3 py-2">{r.search_term || "-"}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2 tabular">{r.results_count ?? "-"}</td>
                      <td className="px-3 py-2">{sourceLabel(r.source)}</td>
                    </>
                  )}
                  <td className="px-3 py-2">{r.city || "-"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(r.created_at)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(r.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Dialog>
  );
}

/**
 * customer_search_tracking.php table: three views (activity / product summary /
 * term summary) with the per-view filter panel, CSV export of every matching
 * row and the "Customers" drill-down.
 */
export function TrackingScreen({ view, data, sources }) {
  const router = useRouter();
  const { setParams } = useQueryState();
  const [refreshing, startRefresh] = useTransition();
  const [customers, setCustomers] = useState(null);
  const config = VIEWS[view];
  const sourceLabels = Object.fromEntries(sources.map((s) => [s.value, s.label]));
  const columns = config.columns.map((c) => (c.key === "source" ? { ...c, labels: sourceLabels } : c));
  const show = (...views) => views.includes(view);

  const switchView = (next) => setParams({ view: next === "activity" ? "" : next, sort: "" });
  const clearFilters = () => setParams(Object.fromEntries(FILTER_KEYS.map((k) => [k, ""])));

  return (
    <div className="space-y-3">
      <Card className="p-3">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink">{config.title}</h2>
            <p className="text-xs text-ink-muted">{config.hint}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(VIEWS).map(([key, v]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => switchView(key)}
                className={cn("h-8 rounded-md border px-3 text-[13px] font-medium", view === key ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line-strong text-ink-soft hover:bg-surface-muted")}
              >
                {v.label}
              </button>
            ))}
            <Button size="sm" onClick={() => startRefresh(() => router.refresh())} loading={refreshing}>
              {!refreshing && <RefreshCw className="size-4" aria-hidden />} Refresh
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {show("activity") && <ParamSelect name="activity" label="Activity" options={ACTIVITY_OPTIONS} placeholder="Searches + Product Opens" />}
          {show("activity", "terms") && <ParamText name="term" label="Search Term" placeholder="e.g. urea" />}
          {show("activity", "products") && <ParamText name="product" label="Product Name" placeholder="Product" />}
          {show("activity", "products") && <ParamText name="sku" label="Product SKU" placeholder="SKU" />}
          {show("activity") && <ParamText name="phone" label="Mobile Number" placeholder="Phone" />}
          {show("activity") && <ParamText name="name" label="Customer Name" placeholder="Name" />}
          <ParamSelect name="userType" label="Customer Type" options={USER_TYPES} placeholder="All Customers" />
          {show("activity") && <ParamSelect name="source" label="Came From" options={sources} placeholder="All Sources" />}
          {show("activity") && <ParamSelect name="device" label="Device" options={DEVICES} placeholder="All Devices" />}
          {show("activity") && <ParamText name="city" label="City" placeholder="City" />}
          <ParamText name="minTimes" label={MIN_LABEL[view]} placeholder="1" type="number" />
          <ParamDate name="from" label="From Date" />
          <ParamDate name="to" label="To Date" />
          <div className="flex items-end">
            <Button size="md" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <DataTable
        id={`crm-tracking-${view}`}
        key={view}
        columns={columns}
        data={data}
        onExport={(params) => exportTrackingAction({ ...params, view })}
        exportName={config.file}
        rowActions={view === "activity" ? [] : [{ id: "customers", label: "Customers", kind: "form" }]}
        onCustomAction={(_action, _ids, rows) =>
          setCustomers(view === "products" ? { kind: "product", productId: rows[0].product_id, label: rows[0].product_name || rows[0].product_id } : { kind: "term", term: rows[0].search_term })
        }
        emptyTitle="No tracking data found"
      />
      {customers && <CustomersDialog target={customers} sources={sources} onClose={() => setCustomers(null)} />}
    </div>
  );
}
