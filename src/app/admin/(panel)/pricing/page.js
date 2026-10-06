import { checkPermission } from "@/lib/auth/session";
import { calculatePricing } from "@/lib/services/admin/products";
import { PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { PricingPanel } from "@/components/admin/products/pricing-panel";

export const metadata = { title: "NRV Pricing Calculator" };

const example = { mrp: 899, nrv: 520, takeRate: 35, gstPercent: 18 };

export default async function PricingCalculatorPage() {
  const { allowed } = await checkPermission("pricing");
  if (!allowed) return (<><PageHeader title="NRV Pricing Calculator" /><PermissionDenied module="pricing" /></>);
  return (
    <>
      <PageHeader
        title="NRV Pricing Calculator"
        description="Selling price is derived from the seller's Net Realisable Value: display = NRV ÷ (1 − take rate). Rules: MRP above ₹300, display price not above MRP, take rate 25–45%, service charge not negative."
      />
      <Card>
        <CardHeader title="Calculate" description="Same engine used when products are created, edited or imported" />
        <CardBody>
          <PricingPanel mode="calculator" initial={example} initialResult={calculatePricing({ ...example, gstPercent: String(example.gstPercent) })} />
        </CardBody>
      </Card>
    </>
  );
}
