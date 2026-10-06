import { SettingsPage } from "@/components/admin/settings/settings-page";

export const metadata = { title: "SMS Settings" };

export default function SmsSettingsPage() {
  return <SettingsPage section="sms" description="SMS gateway and DLT registration used for OTP and order alerts." />;
}
