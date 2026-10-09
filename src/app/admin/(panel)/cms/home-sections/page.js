import { ResourcePage } from "@/components/admin/resource/resource-page";
import { LinkTabs, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { requireAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { getHeroBoard, getHomeCopy } from "@/lib/services/admin/home-editor";
import { HeroOrder } from "@/components/admin/cms/hero-order";
import { HomePageText } from "@/components/admin/cms/home-page-text";

const PAGE = "newhomepage_website.php";

const TABS = [
  { value: "sections", label: "Sections", key: "cms.homeSections" },
  { value: "banners", label: "Banners", key: "cms.homeBanners" },
  { value: "items", label: "Section items", key: "cms.homeSectionItems" },
  { value: "text", label: "Page text" },
];

export const metadata = { title: "Home Banner" };

function tabHref(value) {
  return value === "sections" ? "/admin/cms/home-sections" : `/admin/cms/home-sections?tab=${value}`;
}

function tabs(active) {
  return <LinkTabs tabs={TABS.map((tab) => ({ value: tab.value, label: tab.label, href: tabHref(tab.value) }))} active={active} />;
}

/** newhomepage_website.php: section order, banners, product rows, page text and footer. */
export default async function HomeSectionsPage({ searchParams }) {
  const params = await searchParams;
  const requested = typeof params.tab === "string" ? params.tab : "";
  const current = TABS.find((tab) => tab.value === requested) ?? TABS[0];

  if (current.value === "text") {
    const user = await requireAdmin();
    if (!canPage(user, PAGE, "view")) {
      return (
        <>
          <PageHeader title="Homepage text" />
          {tabs(current.value)}
          <PermissionDenied module="homepage sections" />
        </>
      );
    }
    const result = await getHomeCopy(user);
    if (!result.ok) {
      return (
        <>
          <PageHeader title="Homepage text" description="Page title, meta tags, marquee, top bar, description and footer." />
          {tabs(current.value)}
          <ApiUnavailable error={result} what="the homepage text" />
        </>
      );
    }
    return (
      <>
        <PageHeader title="Homepage text" description="Page title, meta tags, marquee, top bar notification, homepage description and footer links." />
        {tabs(current.value)}
        <HomePageText settings={result.data.settings} content={result.data.content} footer={result.data.footer} canEdit={canPage(user, PAGE, "edit")} />
      </>
    );
  }

  let hero = null;
  if (current.value === "banners") {
    const user = await requireAdmin();
    if (canPage(user, PAGE, "view")) {
      const board = await getHeroBoard(user);
      if (board.ok) hero = <HeroOrder items={board.data} canEdit={canPage(user, PAGE, "edit")} />;
    }
  }

  return (
    <ResourcePage resourceKey={current.key} pathname="/admin/cms/home-sections" searchParams={params}>
      {tabs(current.value)}
      {hero}
    </ResourcePage>
  );
}
