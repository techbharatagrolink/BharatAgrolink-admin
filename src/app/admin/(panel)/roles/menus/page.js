import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { getMenuTree } from "@/lib/services/admin/roles";
import { Notice, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MenuMaster } from "@/components/admin/settings/menu-master";

export const metadata = { title: "Admin Menus" };

/* The API allows menu writes on either page's grant (MENU_PAGES in admin-access.routes.js). */
const MENU_PAGES = ["menu-master.php", "manage-role.php"];

export default async function AdminMenusPage() {
  const { user, allowed } = await checkPermission("roles");
  if (!allowed) return (<><PageHeader title="Admin Menus" /><PermissionDenied module="roles" /></>);

  let tree = [];
  let error = null;
  try {
    tree = await getMenuTree(user);
  } catch (err) {
    error = err;
  }
  const can = Object.fromEntries(["add", "edit", "delete"].map((action) => [action, MENU_PAGES.some((page) => canPage(user, page, action))]));

  return (
    <>
      <PageHeader title="Admin Menus" description="The sidebar is built from this tree. Add, rename, reorder, move or hide sections, groups and pages here; the sidebar and breadcrumbs update for every role straight away." />
      <Notice className="mb-4">
        This tree is the <code className="font-mono">admin_menus</code> table. A role sees an entry when its permissions include view on it; set that in{" "}
        <Link href="/admin/roles" className="font-medium underline">
          Manage Role
        </Link>
        .
      </Notice>
      {error ? <ApiUnavailable error={error} what="the admin menus" /> : <MenuMaster tree={tree} can={can} />}
    </>
  );
}
