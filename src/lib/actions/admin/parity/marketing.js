"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import {
  createCalendarEvent,
  createMarketingExpense,
  createSeoPage,
  deleteCalendarEvent,
  deleteMarketingExpense,
  deleteSeoPage,
  exportEngagement,
  getSeoPage,
  getTrendReport,
  getVideoScript,
  previewEngagementWhatsApp,
  refreshSocial,
  scheduleTrendReport,
  scheduleVideoScript,
  sendEngagementWhatsApp,
  updateCalendarEvent,
  updateMarketingExpense,
  updateSeoPage,
} from "@/lib/services/admin/parity/marketing";

const invalid = (message = "Invalid request.") => ({ ok: false, message });
const str = (v, max = 255) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const list = (v, max = 20, len = 255) => (Array.isArray(v) ? v.slice(0, max).map((x) => str(x, len)).filter(Boolean) : []);
const id = (v) => (/^\d{1,12}$/.test(String(v ?? "")) ? String(v) : null);
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const STAMP = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/;
const KINDS = ["cart", "viewed"];
const LANGUAGES = ["en", "hi"];

/* ---------- Social media dashboard ---------- */

export async function scheduleTrendReportAction(input) {
  const auth = await assertPermission("marketing", "add");
  if (!auth.ok) return auth;
  const categories = list(input?.categories, 20, 60);
  const regions = list(input?.regions, 20, 60);
  const timeFrame = str(input?.timeFrame, 20);
  if (!categories.length) return invalid("Please select at least one category");
  if (!regions.length) return invalid("Please select at least one region");
  const body = {
    scope: str(input?.scope, 10),
    categories,
    regions,
    timeFrame,
    contentFormat: str(input?.contentFormat, 30),
    additionalContext: str(input?.additionalContext, 2000),
  };
  if (timeFrame === "custom") {
    const startDate = str(input?.startDate, 10);
    const endDate = str(input?.endDate, 10);
    if (!YMD.test(startDate) || !YMD.test(endDate)) return invalid("Please select both start and end dates");
    Object.assign(body, { startDate, endDate });
  }
  return scheduleTrendReport(body, auth.user);
}

export async function scheduleVideoScriptAction(input) {
  const auth = await assertPermission("marketing", "add");
  if (!auth.ok) return auth;
  const topic = str(input?.topic, 500);
  const targetAudience = list(input?.targetAudience, 5, 30);
  const duration = Number(input?.duration);
  if (!topic) return invalid("Please enter a topic for the video script");
  if (!targetAudience.length) return invalid("Please select at least one target audience");
  if (!Number.isInteger(duration) || duration < 10 || duration > 300) return invalid("Please enter a valid duration between 10 and 300 seconds");
  return scheduleVideoScript(
    {
      videoType: str(input?.videoType, 30),
      duration,
      style: str(input?.style, 20),
      language: str(input?.language, 20),
      targetAudience,
      topic,
      productName: str(input?.productName),
      keyPoints: list(input?.keyPoints, 20, 500),
      cta: str(input?.cta, 30),
      customCta: str(input?.customCta),
      brandVoiceNotes: str(input?.brandVoiceNotes, 2000),
      generateThumbnail: input?.generateThumbnail !== false,
      generateStoryboard: input?.generateStoryboard !== false,
      includeHashtags: input?.includeHashtags !== false,
    },
    auth.user,
  );
}

export async function refreshSocialAction() {
  const auth = await assertPermission("marketing", "view");
  if (!auth.ok) return auth;
  return refreshSocial(auth.user);
}

export async function loadTrendReportAction(reportId) {
  const auth = await assertPermission("marketing", "view");
  if (!auth.ok) return auth;
  const value = id(reportId);
  if (!value) return invalid("Report not found");
  return getTrendReport(value, auth.user);
}

export async function loadVideoScriptAction(scriptId) {
  const auth = await assertPermission("marketing", "view");
  if (!auth.ok) return auth;
  const value = id(scriptId);
  if (!value) return invalid("Script not found");
  return getVideoScript(value, auth.user);
}

function eventInput(input) {
  const title = str(input?.title);
  const start = str(input?.start, 19);
  const end = str(input?.end, 19);
  if (!title || !STAMP.test(start) || !STAMP.test(end) || !str(input?.category, 30)) return { error: "Please fill in all required fields" };
  return { value: { title, start, end, category: str(input?.category, 30), color: str(input?.color, 7), description: str(input?.description, 5000) } };
}

export async function saveCalendarEventAction(eventId, input) {
  const auth = await assertPermission("marketing", eventId ? "edit" : "add");
  if (!auth.ok) return auth;
  const parsed = eventInput(input);
  if (parsed.error) return invalid(parsed.error);
  const key = str(eventId, 100);
  const result = key ? await updateCalendarEvent(key, parsed.value, auth.user) : await createCalendarEvent(parsed.value, auth.user);
  if (result.ok) revalidatePath("/admin/marketing");
  return result;
}

