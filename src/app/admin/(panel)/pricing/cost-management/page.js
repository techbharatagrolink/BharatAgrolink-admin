import { requireAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { getCostManagement, pricingFactorsEnabled } from "@/lib/services/admin/pricing-factors";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { CostManagement } from "@/components/admin/pricing/cost-management";

export const metadata = { title: "Cost Management" };

const STATUSES = ["all", "negative", "low", "healthy", "overridden"];
const COST_PAGE = "product_cost_management.php";

export default async function CostManagementPage({ searchParams }) {
  const user = await requireAdmin();
  const header = <PageHeader title="Cost Management" description="Product pricing factors: margin after cost factors for every priced product and variant, the cost factor master and the pricing rates." />;
  if (!canPage(user, COST_PAGE, "view") && !canPage(user, "manage_product.php", "view")) return (<>{header}<PermissionDenied module="cost management" /></>);
  if (!(await pricingFactorsEnabled(user))) return (<>{header}<Notice tone="warning" title="Not enabled">Product pricing factors are switched off (PRICING_FACTORS_V1). Use Cost &amp; Margin Management instead.</Notice></>);

  const params = await searchParams;
  const q = String(params?.q ?? "").slice(0, 100);
  const status = STATUSES.includes(params?.status) ? params.status : "all";
  const page = Math.max(1, Number.parseInt(params?.page, 10) || 1);
  const data = await getCostManagement({ q, status, page }, user);
  return (
    <>
      {header}
      {data.ok ? (
        <CostManagement
          summary={data.summary}
          meta={data.meta}
          factors={data.factors}
          config={data.config}
          filters={{ q, status, page }}
          permissions={{ add: canPage(user, COST_PAGE, "add"), edit: canPage(user, COST_PAGE, "edit"), remove: canPage(user, COST_PAGE, "delete") }}
        />
      ) : (
        <Notice tone="danger" title="Could not load">{data.message}</Notice>
      )}
    </>
  );
}
