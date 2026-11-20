import { SeoModulePage } from "@/components/admin/seo/seo-module-page";

export const metadata = { title: "Product Data" };

export default function Page({ searchParams }) {
  return (
    <SeoModulePage
      searchParams={searchParams}
      apiPath="product-quality"
      title="Product Data"
      description="Product listing quality across the catalogue."
      plannedSections={["Missing required attributes by category (Seeds, Fertilizers, Pesticides, ...)", "Variant consistency (e.g. 250 g vs 500 g) and duplicate products", "Product schema / feed validation", "Exportable issue list with links to each product"]}
    />
  );
}
