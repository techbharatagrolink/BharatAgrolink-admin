"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import {
  deleteVendorLicenseDocument,
  lookupVendorIfsc,
  reviewVendorLicenseDocument,
  reviewVendorSellerDocument,
  saveVendorBank,
  saveVendorKycFiles,
  uploadVendorLicenseDocument,
  uploadVendorSellerDocument,
  verifyVendorBank,
} from "@/lib/services/admin/people";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const DOCUMENT_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_IMAGE = 5 * 1024 * 1024;
const LICENSE_FIELDS = ["docType", "docName", "docKind", "docNumber", "issuingAuthority", "issueDate", "expiryDate", "remarks"];
const NUMERIC = /^\d+$/;
const DOC_KEY = /^[a-z0-9-]{1,60}$/;
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

/** A document file chosen in the admin: PDF, JPG or PNG up to 5 MB. */
function documentFile(formData) {
  const file = formData.get("file");
  if (!file || typeof file !== "object" || !file.size) return { error: "Choose a file to upload." };
  if (!DOCUMENT_TYPES.includes(file.type)) return { error: "Only PDF, JPG or PNG files are allowed." };
  if (file.size > MAX_IMAGE) return { error: "The file must be 5 MB or smaller." };
  return { file };
}

/** Approve or reject one of the seller panel's documents (the KYC column on sellerlogin). */
export async function reviewVendorSellerDocumentAction(id, column, action, reason = "") {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  if (!["approve", "reject"].includes(action) || !/^company_[a-z0-9_]+$/.test(String(column))) return { ok: false, message: "Unknown document or action." };
  if (action === "reject" && !String(reason).trim()) return { ok: false, message: "Enter the reason for rejecting this document." };
  try {
    const data = await reviewVendorSellerDocument(id, { column, action, reason: String(reason).trim() }, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message };
  } catch (error) {
    return fail(error, "Could not update the document.");
  }
}

/** Upload one of the seller panel's documents for the seller. */
export async function uploadVendorSellerDocumentAction(id, docId, formData) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  if (!DOC_KEY.test(String(docId))) return { ok: false, message: "Unknown document." };
  const { file, error } = documentFile(formData);
  if (error) return { ok: false, message: error };
  const body = new FormData();
  body.append("file", file, file.name || "document");
  try {
    const data = await uploadVendorSellerDocument(id, docId, body, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message };
  } catch (err) {
    return fail(err, "Could not upload the document.");
  }
}

/** Upload a license / extra document for the seller (goes to review as Pending). */
export async function uploadVendorLicenseDocumentAction(id, formData) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const { file, error } = documentFile(formData);
  if (error) return { ok: false, message: error };
  if (!DOC_KEY.test(String(formData.get("docType") ?? ""))) return { ok: false, message: "Choose a document type." };
  const body = new FormData();
  for (const key of LICENSE_FIELDS) {
    const value = formData.get(key);
    if (typeof value === "string") body.append(key, value.trim());
  }
  body.append("file", file, file.name || "document");
  try {
    const data = await uploadVendorLicenseDocument(id, body, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message };
  } catch (err) {
    return fail(err, "Could not upload the document.");
  }
}

export async function reviewVendorLicenseDocumentAction(id, docId, action, reason = "") {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  if (!NUMERIC.test(String(docId)) || !["approve", "reject"].includes(action)) return { ok: false, message: "Unknown document or action." };
  if (action === "reject" && !String(reason).trim()) return { ok: false, message: "Enter the reason for rejecting this document." };
  try {
    const data = await reviewVendorLicenseDocument(id, docId, { action, reason: String(reason).trim() }, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message };
  } catch (error) {
    return fail(error, "Could not update the document.");
  }
}

export async function deleteVendorLicenseDocumentAction(id, docId) {
  const gate = await assertPermission("vendors", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  if (!NUMERIC.test(String(docId))) return { ok: false, message: "Unknown document." };
  try {
    const data = await deleteVendorLicenseDocument(id, docId, gate.user);
    revalidatePath(`/admin/vendors/${id}`);
    return { ok: true, message: data.message };
  } catch (error) {
    return fail(error, "Could not delete the document.");
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
    if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, message: "Only JPG, PNG, WebP images or PDF documents are allowed." };
    if (file.size > MAX_IMAGE) return { ok: false, message: "Each file must be 5 MB or smaller." };
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
