import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getQuotationDetail, getQuotationForm } from "@/lib/services/admin/b2b-screens";
import { Notice, PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QuotationForm } from "@/components/admin/b2b/quotation-form";

export const metadata = { title: "Revise Quotation" };

const TITLE = "Revise Quotation";

/**
 * A changed offer is a new version (spec C6): the form starts from the current version and saving
 * creates the next one; the current version is kept unchanged and marked superseded.
 */
export default async function ReviseQuotationPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("b2b.quotations", "add");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="revising a B2B quotation" /></>);
  if (!/^\d+$/.test(id)) notFound();

  const back = <ButtonLink href={`/admin/b2b/quotations/${id}`} size="sm">Back to quotation</ButtonLink>;
  const result = await Promise.all([getQuotationDetail(id, user), getQuotationForm(user)]).then(([detail, options]) => ({ detail, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} actions={back} /><ApiUnavailable error={result.error} what="the quotation" /></>);
  const { detail: d, options } = result;
  if (!d) notFound();

  if (!d.actions.revise.allowed) {
    return (
      <>
        <PageHeader title={`${TITLE} ${d.number}`} actions={back} />
        <Notice tone="warning">{d.actions.revise.reason}</Notice>
      </>
    );
  }

  // Display fields for the form's line table come from the stored lines (same order as formValues).
  const initial = {
    ...d.formValues,
    lines: d.formValues.lines.map((line, i) => ({
      ...line,
      name: d.lines[i]?.name ?? line.sku,
      gstPct: d.lines[i]?.gstPct ?? 0,
      stock: d.lines[i]?.stockAtQuote ?? 0,
    })),
  };

  return (
    <>
      <PageHeader
        title={`${TITLE} ${d.number}`}
        description={`Saving creates version ${Math.max(d.version, ...d.versions.map((v) => v.version)) + 1}. Version ${d.version} stays exactly as it is and is marked superseded. The new version is priced and checked again.`}
        actions={back}
      />
      <QuotationForm options={options} initial={initial} reviseOf={d.id} />
    </>
  );
}
