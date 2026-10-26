import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getFixedExpenses } from "@/lib/services/admin/fixed-expenses";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { FixedExpensesScreen } from "@/components/admin/finance/fixed-expenses-screen";

export const metadata = { title: "Fixed Expenses" };

const DESCRIPTION = "Recurring fixed costs with monthly overrides, pro-rated by days in the P&L and expense-limit dashboard.";

export default async function FixedExpensesPage({ searchParams }) {
  const { user, allowed } = await checkPermission("finance.expenses", "view");
  if (!allowed) return (<><PageHeader title="Fixed Expenses" /><PermissionDenied module="Fixed Expenses" /></>);
  const result = await getFixedExpenses(await searchParams, user);

  return (
    <>
      <PageHeader title="Fixed Expenses" description={DESCRIPTION} />
      {result.ok ? (
        <FixedExpensesScreen
          view={result.data}
          canAdd={can(user, "finance.expenses", "add")}
          canEdit={can(user, "finance.expenses", "edit")}
          canDelete={can(user, "finance.expenses", "delete")}
        />
      ) : (
        <Notice tone="warning">{result.message}</Notice>
      )}
    </>
  );
}
