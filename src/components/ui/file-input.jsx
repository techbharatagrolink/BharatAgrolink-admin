"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { FileImage, FileSpreadsheet, FileText, File as FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Friendly replacement for <input type="file">. A real file input stays inside (visually hidden), and
 * every prop given to FileInput — name, accept, multiple, required, disabled, onChange, id, ref,
 * aria-* — goes onto it, so forms that read the field by name and handlers that read
 * e.target.files keep working exactly as before. On top it adds: a clear "click or drag" area, the
 * allowed types and size in plain words, the chosen files with size (and a thumbnail for images),
 * remove buttons, and drag & drop.
 *
 *   hint      extra line under the allowed types (optional)
 *   maxBytes  shown as "up to N MB"; larger files get a warning (the form's own checks still apply)
 *   preview   image thumbnails (default true; pass false where the screen shows its own preview)
 */

const TYPE_NAMES = {
  "image/jpeg": "JPG",
  "image/jpg": "JPG",
  ".jpg": "JPG",
  ".jpeg": "JPG",
  "image/png": "PNG",
  ".png": "PNG",
  "image/webp": "WEBP",
  ".webp": "WEBP",
  "image/gif": "GIF",
  ".gif": "GIF",
  "image/*": "Images",
  "application/pdf": "PDF",
  ".pdf": "PDF",
  "text/csv": "CSV",
  ".csv": "CSV",
  ".xlsx": "Excel (XLSX)",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel (XLSX)",
  ".xls": "Excel (XLS)",
};

function describeAccept(accept) {
  if (!accept) return "Any file type";
  const names = [...new Set(accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).map((t) => TYPE_NAMES[t] || t.replace(/^\./, "").toUpperCase()))];
  if (names.length <= 1) return names[0] || "Any file type";
  return `${names.slice(0, -1).join(", ")} or ${names.at(-1)}`;
}

function accepts(accept, file) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return accept.split(",").some((raw) => {
    const t = raw.trim().toLowerCase();
    if (!t) return false;
    if (t.startsWith(".")) return name.endsWith(t);
    if (t.endsWith("/*")) return type.startsWith(t.slice(0, -1));
    return type === t;
  });
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const iconFor = (file) => {
  const type = file.type || "";
  if (type.startsWith("image/")) return FileImage;
  if (/csv|sheet|excel/.test(type) || /\.(csv|xlsx?)$/i.test(file.name)) return FileSpreadsheet;
  if (type === "application/pdf" || /\.pdf$/i.test(file.name)) return FileText;
  return FileIcon;
};

