"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { calculateCost, checkPincode, checkServiceability, createPickupAddress, exportAllAgents, exportDelivered, exportOverall } from "@/lib/services/admin/parity/ops";
import { deliveredQuery } from "@/components/admin/parity/ops/delivered-config";

const invalid = (message = "Invalid request.") => ({ ok: false, message });
const str = (v, max = 120) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const PINCODE = /^\d{6}$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

function shipmentInput(input) {
  const pickupPincode = str(input?.pickupPincode, 6);
  const deliveryPincode = str(input?.deliveryPincode, 6);
  const weightKg = Number(input?.weightKg);
  const codAmount = input?.codAmount === "" || input?.codAmount == null ? 0 : Number(input.codAmount);
  if (!PINCODE.test(pickupPincode) || !PINCODE.test(deliveryPincode)) return { error: "Pickup and delivery pincodes must be 6 digits." };
  if (!Number.isFinite(weightKg) || weightKg < 0.1 || weightKg > 1000) return { error: "Weight must be between 0.1 and 1000 kg." };
  if (!Number.isFinite(codAmount) || codAmount < 0) return { error: "COD amount must be zero or more." };
  return { value: { pickupPincode, deliveryPincode, weightKg, codAmount } };
}

export async function serviceabilityAction(input) {
  const auth = await assertPermission("shipping.delhiveryPincodes", "view");
  if (!auth.ok) return auth;
  const parsed = shipmentInput(input);
  if (parsed.error) return invalid(parsed.error);
  return checkServiceability(parsed.value, auth.user);
}

export async function pincodeAction(pincode) {
  const auth = await assertPermission("shipping.delhiveryPincodes", "view");
  if (!auth.ok) return auth;
  const value = str(pincode, 6);
  if (!PINCODE.test(value)) return invalid("Pincode must be 6 digits.");
  return checkPincode(value, auth.user);
}

export async function shippingCostAction(input) {
  const auth = await assertPermission("shipping.delhiveryPincodes", "view");
  if (!auth.ok) return auth;
  const parsed = shipmentInput(input);
  if (parsed.error) return invalid(parsed.error);
  return calculateCost(parsed.value, auth.user);
}

const ADDRESS_FIELDS = { pickupLocation: 36, name: 100, email: 100, phone: 12, address: 80, address2: 80, city: 60, state: 60, country: 60, pinCode: 6, lat: 20, long: 20, addressType: 10, vendorName: 100, gstin: 15 };
const REQUIRED = ["pickupLocation", "name", "email", "phone", "address", "city", "state", "country", "pinCode"];

export async function createPickupAddressAction(input) {
  const auth = await assertPermission("shipping.pickupAddresses", "add");
  if (!auth.ok) return auth;
  const value = {};
  for (const [key, max] of Object.entries(ADDRESS_FIELDS)) {
    const v = str(input?.[key], max);
    if (v) value[key] = v;
  }
  const missing = REQUIRED.filter((key) => !value[key]);
  if (missing.length) return invalid("Please fill all required fields.");
  if (!/^\S+@\S+\.\S+$/.test(value.email)) return invalid("Enter a valid email address.");
  if (!/^\d{10,12}$/.test(value.phone)) return invalid("Phone must be 10 to 12 digits.");
  if (!PINCODE.test(value.pinCode)) return invalid("Pin code must be 6 digits.");
  if (value.addressType && value.addressType !== "vendor") return invalid("Unknown address type.");
  const result = await createPickupAddress(value, auth.user);
  if (result.ok) revalidatePath("/admin/shipping/pickup-addresses");
  return result;
}

export async function exportDeliveredAction(params) {
  const auth = await assertPermission("orders.delivered", "view");
  if (!auth.ok) return auth;
  const { page: _page, perPage: _perPage, ...query } = deliveredQuery(params);
  return exportDelivered(query, auth.user);
}

function range(input) {
  const from = str(input?.from, 10);
  const to = str(input?.to, 10);
  if ((from && !YMD.test(from)) || (to && !YMD.test(to))) return null;
  return { from, to };
}

export async function exportOverallAction(input) {
  const auth = await assertPermission("operations.overall", "view");
  if (!auth.ok) return auth;
  const value = range(input);
  if (!value) return invalid("Dates must be YYYY-MM-DD.");
  return exportOverall(value, auth.user);
}

export async function exportAllAgentsAction(input) {
  const auth = await assertPermission("operations.overall", "view");
  if (!auth.ok) return auth;
  const value = range(input);
  if (!value) return invalid("Dates must be YYYY-MM-DD.");
  return exportAllAgents(value, auth.user);
}
