"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function moveItem(list, from, to) {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Drag-handle reordering (the PHP Sortable lists) plus up/down buttons for keyboard users. */
export function SortableList({ items, getKey, onChange, renderItem, disabled = false, className }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const drop = (index) => {
    if (dragIndex != null) onChange(moveItem(items, dragIndex, index));
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <ul className={cn("divide-y divide-line rounded-lg border border-line", className)}>
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          onDragOver={(e) => {
            if (dragIndex == null) return;
            e.preventDefault();
            setOverIndex(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            drop(index);
          }}
          className={cn("flex items-center gap-2 bg-surface px-3 py-2", dragIndex === index && "opacity-60", overIndex === index && dragIndex !== index && "bg-brand-50")}
        >
          {!disabled && (
            <span
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                setDragIndex(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className="cursor-grab text-ink-muted active:cursor-grabbing"
              title="Drag to reorder"
              aria-hidden
            >
              <GripVertical className="size-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
          {!disabled && (
            <div className="flex shrink-0 gap-0.5">
              <button type="button" onClick={() => onChange(moveItem(items, index, index - 1))} disabled={index === 0} className="rounded p-1 text-ink-muted hover:bg-neutral-bg hover:text-ink disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="size-3.5" />
              </button>
              <button type="button" onClick={() => onChange(moveItem(items, index, index + 1))} disabled={index === items.length - 1} className="rounded p-1 text-ink-muted hover:bg-neutral-bg hover:text-ink disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="size-3.5" />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
