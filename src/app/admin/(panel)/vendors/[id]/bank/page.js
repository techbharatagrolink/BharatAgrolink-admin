import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getVendor, getVendorBank } from "@/lib/services/admin/people";
import { PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { PermissionDenied } from "@/components/ui/states";
import { VendorBankForm } from "@/components/admin/vendors/vendor-bank-form";

export const metadata = { title: "Bank Details" };

export default async function VendorBankPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("vendors");
  if (!allowed) return (<><PageHeader title="Bank Details" /><PermissionDenied module="vendors" /></>);
  const data = await getVendor(id, user);
  if (!data) notFound();
  const bank = await getVendorBank(id, user);

  return (
    <>
      <PageHeader
        title="Bank Details"
        description={data.vendor.name}
        actions={<ButtonLink href={`/admin/vendors/${id}`} variant="secondary" size="sm">Back</ButtonLink>}
      />
      <Card>
        <CardHeader title="Bank Details" />
        <CardBody>
          <VendorBankForm vendorId={id} bank={bank} canEdit={can(user, "vendors", "edit")} />
          <p className="mt-4 text-xs text-ink-muted">
            <Link href={`/admin/vendors/${id}`} className="text-brand-700 hover:underline">Back to {data.vendor.name}</Link>
          </p>
        </CardBody>
      </Card>
    </>
  );
}
