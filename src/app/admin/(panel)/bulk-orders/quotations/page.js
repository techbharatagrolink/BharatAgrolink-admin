import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkQuotations } from "@/lib/services/admin/parity/bulk";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkFilters } from "@/components/admin/parity/bulk/bulk-list";
import { BulkQuotationsTable } from "@/components/admin/parity/bulk/quotations-table";

export const metadata = { title: "Bulk Quotations" };

const TITLE = "Quotations";
const DESCRIPTION = "Bulk order quotations. A converted quotation links to the order created from it.";
const STATUSES = ["draft", "sent", "approved", "rejected", "expired"];
const YMD = /^\d{4}-\d{2}-\d{2}$/;

function readQuery(sp) {
  const text = (v, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const page = Number.parseInt(text(sp.page), 10);
  const pageSize = Number.parseInt(text(sp.pageSize), 10);
  return {
    q: text(sp.q),
    status: STATUSES.includes(text(sp.status)) ? text(sp.status) : "",
    converted: ["0", "1"].includes(text(sp.converted)) ? text(sp.converted) : "",
    from: YMD.test(text(sp.from)) ? text(sp.from) : "",
    to: YMD.test(text(sp.to)) ? text(sp.to) : "",
    page: page > 0 ? String(page) : "",
    pageSize: [10, 25, 50, 100].includes(pageSize) ? String(pageSize) : "",
  };
}

export default async function BulkQuotationsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("bulk.quotations");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="quotations" /></>);
  const query = readQuery(await searchParams);
  const result = await getBulkQuotations(query, user).catch((error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="quotations" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <BulkFilters
          key={JSON.stringify(query)}
          values={query}
          fields={[
            { key: "q", label: "Search", placeholder: "Quotation #, name, mobile, email, company" },
            { key: "status", label: "Status", type: "select", all: "All Status", options: STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })) },
            { key: "converted", label: "Converted", type: "select", options: [{ value: "0", label: "Not Converted" }, { value: "1", label: "Converted" }] },
            { key: "from", label: "From", type: "date" },
            { key: "to", label: "To", type: "date" },
          ]}
        />
        <BulkQuotationsTable result={result} query={query} canEdit={can(user, "bulk.quotations", "edit")} canDelete={can(user, "bulk.quotations", "delete")} />
      </div>
    </>
  );
}
