import "server-only";
import { api } from "@/lib/api";
import { buildSidebar, menuOnlyNavigation } from "@/lib/content/admin/sidebar";
import { filterNavigation } from "@/lib/auth/permissions";

/**
 * The admin's sidebar from admin_menus (GET /admin/auth/menu), so Menu Master
 * and role changes apply without a deploy. If the menu cannot be loaded the
 * static navigation.js sidebar (its admin_menus pages only), filtered by the
 * same permissions, is used.
 */
export async function getAdminMenu(user) {
  try {
    const { data } = await api("admin/auth/menu", { token: user.token });
    return buildSidebar(Array.isArray(data?.items) ? data.items : []);
  } catch (error) {
    console.error(`[admin menu] using the static sidebar: ${error?.message ?? error}`);
    return filterNavigation(menuOnlyNavigation(), user);
  }
}
