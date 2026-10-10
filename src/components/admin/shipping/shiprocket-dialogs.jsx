"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { DescriptionList, Notice, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { formatINR } from "@/lib/format";
import { shiprocketOrderAction, shiprocketReportDocumentAction, trackShiprocketAction } from "@/lib/actions/admin/shipping";

/** Badge tones for PHP's status classes (status-new / assigned / call-scheduled / in-progress / dead, tracking classes). */
export const listTone = (status) => ({ INVOICED: "info", NEW: "info", PICKED: "success", CANCELED: "danger" })[status] ?? "warning";
const orderTone = (status) => (status === "CANCELED" ? "danger" : ["DELIVERED", "FULFILLED"].includes(status) ? "success" : ["SHIPPED", "IN_TRANSIT"].includes(status) ? "info" : "warning");
export const trackTone = (tone) => ({ delivered: "success", cancelled: "danger", exception: "danger", picked: "info", in_transit: "info" })[tone] ?? "warning";
const riskTone = (risk) => (risk === "low" ? "success" : risk === "medium" ? "warning" : "danger");
const timelineTone = (tone) => (tone === "cancelled" || tone === "exception" ? "danger" : tone === "pending" ? "warning" : undefined);

/** Opens the tab before the await so the browser does not block it as a popup; follows the document URL when one comes back. */
export async function openInTab(load) {
  const tab = window.open("", "_blank");
  const r = await load();
  if (r.ok && r.data?.ok && r.data.url) {
    if (tab) tab.location.href = r.data.url;
    else window.location.href = r.data.url;
  } else tab?.close();
  return r;
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function Loading({ what }) {
  return (
    <div className="space-y-3" aria-busy>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
      <p className="text-center text-sm text-ink-muted">Loading {what}…</p>
    </div>
  );
}

/** Loads once per open; `load` is a server action returning { ok, data, message }. */
function useLoad(open, load) {
  const [state, setState] = useState({ loading: true, result: null });
  useEffect(() => {
    if (!open) return undefined;
    let live = true;
    load().then((result) => live && setState({ loading: false, result }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return state;
}

const DOC_TEXT = {
  label: { confirm: "Generate label for this shipment?", ok: "Label generated successfully!", fail: (d) => `Failed to generate label. ${d?.message || "Please check shipment details."}` },
  manifest: { confirm: "Generate manifest for this shipment?", ok: "Manifest generated successfully!", fail: (d) => `Failed to generate manifest. ${d?.message || "Please ensure AWB is assigned and pickup is requested."}` },
  invoice: { confirm: "Generate invoice for this order?", ok: "Invoice generated successfully!", fail: (d) => `Failed to generate invoice.${d?.notCreated?.length ? ` Order ID: ${d.notCreated.join(", ")}` : ""}` },
};

/** openShiprocketOrderDetails(): the Shiprocket order with its documents. */
export function ShiprocketOrderDialog({ srOrderId, open, onClose, canEdit }) {
  const { notify } = useToast();
  const { loading, result } = useLoad(open, () => shiprocketOrderAction(srOrderId));
  const [confirm, setConfirm] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [running, start] = useTransition();
  const d = result?.ok ? result.data : null;
  const s = d?.shipment;

  const generate = (doc) =>
    start(async () => {
      const ids = doc === "invoice" ? [d.id] : [s.id];
      const r = await openInTab(() => shiprocketReportDocumentAction(doc, ids));
      setConfirm(null);
      if (!r.ok) return notify({ message: r.message, tone: "error" });
      if (!r.data.ok) return notify({ message: DOC_TEXT[doc].fail(r.data), tone: "error" });
      if (doc === "invoice") setInvoiceUrl(r.data.url);
      notify({ message: DOC_TEXT[doc].ok, tone: "success" });
    });

  const canDocs = Boolean(s?.id && s?.awb);
  const invoice = invoiceUrl || s?.invoiceUrl;
  return (
    <Dialog open={open} onClose={onClose} size="xl" title="Order Details" description={`Order ID: ${d?.id || srOrderId}`}>
      {loading ? (
        <Loading what="order details" />
      ) : !d ? (
        <Notice tone="danger" title="Error Loading Order">{result?.message || "Error loading order details"}. Please try again later or contact support if the issue persists.</Notice>
      ) : (
        <div className="space-y-5">
          <StatGrid>
            <StatCard label="Channel Order ID" value={d.channelOrderId || "N/A"} tone="info" />
            <StatCard label="Order Value" value={formatINR(d.netTotal)} />
            <StatCard label="Products" value={d.products.length} tone="neutral" />
            <StatCard label="Payment Method" value={(d.paymentMethod || "N/A").toUpperCase()} tone="warning" />
          </StatGrid>

          <Section title="Order Status">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={orderTone(d.status)} dot>{d.status || "N/A"}</Badge>
              {d.subStatus && <Badge tone="warning">{d.subStatus}</Badge>}
              {d.cod && <Badge tone="danger">COD Order</Badge>}
            </div>
            {d.statusCode && <p className="text-xs text-ink-muted">Status Code: {d.statusCode}</p>}
          </Section>

          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Customer Information">
              <DescriptionList
                columns={1}
                items={[
                  { label: "Name", value: d.customer.name || "N/A" },
                  { label: "Email", value: d.customer.email || "N/A" },
                  { label: "Phone", value: d.customer.phone || "N/A" },
                  { label: "Address", value: [d.customer.address || "N/A", d.customer.address2].filter(Boolean).join(", ") },
                  { label: "City / State", value: `${d.customer.city || "N/A"}, ${d.customer.state || "N/A"}` },
                  { label: "Pincode / Country", value: `${d.customer.pincode || "N/A"}, ${d.customer.country || "N/A"}` },
                ]}
              />
            </Section>
            <Section title="Pickup Address">
              <DescriptionList
                columns={1}
                items={[
                  d.pickup.name && { label: "Name", value: d.pickup.name },
                  d.pickup.phone && { label: "Phone", value: d.pickup.phone },
                  d.pickup.email && { label: "Email", value: d.pickup.email },
                  d.pickup.address && { label: "Address", value: [d.pickup.address, d.pickup.address2].filter(Boolean).join(", ") },
                  d.pickup.city && { label: "City / State", value: `${d.pickup.city}, ${d.pickup.state}` },
                  d.pickup.pincode && { label: "Pincode / Country", value: `${d.pickup.pincode}, ${d.pickup.country}` },
                ]}
              />
            </Section>
          </div>

          {d.products.length > 0 && (
            <Section title={`Products (${d.products.length})`}>
              <div className="rounded-lg border border-line">
                <MiniTable
                  columns={[
                    { key: "name", label: "Product Name", render: (r) => <span className="text-ink">{r.name || "N/A"}</span> },
                    { key: "sku", label: "SKU", render: (r) => <span className="font-mono text-xs">{r.sku || "N/A"}</span> },
                    { key: "quantity", label: "Quantity", align: "right" },
                    { key: "price", label: "Price", align: "right", render: (r) => formatINR(r.price) },
                    { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
                  ]}
                  rows={d.products}
                />
              </div>
            </Section>
          )}

          {s && (
            <Section title="Shipment Information">
              <DescriptionList
                items={[
                  { label: "Shipment ID", value: s.id || "N/A" },
                  { label: "AWB Code", value: s.awb || "N/A" },
                  { label: "Courier", value: s.courier || "N/A" },
                  { label: "Status", value: <Badge tone={orderTone(d.status)} dot>{s.status || "N/A"}</Badge> },
                  { label: "Weight", value: `${s.weight} kg` },
                  { label: "Dimensions", value: s.dimensions || "N/A" },
                  { label: "ETD", value: s.etd || "N/A" },
                  { label: "Pickup Scheduled", value: s.pickupScheduled || "N/A" },
                  s.deliveredDate && { label: "Delivered Date", value: s.deliveredDate },
                ]}
              />
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs text-ink-muted">Invoice:</span>
                {invoice && (
                  <a href={invoice} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-brand-700 hover:underline">
                    View Invoice
                  </a>
                )}
                {canEdit && (
                  <Button size="xs" variant="danger-outline" onClick={() => setConfirm("invoice")}>
                    {invoice ? "Regenerate Invoice" : "Generate Invoice"}
                  </Button>
                )}
              </div>
              {invoice && <p className="text-xs text-ink-muted">If invoice link shows &quot;Access Denied&quot;, please regenerate the invoice.</p>}
            </Section>
          )}

          {d.awb && (
            <Section title="AWB & Charges">
              <DescriptionList
                items={[
                  d.awb.awb && { label: "AWB", value: d.awb.awb },
                  d.awb.appliedWeight && { label: "Applied Weight", value: `${d.awb.appliedWeight} kg` },
                  d.awb.routingCode && { label: "Routing Code", value: d.awb.routingCode },
                  d.awb.freight != null && { label: "Freight Charges", value: formatINR(d.awb.freight) },
                  d.awb.codCharges != null && { label: "COD Charges", value: formatINR(d.awb.codCharges) },
                ]}
              />
            </Section>
          )}

          {canEdit && (
            <Section title="Generate Documents">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={!canDocs} onClick={() => setConfirm("label")}>Generate Label</Button>
                <Button size="sm" disabled={!canDocs} onClick={() => setConfirm("manifest")}>Generate Manifest</Button>
                <Button size="sm" onClick={() => setConfirm("invoice")}>Generate Invoice</Button>
              </div>
              {!canDocs && <p className="text-xs text-danger-ink">Label and manifest need a Shipment ID and AWB (manifest also needs the pickup requested).</p>}
            </Section>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Important Dates">
              <DescriptionList
                columns={1}
                items={[
                  d.dates.orderDate && { label: "Order Date", value: d.dates.orderDate },
                  d.dates.channelCreatedAt && { label: "Channel Created", value: d.dates.channelCreatedAt },
                  d.dates.createdAt && { label: "Created At", value: d.dates.createdAt },
                  d.dates.updatedAt && { label: "Updated At", value: d.dates.updatedAt },
                  d.dates.etdDate && { label: "ETD Date", value: d.dates.etdDate },
                  d.dates.awbAssignedAt && { label: "AWB Assigned", value: d.dates.awbAssignedAt },
                ]}
              />
            </Section>
            <Section title="Additional Information">
              <DescriptionList
                columns={1}
                items={[
                  d.info.invoiceNo && { label: "Invoice No", value: d.info.invoiceNo },
                  d.info.invoiceDate && { label: "Invoice Date", value: d.info.invoiceDate },
                  d.info.comment && { label: "Comment", value: d.info.comment },
                  d.info.channelName && { label: "Channel", value: d.info.channelName },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                {d.info.international && <Badge tone="danger">International Order</Badge>}
                {d.info.document && <Badge tone="danger">Document Shipment</Badge>}
              </div>
            </Section>
          </div>

          {d.risk && (
            <Section title="Risk Assessment">
              <div className="flex flex-wrap gap-2">
                {d.risk.rto && <Badge tone={riskTone(d.risk.rto)}>RTO Risk: {d.risk.rto.toUpperCase()}</Badge>}
                {d.risk.address && <Badge tone={riskTone(d.risk.address)}>Address Risk: {d.risk.address.toUpperCase()}</Badge>}
                {d.risk.order && <Badge tone={riskTone(d.risk.order)}>Order Risk: {d.risk.order.toUpperCase()}</Badge>}
              </div>
              {d.risk.addressScore && <p className="text-xs text-ink-muted">Address Score: {d.risk.addressScore} / 1.0</p>}
            </Section>
          )}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        loading={running}
        tone="warning"
        onConfirm={() => generate(confirm)}
        title={confirm ? DOC_TEXT[confirm].confirm : ""}
        description="The document is created on Shiprocket and opens in a new tab."
        confirmLabel="Generate"
      />
    </Dialog>
  );
}

/** openShiprocketTracking(): one shipment's tracking timeline. */
export function ShiprocketTrackingDialog({ shipmentId, open, onClose }) {
  const { loading, result } = useLoad(open, () => trackShiprocketAction(shipmentId));
  const t = result?.ok && result.data?.found ? result.data.tracking : null;
  return (
    <Dialog open={open} onClose={onClose} size="xl" title="Shipment Tracking" description={`Shipment ID: ${shipmentId}`}>
      {loading ? (
        <Loading what="tracking information" />
      ) : !result?.ok ? (
        <Notice tone="danger" title="Server Error">{result?.message || "Unable to connect to the server. Please check your internet connection and try again."}</Notice>
      ) : !t ? (
        <Notice tone="danger" title="Unable to fetch tracking information">
          {result.data?.errorType === "no_tracking"
            ? "The shipment may not have been picked up yet or tracking information is still being processed."
            : `${result.data?.message || "There was an issue retrieving tracking data from Shiprocket."} Please try again later or contact support if the issue persists.`}
        </Notice>
      ) : !t.available ? (
        <Notice tone="warning" title="Tracking information not available yet">The shipment may not have been picked up or tracking data is still being processed.</Notice>
      ) : (
        <div className="space-y-5">
          <StatGrid>
            <StatCard label="Order ID" value={t.orderId || "N/A"} tone="info" />
            <StatCard label="Courier" value={t.courier || "N/A"} />
            <StatCard label="Weight" value={`${t.weight} kg`} tone="neutral" />
            <StatCard label="Packages" value={t.packages} tone="warning" />
          </StatGrid>
          <Section title="Current Status">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={trackTone(t.tone)} dot>{t.currentStatus}</Badge>
              {t.consignee && <span className="text-xs text-ink-muted">{t.consignee}</span>}
            </div>
            <p className="text-sm text-ink-soft">
              {t.destination || "N/A"}
              {t.deliveredTo ? ` → ${t.deliveredTo}` : ""}
            </p>
            {t.pod && <p className="text-xs text-ink-muted">POD: {t.pod} {t.podStatus}</p>}
          </Section>
          <DescriptionList
            columns={3}
            items={[
              { label: "AWB", value: t.awb },
              t.currentStatus === "Canceled" && { label: "Origin", value: t.origin || "N/A" },
              t.currentStatus === "Canceled" && { label: "Destination", value: t.destination || "N/A" },
              t.pickupDate && { label: "Pickup Date", value: t.pickupDate },
              t.edd && { label: "Expected Delivery", value: t.edd },
              t.deliveredDate && { label: "Delivered Date", value: t.deliveredDate },
            ]}
          />
          {t.activities.length > 0 && (
            <Section title={`Tracking History (${t.activities.length} ${t.activities.length === 1 ? "Update" : "Updates"})`}>
              <Timeline
                items={t.activities.map((a) => ({
                  id: a.id,
                  title: a.description && a.description.toLowerCase() !== a.label.toLowerCase() ? `${a.label} (${a.description})` : a.label,
                  description: a.activity,
                  meta: [a.date, a.location].filter(Boolean).join(" · "),
                  tone: timelineTone(a.tone),
                }))}
              />
            </Section>
          )}
          {t.trackUrl && (
            <a href={t.trackUrl} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-brand-700 hover:underline">
              Track on Shiprocket
            </a>
          )}
        </div>
      )}
    </Dialog>
  );
}

/** displayBulkTrackingResults(): latest status per selected AWB. */
export function ShiprocketBulkTrackingDialog({ data, rowsByAwb, open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} size="xl" title="Bulk Tracking Results" description={`${data.results.length} shipments · ${data.successCount} tracked · ${data.failCount} failed`}>
      <div className="rounded-lg border border-line">
        <MiniTable
          columns={[
            { key: "awb", label: "AWB", render: (r) => <span className="font-mono text-xs text-ink">{r.awb}</span> },
            { key: "order", label: "Order", render: (r) => <span className="text-xs">{rowsByAwb[r.awb]?.channelOrderId || "N/A"} · {rowsByAwb[r.awb]?.shipmentId || "N/A"}</span> },
            { key: "status", label: "Status", render: (r) => (r.found ? <Badge tone={trackTone(r.tracking.tone)} dot>{r.tracking.currentStatus}</Badge> : <Badge tone="danger">Tracking not available</Badge>) },
            { key: "courier", label: "Courier", render: (r) => (r.found ? r.tracking.courier || r.tracking.courierCompanyId || "N/A" : "—") },
            { key: "route", label: "Origin → Destination", render: (r) => (r.found ? `${r.tracking.origin || "N/A"} → ${r.tracking.destination || "N/A"}` : "—") },
            {
              key: "latest",
              label: "Latest Activity",
              render: (r) => {
                const a = r.found ? r.tracking.activities[0] : null;
                if (!a) return "—";
                return (
                  <span className="block max-w-72 text-xs">
                    {a.rawDate || "N/A"} · {a.activity || "N/A"}
                    {a.location && <span className="block text-ink-muted">{a.location}</span>}
                  </span>
                );
              },
            },
            {
              key: "link",
              label: "",
              render: (r) =>
                r.found && r.tracking.trackUrl ? (
                  <a href={r.tracking.trackUrl} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-brand-700 hover:underline">
                    Track
                  </a>
                ) : null,
            },
          ]}
          rows={data.results.map((r) => ({ ...r, id: r.awb }))}
        />
      </div>
    </Dialog>
  );
}
