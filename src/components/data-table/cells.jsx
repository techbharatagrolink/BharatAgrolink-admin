import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatDateTime, formatINR, formatNumber, formatPercent, maskMobile } from "@/lib/format";
import { cn } from "@/lib/utils";

export function resolveHref(pattern, row) {
  if (!pattern) return null;
  let missing = false;
  const href = pattern.replace(/\{(\w+)\}/g, (_, key) => {
    const value = row[key];
    if (value == null || value === "") missing = true;
    return encodeURIComponent(value ?? "");
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
    default:
      return value == null || value === "" ? "—" : String(value);
  }
}

export function Cell({ column, row }) {
  const value = row[column.key];
  const sub = column.sub ? row[column.sub] : null;
  let content;
  if (column.type === "image")
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
    content = href ? (
      <Link href={href} className="font-medium text-brand-700 hover:underline">
        {text}
      </Link>
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
