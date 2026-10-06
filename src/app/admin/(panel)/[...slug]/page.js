import { notFound } from "next/navigation";
import { getResourceByPath } from "@/lib/content/admin/resources";
import { findNavItem } from "@/lib/content/admin/navigation";
import { ResourcePage } from "@/components/admin/resource/resource-page";

function pathFrom(slug) {
  return `/admin/${slug.map((s) => s.toLowerCase()).join("/")}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const match = getResourceByPath(pathFrom(slug));
  return { title: match?.resource.title ?? findNavItem(pathFrom(slug))?.label ?? "Not found" };
}

export default async function ResourceRoute({ params, searchParams }) {
  const { slug } = await params;
  const pathname = pathFrom(slug);
  const match = getResourceByPath(pathname);
  if (!match) notFound();
  return <ResourcePage resourceKey={match.key} pathname={pathname} searchParams={await searchParams} />;
}