export async function deleteCalendarEventAction(eventId) {
  const auth = await assertPermission("marketing", "delete");
  if (!auth.ok) return auth;
  const key = str(eventId, 100);
  if (!key) return invalid();
  const result = await deleteCalendarEvent(key, auth.user);
  if (result.ok) revalidatePath("/admin/marketing");
  return result;
}

/* ---------- Marketing expenses ---------- */

export async function saveMarketingExpenseAction(expenseId, input) {
  const auth = await assertPermission("marketing.expenses", expenseId ? "edit" : "add");
  if (!auth.ok) return auth;
  const month = str(input?.month, 7);
  const amount = Number(input?.amount);
  const spendDate = str(input?.spendDate, 10);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return invalid("Choose a valid month.");
  if (!str(input?.bucket, 50)) return invalid("Please choose a valid marketing category.");
  if (!Number.isFinite(amount) || amount <= 0) return invalid("Amount must be greater than zero.");
  if (spendDate && !YMD.test(spendDate)) return invalid("Choose a valid spend date.");
  const body = {
    month,
    bucket: str(input?.bucket, 50),
    amount,
    spendDate,
    campaignName: str(input?.campaignName),
    vendorName: str(input?.vendorName),
    invoiceNumber: str(input?.invoiceNumber, 100),
    notes: str(input?.notes, 5000),
  };
  const key = expenseId == null ? null : id(expenseId);
  if (expenseId != null && !key) return invalid();
  const result = key ? await updateMarketingExpense(key, body, auth.user) : await createMarketingExpense(body, auth.user);
  if (result.ok) revalidatePath("/admin/marketing/expenses");
  return result;
}

export async function deleteMarketingExpenseAction(expenseId) {
  const auth = await assertPermission("marketing.expenses", "delete");
  if (!auth.ok) return auth;
  const key = id(expenseId);
  if (!key) return invalid();
  const result = await deleteMarketingExpense(key, auth.user);
  if (result.ok) revalidatePath("/admin/marketing/expenses");
  return result;
}

/* ---------- Engagement panel ---------- */

const ENGAGEMENT_KEYS = ["q", "userType", "type", "date", "sort", "dir", "f_phone", "f_fullname", "f_productName", "f_country", "f_region", "f_city"];

export async function exportEngagementAction(kind, filters) {
  const auth = await assertPermission("marketing.engagement", "view");
  if (!auth.ok) return auth;
  if (!KINDS.includes(kind)) return invalid();
  const query = {};
  for (const key of ENGAGEMENT_KEYS) {
    const value = str(filters?.[key], 120);
    if (value) query[key] = value;
  }
  return exportEngagement(kind, query, auth.user);
}

export async function previewWhatsAppAction(kind, rowId, language) {
  const auth = await assertPermission("marketing.engagement", "view");
  if (!auth.ok) return auth;
  if (!KINDS.includes(kind) || !LANGUAGES.includes(language) || !id(rowId)) return invalid();
  return previewEngagementWhatsApp(kind, id(rowId), language, auth.user);
}

export async function sendWhatsAppAction(kind, rowId, language) {
  const auth = await assertPermission("marketing.engagement", "edit");
  if (!auth.ok) return auth;
  if (!KINDS.includes(kind) || !LANGUAGES.includes(language) || !id(rowId)) return invalid();
  return sendEngagementWhatsApp(kind, id(rowId), language, auth.user);
}

/* ---------- Custom pages / SEO (meta.php) ---------- */

export async function loadSeoPageAction(pageId) {
  const auth = await assertPermission("cms.seo", "view");
  if (!auth.ok) return auth;
  const key = id(pageId);
  if (!key) return invalid("Page not found.");
  return getSeoPage(key, auth.user);
}

export async function saveSeoPageAction(pageId, input) {
  const auth = await assertPermission("cms.seo", pageId ? "edit" : "add");
  if (!auth.ok) return auth;
  const body = {
    pageTitle: str(input?.pageTitle),
    pageHeading: str(input?.pageHeading),
    pageSlug: str(input?.pageSlug, 200),
    metaTags: str(input?.metaTags, 1000),
    metaDescription: str(input?.metaDescription, 2000),
    metaKeywords: str(input?.metaKeywords, 2000),
    canonicalUrl: str(input?.canonicalUrl, 500),
    content: typeof input?.content === "string" ? input.content.slice(0, 2_000_000) : "",
  };
  if (!body.pageTitle) return invalid("Page title is required.");
  if (!body.pageHeading) return invalid("Page heading is required.");
  if (!body.pageSlug) return invalid("Page slug is required.");
  const key = pageId == null ? null : id(pageId);
  if (pageId != null && !key) return invalid();
  const result = key ? await updateSeoPage(key, body, auth.user) : await createSeoPage(body, auth.user);
  if (result.ok) revalidatePath("/admin/cms/seo");
  return result;
}

export async function deleteSeoPageAction(pageId) {
  const auth = await assertPermission("cms.seo", "delete");
  if (!auth.ok) return auth;
  const key = id(pageId);
  if (!key) return invalid();
  const result = await deleteSeoPage(key, auth.user);
  if (result.ok) revalidatePath("/admin/cms/seo");
  return result;
}
