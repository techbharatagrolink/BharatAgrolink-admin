import { Card, CardHeader } from "@/components/ui/card";
import { Unavailable, seoPage } from "@/components/admin/seo/seo-parts";

export const metadata = { title: "SEO Reports" };

/** Reports & export (subtask 12). Export is built once the modules have real data to export. */
export default async function SeoReportsPage() {
  const page = await seoPage({ title: "SEO Reports", description: "Date-filtered summaries and exports of the SEO & AI Command Center." });
  if (page.denied) return page.denied;
  return (
    <>
      {page.header(null)}
      <Card>
        <CardHeader title="Exports" />
        <Unavailable>
          Exports will follow the selected date range, filters and your permissions, with each metric&apos;s definition included. They arrive once the
          modules have real data.
        </Unavailable>
      </Card>
    </>
  );
}
