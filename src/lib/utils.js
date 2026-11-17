import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The typography tokens (text-page-title, text-section, … see globals.css) are font sizes. Registered
// here so tailwind-merge doesn't mistake them for text colours and drop either the size or the colour.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["page-title", "section", "subheading", "body", "small", "table", "label", "micro", "button", "field"] }],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toArray(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

