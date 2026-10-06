import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Marketing & Sales" };

export default function MarketingDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Marketing & Sales</h1>
        <div className="flex gap-2">
          <Button>New Campaign</Button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Ad Spend</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹ 1,24,000</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Organic vs Paid</CardTitle></CardHeader>
          <CardContent><div>Organic 62% / Paid 38%</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Repeat Customer Rate</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">24%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Campaigns</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>• Diwali Sale — ROI 4.2x</li>
            <li>• Summer Promo — ROI 2.1x</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
