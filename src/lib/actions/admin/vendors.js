"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import { lookupVendorIfsc, saveVendorBank, saveVendorKycFiles, verifyVendorBank } from "@/lib/services/admin/people";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 5 * 1024 * 1024;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function fail(error, fallback) {
  if (error instanceof ApiError) return { ok: false, message: error.message };
  return { ok: false, message: fallback };
}

export async function lookupIfscAction(code) {
  const gate = await assertPermission("vendors", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const ifsc = String(code ?? "").trim().toUpperCase();
  if (!IFSC.test(ifsc)) return { ok: false, message: "Please enter a valid IFSC Code (e.g., SBIN0005943)." };
  try {
    return { ok: true, data: await lookupVendorIfsc(ifsc, gate.user) };
  } catch (error) {
    return fail(error, "Could not look up that IFSC code.");
  }
}

export async function saveVendorBankAction(id, input) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  try {
    const data = await saveVendorBank(id, input, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    revalidatePath(`/admin/vendors/${id}/bank`);
    return { ok: true, message: data.message, data };
  } catch (error) {
    return fail(error, "Could not save the bank details.");
  }
}

export async function verifyVendorBankAction(id) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  try {
    const data = await verifyVendorBank(id, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    revalidatePath(`/admin/vendors/${id}/bank`);
    return { ok: true, message: data.message, data };
  } catch (error) {
    return fail(error, "Could not verify the bank account.");
  }
}

export async function saveVendorKycAction(id, formData) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const body = new FormData();
  let count = 0;
  for (const name of ["seller_logo", "pan_card", "aadhar_card", "business_proof"]) {
    const file = formData.get(name);
    if (!file || typeof file !== "object" || !file.size) continue;
    if (!IMAGE_TYPES.includes(file.type)) return { ok: false, message: "Only JPG, PNG or WEBP images are allowed." };
    if (file.size > MAX_IMAGE) return { ok: false, message: "Each image must be 5 MB or smaller." };
    body.append(name, file, file.name || name);
    count += 1;
  }
  if (!count) return { ok: false, message: "Choose a logo, PAN card, Aadhaar card or GST certificate." };
  try {
    const data = await saveVendorKycFiles(id, body, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message, documents: data.documents };
  } catch (error) {
    return fail(error, "Could not save the KYC documents.");
  }
}
