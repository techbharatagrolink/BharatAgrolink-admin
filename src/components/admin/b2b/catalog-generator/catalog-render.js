import { translations } from "./catalog-i18n";

/*
 * Catalogue page builders, ported from b2b_orders/js/catalog_generator.js
 * (generateCatalog and the functions it calls). Markup and class names are
 * unchanged so public/catalog-generator/catalog_generator.css - the PHP
 * stylesheet, copied verbatim - styles them identically. Every builder writes
 * into `doc`, the catalogue frame's document.
 */

export const PRODUCTS_PER_PAGE = 3;

export const SCRIPT_FONT = {
  hi: "Noto Sans Devanagari", mr: "Noto Sans Devanagari", ne: "Noto Sans Devanagari",
  bn: "Noto Sans Bengali", as: "Noto Sans Bengali",
  gu: "Noto Sans Gujarati", pa: "Noto Sans Gurmukhi", or: "Noto Sans Oriya",
  kn: "Noto Sans Kannada", ta: "Noto Sans Tamil", te: "Noto Sans Telugu",
  ml: "Noto Sans Malayalam",
};

export const LANGUAGES = [
  ["en", "English"], ["hi", "Hindi (हिन्दी)"], ["bn", "Bengali (বাংলা)"], ["mr", "Marathi (मराठी)"],
  ["gu", "Gujarati (ગુજરાતી)"], ["pa", "Punjabi (ਪੰਜਾਬੀ)"], ["or", "Odia (ଓଡ଼ିଆ)"], ["kn", "Kannada (ಕನ್ನಡ)"],
  ["ta", "Tamil (தமிழ்)"], ["te", "Telugu (తెలుగు)"], ["ml", "Malayalam (മലയാളം)"], ["ne", "Nepali (नेपाली)"],
  ["as", "Assamese (অসমীয়া)"],
];

const DATE_LOCALE = {
  en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", gu: "gu-IN",
  pa: "pa-IN", or: "or-IN", kn: "kn-IN", ta: "ta-IN", te: "te-IN",
  ml: "ml-IN", ne: "ne-NP", as: "as-IN",
};

const CARD_LABELS = {
  packagingSize: "Packaging Size",
  usage: "Usage",
  targetPests: "Target Pests",
  dosePerAcre: "Dose/Acre",
  crops: "Crops",
  technicalName: "Technical Name",
};

