import { checkPermission } from "@/lib/auth/session";
import { getExpenseLimits } from "@/lib/services/admin/settings";
import { formatDateTime } from "@/lib/format";
import { Notice, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { ExpenseCapEditor } from "@/components/admin/settings/expense-cap-editor";

export const metadata = { title: "Expense Limits" };

export default async function ExpenseLimitsPage() {
  const { user, allowed } = await checkPermission("finance.expenses");
  if (!allowed) return (<><PageHeader title="Expense Limits" /><PermissionDenied module="finance expenses" /></>);
  const d = await getExpenseLimits(user);
  const canEdit = Boolean(user.role.superAdmin);

  return (
    <>
      <PageHeader title="Expense Limits" description="Spend caps as a percentage of delivered sales. Breaches raise alerts on the finance dashboard." />
      {!canEdit && <Notice className="mb-4">Only a full admin can change caps. You can monitor actual spend here.</Notice>}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Caps" />
          <ExpenseCapEditor caps={d.caps} canEdit={canEdit} />
        </Card>
        <Card>
          <CardHeader title="Change history" />
          <CardBody>
            <Timeline items={d.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) }))} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
