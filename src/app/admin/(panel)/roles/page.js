import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { listRoles } from "@/lib/services/admin/roles";
import { PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Roles & Permissions" };

export default async function RolesPage() {
  const { user, allowed } = await checkPermission("roles");
  if (!allowed) return (<><PageHeader title="Roles & Permissions" /><PermissionDenied module="roles" /></>);
  const roles = await listRoles(user);

  return (
    <>
      <PageHeader title="Roles & Permissions" description="Each role grants view / add / edit / delete per admin menu. The backend re-checks every request; the panel only hides what a role cannot use." />
      <Card>
        <MiniTable
          columns={[
            { key: "name", label: "Role", render: (r) => (
              <Link href={`/admin/roles/${r.id}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link>
            ) },
            { key: "id", label: "role_id", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: "description", label: "Description", render: (r) => <span className="block max-w-80 truncate">{r.description}</span> },
            { key: "scope", label: "Data scope", render: (r) => (r.superAdmin ? <Badge tone="danger">Everything</Badge> : r.scope === "own" ? <Badge tone="warning">Own records</Badge> : <Badge tone="neutral">All records</Badge>) },
            { key: "modules", label: "Modules", align: "right" },
            { key: "writes", label: "With write", align: "right" },
            { key: "users", label: "Active users", align: "right", render: (r) => <Link href={`/admin/users?roleName=${encodeURIComponent(r.name)}`} className="text-brand-700 hover:underline">{r.users}</Link> },
          ]}
          rows={roles}
        />
      </Card>
    </>
  );
}
