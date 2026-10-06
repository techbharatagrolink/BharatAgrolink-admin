import { getResourceByPath } from "@/lib/content/admin/resources";
import { ResourcePage } from "./resource-page";

/**
 * Dynamic detail routes like /admin/orders/[id] also catch registry list
 * routes such as /admin/orders/invoices. Render the list when the path is a
 * registered resource; otherwise return null so the detail page continues.
 */
export async function resourceFallback(pathname, searchParams) {
  const match = getResourceByPath(pathname);
  if (!match) return null;
  return <ResourcePage resourceKey={match.key} pathname={pathname} searchParams={await searchParams} />;
}
