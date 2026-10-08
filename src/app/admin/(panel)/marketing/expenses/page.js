import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getMarketingExpenses } from "@/lib/services/admin/parity/marketing";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ExpensesManager } from "@/components/admin/parity/marketing/expenses-manager";

export const metadata = { title: "Marketing Spend" };

/** marketing_expenses.php */
export default async function MarketingExpensesPage({ searchParams }) {
  const { user, allowed } = await checkPermission("marketing.expenses");
  if (!allowed) return (<><PageHeader title="Marketing Spend" /><PermissionDenied module="marketing spend" /></>);
  const sp = await searchParams;
  const query = {};
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(sp.month ?? "")) query.month = sp.month;
  if (/^\d{1,6}$/.test(sp.page ?? "") && Number(sp.page) > 0) query.page = sp.page;
  const result = await getMarketingExpenses(query, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Marketing Spend" /><ApiUnavailable error={result.error} what="marketing spend" /></>);

  return (
    <>
      <PageHeader title="Marketing Spend" description="What was spent on marketing each month. It counts towards the marketing expense limit." />
      <ExpensesManager
        key={`${result.data.month}-${result.data.pagination.page}`}
        data={result.data}
        can={{ add: can(user, "marketing.expenses", "add"), edit: can(user, "marketing.expenses", "edit"), delete: can(user, "marketing.expenses", "delete") }}
      />
    </>
  );
}
