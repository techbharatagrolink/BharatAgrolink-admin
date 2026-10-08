import { requireAdmin } from "@/lib/auth/session";
import { Notice, PageHeader } from "@/components/ui/page";
import { buttonClasses } from "@/components/ui/button";

export const metadata = { title: "Not moved yet" };

// A PHP admin page path such as "manage_orders.php" or "b2b_orders/index.php?x=1".
const PHP_LINK = /^[\w-]+(\/[\w-]+)*\.php(\?[\w=&%.-]*)?$/;

// Read at request time; the deployment sets it only at runtime.
const runtimeEnv = (name) => process.env[name];

/**
 * Opened from sidebar entries (admin_menus) whose screen has not been moved to
 * this admin yet. Set PHP_ADMIN_URL (e.g. https://admin.example.com/AMPL.BAadmin)
 * to offer the PHP page meanwhile.
 */
export default async function NotPortedPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
  const link = one(params.link).trim().slice(0, 300);
  const name = one(params.name).trim().slice(0, 120);
  const base = (runtimeEnv("PHP_ADMIN_URL") || "").replace(/\/+$/, "");
  const phpHref = base && PHP_LINK.test(link) ? `${base}/${link}` : null;

  return (
    <>
      <PageHeader title={name || "Screen not moved yet"} description="This menu item exists in the PHP admin, but its screen has not been moved to this admin yet." />
      <Notice tone="warning" title="Not moved yet">
        {link ? (
          <>
            PHP page: <code className="font-mono text-[13px]">{link}</code>
          </>
        ) : (
          "No PHP page was given."
        )}
      </Notice>
      {phpHref ? (
        <a href={phpHref} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "primary", size: "sm", className: "mt-4" })}>
          Open in the PHP admin
        </a>
      ) : null}
    </>
  );
}
