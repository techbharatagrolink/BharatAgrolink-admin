import { Fragment } from "react";
import { cn } from "@/lib/utils";

/*
 * A small Markdown reader for the AI reports (trend reports, video scripts,
 * CEO recommendations). It builds React elements only, so nothing in the
 * report can inject markup.
 */

const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

function inline(text, keyBase) {
  return String(text)
    .split(INLINE)
    .filter((part) => part !== "")
    .map((part, i) => {
      const key = `${keyBase}-${i}`;
      if (/^(\*\*|__).+\1$/.test(part)) return <strong key={key} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
      if (/^`.+`$/.test(part)) return <code key={key} className="rounded bg-surface-muted px-1 py-0.5 text-[12px]">{part.slice(1, -1)}</code>;
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (link) {
        return /^https?:\/\//i.test(link[2]) ? (
          <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
            {link[1]}
          </a>
        ) : (
          <Fragment key={key}>{link[1]}</Fragment>
        );
      }
      if (/^\*[^*].*\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
      return <Fragment key={key}>{part}</Fragment>;
    });
}

const HEADING_CLASSES = ["text-lg font-semibold", "text-base font-semibold", "text-[15px] font-semibold", "text-sm font-semibold"];

function parse(source, numberedHeadings) {
  const lines = String(source ?? "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/^\*\s+/, "")
    .split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].replace(/#+\s*$/, "") });
      i += 1;
      continue;
    }
    const boldHeading = /^\*\*([^*]+)\*\*\s*:?$/.exec(trimmed) || (numberedHeadings && /^\d+\.\s*\*\*([^*]+)\*\*/.exec(trimmed));
    if (boldHeading) {
      blocks.push({ type: "heading", level: 3, text: boldHeading[1].replace(/:\s*$/, "").trim() });
      i += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "rule" });
      i += 1;
      continue;
    }
    if (/^\|.*\|$/.test(trimmed)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }
    if (/^>\s?/.test(trimmed)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    const bullet = /^[-*•+]\s+/;
    const numbered = /^\d+[.)]\s+/;
    if (bullet.test(trimmed) || numbered.test(trimmed)) {
      const ordered = numbered.test(trimmed);
      const pattern = ordered ? numbered : bullet;
      const items = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        if (numberedHeadings && /^\d+\.\s*\*\*[^*]+\*\*/.test(current)) break;
        if (pattern.test(current)) items.push(current.replace(pattern, ""));
        else if (current && /^\s{2,}/.test(lines[i]) && items.length) items[items.length - 1] += ` ${current}`;
        else break;
        i += 1;
      }
      blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }
    const paragraph = [];
    while (i < lines.length) {
      const current = lines[i].trim();
      if (!current || /^(#{1,6}\s|[-*•+]\s|\d+[.)]\s|>|\|)/.test(current) || /^\*\*[^*]+\*\*:?$/.test(current)) break;
      paragraph.push(current);
      i += 1;
    }
    blocks.push({ type: "p", lines: paragraph });
  }
  return blocks;
}

/** `numberedHeadings`: "1. **Immediate Actions:**" is a heading, as the CEO matrix renders it. */
export function Markdown({ source, className, numberedHeadings = false }) {
  const blocks = parse(source, numberedHeadings);
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-ink-soft", className)}>
      {blocks.map((block, b) => {
        const key = `b${b}`;
        if (block.type === "heading") {
          const Tag = `h${Math.min(block.level + 1, 6)}`;
          return (
            <Tag key={key} className={cn("pt-1 text-ink", HEADING_CLASSES[Math.min(block.level, 4) - 1])}>
              {inline(block.text, key)}
            </Tag>
          );
        }
        if (block.type === "rule") return <hr key={key} className="border-line" />;
        if (block.type === "quote") {
          return (
            <blockquote key={key} className="border-l-4 border-brand-200 pl-3 italic">
              {inline(block.text, key)}
            </blockquote>
          );
        }
        if (block.type === "table") {
          const [head, ...body] = block.rows;
          return (
            <div key={key} className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                {head && (
                  <thead>
                    <tr>
                      {head.map((cell, c) => (
                        <th key={c} className="border border-line bg-surface-muted px-2 py-1.5 text-left font-semibold text-ink">
                          {inline(cell, `${key}h${c}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {body.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className="border border-line px-2 py-1.5 align-top">
                          {inline(cell, `${key}r${r}c${c}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type;
          return (
            <Tag key={key} className={cn("space-y-1 pl-5", block.type === "ul" ? "list-disc" : "list-decimal")}>
              {block.items.map((item, n) => (
                <li key={n}>{inline(item, `${key}i${n}`)}</li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={key}>
            {block.lines.map((text, n) => (
              <Fragment key={n}>
                {n > 0 && <br />}
                {inline(text, `${key}l${n}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
