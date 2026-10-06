import { requireAdmin } from "@/lib/auth/session";
import { getMyAccount } from "@/lib/services/admin/account";
import { formatDateTime, maskMobile } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await requireAdmin();
  const d = await getMyAccount(user);
  const p = d.profile;

  return (
    <>
      <PageHeader title="My Account" description="Your profile, role and recent activity." meta={<><Badge tone={d.role.superAdmin ? "danger" : "info"}>{d.role.name}</Badge>{d.role.scope === "own" && <Badge tone="warning">Own records only</Badge>}</>} />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Profile" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Name", value: p.name },
                  { label: "Staff ID", value: <span className="font-mono text-xs">{p.id}</span> },
                  { label: "Email", value: p.email },
                  { label: "Mobile", value: maskMobile(p.mobile) },
                  { label: "Designation", value: p.designation },
                  { label: "Two-factor sign-in", value: p.twoFactor ? <Badge tone="success">On</Badge> : <Badge tone="warning">Off</Badge> },
                  { label: "Last login", value: formatDateTime(p.lastLoginAt) },
                ]}
              />
            </CardBody>
          </Card>
          <Notice>Password, 2FA and profile changes are handled by the admin authentication service. Ask a full admin to update your role or details.</Notice>
        </div>
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title="What you can access" description={`${d.grants.length} modules`} />
          <MiniTable
            columns={[
              { key: "label", label: "Module", render: (r) => <span className="text-ink">{r.label}<span className="block text-xs text-ink-muted">{r.group}</span></span> },
              { key: "actions", label: "Access", render: (r) => <span className="flex flex-wrap gap-1">{r.actions.map((a) => <Badge key={a} tone={a === "delete" ? "danger" : a === "view" ? "neutral" : "info"}>{a}</Badge>)}</span> },
            ]}
            rows={d.grants.map((g) => ({ ...g, id: g.key }))}
            empty="Your role has no module access."
          />
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Your recent activity" />
        <CardBody>
          <Timeline items={d.activity.map((a) => ({ id: a.id, title: `${a.module}: ${a.action}`, description: [a.entity, a.reason].filter(Boolean).join(" · "), meta: formatDateTime(a.at) }))} />
        </CardBody>
      </Card>
    </>
  );
}
