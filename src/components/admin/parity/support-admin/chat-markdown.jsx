import Image from "next/image";

/*
 * Small markdown renderer for chatbot messages (chat_logs.php renders them with
 * marked, gfm + breaks). Builds React elements only, so message text is never
 * injected as HTML; links allow http(s)/mailto/tel and images allow http(s).
 */

const SAFE_LINK = /^(https?:|mailto:|tel:)/i;
const SAFE_IMAGE = /^https?:\/\//i;
const INLINE =
  /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|`([^`]+)`|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*([^*\s](?:[^*]*[^*\s])?)\*|(?<![\w])_([^_\s](?:[^_]*[^_\s])?)_(?![\w])|(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g;
const LIST_ITEM = /^\s{0,3}([-*+]|\d{1,9}[.)])\s+(.*)$/;
const FENCE = /^\s{0,3}(```|~~~)/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>/;
const TABLE_RULE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

function inline(text, onImage, prefix) {
  const out = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${prefix}-${n++}`;
    if (m[2] !== undefined) {
      out.push(
        SAFE_IMAGE.test(m[2]) ? (
          <button key={key} type="button" onClick={() => onImage?.(m[2])} className="my-1.5 block cursor-zoom-in overflow-hidden rounded-lg border border-line" aria-label={m[1] ? `Expand image: ${m[1]}` : "Expand image"}>
            <Image src={m[2]} alt={m[1] || ""} width={240} height={180} unoptimized className="h-auto max-h-48 w-auto max-w-full object-contain" />
          </button>
        ) : (
          m[1]
        ),
      );
    } else if (m[4] !== undefined) {
      const label = inline(m[3], onImage, key);
      out.push(
        SAFE_LINK.test(m[4]) ? (
          <a key={key} href={m[4]} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline">
            {label}
          </a>
        ) : (
          <span key={key}>{label}</span>
        ),
      );
    } else if (m[5] !== undefined) {
      out.push(
        <code key={key} className="rounded bg-neutral-bg px-1 font-mono text-[12px]">
          {m[5]}
        </code>,
      );
    } else if (m[6] !== undefined || m[7] !== undefined) {
      out.push(<strong key={key}>{inline(m[6] ?? m[7], onImage, key)}</strong>);
    } else if (m[8] !== undefined) {
      out.push(<del key={key}>{inline(m[8], onImage, key)}</del>);
    } else if (m[9] !== undefined || m[10] !== undefined) {
      out.push(<em key={key}>{inline(m[9] ?? m[10], onImage, key)}</em>);
    } else if (m[11] !== undefined) {
      out.push(
        <a key={key} href={m[11]} target="_blank" rel="noopener noreferrer" className="break-all text-brand-700 underline">
          {m[11]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Lines joined with <br>, the `breaks: true` behaviour. */
function lines(list, onImage, prefix) {
  return list.flatMap((line, i) => [i ? <br key={`${prefix}-br${i}`} /> : null, ...inline(line.trim(), onImage, `${prefix}-${i}`)]);
}

const cells = (line) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

const isTable = (all, i) => all[i].includes("|") && i + 1 < all.length && TABLE_RULE.test(all[i + 1]) && all[i + 1].includes("-");
const startsBlock = (all, i) => FENCE.test(all[i]) || HEADING.test(all[i]) || RULE.test(all[i]) || QUOTE.test(all[i]) || LIST_ITEM.test(all[i]) || isTable(all, i);

function parse(source) {
  const all = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < all.length) {
    const line = all[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (FENCE.test(line)) {
      const code = [];
      i++;
      while (i < all.length && !FENCE.test(all[i])) code.push(all[i++]);
      i++;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }
    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (RULE.test(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }
    if (QUOTE.test(line)) {
      const quoted = [];
      while (i < all.length && QUOTE.test(all[i])) quoted.push(all[i++].replace(/^\s{0,3}>\s?/, ""));
      blocks.push({ type: "quote", children: parse(quoted.join("\n")) });
      continue;
    }
    if (isTable(all, i)) {
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < all.length && all[i].trim() && all[i].includes("|")) rows.push(cells(all[i++]));
      blocks.push({ type: "table", head, rows });
      continue;
    }
    const first = line.match(LIST_ITEM);
    if (first) {
      const ordered = /\d/.test(first[1]);
      const items = [];
      while (i < all.length) {
        const m = all[i].match(LIST_ITEM);
        if (!m || /\d/.test(m[1]) !== ordered) break;
        const body = [m[2]];
        i++;
        while (i < all.length && all[i].trim() && /^\s/.test(all[i]) && !LIST_ITEM.test(all[i])) body.push(all[i++]);
        items.push(body);
        let j = i;
        while (j < all.length && !all[j].trim()) j++;
        const next = j < all.length ? all[j].match(LIST_ITEM) : null;
        if (j > i && next && /\d/.test(next[1]) === ordered) i = j;
      }
      blocks.push({ type: "list", ordered, start: ordered ? Number.parseInt(first[1], 10) : undefined, items });
      continue;
    }
    const para = [all[i++]];
    while (i < all.length && all[i].trim() && !startsBlock(all, i)) para.push(all[i++]);
    blocks.push({ type: "paragraph", lines: para });
  }
  return blocks;
}

const HEADING_CLASS = ["text-lg font-semibold", "text-base font-semibold", "text-[15px] font-semibold", "text-sm font-semibold", "text-sm font-semibold", "text-sm font-semibold"];

function render(blocks, onImage, prefix) {
  return blocks.map((block, b) => {
    const key = `${prefix}${b}`;
    switch (block.type) {
      case "code":
        return (
          <pre key={key} className="overflow-x-auto rounded-lg bg-neutral-bg p-2.5 font-mono text-[12px]">
            {block.text}
          </pre>
        );
      case "heading": {
        const Tag = `h${block.level}`;
        return (
          <Tag key={key} className={HEADING_CLASS[block.level - 1]}>
            {inline(block.text, onImage, key)}
          </Tag>
        );
      }
      case "rule":
        return <hr key={key} className="border-line" />;
      case "quote":
        return (
          <blockquote key={key} className="space-y-2 border-l-2 border-line-strong pl-3 text-ink-muted">
            {render(block.children, onImage, `${key}q`)}
          </blockquote>
        );
      case "table":
        return (
          <div key={key} className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {block.head.map((cell, c) => (
                    <th key={c} className="border border-line bg-surface-muted px-2 py-1 text-left font-semibold">
                      {inline(cell, onImage, `${key}h${c}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="border border-line px-2 py-1">
                        {inline(cell, onImage, `${key}r${r}c${c}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "list": {
        const Tag = block.ordered ? "ol" : "ul";
        return (
          <Tag key={key} start={block.start} className={block.ordered ? "list-decimal space-y-1.5 pl-5" : "list-disc space-y-1.5 pl-5"}>
            {block.items.map((item, n) => (
              <li key={n}>{lines(item, onImage, `${key}i${n}`)}</li>
            ))}
          </Tag>
        );
      }
      default:
        return <p key={key}>{lines(block.lines, onImage, key)}</p>;
    }
  });
}

/** Renders one chat message; `onImage(src)` is called when an image is clicked. */
export function ChatMarkdown({ text, onImage }) {
  if (!text) return <p className="text-ink-muted">—</p>;
  return <div className="space-y-2 break-words">{render(parse(String(text)), onImage, "b")}</div>;
}
