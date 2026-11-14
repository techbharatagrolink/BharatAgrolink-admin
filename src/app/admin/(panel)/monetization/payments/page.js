import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { LinkTabs, StatCard, StatGrid } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";
import { ReconcilePayment } from "@/components/admin/monetization/reconcile-payment";
import { InvoiceProfileEditor } from "@/components/admin/monetization/invoice-profile";

export const metadata = { title: "Payments & Invoices" };

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr = (v) => rupees.format(Number(v) || 0);
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const day = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(one(v)) ? one(v) : "");
const PAYMENT_TONE = { CAPTURED: "success", FAILED: "danger", CREATED: "warning", REFUND_PENDING: "warning", REFUNDED: "info" };
const PAYMENT_LABEL = { CAPTURED: "Captured", FAILED: "Failed", CREATED: "Started, not paid", REFUND_PENDING: "Refund pending", REFUNDED: "Refunded" };

function Filters({ tab, values }) {
  return (
    <form className="mb-4 flex flex-wrap items-end gap-2" action="/admin/monetization/payments">
      <input type="hidden" name="tab" value={tab} />
      <label className="flex flex-col gap-1 text-xs text-ink-muted">
        Search
        <input name="search" defaultValue={values.search} placeholder={tab === "invoices" ? "Invoice / order no / seller" : "Order / seller / payment id"} className="h-9 w-64 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-ink-muted">
        From
        <input type="date" name="from" defaultValue={values.from} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-ink-muted">
        To
        <input type="date" name="to" defaultValue={values.to} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
      </label>
      {tab === "payments" ? (
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          Status
          <select name="status" defaultValue={values.status} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink">
            <option value="">All</option>
            {Object.entries(PAYMENT_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button type="submit" className="h-9 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white">
        Apply
      </button>
      <Link href={`/admin/monetization/payments?tab=${tab}`} className="h-9 px-2 text-sm leading-9 text-ink-muted hover:text-ink">
        Clear
      </Link>
    </form>
  );
}

function Pager({ meta, params }) {
  if (!meta || meta.totalPages <= 1) return null;
  const href = (page) => `/admin/monetization/payments?${new URLSearchParams({ ...params, page: String(page) })}`;
  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
      <span className="text-ink-muted">
        Page {meta.page} of {meta.totalPages} · {meta.total} records
      </span>
      <div className="flex gap-2">
        {meta.page > 1 ? (
          <ButtonLink href={href(meta.page - 1)} size="sm">
            Previous
          </ButtonLink>
        ) : null}
        {meta.page < meta.totalPages ? (
          <ButtonLink href={href(meta.page + 1)} size="sm">
            Next
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}

export default async function MonetizationPaymentsPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const tab = ["payments", "credit-notes"].includes(one(sp.tab)) ? one(sp.tab) : "invoices";
  const credit = tab === "credit-notes";
  const values = { search: one(sp.search).slice(0, 100), from: day(sp.from), to: day(sp.to), status: PAYMENT_LABEL[one(sp.status)] ? one(sp.status) : "" };
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const { user, canEdit, header, denied } = await monetizationPage({
    title: "Payments & Invoices",
    description: "Prepaid banner ad collections with their Razorpay references, and the BAN tax invoices issued for verified payments. Separate from BAL service charge invoices.",
  });
  if (denied) return denied;

  const query = { search: values.search || undefined, from: values.from || undefined, to: values.to || undefined, page };
  const [result, profile] = await Promise.all([
    loadMonetization(user, tab === "payments" ? "payments" : "invoices", tab === "payments" ? { ...query, status: values.status || undefined } : { ...query, docType: credit ? "CREDIT_NOTE" : "INVOICE" }),
    loadMonetization(user, "invoice-profile"),
  ]);
  const params = Object.fromEntries(Object.entries({ tab, ...values }).filter(([, v]) => v));
  const p = profile.data;

  return (
    <>
      {header}
      {p ? (
        <Card className="mb-4">
          <CardHeader
            title="Invoice details (supplier)"
            description={`Printed on every new BAN invoice. Address from ${p.sources?.address === "invoice-details" ? "Invoice details" : "Settings → System Settings"}.`}
            actions={<InvoiceProfileEditor profile={p} canEdit={canEdit} />}
          />
          <div className="grid gap-x-6 gap-y-1 px-4 pb-4 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
            <span>
              <span className="text-ink-muted">Name: </span>
              {p.legalName}
            </span>
            <span>
              <span className="text-ink-muted">GSTIN: </span>
              {p.gstin}
            </span>
            <span>
              <span className="text-ink-muted">Default SAC: </span>
              {p.defaultSac}
            </span>
            <span className="sm:col-span-2 lg:col-span-3">
              <span className="text-ink-muted">Address: </span>
              {p.address || <Badge tone="danger">Not set</Badge>}
              {p.sources?.address === "system-settings" ? (
                <Link href="/admin/settings" className="ml-2 text-brand-700 hover:underline">
                  Edit in System Settings
                </Link>
              ) : null}
            </span>
          </div>
        </Card>
      ) : null}
      <LinkTabs
        active={tab}
        tabs={[
          { value: "invoices", label: "BAN invoices", href: "/admin/monetization/payments?tab=invoices" },
          { value: "credit-notes", label: "Credit notes", href: "/admin/monetization/payments?tab=credit-notes" },
          { value: "payments", label: "Payments", href: "/admin/monetization/payments?tab=payments" },
        ]}
      />
      <Filters tab={tab} values={values} />
      {result.error ? (
        <LoadError error={result.error} what={tab === "payments" ? "the payments" : "the invoices"} />
      ) : tab !== "payments" ? (
        <>
          <StatGrid className="mb-4 xl:grid-cols-4">
            <StatCard label={credit ? "Credit notes" : "Invoices"} value={String(result.meta?.total ?? 0)} tone="neutral" />
            <StatCard label="Taxable value" value={inr(result.meta?.sums?.taxable)} tone="neutral" />
            <StatCard label="GST" value={inr(result.meta?.sums?.gst)} tone="neutral" />
            <StatCard label={credit ? "Total refunded" : "Total invoiced"} value={inr(result.meta?.sums?.total)} />
          </StatGrid>
          <Card>
            <CardHeader
              title={credit ? "Credit notes (BANCN)" : "BAN invoices"}
              description={credit ? "Issued when a paid order is refunded; each one references its BAN invoice." : "Issued automatically after a payment is verified with Razorpay. Open one to print or save it as PDF."}
            />
            <MiniTable
              empty={credit ? "No credit notes for these filters." : "No BAN invoices for these filters."}
              columns={[
                {
                  key: "invoiceNo",
                  label: "Invoice",
                  render: (r) => (
                    <a href={`/admin/monetization/invoices/${r.id}`} target="_blank" rel="noopener" className="font-medium text-brand-700 hover:underline">
                      {r.invoiceNo}
                    </a>
                  ),
                },
                { key: "invoiceDate", label: "Date" },
                {
                  key: "seller",
                  label: "Seller",
                  render: (r) => (
                    <span className="block">
                      <span className="font-medium text-ink">{r.sellerName || r.sellerId}</span>
                      <span className="block text-xs text-ink-muted">{r.sellerGstin || "No GSTIN"}</span>
                    </span>
                  ),
                },
                { key: "orderNo", label: "Order" },
                ...(credit ? [{ key: "ref", label: "Against invoice", render: (r) => r.refInvoiceNo || "—" }] : []),
                { key: "ad", label: "Ad", render: (r) => `${r.serviceName} · ${r.packageName}` },
                { key: "taxable", label: "Taxable", align: "right", render: (r) => inr(r.taxable) },
                { key: "gst", label: "GST", align: "right", render: (r) => inr(r.cgst + r.sgst + r.igst) },
                { key: "total", label: "Total", align: "right", render: (r) => <span className="font-medium">{inr(r.total)}</span> },
                { key: "mode", label: "", render: (r) => (r.paymentMode === "test" ? <Badge tone="warning">Test</Badge> : null) },
              ]}
              rows={result.data}
            />
            <Pager meta={result.meta} params={params} />
          </Card>
        </>
      ) : (
        <>
          <StatGrid className="mb-4 xl:grid-cols-3">
            <StatCard label="Payment attempts" value={String(result.meta?.total ?? 0)} tone="neutral" />
            <StatCard label="Collected" value={inr(result.meta?.sums?.captured)} />
            <StatCard label="Failed" value={String(result.meta?.sums?.failed ?? 0)} tone={result.meta?.sums?.failed ? "danger" : "neutral"} />
          </StatGrid>
          <Card>
            <CardHeader title="Payments" description="Every prepaid attempt. A payment counts only after Razorpay confirms it on the server." />
            <MiniTable
              empty="No payments for these filters."
              columns={[
                {
                  key: "order",
                  label: "Order",
                  render: (r) => (
                    <span className="block">
                      <span className="font-medium text-ink">{r.orderNo}</span>
                      <span className="block text-xs text-ink-muted">{r.sellerName}</span>
                    </span>
                  ),
                },
                { key: "amount", label: "Amount", align: "right", render: (r) => inr(r.amount) },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <span className="flex flex-wrap items-center gap-1">
                      <Badge tone={PAYMENT_TONE[r.status] ?? "neutral"}>{PAYMENT_LABEL[r.status] ?? r.status}</Badge>
                      {r.mode === "test" ? <Badge tone="warning">Test</Badge> : null}
                    </span>
                  ),
                },
                {
                  key: "refs",
                  label: "Razorpay",
                  render: (r) => (
                    <span className="block text-xs">
                      <span className="block">{r.gatewayPaymentId || "—"}</span>
                      <span className="block text-ink-muted">{r.gatewayOrderId}</span>
                    </span>
                  ),
                },
                { key: "verifiedVia", label: "Verified by", render: (r) => r.verifiedVia || "—" },
                { key: "when", label: "Time", render: (r) => formatDateTime(r.paidAt || r.createdAt) },
                {
                  key: "invoice",
                  label: "Invoice",
                  render: (r) =>
                    r.invoiceId ? (
                      <a href={`/admin/monetization/invoices/${r.invoiceId}`} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
                        {r.invoiceNo}
                      </a>
                    ) : r.error ? (
                      <span className="text-xs text-danger-ink">{r.error}</span>
                    ) : (
                      "—"
                    ),
                },
                { key: "check", label: "", render: (r) => (canEdit && ["CREATED", "FAILED"].includes(r.status) ? <ReconcilePayment orderId={r.orderId} /> : null) },
              ]}
              rows={result.data}
            />
            <Pager meta={result.meta} params={params} />
          </Card>
        </>
      )}
    </>
  );
}
