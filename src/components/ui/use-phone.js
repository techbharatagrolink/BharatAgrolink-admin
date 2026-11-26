"use client";

import { useSyncExternalStore } from "react";

const PHONE_QUERY = "(max-width: 639.98px)";

const subscribePhone = (callback) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

/** True on phone-width screens (false while rendering on the server and during hydration). */
export function usePhone() {
  return useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);
}
