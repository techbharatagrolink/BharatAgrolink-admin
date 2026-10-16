import { requireAdmin } from "@/lib/auth/session";
import { canViewAgreements, listSellerAgreements } from "@/lib/services/admin/seller-agreements";
import { Notice, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { SellerAgreementsTable } from "@/components/admin/vendors/seller-agreements-table";

export const metadata = { title: "Seller Agreements" };

const TITLE = "Seller Agreements";
const DESCRIPTION = "View and manage seller agreement acceptances. Filter by acceptance status.";

export default async function SellerAgreementsPage({ searchParams }) {
  const user = await requireAdmin();
  if (!canViewAgreements(user)) return (<><PageHeader title={TITLE} /><PermissionDenied module="seller agreements" /></>);
  const sp = await searchParams;
  const result = await listSellerAgreements(sp ?? {}, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="seller agreements" /></>);
  const { data } = result;

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="min-w-0 space-y-4">
        {data.unavailable && <Notice tone="warning" title="Not connected">{data.unavailable}</Notice>}
        <SellerAgreementsTable data={data} />
      </div>
    </>
  );
}
