export const site = {
  name: "Bharat AgroLink",
  panelName: "Admin Panel",
  company: "Agrolink Manufacturing Private Limited",
  supportEmail: "admin-support@bharatagrolink.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

/** Pages without an API still show a notice. Live lists and order detail do not. */
export const demoMode = false;
