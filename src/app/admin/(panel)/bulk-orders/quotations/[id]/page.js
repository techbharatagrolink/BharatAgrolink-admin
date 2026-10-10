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
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-max text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-xs text-ink-muted">
                  {["#", "Item", "SKU", "HSN", "Qty", "Rate", "GST %", "Taxable", "Total"].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {q.products.map((p) => (
                  <tr key={p.item_number} className="border-b border-line last:border-0">
                    <td className="px-3 py-2 tabular">{p.item_number}</td>
                    <td className="px-3 py-2 font-medium text-ink">{p.item_name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                    <td className="px-3 py-2 font-mono text-xs">{p.hsn_code || "—"}</td>
                    <td className="px-3 py-2 tabular">{formatNumber(p.quantity)}</td>
                    <td className="px-3 py-2 tabular">{inr(p.rate)}</td>
                    <td className="px-3 py-2 tabular">{p.gst_percentage}%</td>
                    <td className="px-3 py-2 tabular">{inr(p.taxable_amount)}</td>
                    <td className="px-3 py-2 tabular">{inr(p.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
