import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getCustomer360 } from "@/lib/services/admin/parity/crm";
import { PageHeader } from "@/components/ui/page";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { Customer360View } from "@/components/admin/crm/customer-360";

export const metadata = { title: "Customer 360" };

/** Screens that link here; any one of them opens Customer 360. The API decides limited (sales) vs full (admin). */
const OPENED_FROM = ["crm.tracking", "customers", "orders", "crm.leads", "crm.agentLeads"];

const back = (
  <Link href="/admin/crm/customer-tracking" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-sm font-medium text-ink-soft hover:bg-surface-muted">
    <ArrowLeft className="size-4" aria-hidden /> Customer Tracking
  </Link>
);

/** `/admin/crm/customer-360/<user_unique_id>`, or `/admin/crm/customer-360/by-mobile?mobile=<mobile>` from lead pages. */
export default async function Customer360Page({ params, searchParams }) {
  const { userId } = await params;
  const { mobile } = await searchParams;
  const ref = userId === "by-mobile" ? { mobile: String(mobile ?? "").slice(0, 20) } : { user: decodeURIComponent(userId) };
  const user = await requireAdmin();
  if (!OPENED_FROM.some((p) => can(user, p, "view"))) return (<><PageHeader title="Customer 360" /><PermissionDenied module="Customer 360" /></>);

  let data;
  try {
    data = await getCustomer360(ref, user);
  } catch (error) {
    return (<><PageHeader title="Customer 360" actions={back} /><ApiUnavailable error={error} what="the customer profile" /></>);
  }

  if (!data.eligible) {
    return (
      <>
        <PageHeader title="Customer 360" actions={back} />
        <EmptyState icon={UserX} title="No customer analysis" description={data.reason} />
      </>
    );
  }

  const c = data.customer;
  return (
    <>
      <PageHeader
        title={c.name}
        description={[c.mobile, [c.city, c.state].filter(Boolean).join(", "), c.crop && `Crop: ${c.crop}`, `ID ${c.userId}`].filter(Boolean).join(" · ")}
        meta={
          <>
            {data.score && <Badge tone="brand">Score {data.score.score.toFixed(2)} · {data.score.rating}</Badge>}
            <Badge tone={data.segment.tone}>{data.segment.label}</Badge>
            {c.status && <StatusBadge status={c.status} />}
            <Badge tone={data.tier === "full" ? "brand" : "neutral"}>{data.tier === "full" ? "Full view" : "Sales view"}</Badge>
          </>
        }
        actions={back}
      />
      <Customer360View data={data} />
    </>
  );
}
