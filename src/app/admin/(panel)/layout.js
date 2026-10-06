import { navigation } from "@/lib/content/admin/navigation";
import { filterNavigation, toClientUser } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { getNavBadges, getNotifications } from "@/lib/services/admin/shell";
import { demoMode } from "@/lib/site";
import { AdminShell } from "@/components/admin/shell/admin-shell";

export default async function AdminPanelLayout({ children }) {
  const user = await requireAdmin();
  const [badges, notifications] = await Promise.all([getNavBadges(user), getNotifications(user)]);
  const menu = filterNavigation(navigation, user);

  return (
    <AdminShell user={toClientUser(user)} navigation={menu} badges={badges} notifications={notifications} demoMode={demoMode}>
      {children}
    </AdminShell>
  );
}
