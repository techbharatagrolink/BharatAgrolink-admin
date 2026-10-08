"use client";

import { useEffect, useRef, useState } from "react";

const TOOLS = [
  ["bold", "B", "Bold"],
  ["italic", "I", "Italic"],
  ["underline", "U", "Underline"],
  ["insertUnorderedList", "• List", "Bulleted list"],
  ["insertOrderedList", "1. List", "Numbered list"],
];

/** The PHP product page uses CKEditor so full details render as formatted text, with a Source view. */
export function ProductHtmlEditor({ value, onChange }) {
  const ref = useRef(null);
  const [source, setSource] = useState(false);
  const [html, setHtml] = useState(value || "");

  useEffect(() => {
    if (!source && ref.current) ref.current.innerHTML = html;
  }, [source]);

  const publish = (next) => {
    setHtml(next);
    onChange(next);
  };

  const command = (name, arg) => {
    ref.current?.focus();
    document.execCommand(name, false, arg);
    publish(ref.current?.innerHTML || "");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-surface-muted px-2 py-1.5">
        {TOOLS.map(([name, label, title]) => (
          <button key={name} type="button" title={title} className="rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface" onMouseDown={(event) => event.preventDefault()} onClick={() => command(name)}>{label}</button>
        ))}
        <button
          type="button"
          title="Link"
          className="rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) command("createLink", url);
          }}
        >
          Link
        </button>
        <button type="button" className={`ml-auto rounded px-2 py-1 text-xs font-semibold ${source ? "bg-ink text-white" : "text-ink hover:bg-surface"}`} onClick={() => setSource((current) => !current)}>Source</button>
      </div>
      {source ? (
        <textarea className="min-h-72 w-full resize-y bg-surface p-3 font-mono text-xs text-ink outline-none" value={html} onChange={(event) => publish(event.target.value)} />
      ) : (
        <div
          ref={ref}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="Product full details"
          className="min-h-72 px-3 py-2 text-sm text-ink outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1 [&_ul]:list-disc [&_ul]:pl-5"
          onInput={() => publish(ref.current?.innerHTML || "")}
        />
      )}
    </div>
  );
}
