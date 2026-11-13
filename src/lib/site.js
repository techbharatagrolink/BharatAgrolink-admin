export const site = {
  name: "Bharat AgroLink",
  panelName: "Admin Panel",
  company: "Agrolink Manufacturing Private Limited",
  supportEmail: "admin-support@bharatagrolink.com",
  // This admin app's own URL (self-references only, e.g. callback/redirect links) — NOT the
  // customer marketplace. In production NEXT_PUBLIC_SITE_URL resolves to this admin's own
  // domain (admin.bharatagrolink.com), so it must never be reused to build a marketplace link —
  // see storefrontUrl below for that.
  url: process.env["NEXT_PUBLIC_SITE_URL"] || "http://localhost:3000",
};

/** The customer-facing marketplace's own domain, for "open on the live site" links. Deliberately
 * separate from site.url above (see its comment) — override with NEXT_PUBLIC_MARKETPLACE_URL
 * only if the storefront's domain ever changes. */
export const storefrontUrl = process.env["NEXT_PUBLIC_MARKETPLACE_URL"] || "https://www.bharatagrolink.com";

/** Pages without an API still show a notice. Live lists and order detail do not. */
export const demoMode = false;
