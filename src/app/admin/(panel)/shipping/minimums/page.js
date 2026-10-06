import { SettingsPage } from "@/components/admin/settings/settings-page";

export const metadata = { title: "Minimum Order & COD" };

export default function MinimumsPage() {
  return <SettingsPage section="minimums" description="Checkout limits enforced by the storefront API: minimum order, COD range, COD handling and free-shipping threshold." />;
}
