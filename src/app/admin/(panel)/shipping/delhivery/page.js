import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Delhivery Orders" };

export default async function DelhiveryOrdersPage({ searchParams }) {
  return <ResourcePage resourceKey="shipping.delhivery" pathname="/admin/shipping/delhivery" searchParams={await searchParams} />;
}
