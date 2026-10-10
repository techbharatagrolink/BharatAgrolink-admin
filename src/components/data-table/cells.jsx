"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { StatusDot } from "./status-dot-select";
import { formatDate, formatDateTime, formatINR, formatNumber, formatPercent, maskMobile } from "@/lib/format";
import { cn } from "@/lib/utils";

function hrefToken(value) {
  const text = String(value ?? "");
  // A stored path or absolute URL is already an address. Encoding it turns
  // "/admin/orders/BAO 1" into a relative slug and the card route swallows it.
  if (text.startsWith("/") || /^https?:\/\//i.test(text)) return text;
  return encodeURIComponent(text);
}

export function resolveHref(pattern, row) {
  if (!pattern) return null;
  let missing = false;
  const href = pattern.replace(/\{(\w+)\}/g, (_, key) => {
    const value = row[key];
    if (value == null || value === "") missing = true;
    return hrefToken(value);
  });
  return missing ? null : href;
}

export function formatCellValue(column, row) {
  const value = row[column.key];
  switch (column.type) {
    case "currency":
      return formatINR(value);
    case "number":
      return formatNumber(value);
    case "percent":
      return formatPercent(value);
    case "date":
      return formatDate(value);
    case "datetime":
      return formatDateTime(value);
    case "boolean":
      return value ? "Yes" : "No";
    case "mobile":
      return maskMobile(value);
    case "status":
      return value == null || value === "" ? "—" : (column.labels?.[value] ?? String(value).replace(/_/g, " "));
    case "image":
      return value ? String(value) : "";
    case "lineStatus": {
      const lines = Array.isArray(row.lines) ? row.lines : [];
      const summary = value == null || value === "" ? "" : String(value);
      const detail = lines.map((line) => `${line.productName || "Item"} (${line.invoiceNumber || "no invoice"}): ${line.status}`).join("; ");
      return [summary, detail].filter(Boolean).join(" — ") || "—";
    }
    case "remarks": {
      const list = Array.isArray(value) ? value : [];
      if (!list.length) return "—";
      const body = [...list].reverse().map((item) => `${item.text} (${[item.by || "Unknown", item.at].filter(Boolean).join(", ")})`).join(" | ");
      return list.length > 1 ? `${body} +${list.length - 1}` : body;
    }
    default:
      return value == null || value === "" ? "—" : String(value);
  }
}

function remarkWhen(value) {
  if (!value) return "";
  const normalized = String(value).includes("T") ? String(value) : String(value).replace(" ", "T");
  const formatted = formatDateTime(normalized);
  return formatted === "—" ? String(value) : formatted;
}

function RemarkNote({ item }) {
  const when = remarkWhen(item.at);
  return (
    <div>
      <p className="break-words whitespace-pre-wrap text-ink">{item.text}</p>
      <p className="text-[11px] text-ink-muted">
        {item.by || "Unknown"}
        {when ? ` · ${when}` : ""}
      </p>
    </div>
  );
}

function RemarksCell({ remarks, orderId }) {
  const [open, setOpen] = useState(false);
  const list = Array.isArray(remarks) ? remarks : [];
  if (!list.length) return <span className="text-ink-muted">—</span>;
  const newestFirst = [...list].reverse();
  const latest = newestFirst[0];
  const count = list.length;
  return (
    <>
      <div className="flex w-full min-w-0 items-center gap-1.5">
        <span className="min-w-0 flex-1 truncate" title={latest.text}>
          {latest.text}
        </span>
        <button
          type="button"
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-1.5 text-ink-soft hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30"
          aria-label={count > 1 ? `Show all ${count} remarks` : "Show remark"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
        >
          <MessageSquare className="size-3.5" aria-hidden />
          {count > 1 ? <span className="text-[11px] font-semibold tabular text-brand-700">{count}</span> : null}
        </button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Remarks" description={orderId ? `Order ${orderId}` : "Every note on this order"} size="md">
        <ul className="divide-y divide-line">
          {newestFirst.map((item, index) => (
            <li key={item.id || `${item.at}-${index}`} className="py-3 first:pt-0 last:pb-0">
              <RemarkNote item={item} />
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
}

function LineStatusCell({ row, activeLineId, onPickLine }) {
  const lines = Array.isArray(row.lines) ? row.lines : [];
  if (!lines.length) {
    const status = row.status;
    if (!status) return <span className="text-ink-muted">—</span>;
    return (
      <span className="inline-flex size-6 items-center justify-center" title={String(status)}>
        <StatusDot status={status} />
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {lines.map((line) => {
        const current = line.status || "Placed";
        const label = line.productName || "Item";
        const awb = line.trackingId || "none";
        const active = String(activeLineId) === String(line.id);
        const title = [label, line.invoiceNumber, current, `AWB ${awb}`].filter(Boolean).join(" · ");
        return (
          <button
            key={line.id}
            type="button"
            title={title}
            aria-pressed={active}
            aria-label={`Show ${label}, status ${current}, AWB ${awb}`}
            className={cn("inline-flex size-6 items-center justify-center rounded-full", active && "ring-2 ring-brand-600 ring-offset-1")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onPickLine?.(row.id, line);
            }}
          >
            <StatusDot status={current} />
          </button>
        );
      })}
    </div>
  );
}

export function Cell({ column, row, activeLineId, onPickLine }) {
  const value = row[column.key];
  const sub = column.sub ? row[column.sub] : null;
  let content;
  if (column.type === "lineStatus") content = <LineStatusCell row={row} activeLineId={activeLineId} onPickLine={onPickLine} />;
  else if (column.type === "remarks") content = <RemarksCell remarks={value} orderId={row.id} />;
  else if (column.type === "image")
    content = value ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" loading="lazy" className="h-12 w-auto max-w-[96px] rounded border border-line object-contain" />
    ) : (
      <span className="text-ink-muted">—</span>
    );
  else if (column.type === "link")
    content = value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
        {column.linkLabel || "Open"}
      </a>
    ) : (
      <span className="text-ink-muted">—</span>
    );
  else if (column.type === "status") content = <StatusBadge status={value} label={column.labels?.[value]} />;
  else if (column.type === "boolean") content = <StatusBadge status={Boolean(value)} label={value ? column.trueLabel || "Yes" : column.falseLabel || "No"} />;
  else {
    const text = formatCellValue(column, row);
    const href = resolveHref(column.href, row);
    const external = href && /^https?:\/\//i.test(href);
    content = href ? (
      external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
          {text}
        </a>
      ) : (
        <Link href={href} className="font-medium text-brand-700 hover:underline">
          {text}
        </Link>
      )
    ) : (
      <span className={cn(column.type === "mono" && "font-mono text-[12.5px]", column.emphasis && "font-medium text-ink")}>{text}</span>
    );
  }
  return (
    <div className={cn("min-w-0", column.wrap ? "whitespace-normal" : "truncate")}>
      {content}
      {sub != null && sub !== "" && <div className="truncate text-xs text-ink-muted">{column.subType ? formatCellValue({ type: column.subType, key: column.sub }, row) : String(sub)}</div>}
    </div>
  );
}