export function FileInput({ id: idProp, ref: refProp, accept, multiple = false, disabled = false, hint, maxBytes, preview = true, className, "aria-invalid": ariaInvalid, ...inputProps }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [unreadable, setUnreadable] = useState(() => new Set()); // previews the browser can't draw
  const [dropError, setDropError] = useState("");

  // Mirror the input's own FileList (the source of truth).
  const sync = useCallback(() => {
    const list = Array.from(inputRef.current?.files ?? []);
    setFiles((current) => (current.length === list.length && current.every((f, i) => f === list[i]) ? current : list));
  }, []);

  const setRefs = useCallback(
    (node) => {
      inputRef.current = node;
      // Screens may clear the field in code (ref.current.value = "") — no change event fires for that,
      // so watch this one element's value setter and refresh the list when it is written.
      if (node && !node.__baWatched) {
        const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        Object.defineProperty(node, "value", {
          configurable: true,
          get() {
            return desc.get.call(this);
          },
          set(v) {
            desc.set.call(this, v);
            queueMicrotask(sync);
          },
        });
        node.__baWatched = true;
      }
      if (typeof refProp === "function") refProp(node);
      else if (refProp) refProp.current = node;
    },
    [refProp, sync],
  );
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => setTimeout(sync, 0);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [sync]);

  // Thumbnails for chosen images; the object URLs are released when the selection changes.
  const urls = useMemo(() => (preview ? files.map((f) => (f.type?.startsWith("image/") ? URL.createObjectURL(f) : null)) : []), [files, preview]);
  useEffect(() => () => urls.forEach((u) => u && URL.revokeObjectURL(u)), [urls]);

  // Put files on the real input and fire "change", so React onChange handlers run as for a normal pick.
  const assign = (list) => {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(event.dataTransfer?.files ?? []);
    if (!dropped.length) return;
    const ok = dropped.filter((f) => accepts(accept, f));
    if (!ok.length) {
      setDropError(`That file type isn't allowed here. Use ${describeAccept(accept)}.`);
      return;
    }
    setDropError(ok.length < dropped.length ? `${dropped.length - ok.length} file(s) skipped — only ${describeAccept(accept)} allowed.` : "");
    assign(multiple ? ok : ok.slice(0, 1));
  };

  const remove = (index) => {
    setDropError("");
    if (files.length <= 1) {
      inputRef.current.value = "";
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    } else assign(files.filter((_, i) => i !== index));
  };

  const types = describeAccept(accept);
  const limit = maxBytes ? `up to ${formatBytes(maxBytes)}${multiple ? " each" : ""}` : "";
  const has = files.length > 0;
  const invalid = ariaInvalid === true || ariaInvalid === "true";

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "group relative flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-surface px-4 transition-colors",
          has ? "py-2.5" : "py-4",
          dragging ? "border-brand-600 bg-brand-50" : invalid ? "border-danger bg-danger-bg/40" : "border-line-strong hover:border-brand-600 hover:bg-brand-50/50",
          "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand-600/30",
          disabled && "pointer-events-none cursor-not-allowed opacity-55",
        )}
      >
        <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100", has ? "size-8" : "size-10")}>
          <UploadCloud className={has ? "size-4" : "size-5"} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-sm text-ink">
            <span className="font-semibold text-brand-700">{has ? (multiple ? "Choose different files" : "Replace file") : multiple ? "Click to choose files" : "Click to choose a file"}</span>
            <span className="text-ink-soft"> or drag {multiple ? "them" : "it"} here</span>
          </span>
          <span className="block text-xs text-ink-muted">
            {types}
            {limit && ` · ${limit}`}
            {multiple && !has && " · you can pick several"}
          </span>
          {hint && <span className="mt-0.5 block text-xs text-ink-muted">{hint}</span>}
        </span>
        <input
          {...inputProps}
          ref={setRefs}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className="sr-only"
          onChange={(e) => {
            setDropError("");
            sync();
            inputProps.onChange?.(e);
          }}
        />
      </label>

      {dropError && (
        <p className="text-xs text-danger-ink" role="alert">
          {dropError}
        </p>
      )}

      {has && (
        <ul className="space-y-1.5" aria-live="polite" aria-label="Chosen files">
          {files.map((file, i) => {
            const Icon = iconFor(file);
            const tooBig = maxBytes && file.size > maxBytes;
            return (
              <li key={`${file.name}-${file.size}-${i}`} className={cn("flex min-w-0 items-center gap-3 rounded-lg border bg-surface px-2.5 py-2", tooBig ? "border-warning-ink/40 bg-warning-bg/40" : "border-line")}>
                {preview && urls[i] && !unreadable.has(urls[i]) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[i]}
                    alt=""
                    className="size-10 shrink-0 rounded-md border border-line object-cover"
                    onError={() => setUnreadable((s) => new Set(s).add(urls[i]))}
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-neutral-bg text-ink-muted">
                    <Icon className="size-5" aria-hidden />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink" title={file.name}>
                    {file.name}
                  </span>
                  <span className={cn("block text-xs", tooBig ? "font-medium text-warning-ink" : "text-ink-muted")}>
                    {formatBytes(file.size)}
                    {tooBig && ` · larger than ${formatBytes(maxBytes)}, it may be rejected`}
                  </span>
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-bg hover:text-danger-ink"
                    aria-label={`Remove ${file.name}`}
                    title="Remove"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
