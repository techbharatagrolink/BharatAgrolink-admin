import { checkPermission } from "@/lib/auth/session";
import { calculatePricingLive } from "@/lib/services/admin/products";
import { PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { PricingPanel } from "@/components/admin/products/pricing-panel";

export const metadata = { title: "NRV Pricing Calculator" };

const example = { mrp: 899, nrv: 520, takeRate: 35, gstPercent: 18 };

export default async function PricingCalculatorPage() {
  const { user, allowed } = await checkPermission("pricing");
  if (!allowed) return (<><PageHeader title="NRV Pricing Calculator" /><PermissionDenied module="pricing" /></>);
  const initialResult = await calculatePricingLive({ ...example, gstPercent: String(example.gstPercent) }, user);
  return (
    <>
      <PageHeader
        title="NRV Pricing Calculator"
        description="Selling price follows includes/nrv_pricing.php: display = NRV ÷ (1 − take rate), then sale, TCS, service charge and BSA are derived from that rounded display price. This screen also keeps the panel checks (MRP above ₹300, take rate 25–45%, display not above MRP)."
      />
      <Card>
        <CardHeader title="Calculate" description="POST /admin/pricing/calculate. The old price calculator's NimbusPost call is not run." />
        <CardBody>
          <PricingPanel mode="calculator" initial={example} initialResult={initialResult} />
        </CardBody>
      </Card>
    </>
  );
}
