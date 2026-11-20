import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api";
import { checkPermission } from "@/lib/auth/session";
import { getBulkQuotation } from "@/lib/services/admin/parity/bulk";
import { formatDate, formatNumber, inr } from "@/lib/format";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DescriptionList, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Bulk Quotation" };

const join = (...parts) => parts.filter(Boolean).join(", ") || "—";

export default async function BulkQuotationPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("bulk.quotations");
  if (!allowed) return (<><PageHeader title="Quotation" /><PermissionDenied module="quotations" /></>);
  const q = await getBulkQuotation(id, user).catch((error) => ({ error }));
  if (q.error instanceof ApiError && q.error.status === 404) notFound();
  if (q.error) return (<><PageHeader title="Quotation" /><ApiUnavailable error={q.error} what="this quotation" /></>);

  return (
    <>
      <PageHeader
        title={`Quotation ${q.quotation_number}`}
        description={`Dated ${formatDate(q.quotation_date)}${q.valid_until ? ` · valid until ${formatDate(q.valid_until)}` : ""}`}
        meta={
          <>
            <StatusBadge status={q.status} />
            {q.converted_to_order || q.b2b_order_id ? <Badge tone="success">Converted</Badge> : <Badge tone="neutral">Not converted</Badge>}
          </>
        }
        actions={
          <>
            {q.b2b_order_id && (
              <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(q.b2b_order_id)}`} className={buttonClasses({ size: "sm" })}>
                Order {q.b2b_order_id}
              </Link>
            )}
            <Link href="/admin/bulk-orders/quotations" className={buttonClasses({ size: "sm" })}>
              <ArrowLeft className="size-4" aria-hidden /> Quotations
            </Link>
          </>
        }
      />
      <div className="space-y-4">
        <Card>
          <CardHeader title="Customer" />
          <CardBody>
            <DescriptionList
              columns={3}
              items={[
                { label: "Name", value: q.customer_name || "—" },
                { label: "Mobile", value: q.customer_mobile || "—" },
                { label: "Email", value: q.customer_email || "—" },
                { label: "Company", value: q.customer_company || "—" },
                { label: "GSTIN", value: q.customer_gstin || "—" },
                { label: "Vendor", value: q.vendor_company_name || "—" },
              ]}
            />
          </CardBody>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader title="Pickup" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Warehouse", value: q.source_warehouse_name || "—" },
                  { label: "Address", value: join(q.source_address_line1, q.source_address_line2, q.source_city, q.source_state, q.source_pincode) },
                  { label: "Contact", value: join(q.sender_contact_person_name, q.sender_contact_person_contact_no) },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Delivery" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Warehouse", value: q.destination_warehouse_name || "—" },
                  { label: "Address", value: join(q.destination_address_line1, q.destination_address_line2, q.destination_city, q.destination_state, q.destination_pincode) },
                  { label: "Contact", value: join(q.recipient_contact_person_name, q.recipient_contact_person_contact_no) },
                ]}
              />
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader title="Products" description={`${q.products.length} line${q.products.length === 1 ? "" : "s"}`} />
          <MiniTable
            rows={q.products.map((p) => ({ ...p, id: p.item_number }))}
            columns={[
              { key: "n", label: "#", render: (p) => <span className="tabular">{p.item_number}</span> },
              { key: "item", label: "Item", render: (p) => <span className="font-medium text-ink">{p.item_name}</span> },
              { key: "sku", label: "SKU", render: (p) => <span className="font-mono text-xs">{p.sku}</span> },
              { key: "hsn", label: "HSN", render: (p) => <span className="font-mono text-xs">{p.hsn_code || "—"}</span> },
              { key: "qty", label: "Qty", align: "right", render: (p) => formatNumber(p.quantity) },
              { key: "rate", label: "Rate", align: "right", render: (p) => inr(p.rate) },
              { key: "gst", label: "GST %", align: "right", render: (p) => `${p.gst_percentage}%` },
              { key: "taxable", label: "Taxable", align: "right", render: (p) => inr(p.taxable_amount) },
              { key: "total", label: "Total", align: "right", render: (p) => inr(p.total_amount) },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Shipment & payment" />
          <CardBody>
            <DescriptionList
              columns={3}
              items={[
                { label: "Invoice value", value: inr(q.invoice_value) },
                { label: "Advance payment", value: inr(q.advance_payment) },
                { label: "Packages", value: formatNumber(q.no_of_packages) },
                { label: "Approx. weight (kg)", value: formatNumber(q.approx_weight) },
                { label: "Mode", value: q.mode_name || "—" },
                { label: "COD", value: q.is_cod ? inr(q.cod_amount) : "No" },
                { label: "To pay", value: q.is_to_pay ? inr(q.to_pay_amount) : "No" },
                { label: "Insured", value: q.is_insured ? "Yes" : "No" },
                { label: "PO no.", value: q.po_no || "—" },
                { label: "Remarks", value: q.remarks || "—" },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
