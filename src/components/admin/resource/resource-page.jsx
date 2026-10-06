import { getResource } from "@/lib/content/admin/resources";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { listResource, resolveFormOptions } from "@/lib/services/admin/resources";
import { LinkTabs, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { ResourceTable } from "./resource-table";

function tabHref(pathname, searchParams, field, value) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (k === "page" || k === field || v == null || v === "") continue;
    params.set(k, Array.isArray(v) ? v[0] : v);
  }
  if (value) params.set(field, value);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Server component rendering any registry resource with permission checks. */
export async function ResourcePage({ resourceKey, pathname, searchParams, actions, children }) {
  const resource = getResource(resourceKey);
  const { user, allowed } = await checkPermission(resource.permission, "view");
  if (!allowed) {
    return (
      <>
        <PageHeader title={resource.title} />
        <PermissionDenied module={resource.title} />
      </>
    );
  }

  const data = await listResource(resourceKey, searchParams, user);
  const permitted = (list = []) => list.filter((a) => can(user, resource.permission, a.permission ?? "edit"));
  const tabField = resource.tabs?.field;
  const activeTab = tabField ? (Array.isArray(searchParams[tabField]) ? searchParams[tabField][0] : searchParams[tabField]) || "" : "";
  const tabs = tabField
    ? [
        { value: "", label: "All", href: tabHref(pathname, searchParams, tabField, ""), count: data.tabCounts?.all ?? 0 },
        ...resource.tabs.values.map((value) => ({
          value,
          label: resource.tabs.labels?.[value] ?? value.replace(/_/g, " "),
          href: tabHref(pathname, searchParams, tabField, value),
          count: data.tabCounts?.[value] ?? 0,
        })),
      ]
    : null;

  const tableData = { rows: data.rows, total: data.total, page: data.page, pageSize: data.pageSize, pageCount: data.pageCount };
  const links = (resource.headerActions ?? []).filter((a) => can(user, a.permission ?? resource.permission, a.action ?? "view"));
  const headerActions =
    actions || links.length ? (
      <>
        {links.map((a) => (
          <ButtonLink key={a.href} href={a.href} size="sm" variant={a.primary ? "primary" : "secondary"}>
            {a.label}
          </ButtonLink>
        ))}
        {actions}
      </>
    ) : null;

  return (
    <>
      <PageHeader title={resource.title} description={resource.description} actions={headerActions} />
      {children}
      {tabs && <LinkTabs tabs={tabs} active={activeTab} />}
      <ResourceTable
        resourceKey={resourceKey}
        resource={{
          title: resource.title,
          columns: resource.columns,
          filters: resource.filters,
          search: resource.search,
          searchFields: resource.searchFields,
          dateRange: resource.dateRange,
          rowHref: resource.rowHref,
          exportable: resource.exportable,
          form: resource.form ? { title: resource.form.title, fields: resource.form.fields, requireReason: resource.form.requireReason } : null,
        }}
        data={tableData}
        canAdd={Boolean(resource.form) && can(user, resource.permission, "add") && !resource.noAdd}
        rowActions={permitted(resource.rowActions)}
        bulkActions={permitted(resource.bulkActions)}
        optionSets={resolveFormOptions(resource)}
      />
    </>
  );
}
