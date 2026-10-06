import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getRole } from "@/lib/services/admin/roles";
import { formatDateTime } from "@/lib/format";
import { PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { RoleMatrix } from "@/components/admin/settings/role-matrix";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Role ${id}` };
}

export default async function RoleDetailPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("roles");
  if (!allowed) return (<><PageHeader title="Edit role" /><PermissionDenied module="roles" /></>);
  const data = await getRole(id);
  if (!data) notFound();
  const { role } = data;

  let lockedReason = null;
  if (role.superAdmin) lockedReason = "The Super Admin role always has full access and cannot be changed.";
  else if (role.id === user.roleId) lockedReason = "You cannot change your own role. Ask another administrator.";
  else if (!can(user, "roles", "edit")) lockedReason = "You have view access to roles. Editing needs roles: edit.";
  const editable = !lockedReason;
  const grantable = user.role.superAdmin ? true : user.role.permissions;
  const permissions = role.superAdmin ? Object.fromEntries(data.catalog.map((p) => [p.key, ["view", "add", "edit", "delete"]])) : role.permissions;

  return (
    <>
      <PageHeader
        title={role.name}
        description={role.description}
        meta={
          <>
            <Badge tone="neutral">role_id {role.id}</Badge>
            {role.superAdmin ? <Badge tone="danger">Super admin</Badge> : role.scope === "own" ? <Badge tone="warning">Own records only</Badge> : <Badge tone="neutral">All records</Badge>}
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title="Permissions" description="Granting add, edit or delete also grants view." />
          <RoleMatrix roleId={role.id} catalog={data.catalog} permissions={permissions} editable={editable} grantable={grantable} lockedReason={lockedReason} />
        </Card>
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title={`Users (${data.users.length})`} />
            <CardBody>
              {data.users.length ? (
                <ul className="space-y-2">
                  {data.users.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate text-ink">{u.name}</span>
                        <span className="block truncate text-xs text-ink-muted">{u.email}</span>
                      </span>
                      <StatusBadge status={u.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">No users have this role.</p>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Recent changes" />
            <CardBody>
              <Timeline items={data.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
