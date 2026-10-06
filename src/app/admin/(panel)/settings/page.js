import { SettingsPage } from "@/components/admin/settings/settings-page";

export const metadata = { title: "System Settings" };

export default function SystemSettingsPage() {
  return <SettingsPage section="system" description="Marketplace identity, support contacts, order and return defaults, payout cycle and maintenance mode." />;
}
