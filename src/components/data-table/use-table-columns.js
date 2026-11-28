"use client";

import { useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/*
 * Column choices (which columns are shown, S.No. on/off) of every admin table, kept for the current working
 * session only: sessionStorage, per page + table, per browser tab. They stay while you open a record (e.g. an
 * order) and come back, or refresh the page, and are forgotten when the tab or browser is closed, so the next
 * visit starts from the table's default columns.
 */

const COLUMNS_KEY = (key) => `ba-table-columns:${key}`;

// In-memory copy, so choices still apply for this visit when sessionStorage is unavailable (private mode, full).
const memoryColumns = new Map();
const columnListeners = new Set();

function subscribeColumns(callback) {
  columnListeners.add(callback);
  return () => columnListeners.delete(callback);
}

function readColumns(key) {
  try {
    return window.sessionStorage.getItem(COLUMNS_KEY(key)) ?? memoryColumns.get(key) ?? null;
  } catch {
    return memoryColumns.get(key) ?? null;
  }
}

function writeColumns(key, value) {
  const text = value == null ? null : JSON.stringify(value);
  if (text == null) memoryColumns.delete(key);
  else memoryColumns.set(key, text);
  try {
    if (text == null) window.sessionStorage.removeItem(COLUMNS_KEY(key));
    else window.sessionStorage.setItem(COLUMNS_KEY(key), text);
  } catch {
    /* storage unavailable: the in-memory copy still applies */
  }
  for (const listener of columnListeners) listener();
}

/**
 * A table's hidden columns and S.No. choice for this session. `id` names the table on its page (the page path
 * is added, so equal ids on different pages never share a choice). `columns` are [{ key, hidden? }]; columns
 * marked `hidden` start hidden. The server render and the first client render use the defaults; the session's
 * choice applies right after. Columns that no longer exist are ignored. `reset()` forgets the choice now.
 */
export function useTableColumns(id, columns, serial = false) {
  const pathname = usePathname() || "";
  const key = `${pathname}#${id}`;
  const raw = useSyncExternalStore(subscribeColumns, () => readColumns(key), () => null);
  const defaults = useMemo(() => columns.filter((c) => c.hidden).map((c) => c.key), [columns]);
  const saved = useMemo(() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);
  // Kept stable between renders: the grid re-applies its columns whenever this list changes identity.
  const hidden = useMemo(() => {
    if (!Array.isArray(saved?.hidden)) return defaults;
    const known = new Set(columns.map((c) => c.key));
    return saved.hidden.filter((k) => known.has(k));
  }, [saved, columns, defaults]);
  const showSerial = serial ? (typeof saved?.showSerial === "boolean" ? saved.showSerial : true) : false;
  return {
    hidden,
    showSerial,
    setHidden: (next) => writeColumns(key, { hidden: typeof next === "function" ? next(hidden) : next, showSerial }),
    setShowSerial: (value) => writeColumns(key, { hidden, showSerial: value }),
    reset: () => writeColumns(key, null),
  };
}
