"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Paperclip, SendHorizontal, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { formatPhpDate } from "@/lib/format";
import { ticketMessageAction, updateTicketAction } from "@/lib/actions/admin/workflows";

/* Ticket detail widgets, as PHP support/admin_ticket_details.php. */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PUSHER_SRC = "https://js.pusher.com/8.2/pusher.min.js";
const POLL_MS = 15000;

// A select shows its first option when the stored value is not one of them (as the PHP form did).
const pick = (value, options) => (options.includes(value) ? value : options[0]);

/** The "Admin Controls" box: status + department, saved together like the PHP form. */
export function TicketAdminControls({ id, status, department, statuses, departments }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState({ status: pick(status, statuses), department: pick(department, departments) });
  const [busy, startBusy] = useTransition();

  const save = (event) => {
    event.preventDefault();
    startBusy(async () => {
      const r = await updateTicketAction(id, form);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) router.refresh();
    });
  };

  return (
    <form onSubmit={save} className="mb-5 rounded-lg border border-line bg-surface-muted p-3 shadow-sm">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-brand-700">
        <Settings className="size-4" aria-hidden /> Admin Controls
      </h2>
      <div className="space-y-2">
        <Field label="Status">{({ id: fid }) => <Select id={fid} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={statuses} />}</Field>
        <Field label="Department">{({ id: fid }) => <Select id={fid} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} options={departments} />}</Field>
      </div>
      <Button type="submit" size="sm" className="mt-3 w-full border-transparent bg-ink text-surface hover:bg-ink hover:opacity-90" loading={busy}>
        Update
      </Button>
    </form>
  );
}

let pusherScript = null;

/** Loads the Pusher browser client the PHP page used, once per page. */
function loadPusher() {
  if (window.Pusher) return Promise.resolve(window.Pusher);
  pusherScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PUSHER_SRC;
    script.async = true;
    script.onload = () => (window.Pusher ? resolve(window.Pusher) : reject(new Error("Pusher did not load.")));
    script.onerror = () => {
      pusherScript = null;
      script.remove();
      reject(new Error("Pusher did not load."));
    };
    document.head.appendChild(script);
  });
  return pusherScript;
}

/**
 * Re-reads the ticket whenever a message is posted on its Pusher channel - by
 * this panel, the PHP admin, the website or the seller panel. Without Pusher
 * settings it polls instead, so replies still show up without a reload.
 */
function useLiveTicket(realtime) {
  const router = useRouter();
  const { key, cluster, channel, event } = realtime ?? {};
  useEffect(() => {
    if (!key || !channel) {
      const timer = setInterval(() => {
        if (document.visibilityState === "visible") router.refresh();
      }, POLL_MS);
      return () => clearInterval(timer);
    }
    let pusher = null;
    let cancelled = false;
    loadPusher()
      .then((Pusher) => {
        if (cancelled) return;
        pusher = new Pusher(key, { cluster });
        pusher.subscribe(channel).bind(event || "new-message", () => router.refresh());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      pusher?.disconnect();
    };
  }, [key, cluster, channel, event, router]);
}

function MessageBubble({ message: m, mine }) {
  const bubble = m.internal ? "ml-auto border border-[#ffe69c] bg-[#fff5c4]" : mine ? "ml-auto rounded-tr-none bg-[#d9fdd3]" : "mr-auto rounded-tl-none bg-white";
  return (
    <li className={cn("relative mb-2 w-fit max-w-[85%] rounded-lg px-3 py-2 text-[0.95rem] leading-snug text-[#111b21] shadow-[0_1px_2px_rgba(0,0,0,0.1)]", bubble)}>
      {m.internal && (
        <div className="mb-1 flex items-center gap-1 border-b border-[#ffc107] pb-1 text-xs font-bold text-[#cc9a06]">
          <Lock className="size-3" aria-hidden /> INTERNAL
        </div>
      )}
      {!mine && !m.internal && <span className="mb-0.5 block text-[0.8rem] font-bold text-[#e542a3]">{m.sender}</span>}
      <span className="wrap-break-word whitespace-pre-wrap">{m.message}</span>
      {m.attachmentUrl && (
        <div className="mt-2">
          <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.attachmentUrl} alt="Attachment" loading="lazy" className="mt-1 max-w-[200px] cursor-pointer rounded-md" />
          </a>
        </div>
      )}
      <span className="float-right mt-1.5 ml-2.5 text-[0.7rem] text-[#999]">{formatPhpDate(m.at, "d M Y H:i a")}</span>
    </li>
  );
}

