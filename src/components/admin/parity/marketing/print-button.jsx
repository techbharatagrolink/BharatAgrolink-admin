"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Prints one element (e.g. a report) in its own window, with the page's styles. */
export function printElement(element, title) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win || !element) return false;
  win.document.title = title;
  for (const node of document.querySelectorAll('link[rel="stylesheet"], style')) win.document.head.appendChild(win.document.importNode(node, true));
  win.document.body.className = "bg-white p-8";
  win.document.body.appendChild(win.document.importNode(element, true));
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
  return true;
}

/** The PHP "Export as PDF" buttons: the browser's print-to-PDF of the current page. */
export function PrintButton({ label = "Export as PDF", size = "sm", variant = "primary" }) {
  return (
    <Button variant={variant} size={size} onClick={() => window.print()} className="print:hidden">
      <FileDown className="size-4" aria-hidden />
      {label}
    </Button>
  );
}
