import { SeoModulePage } from "@/components/admin/seo/seo-module-page";

export const metadata = { title: "SEO & Google" };

export default function Page({ searchParams }) {
  return (
    <SeoModulePage
      searchParams={searchParams}
      apiPath="search-performance"
      title="SEO & Google"
      description="Google Search Console performance, indexing and keyword positions."
      plannedSections={["Clicks, impressions, CTR and average position with period comparison", "Indexed pages and indexing/crawl issues", "Brand vs non-brand clicks (brand terms editable in Settings)", "Top queries and pages, with drill-down to the URL or query"]}
    />
  );
}
