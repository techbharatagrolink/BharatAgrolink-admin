import { toClientUser } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { getNavBadges, getNotifications } from "@/lib/services/admin/shell";
import { getAdminMenu } from "@/lib/services/admin/menu";
import { AdminShell } from "@/components/admin/shell/admin-shell";

export default async function AdminPanelLayout({ children }) {
  const user = await requireAdmin();
  const [menu, badges, notifications] = await Promise.all([getAdminMenu(user), getNavBadges(user), getNotifications(user)]);

  return (
    <AdminShell user={toClientUser(user)} navigation={menu} badges={badges} notifications={notifications}>
      {children}
    </AdminShell>
  );
}
