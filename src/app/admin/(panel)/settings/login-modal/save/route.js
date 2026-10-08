import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { saveLoginModal } from "@/lib/services/admin/parity/support-admin";

/*
 * Route handler instead of a server action: server action bodies are capped at
 * 1 MB, and signup_modal_settings.php accepts images up to 10 MB.
 */

const MAX_IMAGE = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const reply = (body, status = 200) => NextResponse.json(body, { status });

export async function POST(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin && host && new URL(origin).host === host);
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) return reply({ ok: false, message: "Invalid request origin." }, 403);

  const gate = await assertPermission("settings.loginModal", "edit");
  if (!gate.ok) return reply({ ok: false, message: gate.message }, gate.user ? 403 : 401);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, message: "Invalid form data." }, 400);
  }
  const title = String(form.get("title") ?? "").trim();
  const subtitle = String(form.get("subtitle") ?? "").trim();
  const fieldErrors = {};
  if (!title) fieldErrors.title = "Modal title is required.";
  else if (title.length > 255) fieldErrors.title = "Modal title must be 255 characters or fewer.";
  if (!subtitle) fieldErrors.subtitle = "Modal subtitle is required.";
  else if (subtitle.length > 255) fieldErrors.subtitle = "Modal subtitle must be 255 characters or fewer.";
  const image = form.get("image");
  if (image && typeof image === "object" && image.size > 0) {
    if (!IMAGE_TYPES.includes(image.type)) fieldErrors.image = "Invalid file type. Only JPG, PNG and WebP are allowed.";
    else if (image.size > MAX_IMAGE) fieldErrors.image = "File size exceeds 10MB limit";
  }
  if (Object.keys(fieldErrors).length) return reply({ ok: false, message: Object.values(fieldErrors)[0], fieldErrors }, 400);

  const result = await saveLoginModal(form, gate.user);
  if (result.ok) revalidatePath("/admin/settings/login-modal");
  return reply(result, result.ok ? 200 : 400);
}
