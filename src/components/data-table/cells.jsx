"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/form";
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

function RemarksCell({ remarks }) {
  const list = Array.isArray(remarks) ? remarks : [];
  if (!list.length) return <span className="text-ink-muted">—</span>;
  const [latest, ...older] = [...list].reverse();
  return (
    <div className="space-y-2 whitespace-normal">
      <RemarkNote item={latest} />
      {older.length > 0 && <p className="text-[11px] font-semibold text-brand-700">+{older.length}</p>}
      {older.map((item) => (
        <RemarkNote key={item.id} item={item} />
      ))}
    </div>
  );
}

function LineStatusCell({ row, options, onLineStatus }) {
  const [draft, setDraft] = useState(null);
  const [running, startRunning] = useTransition();
  const lines = Array.isArray(row.lines) ? row.lines : [];
  const canonical = Array.isArray(options) ? options : [];

  const save = () => {
    if (!draft || !onLineStatus) return;
    startRunning(async () => {
      await onLineStatus(row.id, draft.invoiceNumber, draft.status);
      setDraft(null);
    });
  };

  if (!lines.length) return <span>{row.splitSummary || "—"}</span>;

  return (
    <div className="space-y-2 whitespace-normal">
      {row.splitSummary ? <p className="text-xs text-ink-muted">{row.splitSummary}</p> : null}
      {lines.map((line) => {
        const current = line.status || "Placed";
        const choices = canonical.includes(current) ? canonical : [current, ...canonical];
        const label = line.productName || "Item";
        return (
          <div key={line.id} className="space-y-1">
            <p className="break-words text-xs text-ink-soft" title={line.invoiceNumber || undefined}>
              {label}
              {line.invoiceNumber ? <span className="text-ink-muted"> · {line.invoiceNumber}</span> : null}
            </p>
            {onLineStatus && line.invoiceNumber ? (
              <Select
                aria-label={`Line status for ${label}`}
                value={current}
                options={choices}
                onChange={(event) => {
                  const next = event.target.value;
                  if (next && next !== current && canonical.includes(next)) {
                    setDraft({ invoiceNumber: line.invoiceNumber, status: next, productName: label });
                  }
                }}
              />
            ) : (
              <p className="text-sm text-ink">{current}</p>
            )}
          </div>
        );
      })}
      <ConfirmDialog
        open={Boolean(draft)}
        onClose={() => (running ? undefined : setDraft(null))}
        onConfirm={save}
        loading={running}
        title="Update line status?"
        description={draft ? `Change ${draft.productName} (${draft.invoiceNumber}) on order ${row.id} to “${draft.status}”? This sets the status on every product that shares this seller invoice.` : ""}
        confirmLabel={draft ? `Set ${draft.status}` : "Update"}
        tone="warning"
      />
    </div>
  );
}

export function Cell({ column, row, onLineStatus }) {
  const value = row[column.key];
  const sub = column.sub ? row[column.sub] : null;
  let content;
  if (column.type === "lineStatus") content = <LineStatusCell row={row} options={column.options} onLineStatus={onLineStatus} />;
  else if (column.type === "remarks") content = <RemarksCell remarks={value} />;
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
