"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { searchB2bCatalogueBuyers, sendB2bCatalogue } from "@/lib/actions/admin/b2b-catalog-generator";

/*
 * "Send on WhatsApp" (b2b_orders/js/catalog_send.js). The catalogue has no
 * server-side PDF: the frame's pages are rasterised with html2canvas into an
 * A4 jsPDF, uploaded to R2 by the API, and handed to the buyer as a wa.me link.
 */

const CDN_HTML2CANVAS = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
const CDN_JSPDF = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const A4_W = 210;
const A4_H = 297;
const IMAGE_ROUTE = "/admin/b2b/catalog/generate/image";

function loadScript(win, src) {
  const doc = win.document;
  return new Promise((resolve, reject) => {
    if (doc.querySelector(`script[data-src="${src}"]`)) return resolve();
    const s = doc.createElement("script");
    s.src = src;
    s.setAttribute("data-src", src);
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load " + src));
    doc.head.appendChild(s);
  });
}

/** Routes cross-origin images through the same-origin proxy so the canvas is not tainted. Returns a restore function. */
function proxyImages(win, root) {
  const swapped = [];
  root.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (!/^https?:\/\//i.test(src)) return;
    if (src.indexOf(win.location.origin) === 0) return;
    swapped.push([img, src]);
    img.setAttribute("crossorigin", "anonymous");
    img.setAttribute("src", `${IMAGE_ROUTE}?u=${encodeURIComponent(src)}`);
  });
  const waits = swapped.map(([img]) => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
      win.setTimeout(resolve, 15000);
    });
  });
  return Promise.all(waits).then(() => () => {
    swapped.forEach(([img, src]) => {
      img.removeAttribute("crossorigin");
      img.setAttribute("src", src);
    });
  });
}

/** Rasterises every catalogue page into one A4 PDF blob, one page at a time. */
export async function buildCataloguePdf(win, onProgress) {
  const doc = win.document;
  const pages = Array.from(doc.querySelectorAll("#catalogPreview .catalog-page"));
  if (!pages.length) throw new Error("Nothing to send - the catalogue preview is empty.");
  const root = doc.getElementById("catalogPreview");
  const zoom = doc.documentElement.style.getPropertyValue("--cg-zoom");
  doc.documentElement.style.setProperty("--cg-zoom", "1");
  let restore = null;
  try {
    restore = await proxyImages(win, root);
    await loadScript(win, CDN_HTML2CANVAS);
    await loadScript(win, CDN_JSPDF);
    const JsPDF = (win.jspdf && win.jspdf.jsPDF) || win.jsPDF;
    if (!JsPDF) throw new Error("PDF library failed to load.");
    const pdf = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    for (let i = 0; i < pages.length; i++) {
      onProgress(i + 1, pages.length);
      const canvas = await win.html2canvas(pages[i], { scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff", logging: false });
      const img = canvas.toDataURL("image/jpeg", 0.85);
      if (i > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, 0, A4_W, A4_H, undefined, "FAST");
    }
    return pdf.output("blob");
  } finally {
    restore?.();
    doc.documentElement.style.setProperty("--cg-zoom", zoom || "1");
  }
}

export function CatalogueSendDialog({ open, onClose, getFrameWindow, notify }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const close = () => {
    if (busy) return;
    setQ("");
    setResults(null);
    setStatus("");
    onClose();
  };

  const onSearch = (value) => {
    setQ(value);
    clearTimeout(timer.current);
    const term = value.trim();
    if (term.length < 2) {
      setResults(null);
      return;
    }
    timer.current = setTimeout(async () => {
      const res = await searchB2bCatalogueBuyers(term);
      setResults(res.ok ? res.buyers : { error: res.message || "Search failed." });
    }, 250);
  };

  const sendTo = async (buyer) => {
    if (!buyer.phone) {
      notify({ tone: "error", message: "That buyer has no mobile number on record." });
      return;
    }
    // Opened inside the click, or the browser blocks it as a popup once the async work finishes.
    const chatWin = window.open("", "_blank");
    setBusy(true);
    setResults(null);
    setStatus("Preparing the catalogue…");
    try {
      const win = getFrameWindow();
      if (!win) throw new Error("Nothing to send - the catalogue preview is empty.");
      const blob = await buildCataloguePdf(win, (done, total) => setStatus(`Rendering page ${done} of ${total}…`));
      setStatus(`Uploading (${Math.round(blob.size / 1024)} KB)…`);
      const fd = new FormData();
      fd.append("pdf", new File([blob], "catalogue.pdf", { type: "application/pdf" }));
      fd.append("buyer_phone", buyer.phone);
      fd.append("buyer_name", buyer.name);
      const res = await sendB2bCatalogue(fd);
      if (!res.ok || !res.waLink) throw new Error(res.message || "Could not publish the catalogue.");
      setStatus("Opening WhatsApp…");
      if (chatWin) chatWin.location = res.waLink;
      else window.location.href = res.waLink;
      setTimeout(() => {
        setBusy(false);
        setStatus("");
        setQ("");
        onClose();
      }, 600);
    } catch (err) {
      chatWin?.close();
      setBusy(false);
      setStatus("");
      notify({ tone: "error", message: err.message || "Could not send the catalogue." });
    }
  };

  return (
    <Dialog open={open} onClose={close} title="Send catalogue on WhatsApp" description="Search a buyer by name, mobile, email or pincode." size="md">
      <div className="space-y-3">
        <Input type="search" value={q} onChange={(e) => onSearch(e.target.value)} placeholder="Type at least 2 characters…" autoComplete="off" disabled={busy} aria-label="Search buyers" />
        {Array.isArray(results) && results.length === 0 && <p className="py-3 text-sm text-ink-muted">No buyer matched that.</p>}
        {results?.error && <p className="py-3 text-sm text-ink-muted">{results.error}</p>}
        {Array.isArray(results) && results.length > 0 && (
          <ul className="max-h-[380px] overflow-y-auto">
            {results.map((buyer) => (
              <li key={buyer.id}>
                <button type="button" onClick={() => sendTo(buyer)} className="block w-full rounded-lg px-2.5 py-2 text-left hover:bg-surface-muted">
                  <span className="block text-sm font-semibold text-ink">{buyer.name}</span>
                  <span className="mt-px block text-xs text-ink-muted">{buyer.sub || buyer.phone}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {status && <p className="rounded-lg bg-success-bg px-3 py-2 text-sm text-success-ink" role="status">{status}</p>}
      </div>
    </Dialog>
  );
}