const CATEGORY_GLYPH = {
  "Seeds": "M12 3c-3 3-5 7-5 11a5 5 0 0010 0c0-4-2-8-5-11z",
  "Fertilizers": "M6 20h12M8 20V11a4 4 0 118 0v9",
  "Crop Protection": "M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z",
  "Bio Products": "M12 20c-4 0-7-3-7-7 4 0 7 1 7 5 0-4 3-5 7-5 0 4-3 7-7 7z",
  "Farm Equipment": "M5 19l6-6M11 13l6-6M9 15l6-6M4 20l4-1 9-9-3-3-9 9-1 4z",
  "Irrigation": "M12 3s5 5.5 5 9.5A5 5 0 017 12.5C7 8.5 12 3 12 3z",
  "Agricultural Tools": "M4 20l6-6M14 4l6 6-4 4-6-6 4-4zM8 12l4 4",
};

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** UI/catalogue string in the language, falling back to English, with {placeholder} substitution. */
export function t(language, key, vars) {
  const dict = translations[language] || translations.en;
  let str = dict[key] ?? translations.en[key] ?? key;
  if (vars) Object.keys(vars).forEach((k) => { str = str.replace(`{${k}}`, vars[k]); });
  return str;
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export function createProductPlaceholder(product) {
  const hue = hashHue(product.category || product.name);
  const glyph = CATEGORY_GLYPH[product.category] || CATEGORY_GLYPH["Agricultural Tools"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <rect width="160" height="160" fill="hsl(${hue},32%,94%)"/>
    <circle cx="80" cy="68" r="34" fill="hsl(${hue},38%,86%)"/>
    <path d="${glyph}" transform="translate(56,44) scale(1.4)" fill="none" stroke="hsl(${hue},45%,38%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export function createVendorPlaceholder(vendor) {
  const hue = hashHue(vendor.name);
  const initials = vendor.name.split(" ").filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="30" fill="hsl(${hue},34%,40%)"/>
    <text x="30" y="38" font-family="Manrope,Arial,sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function handleImageError(imgEl, kind, refObject) {
  const fallback = kind === "vendor" ? createVendorPlaceholder(refObject) : createProductPlaceholder(refObject);
  imgEl.onerror = null;
  imgEl.src = fallback;
}

/** Today as yyyy-mm-dd in local time, which is what <input type="date"> wants. */
export function todayIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

/** ISO date from the picker -> long-form date in the catalogue's language. */
export function formatCatalogDate(isoValue, language) {
  const iso = String(isoValue || "").trim();
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return iso;
  const opts = { day: "2-digit", month: "long", year: "numeric" };
  try {
    return d.toLocaleDateString(DATE_LOCALE[language] || "en-IN", opts);
  } catch {
    return d.toLocaleDateString("en-IN", opts);
  }
}

/** packaging_size first; the first active variant's attribute only when it is empty. */
function packText(product) {
  const packaging = String(product.packaging || "").trim();
  if (packaging) return packaging;
  return String(product.pack || "").trim();
}

function initialsOf(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function brandMarkHtml(ctx, sizeClass) {
  const { branding } = ctx;
  if (branding.logo) return `<img class="${sizeClass}" src="${branding.logo}" alt="${escapeHtml(branding.name)}">`;
  return `<div class="${sizeClass}">${initialsOf(branding.name)}</div>`;
}

function generateCoverPage(ctx) {
  const { doc, branding, settings, boot } = ctx;
  const page = doc.createElement("section");
  page.className = "catalog-page page--cover";
  page.setAttribute("aria-label", "Catalogue cover");

  page.innerHTML = `
    <div class="cover-logo-card">${brandMarkHtml(ctx, "cover-logo")}</div>

    <div class="cover-headline">
      <div class="cover-brand">${escapeHtml(branding.name.toUpperCase())}</div>
      <div class="cover-strap">${escapeHtml(settings.title)}</div>
    </div>

    <div class="cover-emblem" aria-hidden="true">
      <svg viewBox="0 0 120 130" fill="none" stroke="#fff" stroke-width="3"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M28 112V58"/>
        <path d="M28 58c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M28 58c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M28 80c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M28 80c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M60 112V40"/>
        <path d="M60 40c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M60 40c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M60 62c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M60 62c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M60 84c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M60 84c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M92 112V58"/>
        <path d="M92 58c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M92 58c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <path d="M92 80c-11 0-17-7-17-16 9 0 17 6 17 16z"/>
        <path d="M92 80c11 0 17-7 17-16-9 0-17 6-17 16z"/>
        <rect x="8" y="112" width="104" height="12" rx="3"/>
        <path d="M26 118h68"/>
      </svg>
    </div>

    <div class="cover-foot">
      <div class="cover-market">${escapeHtml(settings.subtitle)}</div>
      ${boot.coverTagline ? `<div class="cover-tagline">${escapeHtml(boot.coverTagline)}</div>` : ""}
    </div>
  `;

  // Configured cover artwork renders full bleed; if it cannot load, the
  // typeset cover above stays (the PHP default img/catalog_cover.png is absent).
  if (boot.coverImage) {
    page.classList.add("page--cover-artwork");
    const art = doc.createElement("img");
    art.className = "cover-artwork";
    art.alt = branding.name + " catalogue cover";
    art.src = boot.coverImage;
    art.addEventListener("error", () => {
      page.classList.remove("page--cover-artwork");
      art.remove();
    }, { once: true });
    page.appendChild(art);
  }

  return page;
}

function pageHeaderHtml(ctx) {
  return `
    <div class="page-header__brand">
      ${brandMarkHtml(ctx, "page-header__mark")}
      <span>${escapeHtml(ctx.branding.name)}</span>
    </div>
    <div class="page-header__label">${escapeHtml(t(ctx.language, "pageHeaderLabel"))}</div>
  `;
}

function pageFooterHtml(ctx) {
  return `
    <span><strong>${escapeHtml(ctx.branding.name)}</strong> · ${escapeHtml(ctx.branding.website)}</span>
    <span class="page-number">Page —</span>
  `;
}

/** One pack shot beside a rounded spec card, alternating sides down the page. No pricing. */
function createProductCard(ctx, product, index) {
  const row = ctx.doc.createElement("div");
  row.className = "spec-row" + (index % 2 === 1 ? " spec-row--flip" : "");

  const specs = [
    ["packagingSize", packText(product)],
    ["usage", product.usage],
    ["targetPests", product.pests],
    ["dosePerAcre", product.dose],
    ["crops", product.crops],
    ["technicalName", product.technical],
  ].filter((pair) => String(pair[1] || "").trim() !== "");

  const specRows = specs.map((pair) => `
      <div class="spec-list__row">
        <dt class="spec-list__key">${escapeHtml(CARD_LABELS[pair[0]])}</dt>
        <dd class="spec-list__val">${escapeHtml(String(pair[1]).trim())}</dd>
      </div>`).join("");

  row.innerHTML = `
    <div class="spec-row__media">
      <img alt="${escapeHtml(product.name)}" src="${product.image || createProductPlaceholder(product)}">
    </div>
    <div class="spec-card">
      <h3 class="spec-card__title">
        ${escapeHtml(product.name)}
      </h3>
      ${specRows ? `<dl class="spec-list">${specRows}</dl>` : ""}
    </div>
  `;

  const img = row.querySelector(".spec-row__media img");
  img.addEventListener("error", () => handleImageError(img, "product", product));
  return row;
}

function buildProductPage(ctx, productChunk, category, showBand) {
  const { doc } = ctx;
  const page = doc.createElement("section");
  page.className = "catalog-page page--product";
  page.setAttribute("aria-label", "Catalogue products");

  const header = doc.createElement("div");
  header.className = "page-header";
  header.innerHTML = pageHeaderHtml(ctx);
  page.appendChild(header);

  if (showBand) {
    const band = doc.createElement("div");
    band.className = "category-band";
    band.textContent = category;
    page.appendChild(band);
  }

  const stack = doc.createElement("div");
  stack.className = "spec-stack";
  productChunk.forEach((product, i) => stack.appendChild(createProductCard(ctx, product, i)));
  page.appendChild(stack);

  const footer = doc.createElement("div");
  footer.className = "page-footer";
  footer.innerHTML = pageFooterHtml(ctx);
  page.appendChild(footer);
  return page;
}

/** Product pages grouped by category; only the first page of a category carries the green band. */
function generateProductPages(ctx, selectedProducts) {
  const perPage = ctx.perPage > 0 ? ctx.perPage : PRODUCTS_PER_PAGE;
  const order = [];
  const byCategory = new Map();
  selectedProducts.forEach((p) => {
    const key = String(p.category || "Uncategorised");
    if (!byCategory.has(key)) { byCategory.set(key, []); order.push(key); }
    byCategory.get(key).push(p);
  });

  const pages = [];
  order.forEach((category) => {
    const group = byCategory.get(category);
    for (let i = 0; i < group.length; i += perPage) {
      pages.push(buildProductPage(ctx, group.slice(i, i + perPage), category, i === 0));
    }
  });
  return pages;
}

function buildSellerPage(ctx, uniqueVendors) {
  const { doc, language } = ctx;
  const page = doc.createElement("section");
  page.className = "catalog-page page--product page--sellers";
  page.setAttribute("aria-label", "Our sellers");

  const header = doc.createElement("div");
  header.className = "page-header";
  header.innerHTML = pageHeaderHtml(ctx);

  const intro = doc.createElement("div");
  intro.className = "sellers-intro";
  intro.innerHTML = `
    <div class="sellers-kicker">${escapeHtml(t(language, "sellersKicker"))}</div>
    <h2 class="sellers-title">${escapeHtml(t(language, "sellersTitle"))}</h2>
    <p class="sellers-subtitle">${escapeHtml(t(language, "sellersSubtitle"))}</p>
  `;

  const grid = doc.createElement("div");
  grid.className = "sellers-grid";
  uniqueVendors.forEach((vendor) => {
    const card = doc.createElement("div");
    card.className = "seller-card";
    card.innerHTML = `
      <div class="seller-card__logo"><img alt="" src="${vendor.logo || createVendorPlaceholder(vendor)}"></div>
      <div class="seller-card__name">${escapeHtml(vendor.name)}</div>
      <div class="seller-card__tag">${escapeHtml(t(language, "sellerTag"))}</div>
    `;
    const img = card.querySelector("img");
    img.addEventListener("error", () => handleImageError(img, "vendor", vendor));
    grid.appendChild(card);
  });

  const footer = doc.createElement("div");
  footer.className = "page-footer";
  footer.innerHTML = pageFooterHtml(ctx);

  page.append(header, intro, grid, footer);
  return page;
}

function qrFallbackIcon(doc) {
  const wrap = doc.createElement("div");
  wrap.className = "qr-placeholder__img qr-placeholder__img--fallback";
  wrap.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.4"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.4"/><path d="M14 14h3v3h-3zM19 14h2M14 19h2M19 19h2v2" stroke="currentColor" stroke-width="1.4"/></svg>`;
  return wrap;
}

function generateFinalPage(ctx) {
  const { doc, branding, salesAgent, language } = ctx;
  const page = doc.createElement("section");
  page.className = "catalog-page page--final";
  page.setAttribute("aria-label", "Sales contact and branding");

  const header = doc.createElement("div");
  header.className = "final-header";
  header.innerHTML = `
    ${brandMarkHtml(ctx, "final-mark")}
    <p class="final-tagline">${escapeHtml(t(language, "tagline"))}</p>
    <p class="final-strapline">${escapeHtml(t(language, "strapline"))}</p>
  `;

  const body = doc.createElement("div");
  body.className = "final-body";

  const contactWrap = doc.createElement("div");
  contactWrap.innerHTML = `<div class="final-section-label">${escapeHtml(t(language, "enquiriesLabel"))}</div>`;
  const contactCard = doc.createElement("div");
  contactCard.className = "contact-card";
  contactCard.innerHTML = `
    <div class="contact-card__agent">
      <span class="contact-card__agent-role">${escapeHtml(t(language, "salesAgentLabel"))}</span>
      <span class="contact-card__agent-name">${escapeHtml(salesAgent.name)}</span>
    </div>
    <div class="contact-card__details">
      ${salesAgent.phone ? `<a href="tel:${escapeHtml(salesAgent.phone)}">${escapeHtml(salesAgent.phone)}</a>
      <span class="muted">${escapeHtml(t(language, "callWhatsapp"))}</span>` : ""}
      ${salesAgent.email ? `<a href="mailto:${escapeHtml(salesAgent.email)}">${escapeHtml(salesAgent.email)}</a>` : ""}
    </div>
  `;
  contactWrap.appendChild(contactCard);
  body.appendChild(contactWrap);

  const divider = doc.createElement("div");
  divider.className = "final-divider";
  body.appendChild(divider);

  const cta = doc.createElement("div");
  cta.className = "final-cta";
  cta.innerHTML = `
    <div class="final-section-label">${escapeHtml(t(language, "exploreLabel"))}</div>
    <p class="final-cta__copy">${escapeHtml(t(language, "ctaCopy"))}</p>
    <div class="final-cta__website">${escapeHtml(branding.website)}</div>
  `;
  body.appendChild(cta);

  const footer = doc.createElement("div");
  footer.className = "final-footer";
  footer.innerHTML = `
    <div class="qr-placeholder">
      <img class="qr-placeholder__img" alt="${escapeHtml(t(language, "qrCaption", { website: branding.website }))}" src="${branding.qrCode}">
    </div>
    <span class="qr-placeholder-caption">${escapeHtml(t(language, "qrCaption", { website: branding.website }))}</span>
  `;
  const qrImg = footer.querySelector(".qr-placeholder__img");
  qrImg.addEventListener("error", () => qrImg.replaceWith(qrFallbackIcon(doc)), { once: true });

  const pageFooter = doc.createElement("div");
  pageFooter.className = "page-footer page-footer--dark";
  pageFooter.innerHTML = pageFooterHtml(ctx);

  page.append(header, body, footer);

  if (language !== "en") {
    const notice = doc.createElement("p");
    notice.className = "mt-notice";
    notice.textContent =
      "Product names and categories in this catalogue are machine-translated. "
      + "The original English name is printed beneath each product. "
      + "Chemical names, SKU codes, pack sizes and all figures are unchanged from the source data. "
      + "For contractual or regulatory use, refer to the English original.";
    page.appendChild(notice);
  }

  page.appendChild(pageFooter);
  return page;
}

function updatePageNumbers(ctx, pages) {
  const total = pages.length;
  pages.forEach((page, index) => {
    const marker = page.querySelector(".page-number");
    if (marker) {
      marker.textContent = t(ctx.language, "pageOf", { n: String(index + 1).padStart(2, "0"), total: String(total).padStart(2, "0") });
    }
  });
}

function wireBrandLogoFallback(ctx, root) {
  root.querySelectorAll("img.cover-logo, img.page-header__mark").forEach((img) => {
    img.addEventListener("error", () => {
      const div = ctx.doc.createElement("div");
      div.className = img.className;
      div.textContent = initialsOf(ctx.branding.name);
      img.replaceWith(div);
    }, { once: true });
  });
}

/** Sellers behind the selection, in first-seen order (product.vendorId -> vendor.id). */
export function uniqueVendorsOf(selected, vendors) {
  const byId = new Map(vendors.map((v) => [v.id, v]));
  const seen = new Map();
  selected.forEach((p) => {
    const v = byId.get(p.vendorId);
    if (v && !seen.has(v.id)) seen.set(v.id, v);
  });
  return Array.from(seen.values());
}

/**
 * Renders the whole catalogue into `root` (cover, product pages, sellers
 * page, final page) and returns the page count.
 * ctx: { doc, branding, salesAgent, settings: { title, subtitle }, boot, language, perPage, vendors }
 */
export function renderCatalogue(ctx, root, selected) {
  root.innerHTML = "";
  const pages = [generateCoverPage(ctx), ...generateProductPages(ctx, selected)];
  const uniqueVendors = uniqueVendorsOf(selected, ctx.vendors);
  if (uniqueVendors.length) pages.push(buildSellerPage(ctx, uniqueVendors));
  pages.push(generateFinalPage(ctx));
  pages.forEach((page) => root.appendChild(page));
  updatePageNumbers(ctx, pages);
  wireBrandLogoFallback(ctx, root);
  return pages.length;
}
