"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronLeft, ChevronRight, Columns3, EllipsisVertical, Pin, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Header "⋮" menu of the AG Grid tables (AG Grid's column menu look): sort, pin, autosize, move,
 * choose and reset columns. Sorting goes through the table's `onSort` (server-side, URL); the rest
 * is applied with the grid API, so it only changes this view.
 */

const WIDTH = 236;

function Item({ icon: Icon, label, onClick, disabled, active, trailing }) {
  return (
    <li>
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm normal-case tracking-normal",
          disabled ? "cursor-not-allowed text-ink-muted/50" : "cursor-pointer text-ink hover:bg-surface-muted",
          active && "font-semibold text-brand-700",
        )}
      >
        <span className="inline-flex size-4 shrink-0 items-center justify-center">{Icon ? <Icon className="size-4" aria-hidden /> : null}</span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {trailing}
      </button>
    </li>
  );
}

const Divider = () => <li role="separator" className="my-1 border-t border-line" />;

export function ColumnMenu({ api, column, col, sortable, sortDir, onSort, allColumns, hiddenKeys = [], onToggleColumn, onReset, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("main");
  const [pos, setPos] = useState(null);
  const [, refresh] = useState(0);
  const button = useRef(null);
  const panel = useRef(null);
  const colId = column?.getColId?.() ?? col.key;

  const close = useCallback(() => {
    setOpen(false);
    setView("main");
  }, []);

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);

  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const place = () => {
      const r = button.current.getBoundingClientRect();
      const height = panel.current?.offsetHeight ?? 420;
      const below = r.bottom + 6 + height < window.innerHeight;
      setPos({ top: below ? r.bottom + 6 : Math.max(8, r.top - 6 - height), left: Math.max(8, Math.min(r.left, window.innerWidth - WIDTH - 8)) });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, view]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !panel.current?.contains(e.target) && !button.current?.contains(e.target) && close();
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        button.current?.focus();
      }
    };
    // Scrolling the grid body moves the header out from under the menu: close it then.
    const onScroll = (e) => !panel.current?.contains(e.target) && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close]);

  const live = api && !api.isDestroyed?.() ? api : null;
  const gridColumn = live?.getColumn(colId) ?? null;
  const pinned = gridColumn?.getPinned() ?? null;
  const locked = Boolean(gridColumn?.getColDef().lockPinned);

  // Move Left / Right swaps with the neighbour in the same pinned area, never past the fixed columns.
  const neighbour = (step) => {
    if (!live || !gridColumn) return null;
    const shown = live.getAllDisplayedColumns();
    const next = shown[shown.indexOf(gridColumn) + step];
    if (!next || next.getColId().startsWith("__") || next.getPinned() !== pinned || next.getColDef().lockPosition) return null;
    return next;
  };
  const left = neighbour(-1);
  const right = neighbour(1);
  const move = (target) => {
    if (!target) return;
    live.moveColumns([colId], live.getAllGridColumns().indexOf(target));
    refresh((n) => n + 1);
  };
  const run = (fn) => () => {
    fn();
    close();
  };

  const choosable = allColumns && onToggleColumn ? allColumns : null;
  const shownCount = choosable ? choosable.filter((c) => !hiddenKeys.includes(c.key)).length : 0;

  return (
    <>
      <div className={cn("ba-col-menu inline-flex shrink-0 items-center", open && "is-open")}>
        <button
          ref={button}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={`Column menu for ${col.label}`}
          aria-haspopup="menu"
          aria-expanded={open}
          title="Column menu"
          className={cn("inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-ink-muted transition-colors hover:bg-surface hover:text-ink", open && "bg-surface text-ink shadow-xs")}
        >
          <EllipsisVertical className="size-3.5" aria-hidden />
        </button>
      </div>
      {open &&
        createPortal(
          <div
            ref={panel}
            role="menu"
            aria-label={`${col.label} column`}
            style={{ position: "fixed", top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: WIDTH }}
            className="z-[60] rounded-xl border border-line bg-surface text-left font-normal shadow-xl"
          >
            {view === "main" && (
              <ul className="py-1">
                {sortable && onSort && (
                  <>
                    <Item icon={ArrowUp} label="Sort Ascending" active={sortDir === "asc"} onClick={run(() => onSort("asc"))} />
                    <Item icon={ArrowDown} label="Sort Descending" active={sortDir === "desc"} onClick={run(() => onSort("desc"))} />
                    {sortDir && <Item icon={X} label="Clear Sort" onClick={run(() => onSort(""))} />}
                    <Divider />
                  </>
                )}
                <Item icon={Pin} label="Pin Column" disabled={!live || locked} onClick={() => setView("pin")} trailing={<ChevronRight className="size-4 text-ink-muted" aria-hidden />} />
                <Divider />
                <Item label="Autosize This Column" disabled={!live} onClick={run(() => live.autoSizeColumns([colId], false))} />
                <Item label="Autosize All Columns" disabled={!live} onClick={run(() => live.autoSizeAllColumns(false))} />
                <Divider />
                <Item icon={ArrowLeft} label="Move Left" disabled={!left} onClick={() => move(left)} />
                <Item icon={ArrowRight} label="Move Right" disabled={!right} onClick={() => move(right)} />
                <Divider />
                {choosable && <Item icon={Columns3} label="Choose Columns" onClick={() => setView("columns")} trailing={<ChevronRight className="size-4 text-ink-muted" aria-hidden />} />}
                <Item label="Reset Columns" disabled={!live} onClick={run(() => onReset?.())} />
              </ul>
            )}

            {view === "pin" && (
              <ul className="py-1">
                <Item icon={ChevronLeft} label="Back" onClick={() => setView("main")} />
                <Divider />
                {[
                  { value: "left", label: "Pin Left" },
                  { value: "right", label: "Pin Right" },
                  { value: null, label: "No Pin" },
                ].map((option) => (
                  <Item
                    key={option.label}
                    label={option.label}
                    active={pinned === option.value}
                    trailing={pinned === option.value ? <Check className="size-4" aria-hidden /> : null}
                    onClick={run(() => live.setColumnsPinned([colId], option.value))}
                  />
                ))}
              </ul>
            )}

            {view === "columns" && choosable && (
              <div className="py-1">
                <ul>
                  <Item icon={ChevronLeft} label="Back" onClick={() => setView("main")} />
                  <Divider />
                </ul>
                <ul className="max-h-72 overflow-y-auto px-1.5 pb-1.5">
                  {choosable.map((c) => {
                    const checked = !hiddenKeys.includes(c.key);
                    // The last visible column cannot be hidden: the grid needs at least one.
                    const disabled = checked && shownCount <= 1;
                    return (
                      <li key={c.key}>
                        <label className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm normal-case tracking-normal text-ink", disabled ? "opacity-50" : "cursor-pointer hover:bg-surface-muted")}>
                          <input type="checkbox" className="size-4 accent-brand-600" checked={checked} disabled={disabled} onChange={(e) => onToggleColumn(c.key, e.target.checked)} />
                          <span className="min-w-0 truncate">{c.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
