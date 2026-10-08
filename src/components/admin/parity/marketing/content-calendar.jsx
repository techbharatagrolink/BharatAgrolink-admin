"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Circle, Hash, Megaphone, NotebookPen, Plus, Video } from "lucide-react";
import { deleteCalendarEventAction, saveCalendarEventAction } from "@/lib/actions/admin/parity/marketing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { Collapsible } from "./social-shared";

const CATEGORIES = [
  { value: "social-media", label: "Social Media Post" },
  { value: "blog", label: "Blog Article" },
  { value: "video", label: "Video Content" },
  { value: "campaign", label: "Campaign Launch" },
  { value: "event", label: "Event" },
  { value: "announcement", label: "Announcement" },
  { value: "other", label: "Other" },
];
const COLORS = [
  { value: "#10A450", label: "Green (Default)" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#ea580c", label: "Orange" },
];
const ICONS = { "social-media": Hash, blog: NotebookPen, video: Video, campaign: Megaphone, event: CalendarDays, announcement: Megaphone, other: Circle };
const VIEWS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
  { value: "list", label: "List" },
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EMPTY = { title: "", start: "", end: "", category: "", color: "#10A450", description: "" };

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const local = (d) => `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
const startOfWeek = (d) => addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), -d.getDay());
const time = (d) => `${pad(d.getHours() % 12 || 12)}:${pad(d.getMinutes())} ${d.getHours() < 12 ? "am" : "pm"}`;

/** "YYYY-MM-DD HH:mm:ss" read as wall-clock time, never shifted by the browser's timezone. */
function parse(stamp) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(stamp ?? ""));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])) : null;
}

/** The days an event covers; an end exactly at midnight does not take that day, as in FullCalendar. */
function lastDay(e) {
  if (e.endDate > e.startDate && e.endDate.getHours() === 0 && e.endDate.getMinutes() === 0 && ymd(e.endDate) !== ymd(e.startDate)) return ymd(addDays(e.endDate, -1));
  return ymd(e.endDate < e.startDate ? e.startDate : e.endDate);
}

const onDay = (e, day) => ymd(e.startDate) <= day && day <= lastDay(e);

function EventChip({ event, onOpen, draggable, compact }) {
  const Icon = ICONS[event.category] ?? Circle;
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(ev) => ev.dataTransfer.setData("text/plain", event.id)}
      onClick={(ev) => {
        ev.stopPropagation();
        onOpen(event);
      }}
      className={cn("flex w-full items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white", compact ? "" : "py-1 text-xs")}
      style={{ background: event.color || "#10A450" }}
      title={event.title}
    >
      <Icon className="size-2.5 shrink-0" aria-hidden />
      <span className="truncate">{event.title}</span>
    </button>
  );
}

/** social_media_dashboard.php "Content Calendar": month, week, day and list views with add / edit / move / delete. */
export function ContentCalendar({ events: rawEvents, can }) {
  const router = useRouter();
  const { notify } = useToast();
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(null);
  const [today, setToday] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const now = new Date();
    setToday(ymd(now));
    setCursor((c) => c ?? new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const events = useMemo(
    () =>
      rawEvents
        .map((e) => ({ ...e, startDate: parse(e.start), endDate: parse(e.end) ?? parse(e.start) }))
        .filter((e) => e.startDate)
        .sort((a, b) => a.startDate - b.startDate),
    [rawEvents],
  );

  if (!cursor) return null;

  function openNew(start, end) {
    if (!can.add) return;
    setForm({ ...EMPTY, start: local(start), end: local(end) });
    setEditing("new");
  }

  function openEvent(e) {
    setForm({ title: e.title, start: local(e.startDate), end: local(e.endDate), category: e.category || "", color: e.color || "#10A450", description: e.description || "" });
    setEditing(e.id);
  }

  async function persist(id, values, message) {
    const result = await saveCalendarEventAction(id === "new" ? null : id, values);
    if (!result.ok) {
      notify({ message: result.message || (id === "new" ? "Failed to create event" : "Failed to update event"), tone: "error" });
      return false;
    }
    notify({ message, tone: "success" });
    router.refresh();
    return true;
  }

  async function save(ev) {
    ev.preventDefault();
    if (!form.title.trim() || !form.start || !form.end || !form.category) return notify({ message: "Please fill in all required fields", tone: "error" });
    if (form.end < form.start) return notify({ message: "The end must be after the start.", tone: "error" });
    setSaving(true);
    const ok = await persist(editing, form, editing === "new" ? "Event created successfully" : "Event updated successfully");
    setSaving(false);
    if (ok) setEditing(null);
  }

  async function remove() {
    setDeleting(true);
    const result = await deleteCalendarEventAction(editing);
    setDeleting(false);
    setConfirming(false);
    if (!result.ok) return notify({ message: result.message || "Failed to delete event", tone: "error" });
    notify({ message: "Event deleted successfully", tone: "success" });
    setEditing(null);
    router.refresh();
  }

  async function moveTo(eventId, day) {
    const e = events.find((x) => x.id === eventId);
    if (!e || !can.edit) return;
    const [y, m, d] = day.split("-").map(Number);
    const shift = Math.round((new Date(y, m - 1, d) - new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate())) / 86400000);
    if (!shift) return;
    await persist(e.id, { title: e.title, start: local(addDays(e.startDate, shift)), end: local(addDays(e.endDate, shift)), category: e.category || "other", color: e.color || "#10A450", description: e.description || "" }, "Event updated successfully");
  }

  function step(dir) {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1));
    else setCursor(addDays(cursor, (view === "day" ? 1 : 7) * dir));
  }

  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const fmt = (d) => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  const title =
    view === "month"
      ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
      : view === "day"
        ? `${MONTHS[cursor.getMonth()]} ${cursor.getDate()}, ${cursor.getFullYear()}`
        : `${fmt(weekDays[0])} – ${fmt(weekDays[6])}, ${weekDays[6].getFullYear()}`;

  const monthStart = startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const monthDays = Array.from({ length: Math.ceil((Math.round((monthEnd - monthStart) / 86400000) + 1) / 7) * 7 }, (_, i) => addDays(monthStart, i));
  const dayList = (days) => days.map((d) => ({ day: d, items: events.filter((e) => onDay(e, ymd(d))) }));

  return (
    <Collapsible id="content-calendar" title="Content Calendar" icon={CalendarDays} badge="INTERACTIVE">
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="outline" onClick={() => step(-1)} aria-label="Previous">
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button size="icon-sm" variant="outline" onClick={() => step(1)} aria-label="Next">
              <ChevronRight className="size-4" aria-hidden />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(parse(`${today} 00:00`) ?? new Date())}>
              today
            </Button>
          </div>
          <h3 className="text-base font-semibold text-ink" aria-live="polite">{title}</h3>
          <div className="flex items-center gap-1">
            {VIEWS.map((v) => (
              <Button key={v.value} size="sm" variant={view === v.value ? "primary" : "outline"} onClick={() => setView(v.value)} aria-pressed={view === v.value}>
                {v.label}
              </Button>
            ))}
            {can.add && (
              <Button size="sm" variant="primary" onClick={() => openNew(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 9), new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 10))}>
                <Plus className="size-4" aria-hidden />
                Add Event
              </Button>
            )}
          </div>
        </div>

        {view === "month" && (
          <div className="overflow-x-auto">
            <div className="grid min-w-[640px] grid-cols-7 border-t border-l border-line text-sm">
              {WEEKDAYS.map((w) => (
                <div key={w} className="border-r border-b border-line bg-surface-muted px-2 py-1.5 text-center text-xs font-semibold text-ink-muted">{w}</div>
              ))}
              {monthDays.map((d) => {
                const key = ymd(d);
                const items = events.filter((e) => onDay(e, key));
                const outside = d.getMonth() !== cursor.getMonth();
                return (
                  <div
                    key={key}
                    role={can.add ? "button" : undefined}
                    tabIndex={can.add ? 0 : undefined}
                    aria-label={can.add ? `Add event on ${key}` : undefined}
                    onClick={() => openNew(d, addDays(d, 1))}
                    onKeyDown={(ev) => {
                      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target !== ev.currentTarget) return;
                      ev.preventDefault();
                      openNew(d, addDays(d, 1));
                    }}
                    onDragOver={(ev) => can.edit && ev.preventDefault()}
                    onDrop={(ev) => {
                      ev.preventDefault();
                      moveTo(ev.dataTransfer.getData("text/plain"), key);
                    }}
                    className={cn("min-h-24 border-r border-b border-line p-1", outside && "bg-surface-muted/60 text-ink-muted", key === today && "bg-warning-bg/40", can.add && "cursor-pointer hover:bg-brand-50/40")}
                  >
                    <div className={cn("mb-1 text-right text-xs", key === today && "font-bold text-brand-700")}>{d.getDate()}</div>
                    <div className="space-y-0.5">
                      {items.slice(0, 3).map((e) => (
                        <EventChip key={e.id} event={e} onOpen={openEvent} draggable={can.edit} compact />
                      ))}
                      {items.length > 3 && (
                        <button
                          type="button"
                          className="px-1 text-[11px] font-medium text-brand-700 hover:underline"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setCursor(d);
                            setView("day");
                          }}
                        >
                          +{items.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="overflow-x-auto">
            <div className="grid min-w-[700px] grid-cols-7 gap-2">
              {dayList(weekDays).map(({ day, items }) => (
                <div key={ymd(day)} className={cn("min-h-40 rounded-lg border border-line p-2", ymd(day) === today && "border-brand-200 bg-brand-50/40")}>
                  <button type="button" onClick={() => openNew(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9), new Date(day.getFullYear(), day.getMonth(), day.getDate(), 10))} className="mb-2 w-full text-left text-xs font-semibold text-ink-muted hover:text-ink" disabled={!can.add}>
                    {WEEKDAYS[day.getDay()]} {day.getDate()}/{day.getMonth() + 1}
                  </button>
                  <div className="space-y-1">
                    {items.map((e) => (
                      <div key={e.id}>
                        <p className="text-[10px] text-ink-muted">{time(e.startDate)}</p>
                        <EventChip event={e} onOpen={openEvent} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "day" && (
          <div className="rounded-lg border border-line">
            {dayList([cursor])[0].items.map((e) => (
              <div key={e.id} className="flex items-start gap-3 border-b border-line p-3 last:border-b-0">
                <p className="w-36 shrink-0 text-xs text-ink-muted">
                  {time(e.startDate)} – {time(e.endDate)}
                </p>
                <div className="min-w-0 flex-1">
                  <EventChip event={e} onOpen={openEvent} />
                  {e.description && <p className="mt-1 text-xs whitespace-pre-wrap text-ink-soft">{e.description}</p>}
                </div>
              </div>
            ))}
            {!dayList([cursor])[0].items.length && <p className="p-6 text-center text-sm text-ink-muted">No events on this day.</p>}
          </div>
        )}

        {view === "list" && (
          <div className="rounded-lg border border-line">
            {dayList(weekDays)
              .filter((d) => d.items.length)
              .map(({ day, items }) => (
                <div key={ymd(day)}>
                  <p className="bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day.getDay()]} · {MONTHS[day.getMonth()]} {day.getDate()}, {day.getFullYear()}
                  </p>
                  {items.map((e) => (
                    <button key={e.id} type="button" onClick={() => openEvent(e)} className="flex w-full items-center gap-3 border-b border-line px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-muted">
                      <span className="w-36 shrink-0 text-xs text-ink-muted">
                        {time(e.startDate)} – {time(e.endDate)}
                      </span>
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: e.color || "#10A450" }} aria-hidden />
                      <span className="truncate text-ink">{e.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            {!dayList(weekDays).some((d) => d.items.length) && <p className="p-6 text-center text-sm text-ink-muted">No events to display</p>}
          </div>
        )}
      </div>

      <Dialog
        open={editing != null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add New Event" : "Edit Event"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            {editing !== "new" && can.delete && (
              <Button variant="danger" onClick={() => setConfirming(true)} disabled={saving}>Delete</Button>
            )}
            {(editing === "new" ? can.add : can.edit) && (
              <Button variant="primary" type="submit" form="calendar-event-form" loading={saving}>Save Event</Button>
            )}
          </>
        }
      >
        <form id="calendar-event-form" onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <Field label="Title" required className="sm:col-span-2">
            {({ id }) => <Input id={id} maxLength={255} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Enter event title" />}
          </Field>
          <Field label="Start Date & Time" required>
            {({ id }) => <Input id={id} type="datetime-local" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />}
          </Field>
          <Field label="End Date & Time" required>
            {({ id }) => <Input id={id} type="datetime-local" min={form.start || undefined} value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />}
          </Field>
          <Field label="Category" required>
            {({ id }) => <Select id={id} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Select Category" options={CATEGORIES} />}
          </Field>
          <Field label="Color">
            {({ id }) => <Select id={id} value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} options={COLORS} />}
          </Field>
          <Field label="Description" className="sm:col-span-2">
            {({ id }) => <Textarea id={id} rows={3} maxLength={5000} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Enter event description or notes..." />}
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog open={confirming} onClose={() => setConfirming(false)} onConfirm={remove} loading={deleting} title="Delete event?" description="Are you sure you want to delete this event?" confirmLabel="Delete" />
    </Collapsible>
  );
}
