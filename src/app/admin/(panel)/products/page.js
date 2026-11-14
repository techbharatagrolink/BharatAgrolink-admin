import { checkPermission } from "@/lib/auth/session";
import { getProductsSummary } from "@/lib/services/admin/products";
import { formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";
import { AlertTriangle, TrendingDown, PackageX, CheckCircle2 } from "lucide-react";

export const metadata = { title: "All Products" };

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const { allowed, user } = await checkPermission("products");
  const summary = allowed ? await getProductsSummary(user) : null;

  return (
    <ResourcePage resourceKey="products" pathname="/admin/products" searchParams={params}>
      {summary ? (
        <StatGrid className="mb-4">
          <StatCard
            label="Take Rate Alert (< 35%)"
            value={formatNumber(summary.takeRateAlert ?? 0)}
            hint="Low take rate products"
            tone="danger"
            icon={AlertTriangle}
            href="/admin/products?takeRateAlert=yes&sort=takeRate%3Aasc"
          />
          <StatCard
            label="Negative CM (Loss)"
            value={formatNumber(summary.negativeMargin ?? 0)}
            hint="Loss-making products"
            tone="danger"
            icon={TrendingDown}
            href="/admin/products?verdict=loss&sort=contributionMargin%3Aasc"
          />
          <StatCard
            label="Out of Stock"
            value={formatNumber(summary.outOfStock ?? 0)}
            hint="No pack size can be sold (live inventory)"
            tone="warning"
            icon={PackageX}
            href="/admin/products?stockStatus=Out+of+Stock&sort=stock%3Aasc"
          />
          <StatCard
            label="In Stock on Website"
            value={formatNumber(summary.inStockOnWebsite ?? 0)}
            hint="Active & live to buy"
            tone="brand"
            icon={CheckCircle2}
            href="/admin/products?status=Active&stockStatus=In+Stock"
          />
        </StatGrid>
      ) : null}
    </ResourcePage>
  );
}
