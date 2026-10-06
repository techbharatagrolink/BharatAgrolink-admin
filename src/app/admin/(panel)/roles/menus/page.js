import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getMenuTree } from "@/lib/services/admin/roles";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";

export const metadata = { title: "Admin Menus" };

export default async function AdminMenusPage() {
  const { allowed } = await checkPermission("roles");
  if (!allowed) return (<><PageHeader title="Admin Menus" /><PermissionDenied module="roles" /></>);
  const tree = await getMenuTree();

  return (
    <>
      <PageHeader title="Admin Menus" description="The sidebar tree, the permission key each entry checks, the legacy PHP page it replaces and which roles can see it." />
      <Notice className="mb-4">Menus are defined in code so every entry has a matching route and permission. To verify against production, export the legacy <code className="font-mono">admin_menus</code> table and compare.</Notice>
      <div className="space-y-4">
        {tree.map((section) => (
          <Card key={section.section}>
            <CardHeader title={section.section} />
            <ul className="divide-y divide-line md:hidden">
              {section.items.flatMap((item) =>
                item.children.map((c) => (
                  <li key={c.key} className="px-4 py-3 text-[13px]">
                    <Link href={c.href} className="font-medium text-brand-700 hover:underline">{c.label}</Link>
                    {item.children.length > 1 || item.label !== c.label ? <span className="block text-xs text-ink-muted">{item.label}{item.sensitive ? " · sensitive" : ""}</span> : null}
                    <dl className="mt-2 space-y-1.5">
                      <div><dt className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">Permission</dt><dd className="font-mono text-xs break-all text-ink-soft">{c.permission}{c.action !== "view" ? `:${c.action}` : ""}</dd></div>
                      <div><dt className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">Legacy page</dt><dd className="text-xs break-words text-ink-muted">{c.legacy}</dd></div>
                      <div>
                        <dt className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">Visible to</dt>
                        <dd className="mt-0.5 flex flex-wrap gap-1">{c.roles.map((r) => <Badge key={r} tone={r === "Super Admin" ? "danger" : "neutral"}>{r}</Badge>)}</dd>
                      </div>
                    </dl>
                  </li>
                )),
              )}
            </ul>
            <div className="hidden overflow-x-auto scrollbar-thin md:block">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-line text-xs text-ink-muted">
                    <th scope="col" className="px-4 py-2 font-semibold">Menu</th>
                    <th scope="col" className="px-4 py-2 font-semibold">Permission</th>
                    <th scope="col" className="px-4 py-2 font-semibold">Legacy page</th>
                    <th scope="col" className="px-4 py-2 font-semibold">Visible to</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.flatMap((item) =>
                    item.children.map((c) => (
                      <tr key={c.key} className="border-b border-line last:border-0 align-top">
                        <td className="px-4 py-2">
                          <Link href={c.href} className="font-medium text-brand-700 hover:underline">{c.label}</Link>
                          {item.children.length > 1 || item.label !== c.label ? <span className="block text-xs text-ink-muted">{item.label}{item.sensitive ? " · sensitive" : ""}</span> : null}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-ink-soft">{c.permission}{c.action !== "view" ? `:${c.action}` : ""}</td>
                        <td className="max-w-64 px-4 py-2 text-xs text-ink-muted">{c.legacy}</td>
                        <td className="px-4 py-2">
                          <span className="flex flex-wrap gap-1">
                            {c.roles.map((r) => <Badge key={r} tone={r === "Super Admin" ? "danger" : "neutral"}>{r}</Badge>)}
                          </span>
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
