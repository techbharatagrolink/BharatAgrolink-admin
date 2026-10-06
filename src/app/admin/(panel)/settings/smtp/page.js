import { SettingsPage } from "@/components/admin/settings/settings-page";

export const metadata = { title: "SMTP Settings" };

export default function SmtpSettingsPage() {
  return <SettingsPage section="smtp" description="Outgoing mail server used for order, refund and payout emails." />;
}
