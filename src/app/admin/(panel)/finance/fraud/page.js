import { Ban, ChartLine, TriangleAlert, Users } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getFraudAnalysis } from "@/lib/services/admin/parity/marketing";
import { formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { FraudTables } from "@/components/admin/parity/marketing/fraud-tables";

export const metadata = { title: "Fraud Analysis Dashboard" };

/** fraud_analysis_dashboard.php: RTO / cancellation counts and the two customer grids. */
export default async function FraudAnalysisPage() {
  const { user, allowed } = await checkPermission("finance.fraud");
  if (!allowed) return (<><PageHeader title="Fraud Analysis Dashboard" /><PermissionDenied module="fraud analysis" /></>);
  const result = await getFraudAnalysis(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Fraud Analysis Dashboard" /><ApiUnavailable error={result.error} what="the fraud analysis" /></>);
  const { stats, problemCustomers, topCustomers } = result.data;

  return (
    <>
      <PageHeader title="Fraud Analysis Dashboard" description="Customers behind RTO and cancelled orders, and the customers who order most." />
      <StatGrid>
        <StatCard label="RTO Orders" value={formatNumber(stats.totalRtoOrders)} icon={TriangleAlert} tone="danger" />
        <StatCard label="Cancelled Orders" value={formatNumber(stats.totalCancelledOrders)} icon={Ban} tone="warning" />
        <StatCard label="Customers with RTO/Cancelled" value={formatNumber(stats.totalProblemCustomers)} icon={Users} tone="info" />
        <StatCard label="Top Customer Orders" value={formatNumber(stats.topCustomerOrders)} icon={ChartLine} />
      </StatGrid>
      <FraudTables problemCustomers={problemCustomers} topCustomers={topCustomers} />
    </>
  );
}
