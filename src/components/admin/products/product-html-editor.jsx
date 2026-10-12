"use client";

import { useLayoutEffect, useRef, useState } from "react";

const TOOLS = [
  ["bold", "B", "Bold"],
  ["italic", "I", "Italic"],
  ["underline", "U", "Underline"],
  ["insertUnorderedList", "• List", "Bulleted list"],
  ["insertOrderedList", "1. List", "Numbered list"],
];

const SWATCHES = ["#111827", "#6b7280", "#ffffff", "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#7c3aed", "#db2777"];

const TOOL_CLASS = "shrink-0 rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface";

/** Style and script elements. Attributes (`style=`, `class`) stay in the editable HTML. */
const EMBEDDED_SOURCE = "<style\\b[^>]*>[\\s\\S]*?<\\/style>|<script\\b[^>]*>[\\s\\S]*?<\\/script>";

function embeddedRe() {
  return new RegExp(EMBEDDED_SOURCE, "gi");
}

function placeholder(index) {
  return `<span data-ba-html-embed="${index}" contenteditable="false">\u200b</span>`;
}

/** Pull style/script out of the string contentEditable would drop, leaving the rest intact. */
function toVisual(raw, embedsRef) {
  const blocks = [];
  const body = String(raw ?? "").replace(embeddedRe(), (block) => {
    const index = blocks.length;
    blocks.push(block);
    return placeholder(index);
  });
  embedsRef.current = blocks;
  return body;
}

/** Put the original style/script blocks back. Source mode never calls this. */
function restoreEmbedded(visualHtml, blocks) {
  let result = String(visualHtml ?? "");
  const missing = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const pattern = new RegExp(`<span\\b[^>]*\\bdata-ba-html-embed=(["'])${index}\\1[^>]*>[\\s\\S]*?<\\/span>`, "i");
    if (pattern.test(result)) result = result.replace(pattern, () => blocks[index]);
    else missing.push(blocks[index]);
  }
  return missing.length ? result + missing.join("") : result;
}

function cssFrom(blocks) {
  return blocks
    .map((block) => {
      const match = String(block).match(/^<style\b[^>]*>([\s\S]*)<\/style>$/i);
      return match ? match[1] : "";
    })
    .filter(Boolean)
    .join("\n")
    .replace(/<\/style/gi, "");
}

function cssIn(raw) {
  const blocks = [];
  String(raw ?? "").replace(embeddedRe(), (block) => {
    blocks.push(block);
    return "";
  });
  return cssFrom(blocks);
}

function normalizeColor(color) {
  const value = String(color || "").trim();
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "";
}

/** `foreColor` sometimes writes a `<font color>` tag. Store the same color as a span style. */
function normalizeFontColors(editor) {
  editor.querySelectorAll("font[color]").forEach((font) => {
    const span = document.createElement("span");
    span.style.color = font.getAttribute("color");
    while (font.firstChild) span.appendChild(font.firstChild);
    font.replaceWith(span);
  });
}

function rangeInside(editor, range) {
  try {
    return Boolean(range) && !range.collapsed && editor.contains(range.commonAncestorContainer);
  } catch {
    return false;
  }
}

