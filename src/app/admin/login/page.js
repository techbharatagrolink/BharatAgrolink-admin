import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getStore } from "@/lib/mock/admin/store";
import { demoAccounts } from "@/lib/mock/admin/access";
import { site } from "@/lib/site";
import { LoginForm } from "@/components/admin/auth/login-form";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }) {
  if (await getCurrentAdmin()) redirect("/admin/dashboard");
  const { next } = await searchParams;
  const store = getStore();
  const accounts = demoAccounts.map((a) => {
    const staff = store.staff.find((s) => s.id === a.userId);
    const role = store.roles.find((r) => r.id === staff.roleId);
    return { email: staff.email, name: staff.name, role: role.name, hint: a.hint };
  });

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)]">
      <aside className="relative hidden overflow-hidden bg-nav p-10 text-nav-ink lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-white px-3 py-2">
            <BrandLogo className="h-11" priority />
          </span>
          <p className="text-xs font-medium tracking-wide text-nav-muted uppercase">{site.panelName}</p>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl leading-tight font-semibold text-white">One back office for orders, vendors, money and farmers.</h2>
          <p className="mt-4 text-sm leading-relaxed text-nav-muted">Catalog and NRV pricing, order fulfilment and shipping, returns and RTO, vendor payouts, finance ledgers, CRM and sales teams, B2B, operations and support — in one place.</p>
        </div>
        <p className="text-xs text-nav-muted">© {site.company}</p>
      </aside>
      <main className="flex items-center justify-center bg-canvas px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <BrandLogo className="h-11" priority />
            <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Log in to the admin panel</h1>
          <p className="mt-1 text-sm text-ink-muted">Use your staff account. Access is limited to the modules your role allows.</p>
          <LoginForm accounts={accounts} next={typeof next === "string" ? next : ""} />
        </div>
      </main>
    </div>
  );
}
