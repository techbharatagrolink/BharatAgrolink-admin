import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getEngagement } from "@/lib/services/admin/parity/marketing";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { EngagementSection } from "@/components/admin/parity/marketing/engagement-section";

export const metadata = { title: "Engagement Panel" };

const SORTS = {
  cart: ["id", "phone", "fullname", "productName", "qty", "type", "createdAt", "country", "region", "city"],
  viewed: ["id", "phone", "fullname", "productName", "views", "viewedAt", "lastViewedAt", "country", "region", "city"],
};
const TEXT_KEYS = { q: 120, f_phone: 60, f_fullname: 120, f_productName: 120, f_country: 10, f_region: 120, f_city: 120 };

/** The prefixed URL params of one grid, checked before they reach the API. */
function filtersFor(kind, sp, prefix) {
  const get = (key) => (typeof sp[`${prefix}${key}`] === "string" ? sp[`${prefix}${key}`] : "");
  const query = { page: /^\d{1,6}$/.test(get("page")) && Number(get("page")) > 0 ? Number(get("page")) : 1, pageSize: ["10", "20", "50", "100"].includes(get("pageSize")) ? Number(get("pageSize")) : 20 };
  for (const [key, max] of Object.entries(TEXT_KEYS)) {
    const value = get(key).trim().slice(0, max);
    if (value) query[key] = value;
  }
  if (["registered", "guest"].includes(get("userType"))) query.userType = get("userType");
  if (kind === "cart" && ["0", "1"].includes(get("type"))) query.type = get("type");
  if (kind === "viewed" && /^\d{4}-\d{2}-\d{2}$/.test(get("date"))) query.date = get("date");
  if (SORTS[kind].includes(get("sort"))) query.sort = get("sort");
  if (["asc", "desc"].includes(get("dir"))) query.dir = get("dir");
  return query;
}

/** engagement_panel.php: cart tracking and recently viewed products, each with WhatsApp follow-ups. */
export default async function EngagementPage({ searchParams }) {
  const { user, allowed } = await checkPermission("marketing.engagement");
  if (!allowed) return (<><PageHeader title="Engagement Panel" /><PermissionDenied module="the engagement panel" /></>);
  const sp = await searchParams;
  const cartFilters = filtersFor("cart", sp, "c_");
  const viewedFilters = filtersFor("viewed", sp, "v_");
  const [cart, viewed] = await Promise.all([
    getEngagement("cart", cartFilters, user).then((data) => ({ data }), (error) => ({ error })),
    getEngagement("viewed", viewedFilters, user).then((data) => ({ data }), (error) => ({ error })),
  ]);
  const canSend = can(user, "marketing.engagement", "edit");

  return (
    <>
      <PageHeader title="Engagement Panel" description="Send WhatsApp messages to users based on their cart activity and product views" />
      <div className="space-y-4">
        {cart.error ? <ApiUnavailable error={cart.error} what="cart tracking" /> : <EngagementSection kind="cart" prefix="c_" data={cart.data} filters={cartFilters} canSend={canSend} />}
        {viewed.error ? <ApiUnavailable error={viewed.error} what="recently viewed products" /> : <EngagementSection kind="viewed" prefix="v_" data={viewed.data} filters={viewedFilters} canSend={canSend} />}
      </div>
    </>
  );
}