/** The WhatsApp-style chat: header, messages, image attach with preview, internal-note switch, send. */
export function TicketChat({ id, subject, requesterName, messages, viewer, realtime, canReply }) {
  const { notify } = useToast();
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sent, setSent] = useState([]);
  const [busy, startBusy] = useTransition();
  const bodyRef = useRef(null);
  const fileRef = useRef(null);
  useLiveTicket(realtime);

  // Server rows win; a message this tab just sent shows until the refreshed page includes it.
  const known = new Set(messages.map((m) => String(m.id)));
  const shown = [...messages, ...sent.filter((m) => !known.has(String(m.id)))];
  const isMine = (m) => m.senderType === "admin" && viewer?.id != null && String(m.senderId) === String(viewer.id);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const chooseFile = (event) => {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) {
      notify({ message: "Please choose an image.", tone: "error" });
      event.target.value = "";
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      notify({ message: "The image must be 5 MB or smaller.", tone: "error" });
      event.target.value = "";
      return;
    }
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const send = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    const formData = new FormData();
    formData.set("message", text);
    if (internal) formData.set("is_internal", "1");
    if (file) formData.set("image", file);
    startBusy(async () => {
      const r = await ticketMessageAction(id, formData);
      if (!r?.ok) {
        notify({ message: `Error: ${r?.message || "Failed to send message"}`, tone: "error" });
        return;
      }
      setText("");
      clearFile();
      if (r.item) setSent((list) => [...list, r.item]);
    });
  };

  return (
    <section aria-label="Ticket chat" className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-[#efe7dd] shadow-[0_2px_10px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "url('https://ik.imagekit.io/h7mvzndkk/seller.bharatagrolink.com/image.png?updatedAt=1763807199835')" }}>
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-[300px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-30" style={{ backgroundImage: "url('https://ik.imagekit.io/h7mvzndkk/seller.bharatagrolink.com/whatsappbg.png')" }} />

      <header className="relative z-10 flex items-center gap-2 bg-[#008069] px-4 py-2.5 text-white">
        <div className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-white text-[0.8rem] font-bold text-[#008069]">#{id}</div>
        <div className="min-w-0 leading-tight">
          <div className="truncate font-bold">{subject}</div>
          <small className="text-xs opacity-90">{requesterName}</small>
        </div>
      </header>

      <ol ref={bodyRef} className="relative z-10 min-h-0 flex-1 overflow-y-auto p-5" aria-label="Messages" aria-live="polite">
        {shown.map((m) => (
          <MessageBubble key={m.id} message={m} mine={isMine(m)} />
        ))}
      </ol>

      {preview && (
        <div className="absolute inset-x-0 bottom-[70px] z-20 mx-3 rounded border border-[#dee2e6] bg-white p-2 text-[#111b21] shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Selected attachment" className="h-[50px] rounded" />
              <small className="font-bold">Image attached</small>
            </div>
            <button type="button" onClick={clearFile} className="rounded p-1 text-[#54656f] hover:bg-black/5" aria-label="Remove image">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {canReply && (
        <form onSubmit={send} className="relative z-10 flex items-center gap-2 bg-[#f0f2f5] p-2.5">
          <input ref={fileRef} type="file" name="image" accept="image/*" className="hidden" onChange={chooseFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full p-1.5 text-[#54656f] hover:bg-black/5" aria-label="Attach image" title="Attach image">
            <Paperclip className="size-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center rounded-3xl bg-white px-4 py-2">
            <input
              type="text"
              name="message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message..."
              required
              maxLength={4000}
              autoComplete="off"
              aria-label="Message"
              className="w-full border-none bg-transparent py-0.5 text-[#111b21] outline-none placeholder:text-[#8696a0]"
            />
          </div>
          <label title="Internal Note" className="flex cursor-pointer items-center">
            <input type="checkbox" name="is_internal" checked={internal} onChange={(e) => setInternal(e.target.checked)} className="peer sr-only" />
            <span className="sr-only">Internal note</span>
            <span aria-hidden className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#c9ced3] transition-colors peer-checked:bg-[#cc9a06] peer-focus-visible:ring-2 peer-focus-visible:ring-[#008069] peer-focus-visible:ring-offset-1 after:ml-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
          </label>
          <button type="submit" disabled={busy || !text.trim()} className="flex size-[45px] shrink-0 items-center justify-center rounded-full bg-[#008069] text-white shadow transition hover:bg-[#006d5b] disabled:cursor-not-allowed disabled:bg-[#ccc]" aria-label={internal ? "Add internal note" : "Send message"}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <SendHorizontal className="size-5" aria-hidden />}
          </button>
        </form>
      )}
    </section>
  );
}
