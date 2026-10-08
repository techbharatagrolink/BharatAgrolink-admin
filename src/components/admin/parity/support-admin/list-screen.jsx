import { getResource } from "@/lib/content/admin/resources";
import { can } from "@/lib/auth/permissions";
import { listResource, resolveFormOptions } from "@/lib/services/admin/resources";
import { Notice, PageHeader } from "@/components/ui/page";
import { ResourceTable } from "@/components/admin/resource/resource-table";

/** Current query string without `view`, so detail links keep the list state. */
export function listQueryString(searchParams, drop = ["view"]) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (drop.includes(key) || value == null || value === "") continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  return params.toString();
}

export function firstParam(searchParams, key) {
  const value = searchParams?.[key];
  return (Array.isArray(value) ? value[0] : value) || "";
}

/**
 * ResourcePage for the support-admin screens: the caller has already checked
 * the permission, and may pass live filter options, header links and a detail
 * dialog (children) opened through `?view=<id>`.
 */
export async function ListScreen({ resourceKey, user, pathname, searchParams, filters, actions, viewable = true, children }) {
  const resource = getResource(resourceKey);
  const data = await listResource(resourceKey, searchParams, user);
  const permitted = (list = []) => list.filter((a) => can(user, resource.permission, a.permission ?? "edit"));
  const qs = listQueryString(searchParams);
  const viewHref = `${pathname}?${qs ? `${qs}&` : ""}view={id}`;
  const rowActions = permitted(resource.rowActions).map((a) => (a.id === "view" ? { ...a, href: viewHref } : a));

  return (
    <>
      <PageHeader title={resource.title} description={resource.description} actions={actions} />
      {data.unavailable ? <Notice tone="warning">{data.unavailable}</Notice> : null}
      <ResourceTable
        resourceKey={resourceKey}
        resource={{
          title: resource.title,
          columns: resource.columns,
          filters: filters ?? resource.filters,
          search: resource.search,
          searchFields: resource.searchFields,
          dateRange: resource.dateRange,
          rowHref: viewable ? viewHref : null,
          exportable: resource.exportable,
          form: resource.form ? { title: resource.form.title, fields: resource.form.fields, requireReason: resource.form.requireReason } : null,
        }}
        data={{ rows: data.rows, total: data.total, page: data.page, pageSize: data.pageSize, pageCount: data.pageCount }}
        canAdd={Boolean(resource.form) && can(user, resource.permission, "add") && !resource.noAdd}
        rowActions={rowActions}
        bulkActions={permitted(resource.bulkActions)}
        optionSets={await resolveFormOptions(resource, user)}
      />
      {children}
    </>
  );
}
