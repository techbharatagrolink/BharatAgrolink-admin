import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getCaseSlabs } from "@/lib/services/admin/b2b-screens";
import { formatDate, formatINR } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { CaseRatesForm } from "@/components/admin/b2b/case-rates-form";

export const metadata = { title: "B2B Case Rates" };

const VERIFY_TONE = { VERIFIED: "success", PROVISIONAL: "warning", UNVERIFIED: "neutral" };
const stepLabel = (n) => (n === 8 ? "8+ cases" : `${n} case${n > 1 ? "s" : ""}`);

/**
 * Customer case rates 1 / 2 / 4 / 8+ of one B2B sellable unit (task #107 subtask 3; spec §5 "2-Case /
 * 4-Case / 8+ Case Rate", A2 "Slabs"). The slab the quoted case count reaches is the base B2B price in
 * quotations and direct orders; CM, floor and approval still run on the final rate.
 */
export default async function CaseRatesPage({ params }) {
  const { sourceType, sourceId } = await params;
  const { user, allowed } = await checkPermission("b2b.catalog");
  if (!allowed) return (<><PageHeader title="B2B Case Rates" /><PermissionDenied module="B2B case rates" /></>);
  const result = await getCaseSlabs(sourceType, sourceId, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="B2B Case Rates" /><ApiUnavailable error={result.error} what="case rates" /></>);
  const { data } = result;
  const facts = [
    ["SKU", data.sku || "—"],
    ["Pack", data.pack || "—"],
    ["HSN", data.hsn || "—"],
    ["GST", `${data.gstPct}%`],
    ["List price (ex-GST)", formatINR(data.listPrice)],
    ["MRP", data.mrp ? formatINR(data.mrp) : "—"],
    ["Units per case", data.unitsPerCase ?? "not set"],
    ["MOQ", data.moqQty ? `${data.moqQty} ${data.moqType || ""}` : "—"],
    ["Order multiple", data.orderMultiple ?? "—"],
  ];
  if (data.floorPrice !== undefined) facts.push(["Floor price", data.floorPrice != null ? formatINR(data.floorPrice) : "—"]);
  const showCost = data.slabs.some((s) => "approvedCost" in s);

  return (
    <>
      <PageHeader
        title={data.name}
        description="Customer case rates: the base B2B rate by manufacturer cases. Without rates the list price applies."
        actions={<Link href="/admin/b2b/sku-links" className="text-sm text-brand-700 hover:underline">← SKU Links &amp; Case Sizes</Link>}
      />
      {!data.active && <Notice tone="warning" className="mb-3">This product is inactive.</Notice>}
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm">
          Case size <Badge tone={VERIFY_TONE[data.caseVerification] ?? "neutral"}>{data.caseVerification.toLowerCase()}</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-5">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-ink-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="mt-3 p-4">
        <h2 className="mb-2 font-semibold">Active case rates{data.validUntil ? ` · valid until ${formatDate(data.validUntil)}` : ""}</h2>
        <MiniTable
          columns={[
            { key: "minCases", label: "Slab", render: (s) => stepLabel(s.minCases) },
            { key: "rate", label: "Rate ex-GST / unit", align: "right", render: (s) => formatINR(s.rate) },
            { key: "rateInclGst", label: "Incl. GST", align: "right", render: (s) => formatINR(s.rateInclGst) },
            { key: "caseRate", label: "Per case", align: "right", render: (s) => (s.caseRate != null ? formatINR(s.caseRate) : "—") },
            ...(showCost
              ? [
                  { key: "approvedCost", label: "Approved cost", align: "right", render: (s) => (s.approvedCost != null ? formatINR(s.approvedCost) : "NRV") },
                  { key: "grossMarginPct", label: "Gross margin", align: "right", render: (s) => (s.grossMarginPct != null ? `${s.grossMarginPct}%` : "—") },
                ]
              : []),
          ]}
          rows={data.slabs.map((s) => ({ ...s, id: s.minCases }))}
          empty="No case rates: quotations use the list price."
        />
        {data.canEdit && (
          <div className="mt-4 border-t border-line pt-4">
            <CaseRatesForm data={data} />
          </div>
        )}
      </Card>

      {data.history.length > 0 && (
        <Card className="mt-3 p-4">
          <h2 className="mb-2 font-semibold">Earlier rates</h2>
          <MiniTable
            columns={[
              { key: "minCases", label: "Slab", render: (h) => stepLabel(h.minCases) },
              { key: "rate", label: "Rate", align: "right", render: (h) => formatINR(h.rate) },
              { key: "setBy", label: "Set by", render: (h) => `${h.setBy} · ${formatDate(h.setAt)}` },
              { key: "supersededAt", label: "Replaced", render: (h) => formatDate(h.supersededAt) },
              { key: "note", label: "Note" },
            ]}
            rows={data.history.map((h, i) => ({ ...h, id: i }))}
            empty=""
          />
        </Card>
      )}
    </>
  );
}
