"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import {
  addPromoBanners,
  addSectionItem,
  deleteBanner,
  deletePromoBanner,
  deleteSectionItem,
  resetHeroOrder,
  resetSectionOrder,
  saveBanner,
  saveHeroOrder,
  saveHomeContent,
  saveHomeFooter,
  saveHomeSettings,
  saveOffer,
  saveSectionOrder,
  saveSectionTitle,
  searchSectionProducts,
  updatePromoBanner,
} from "@/lib/services/admin/home-editor";

const PAGE = "newhomepage_website.php";
const PATH = "/admin/cms/home-sections";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 15 * 1024 * 1024;

const str = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");

async function gate(action) {
  const user = await getCurrentAdmin();
  if (!user) return { ok: false, message: "Your session has expired. Please log in again." };
  if (!canPage(user, PAGE, action)) return { ok: false, message: "You do not have permission to perform this action." };
  return { ok: true, user };
}

function done(result) {
  if (result?.ok) revalidatePath(PATH);
  return result;
}

function takeImage(formData, name) {
  const file = formData.get(name);
  if (!file || typeof file !== "object" || !file.size) return { file: null };
  if (!IMAGE_TYPES.includes(file.type)) return { error: "Only JPG, PNG or WebP images are allowed." };
  if (file.size > MAX_IMAGE) return { error: "Each image must be 15 MB or smaller." };
  return { file };
}

export async function saveSectionOrderAction(order) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveSectionOrder(order, gateResult.user));
}

export async function resetSectionOrderAction() {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await resetSectionOrder(gateResult.user));
}

export async function saveHeroOrderAction(order) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveHeroOrder(order, gateResult.user));
}

export async function resetHeroOrderAction() {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await resetHeroOrder(gateResult.user));
}

export async function saveBannerAction(formData) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  const type = str(formData.get("type"), 80);
  const body = new FormData();
  body.set("link", str(formData.get("link"), 2000));
  body.set("linkMobile", str(formData.get("linkMobile"), 300));
  for (const name of ["image", "imageMobile"]) {
    const taken = takeImage(formData, name);
    if (taken.error) return { ok: false, message: taken.error };
    if (taken.file) body.append(name, taken.file, taken.file.name || name);
  }
  return done(await saveBanner(type, body, gateResult.user));
}

export async function deleteBannerAction(type) {
  const gateResult = await gate("delete");
  if (!gateResult.ok) return gateResult;
  return done(await deleteBanner(str(type, 80), gateResult.user));
}

export async function saveOfferAction(formData) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  const id = str(formData.get("id"), 20);
  const body = new FormData();
  body.set("link", str(formData.get("link"), 2000));
  const taken = takeImage(formData, "image");
  if (taken.error) return { ok: false, message: taken.error };
  if (taken.file) body.append("image", taken.file, taken.file.name || "image");
  return done(await saveOffer(id, body, gateResult.user));
}

export async function saveSectionTitleAction(key, title) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveSectionTitle(str(key, 40), str(title, 255), gateResult.user));
}

export async function searchSectionProductsAction(key, q) {
  const gateResult = await gate("view");
  if (!gateResult.ok) return gateResult;
  return searchSectionProducts(str(key, 40), str(q, 80), gateResult.user);
}

export async function addSectionItemAction(key, productId) {
  const gateResult = await gate("add");
  if (!gateResult.ok) return gateResult;
  return done(await addSectionItem(str(key, 40), str(productId, 200), gateResult.user));
}

export async function deleteSectionItemAction(key, id) {
  const gateResult = await gate("delete");
  if (!gateResult.ok) return gateResult;
  return done(await deleteSectionItem(str(key, 40), id, gateResult.user));
}

export async function saveHomeSettingsAction(values) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveHomeSettings(values, gateResult.user));
}

export async function saveHomeContentAction(values) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveHomeContent(values, gateResult.user));
}

export async function addPromoAction(formData) {
  const gateResult = await gate("add");
  if (!gateResult.ok) return gateResult;
  const files = formData.getAll("images").filter((file) => file && typeof file === "object" && file.size);
  if (!files.length) return { ok: false, message: "Choose at least one image." };
  const body = new FormData();
  const links = [];
  for (const file of files) {
    if (!IMAGE_TYPES.includes(file.type)) return { ok: false, message: "Only JPG, PNG or WebP images are allowed." };
    if (file.size > MAX_IMAGE) return { ok: false, message: "Each image must be 15 MB or smaller." };
    body.append("images", file, file.name || "image");
    links.push("");
  }
  const posted = formData.get("links");
  body.set("links", typeof posted === "string" ? posted : JSON.stringify(links));
  return done(await addPromoBanners(body, gateResult.user));
}

export async function updatePromoAction(formData) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  const id = str(formData.get("id"), 20);
  const body = new FormData();
  body.set("link", str(formData.get("link"), 500));
  const taken = takeImage(formData, "image");
  if (taken.error) return { ok: false, message: taken.error };
  if (taken.file) body.append("image", taken.file, taken.file.name || "image");
  return done(await updatePromoBanner(id, body, gateResult.user));
}

export async function deletePromoAction(id) {
  const gateResult = await gate("delete");
  if (!gateResult.ok) return gateResult;
  return done(await deletePromoBanner(id, gateResult.user));
}

export async function saveHomeFooterAction(categories) {
  const gateResult = await gate("edit");
  if (!gateResult.ok) return gateResult;
  return done(await saveHomeFooter(categories, gateResult.user));
}