/** The PHP product page uses CKEditor so full details render as formatted text, with a Source view. */
export function ProductHtmlEditor({ value, onChange, id, describedBy, label = "Product full details" }) {
  const ref = useRef(null);
  const sourceRef = useRef(null);
  const embedsRef = useRef([]);
  const htmlRef = useRef(value || "");
  const savedRange = useRef(null);
  const savedSource = useRef(null);
  const modeRef = useRef(null);
  const painted = useRef(false);
  const [source, setSource] = useState(false);
  const [picked, setPicked] = useState("#111827");
  const html = value || "";
  const previewCss = cssIn(html);

  const publish = (next) => {
    htmlRef.current = next;
    onChange(next);
  };

  useLayoutEffect(() => {
    const next = value || "";
    const external = next !== htmlRef.current;
    const enteredVisual = modeRef.current !== source && !source;
    modeRef.current = source;
    if (external) htmlRef.current = next;
    if (source || !ref.current) return;
    if (!painted.current || external || enteredVisual) {
      ref.current.innerHTML = toVisual(htmlRef.current, embedsRef);
      painted.current = true;
    }
  }, [source, value]);

  const captureSelection = () => {
    if (source) {
      const field = sourceRef.current;
      if (!field || field.selectionStart === field.selectionEnd) return;
      savedSource.current = { start: field.selectionStart, end: field.selectionEnd };
      return;
    }
    const editor = ref.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!rangeInside(editor, range)) return;
    savedRange.current = range.cloneRange();
  };

  const activeRange = (editor) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && rangeInside(editor, selection.getRangeAt(0))) return selection.getRangeAt(0);
    return rangeInside(editor, savedRange.current) ? savedRange.current : null;
  };

  const command = (name, arg) => {
    const editor = ref.current;
    if (!editor || source) return;
    editor.focus();
    const range = savedRange.current;
    if (rangeInside(editor, range)) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      try {
        selection.addRange(range);
      } catch {
        /* The browser already kept the live selection. */
      }
    }
    document.execCommand(name, false, arg);
    publish(restoreEmbedded(editor.innerHTML, embedsRef.current));
  };

  const applyColor = (color) => {
    const hex = normalizeColor(color);
    if (!hex) return;
    if (source) {
      const field = sourceRef.current;
      const saved = savedSource.current;
      const start = saved?.start ?? field?.selectionStart;
      const end = saved?.end ?? field?.selectionEnd;
      if (field == null || start == null || end == null || start === end) return;
      const current = value || "";
      const wrapped = `<span style="color: ${hex}">${current.slice(start, end)}</span>`;
      publish(`${current.slice(0, start)}${wrapped}${current.slice(end)}`);
      savedSource.current = null;
      setPicked(hex);
      return;
    }
    const editor = ref.current;
    const range = editor && activeRange(editor);
    if (!editor || !range) return;
    editor.focus();
    const selection = window.getSelection();
    selection.removeAllRanges();
    try {
      selection.addRange(range);
    } catch {
      return;
    }
    if (!rangeInside(editor, selection.rangeCount ? selection.getRangeAt(0) : null)) return;
    let previous = false;
    try {
      previous = document.queryCommandState("styleWithCSS");
    } catch {
      /* styleWithCSS is unavailable; foreColor still applies a font color. */
    }
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch {
      /* Fall back to the browser's font color markup. */
    }
    const applied = document.execCommand("foreColor", false, hex);
    try {
      document.execCommand("styleWithCSS", false, previous);
    } catch {
      /* Leave the previous command mode unchanged. */
    }
    if (!applied) {
      const span = document.createElement("span");
      span.style.color = hex;
      const live = selection.rangeCount ? selection.getRangeAt(0) : range;
      try {
        live.surroundContents(span);
      } catch {
        span.appendChild(live.extractContents());
        live.insertNode(span);
      }
    }
    normalizeFontColors(editor);
    if (selection.rangeCount && rangeInside(editor, selection.getRangeAt(0))) savedRange.current = selection.getRangeAt(0).cloneRange();
    setPicked(hex);
    publish(restoreEmbedded(editor.innerHTML, embedsRef.current));
  };

  const onPaste = (event) => {
    const pasted = event.clipboardData?.getData("text/html") || "";
    if (!pasted || !embeddedRe().test(pasted)) return;
    event.preventDefault();
    const blocks = embedsRef.current.slice();
    const body = pasted.replace(embeddedRe(), (block) => {
      const index = blocks.length;
      blocks.push(block);
      return placeholder(index);
    });
    embedsRef.current = blocks;
    document.execCommand("insertHTML", false, body);
    publish(restoreEmbedded(ref.current?.innerHTML || "", blocks));
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex w-full min-w-0 max-w-full flex-wrap items-center gap-1 border-b border-line bg-surface-muted px-2 py-1.5">
        {TOOLS.map(([name, text, title]) => (
          <button
            key={name}
            type="button"
            title={title}
            className={TOOL_CLASS}
            onMouseDown={(event) => {
              event.preventDefault();
              captureSelection();
            }}
            onClick={() => command(name)}
          >
            {text}
          </button>
        ))}
        <button
          type="button"
          title="Link"
          className={TOOL_CLASS}
          onMouseDown={(event) => {
            event.preventDefault();
            captureSelection();
          }}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) command("createLink", url);
          }}
        >
          Link
        </button>
        <button type="button" className={`ml-auto shrink-0 rounded px-2 py-1 text-xs font-semibold max-sm:ml-0 ${source ? "bg-ink text-white" : "text-ink hover:bg-surface"}`} onClick={() => setSource((current) => !current)}>
          Source
        </button>
        <div className="flex basis-full flex-wrap items-center gap-1 border-t border-line pt-1">
          <span className="inline-flex shrink-0 items-center gap-1 px-1 text-xs font-semibold text-ink">
            <span className="inline-flex flex-col items-center leading-none" aria-hidden>
              A
              <span className="mt-0.5 h-0.5 w-3 rounded-sm" style={{ backgroundColor: picked }} />
            </span>
            Text color
          </span>
          {SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={`Text color ${color}`}
              className="size-5 shrink-0 rounded border border-line"
              style={{ backgroundColor: color }}
              onMouseDown={(event) => {
                event.preventDefault();
                captureSelection();
              }}
              onClick={() => applyColor(color)}
            />
          ))}
          <label className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
            Custom
            <input
              type="color"
              aria-label="Custom text color"
              className="h-5 w-7 cursor-pointer border-0 bg-transparent p-0"
              value={normalizeColor(picked) || "#111827"}
              onPointerDown={captureSelection}
              onChange={(event) => applyColor(event.target.value)}
            />
          </label>
        </div>
      </div>
      {source ? (
        <textarea
          ref={sourceRef}
          id={id}
          aria-label={label}
          aria-describedby={describedBy}
          className="min-h-72 w-full max-w-full resize-y bg-surface p-3 font-mono text-xs break-words text-ink outline-none"
          value={html}
          onChange={(event) => publish(event.target.value)}
        />
      ) : (
        <>
          {previewCss ? <style>{`@scope ([data-product-html-visual]) {\n${previewCss}\n}`}</style> : null}
          <div
            ref={ref}
            id={id}
            data-product-html-visual=""
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label={label}
            aria-describedby={describedBy}
            className="min-h-72 max-w-full overflow-x-auto break-words px-3 py-2 text-sm text-ink outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1 [&_ul]:list-disc [&_ul]:pl-5"
            onInput={(event) => {
              if (!event.nativeEvent.isTrusted) return;
              publish(restoreEmbedded(ref.current?.innerHTML || "", embedsRef.current));
            }}
            onPaste={onPaste}
          />
        </>
      )}
    </div>
  );
}
