import { checkPermission } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ProposalBuilder } from "@/components/admin/pricing/proposals/proposal-builder";

export const metadata = { title: "New Pricing Proposal" };

export default async function NewPricingProposalPage({ searchParams }) {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="New Pricing Proposal" />
        <PermissionDenied module="products" />
      </>
    );
  }
  const params = await searchParams;
  return (
    <>
      <PageHeader
        title="New Pricing Proposal"
        description="Propose services on all, some or one variation of a product. Each variation's NRV is worked out from its own display price; nothing changes until the vendor accepts."
      />
      <ProposalBuilder initialProductId={String(params?.productId ?? "")} canCreate={canPage(user, "manage_product.php", "edit")} />
    </>
  );
}
