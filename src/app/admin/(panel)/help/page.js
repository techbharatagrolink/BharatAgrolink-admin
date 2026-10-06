import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { helpTopics, shortcuts } from "@/lib/content/admin/help";
import { PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Help" };

export default async function HelpPage() {
  const user = await requireAdmin();
  const topics = helpTopics.filter((t) => !t.permission || can(user, t.permission));

  return (
    <>
      <PageHeader title="Help" description="Key business rules for the modules you use." />
      <div className="grid gap-4 lg:grid-cols-2">
        {topics.map((t) => (
          <Card key={t.key}>
            <CardHeader title={t.title} actions={<Link href={t.href} className="text-[13px] font-medium text-brand-700 hover:underline">Open</Link>} />
            <CardBody>
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink-soft">
                {t.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </CardBody>
          </Card>
        ))}
        <Card>
          <CardHeader title="Keyboard shortcuts" />
          <CardBody>
            <dl className="space-y-2 text-sm">
              {shortcuts.map((s) => (
                <div key={s.action} className="flex items-center justify-between gap-3">
                  <dt className="text-ink-soft">{s.action}</dt>
                  <dd className="flex gap-1">{s.keys.map((k) => <kbd key={k} className="rounded border border-line-strong bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-ink">{k}</kbd>)}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
