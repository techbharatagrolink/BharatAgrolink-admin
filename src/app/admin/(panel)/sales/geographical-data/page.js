import { ApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/session";
import { getGeo, getGeoOptions } from "@/lib/services/admin/parity/geo";
import { LinkTabs, Notice, PageHeader } from "@/components/ui/page";
import { ApiUnavailable } from "@/components/ui/states";
import { GeoTable } from "@/components/admin/parity/geo/geo-table";

export const metadata = { title: "Geographical Data" };

const TITLE = "Geographical Data";
const DESCRIPTION = "Development blocks, urban local bodies and villages by pincode, with each pincode's soil, water, climate and crop profile.";
const BASE = "/admin/sales/geographical-data";

const TABS = [
  { value: "blocks", label: "Development Blocks", href: BASE },
  { value: "urban", label: "Urban Village", href: `${BASE}?tab=urban` },
  { value: "villages", label: "Villages", href: `${BASE}?tab=villages` },
];

const PAGE_SIZES = [10, 25, 50, 100];
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

function listQuery(sp) {
  const page = Math.min(100000, Math.max(1, Number.parseInt(one(sp.page), 10) || 1));
  const size = Number(one(sp.pageSize));
  const query = { page, pageSize: PAGE_SIZES.includes(size) ? size : 25 };
  for (const [key, max] of [["q", 100], ["state", 150], ["district", 150], ["type", 150]]) {
    const value = one(sp[key]).trim().slice(0, max);
    if (value) query[key] = value;
  }
  if (/^\d{6}$/.test(one(sp.pincode).trim())) query.pincode = one(sp.pincode).trim();
  return query;
}

/** Sales > Geographical Data: the pincode_mapping database, one tab per table, read only. */
export default async function GeographicalDataPage({ searchParams }) {
  // open to every logged-in admin, no role permission needed
  const user = await requireAdmin();
  const sp = await searchParams;
  const kind = TABS.some((t) => t.value === sp.tab) ? sp.tab : "blocks";
  const query = listQuery(sp);

  const [listed, opted] = await Promise.allSettled([getGeo(kind, query, user), getGeoOptions(kind, query.state, user)]);
  const failure = [listed, opted].find((r) => r.status === "rejected")?.reason;
  // a search the API refused as too slow (422) keeps the tabs and filters on screen so it can be narrowed
  const tooSlow = failure instanceof ApiError && failure.status === 422 && listed.status === "rejected" && opted.status === "fulfilled";
  if (failure && !tooSlow) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <LinkTabs tabs={TABS} active={kind} />
        <ApiUnavailable error={failure} what="geographical data" />
      </>
    );
  }
  const data = tooSlow ? { rows: [], total: 0, page: 1, pageSize: query.pageSize, pageCount: 1 } : listed.value;
  const options = opted.value;

  const villageNote = tooSlow
    ? null
    : kind !== "villages"
      ? null
      : data.totalUnknown
        ? "The village table has about 6 lakh rows and is indexed only by pincode, so this filter is paged without a total and can take a few seconds. Filter by pincode for the fastest results."
        : data.totalIsEstimate
          ? "About 6 lakh villages (approximate count). Search a 6-digit pincode, or pick a state and district."
          : null;

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <LinkTabs tabs={TABS} active={kind} />
      {tooSlow && (
        <Notice tone="warning" title="Search took too long" className="mb-3">
          {failure.message}
        </Notice>
      )}
      {villageNote && (
        <Notice tone="info" className="mb-3">
          {villageNote}
        </Notice>
      )}
      <GeoTable kind={kind} data={data} options={options} />
    </>
  );
}
