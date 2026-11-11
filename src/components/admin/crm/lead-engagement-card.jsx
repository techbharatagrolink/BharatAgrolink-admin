import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";

/** One Engagement Panel grid (cart tracking or recently viewed) for the lead's app user, newest first. */
function ActivityTable({ head, rows, empty }) {
  if (!rows.length) return <p className="px-4 py-3 text-sm text-ink-muted">{empty}</p>;
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-max text-left text-[13px]">
        <thead>
          <tr className="border-b border-line text-xs text-ink-muted">
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {cells.map((c, j) => (
                <td key={j} className={j === 0 ? "px-3 py-2 font-mono text-xs" : "px-3 py-2"}>
                  {c ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * User Cart Tracking and User Recently Viewed Products of the customer behind a lead, found by user id
 * (the app user(s) registered with the lead's mobile). `engagement` is null when no app user has this mobile.
 */
export function LeadEngagementCard({ engagement, mobile }) {
  const panel = mobile ? `/admin/marketing/engagement?c_f_phone=${encodeURIComponent(mobile)}&v_f_phone=${encodeURIComponent(mobile)}` : null;
  const action = panel ? (
    <Link href={panel} className="text-sm font-medium text-brand-700 hover:underline">
      Engagement Panel
    </Link>
  ) : null;

  if (!engagement) {
    return (
      <Card>
        <CardHeader title="Cart & recently viewed" description="Engagement Panel activity of this customer" actions={action} />
        <p className="px-4 py-3 text-sm text-ink-muted">No app user is registered with this mobile, so there is no cart or product view activity.</p>
      </Card>
    );
  }

  const { cart, viewed, userIds, limit } = engagement;
  const capped = (n) => (n >= limit ? `latest ${limit}` : `${n}`);
  return (
    <Card>
      <CardHeader
        title="Cart & recently viewed"
        description={`User ID ${userIds.join(", ")} · ${capped(cart.length)} cart item${cart.length === 1 ? "" : "s"} · ${capped(viewed.length)} viewed product${viewed.length === 1 ? "" : "s"}`}
        actions={action}
      />
      <div className="space-y-4 pt-3 pb-2">
        <div>
          <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">User Cart Tracking</h3>
          <ActivityTable
            head={["ID", "Product", "Qty", "Type", "Added", "Location"]}
            rows={cart.map((r) => [r.id, r.productName, r.qty, r.type, formatDateTime(r.createdAt), r.location || null])}
            empty="No cart activity."
          />
        </div>
        <div>
          <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">User Recently Viewed Products</h3>
          <ActivityTable
            head={["ID", "Product", "Views", "First viewed", "Last viewed", "Location"]}
            rows={viewed.map((r) => [r.id, r.productName, r.views, formatDateTime(r.viewedAt), formatDateTime(r.lastViewedAt), r.location || null])}
            empty="No product views."
          />
        </div>
      </div>
    </Card>
  );
}
