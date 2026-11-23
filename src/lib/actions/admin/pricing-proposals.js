"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import {
  createProposal,
  getProposalOptions,
  previewProposal,
  replyToClarification,
  searchProposalProducts,
  withdrawProposal,
} from "@/lib/services/admin/pricing-proposals";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const denied = { ok: false, message: "You do not have permission to do this." };
const PRODUCT_PAGE = "manage_product.php";

async function admin(action) {
  const user = await getCurrentAdmin();
  if (!user) return { error: expired };
  if (!canPage(user, PRODUCT_PAGE, action)) return { error: denied };
  return { user };
}

export async function searchProposalProductsAction(q) {
  const { user, error } = await admin("view");
  if (error) return { ...error, products: [] };
  const term = String(q ?? "").trim();
  if (term.length < 2) return { ok: true, products: [] };
  return searchProposalProducts(term, user);
}

export async function loadProposalOptionsAction(productId) {
  const { user, error } = await admin("view");
  if (error) return error;
  const id = String(productId ?? "").trim();
  if (!id) return { ok: false, message: "Enter a product ID." };
  return getProposalOptions(id, user);
}

export async function previewProposalAction(body) {
  const { user, error } = await admin("view");
  if (error) return error;
  return previewProposal(body, user);
}

export async function createProposalAction(body) {
  const { user, error } = await admin("edit");
  if (error) return error;
  const result = await createProposal(body, user);
  if (result.ok) revalidatePath("/admin/pricing/proposals");
  return result;
}

export async function withdrawProposalAction(id, reason) {
  const { user, error } = await admin("edit");
  if (error) return error;
  const trimmed = String(reason ?? "").trim().slice(0, 500);
  if (trimmed.length < 3) return { ok: false, message: "Enter the reason for withdrawing." };
  const result = await withdrawProposal(id, trimmed, user);
  if (result.ok) {
    revalidatePath("/admin/pricing/proposals");
    revalidatePath(`/admin/pricing/proposals/${id}`);
  }
  return result;
}

export async function replyToClarificationAction(proposalId, itemId, reply) {
  const { user, error } = await admin("edit");
  if (error) return error;
  const trimmed = String(reply ?? "").trim().slice(0, 1000);
  if (trimmed.length < 2) return { ok: false, message: "Write the answer." };
  const result = await replyToClarification(itemId, trimmed, user);
  if (result.ok) revalidatePath(`/admin/pricing/proposals/${proposalId}`);
  return result;
}
