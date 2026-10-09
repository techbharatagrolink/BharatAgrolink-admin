/**
 * Live admin paths for CMS lists, settings, roles, minimums, expense caps and the NRV calculator.
 * Merge `resources` into LIVE_RESOURCES and `livePaths` into LIVE_ADMIN_PATHS.
 * cms.pages is not a second writer: the list service adapts /admin/custom-pages.
 */
export const resources = {
  "cms.banners": { path: "/cms/banners", page: "newhomepage_website.php", permission: "cms" },
  "cms.homeSections": { path: "/cms/home-sections", page: "newhomepage_website.php", permission: "cms" },
  "cms.homeBanners": { path: "/cms/home-sections/banners", page: "newhomepage_website.php", permission: "cms" },
  "cms.homeSectionItems": { path: "/cms/home-sections/items", page: "newhomepage_website.php", permission: "cms" },
  "cms.pages": { path: "/custom-pages", page: "pages_custom.php", permission: "cms.pages" },
  "cms.notifications": { path: "/cms/notifications", page: "notification.php", permission: "cms.notifications" },
};

export const livePaths = [
  "/admin/cms/banners",
  "/admin/cms/home-sections",
  "/admin/cms/pages",
  "/admin/cms/notifications",
  "/admin/roles",
  "/admin/settings",
  "/admin/settings/smtp",
  "/admin/settings/sms",
  "/admin/settings/integrations",
  "/admin/shipping/minimums",
  "/admin/finance/expense-limits",
  "/admin/pricing",
];
