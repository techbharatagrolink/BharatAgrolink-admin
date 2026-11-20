import { SeoModulePage } from "@/components/admin/seo/seo-module-page";

export const metadata = { title: "Orders & Revenue" };

export default function Page({ searchParams }) {
  return (
    <SeoModulePage
      searchParams={searchParams}
      apiPath="organic-commerce"
      title="Orders & Revenue"
      description="Orders and Organic GMV (Delivered) that came from organic search."
      plannedSections={["Organic sessions, add-to-cart and conversion rate (Google Analytics 4)", "Organic orders by status: placed, delivered, cancelled, returned", "Organic GMV (Delivered): delivered order items only, never labelled as company revenue", "Attributed orders reconciled against marketplace order IDs"]}
    />
  );
}
