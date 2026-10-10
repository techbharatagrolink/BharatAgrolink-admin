import { requireAdmin } from "@/lib/auth/session";
import { getMyAccount, getMySessions } from "@/lib/services/admin/account";
import { formatDateTime, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { ChangePasswordForm, LogoutOtherSessionsButton } from "@/components/admin/account/account-security";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await requireAdmin();
  const [d, sessions] = await Promise.all([getMyAccount(user), getMySessions(user).then((data) => ({ data }), (error) => ({ error }))]);
  const p = d.profile;

  return (
    <>
      <PageHeader title="My Account" description="Your profile, role, password, sessions and recent activity." meta={<><Badge tone={d.role.superAdmin ? "danger" : "info"}>{d.role.name}</Badge>{d.role.scope === "own" && <Badge tone="warning">Own records only</Badge>}</>} />
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
          <Card id="password" className="scroll-mt-20">
            <CardHeader title="Change password" description="Applies to this panel and the PHP admin. Every other login is signed out." />
            <CardBody>
              <ChangePasswordForm />
            </CardBody>
          </Card>
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
      <Card id="sessions" className="mt-4 scroll-mt-20">
        <CardHeader title="Active sessions" description="Devices signed in to your account on this panel and the PHP admin." />
        {sessions.error ? (
          <CardBody>
            <ApiUnavailable error={sessions.error} what="your sessions" />
          </CardBody>
        ) : (
          <>
            <MiniTable
              columns={[
                { key: "device", label: "Device", render: (r) => <span className="text-ink">{r.current ? <Badge tone="success">This device</Badge> : "Other device"}<span className="block max-w-80 truncate text-xs text-ink-muted" title={r.userAgent}>{r.userAgent || "—"}</span></span> },
                { key: "ipAddress", label: "IP address", render: (r) => <span className="font-mono text-xs">{r.ipAddress || "—"}</span> },
                { key: "createdAt", label: "Signed in", render: (r) => formatDateTime(r.createdAt) },
                { key: "lastUsedAt", label: "Last used", render: (r) => formatDateTime(r.lastUsedAt || r.createdAt) },
                { key: "expiresAt", label: "Expires", render: (r) => formatDateTime(r.expiresAt) },
              ]}
              rows={sessions.data}
              empty="No active sessions."
            />
            <CardBody className="border-t border-line">
              <LogoutOtherSessionsButton disabled={!sessions.data.some((s) => !s.current)} />
            </CardBody>
          </>
        )}
      </Card>
      <Card className="mt-4">
        <CardHeader title="Your recent activity" />
        <CardBody>
          <Timeline items={d.activity.map((a) => ({ id: a.id, title: `${a.module}: ${a.action}`, description: [a.entity, a.reason].filter(Boolean).join(" · "), meta: formatDateTime(a.at) }))} />
        </CardBody>
      </Card>
    </>
  );
}
