import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkShipments } from "@/lib/services/admin/parity/bulk";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkFilters } from "@/components/admin/parity/bulk/bulk-list";
import { BulkShipmentsTable } from "@/components/admin/parity/bulk/shipments-table";

export const metadata = { title: "Bulk Shipments" };

const TITLE = "Bulk Shipments";
const DESCRIPTION = "Courier shipments of bulk orders (newest 1000). Search by order, customer, warehouse or waybill.";
const STATUSES = ["Created", "Picked Up", "In Transit", "Out For Delivery", "Delivered", "Cancelled"];

function readQuery(sp) {
  const text = (v, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const page = Number.parseInt(text(sp.page), 10);
  return {
    q: text(sp.q),
    orderId: text(sp.orderId),
    waybill: text(sp.waybill),
    status: STATUSES.includes(text(sp.status)) ? text(sp.status) : "",
    page: page > 0 ? String(page) : "",
  };
}

export default async function BulkShipmentsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("bulk.shipments");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="bulk shipments" /></>);
  const query = readQuery(await searchParams);
  const result = await getBulkShipments(query, user).catch((error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="bulk shipments" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <BulkFilters
          key={JSON.stringify(query)}
          values={query}
          fields={[
            { key: "q", label: "Search", placeholder: "Order, customer, warehouse" },
            { key: "orderId", label: "Order ID (exact)" },
            { key: "waybill", label: "Waybill" },
            { key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s })) },
          ]}
        />
        <BulkShipmentsTable result={result} query={query} canEdit={can(user, "bulk.shipments", "edit")} />
      </div>
    </>
  );
}
