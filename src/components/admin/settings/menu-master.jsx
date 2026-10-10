"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Eye, EyeOff, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { faIcon, knownPages, menuTarget, nextOnlyScreens } from "@/lib/content/admin/sidebar";
import { createMenuAction, deleteMenuAction, moveMenuAction, updateMenuAction } from "@/lib/actions/admin/menus";
import { NavIcon } from "@/components/admin/shell/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Switch } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";

/*
 * Menu Master: the admin_menus tree the sidebar is built from.
 * Sections (top level) -> groups (#links, sidebar sub-menus) -> pages (legacy page links).
 * Every write goes through a server action; the API re-checks the grant and audits it.
 */

/* Rows that open Menu Master and Manage Role; the API refuses to hide or delete them. */
const PROTECTED = new Set(["menu-master.php", "manage-role.php", "manage_roles.php"]);
const LOCKED_HINT = "This entry controls access to Menu Master and Manage Role.";
const GRID = "md:grid md:grid-cols-[minmax(0,2.3fr)_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,2.2fr)_6.75rem] md:items-center md:gap-4";

const norm = (link) => String(link ?? "").trim().replace(/^\/+/, "");
const isGroupLink = (link) => {
  const value = norm(link);
  return !value || (value.startsWith("#") && !value.startsWith("#dashboard_"));
};
const kindOf = (node, depth) => (depth === 0 ? "section" : isGroupLink(node.link) ? "group" : "page");
const slugLink = (name) => `#${String(name).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "menu"}`;
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function walk(nodes, fn, depth = 0, trail = []) {
  for (const node of nodes) {
    fn(node, depth, trail);
    walk(node.children || [], fn, depth + 1, [...trail, node]);
  }
}

function subtree(node) {
  const out = [];
  walk([node], (n) => out.push(n));
  return out;
}

const isLocked = (node) => subtree(node).some((n) => PROTECTED.has(norm(n.link)));
const pageCount = (node, activeOnly = false) => subtree(node).filter((n) => n !== node && !isGroupLink(n.link) && (!activeOnly || n.status)).length;
const groupCount = (node) => (node.children || []).filter((n) => isGroupLink(n.link)).length;

/** Hidden rows drop out unless shown; a search keeps matches, their parents, and everything under a match. */
function prune(nodes, showHidden, q) {
  const out = [];
  for (const node of nodes) {
    if (!showHidden && !node.status) continue;
    const hit = !q || `${node.name} ${node.link}`.toLowerCase().includes(q);
    const children = prune(node.children || [], showHidden, hit ? "" : q);
    if (hit || children.length) out.push({ ...node, children });
  }
  return out;
}

function RoleList({ roles }) {
  const [open, setOpen] = useState(false);
  if (roles.length <= 1) return <Badge tone="brand">Super Admin only</Badge>;
  const shown = open ? roles : roles.slice(0, 3);
  return (
    <span className="flex flex-wrap items-center gap-1">
      {shown.map((role) => (
        <Badge key={role} tone={role === "Super Admin" ? "brand" : "neutral"}>
          {role}
        </Badge>
      ))}
      {roles.length > 3 && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full px-1.5 text-[11.5px] font-medium text-brand-700 hover:underline" title={open ? undefined : roles.slice(3).join(", ")}>
          {open ? "Show less" : `+${roles.length - 3} more`}
        </button>
      )}
    </span>
  );
}

function Opens({ node, kind }) {
  if (kind !== "page") return <span className="text-xs text-ink-muted">{kind === "group" ? "Sub-menu" : "Section"}</span>;
  const target = menuTarget(node.link);
  if (!target.ported) return <Badge tone="warning">Not built yet</Badge>;
  if (target.route && !target.known) return <Badge tone="warning">Unknown route</Badge>;
  return (
    <Link href={target.href} className="block truncate font-mono text-xs text-brand-700 hover:underline" title={target.href}>
      {target.href}
    </Link>
  );
}

function MoveButtons({ index, count, onMove, disabled }) {
  if (count < 0) return null;
  return (
    <>
      <Button variant="ghost" size="icon-sm" aria-label="Move up" title="Move up" disabled={disabled || index === 0} onClick={() => onMove("up")}>
        <ArrowUp className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Move down" title="Move down" disabled={disabled || index >= count - 1} onClick={() => onMove("down")}>
        <ArrowDown className="size-4" />
      </Button>
    </>
  );
}

function RowMenu({ node, kind, ctx }) {
  const { can, onAction } = ctx;
  const locked = ctx.lockedIds.has(node.id);
  const items = [
    can.edit && { id: "edit", label: "Edit", icon: Pencil },
    can.add && kind !== "page" && { id: "add", label: kind === "section" ? "Add group or page" : "Add page", icon: Plus },
    can.edit && { id: "toggle", label: node.status ? "Hide from sidebar" : "Show in sidebar", icon: node.status ? EyeOff : Eye, disabled: locked && node.status },
    can.delete && { id: "delete", label: "Delete", icon: Trash2, danger: true, disabled: locked },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <Popover
      label={`Actions for ${node.name}`}
      panelClassName="w-52"
      trigger={({ toggle, props }) => (
        <Button variant="ghost" size="icon-sm" onClick={toggle} {...props}>
          <MoreHorizontal className="size-4" />
        </Button>
      )}
    >
      <ul className="py-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              data-close
              disabled={item.disabled}
              title={item.disabled ? LOCKED_HINT : undefined}
              onClick={() => onAction(item.id, node, kind)}
              className={cn("flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50", item.danger ? "text-danger-ink" : "text-ink")}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

function MenuRow({ node, depth, index, count, parentHidden, ctx }) {
  const kind = kindOf(node, depth);
  const hidden = !node.status || parentHidden;
  const target = kind === "page" ? menuTarget(node.link) : null;
  const pages = kind === "group" ? pageCount(ctx.full(node), true) : 0;
  const actions = (
    <div className="flex shrink-0 items-center justify-end">
      {ctx.can.edit && <MoveButtons index={index} count={count} disabled={ctx.busy} onMove={(direction) => ctx.onMove(node, direction)} />}
      <RowMenu node={node} kind={kind} ctx={ctx} />
    </div>
  );
  return (
    <>
      <div className={cn("border-b border-line px-4 py-2.5 text-[13px] last:border-b-0", GRID, kind === "group" && "bg-surface-muted/60")}>
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className={cn("flex min-w-0 items-center gap-2", hidden && "opacity-55")} style={{ paddingLeft: `${Math.max(0, depth - 1) * 1.25}rem` }}>
            <NavIcon name={faIcon(node.icon)} className={cn("size-4 shrink-0", kind === "group" ? "text-ink-soft" : "text-ink-muted")} />
            <div className="min-w-0">
              {target?.ported ? (
                <Link href={target.href} className="block truncate font-medium text-brand-700 hover:underline">
                  {node.name}
                </Link>
              ) : (
                <span className={cn("block truncate", kind === "group" ? "font-semibold text-ink" : "font-medium text-ink-soft")}>{node.name}</span>
              )}
              {kind === "group" && <span className="block text-xs text-ink-muted">{pages ? plural(pages, "page") : "Empty: not shown in the sidebar"}</span>}
            </div>
            {!node.status && <Badge tone="neutral">Hidden</Badge>}
          </div>
          <div className="md:hidden">{actions}</div>
        </div>
        <div className="mt-1.5 min-w-0 md:mt-0">
          <span className="text-[11px] font-medium tracking-wide text-ink-muted uppercase md:hidden">Link </span>
          <code className="font-mono text-xs break-all text-ink-soft">{node.link || "—"}</code>
        </div>
        <div className="mt-1.5 min-w-0 md:mt-0">
          <Opens node={node} kind={kind} />
        </div>
        <div className="mt-1.5 min-w-0 md:mt-0">
          <RoleList roles={node.roles || []} />
        </div>
        <div className="hidden md:block">{actions}</div>
      </div>
      {(node.children || []).map((child, i, list) => (
        <MenuRow key={child.id} node={child} depth={depth + 1} index={i} count={count < 0 ? -1 : list.length} parentHidden={hidden} ctx={ctx} />
      ))}
    </>
  );
}

function SectionCard({ node, index, count, expanded, onToggle, canMove, ctx }) {
  const { can, busy } = ctx;
  const groups = groupCount(ctx.full(node));
  const pages = pageCount(ctx.full(node));
  return (
    <Card>
      <div className={cn("flex flex-wrap items-center gap-2 px-4 py-3", expanded && "border-b border-line")}>
        <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <ChevronRight className={cn("size-4 shrink-0 text-ink-muted transition-transform", expanded && "rotate-90")} aria-hidden />
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700", !node.status && "opacity-55")}>
            <NavIcon name={faIcon(node.icon)} className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold text-ink">{node.name}</span>
              {!node.status && <Badge tone="neutral">Hidden</Badge>}
            </span>
            <span className="block truncate text-xs text-ink-muted">
              {plural(groups, "group")} · {plural(pages, "page")} · <code className="font-mono">{node.link || "—"}</code>
            </span>
          </span>
        </button>
        <div className="flex items-center gap-1">
          {can.add && (
            <Button size="sm" variant="secondary" onClick={() => ctx.onAction("add", node, "section")} disabled={busy}>
              <Plus className="size-4" aria-hidden /> Add
            </Button>
          )}
          {can.edit && canMove && <MoveButtons index={index} count={count} disabled={busy} onMove={(direction) => ctx.onMove(node, direction)} />}
          <RowMenu node={node} kind="section" ctx={ctx} />
        </div>
      </div>
      {expanded &&
        (node.children?.length ? (
          <div>
            <div className={cn("hidden border-b border-line bg-surface-muted px-4 py-2 text-xs font-semibold text-ink-muted", GRID)}>
              <span>Menu</span>
              <span>Link</span>
              <span>Opens</span>
              <span>Visible to</span>
              <span className="sr-only">Actions</span>
            </div>
            {node.children.map((child, i, list) => (
              <MenuRow key={child.id} node={child} depth={1} index={i} count={canMove ? list.length : -1} parentHidden={!node.status} ctx={ctx} />
            ))}
          </div>
        ) : (
          <EmptyState title="No entries in this section" description={can.add ? "Add a group (a sidebar sub-menu) or a page." : undefined} className="py-8" />
        ))}
    </Card>
  );
}

function linkHint(target) {
  if (target?.route) {
    const where = target.known ? `Opens ${target.href} in this admin.` : `Opens ${target.href}. That is not a known screen of this admin, so check that it opens.`;
    return `${where} The PHP admin cannot open /admin/ links.`;
  }
  if (target?.ported) return `Opens ${target.href}. Roles are granted on this link in Manage Role.`;
  return "No screen in this admin uses this link yet, so the entry opens the “Not built yet” page. Use a PHP page with a screen here, or an /admin/ route of this admin.";
}

/** Where an entry can live: the top level, a section, or a group. A row's own subtree is left out. */
function parentOptions(tree, exclude) {
  const options = [{ value: "0", label: "Top level (a new sidebar section)" }];
  walk(tree, (node, depth, trail) => {
    if (exclude.has(node.id) || trail.some((t) => exclude.has(t.id))) return;
    if (depth > 1 || (depth === 1 && !isGroupLink(node.link))) return;
    const label = [...trail.map((t) => t.name), node.name].join(" › ");
    options.push({ value: String(node.id), label: `${label}${node.status ? "" : " (hidden)"}` });
  });
  return options;
}

function MenuDialog({ dialog, tree, pages, icons, onClose, onSaved }) {
  const { notify } = useToast();
  const [saving, startSaving] = useTransition();
  const editing = dialog.mode === "edit";
  const node = dialog.node;
  const initialParent = String(editing ? node.parentId : dialog.parentId ?? 0);
  const [parentId, setParentId] = useState(initialParent);
  const [kind, setKind] = useState(editing ? kindOf(node, dialog.depth) : dialog.kind);
  const [name, setName] = useState(editing ? node.name : "");
  const [link, setLink] = useState(editing ? node.link : "");
  const [linkTouched, setLinkTouched] = useState(editing);
  const [icon, setIcon] = useState(editing ? node.icon : "");
  const [visible, setVisible] = useState(editing ? Boolean(node.status) : true);
  const [touched, setTouched] = useState(false);

  const exclude = useMemo(() => new Set(editing ? subtree(node).map((n) => n.id) : []), [editing, node]);
  const parents = useMemo(() => {
    const options = parentOptions(tree, exclude);
    if (!options.some((o) => o.value === initialParent)) options.push({ value: initialParent, label: `Current parent (#${initialParent})` });
    return options;
  }, [tree, exclude, initialParent]);
  const parentLabel = parents.find((o) => o.value === parentId)?.label;

  const isPage = kind === "page";
  const effectiveLink = !isPage && !linkTouched ? slugLink(name) : link.trim();
  const target = isPage ? menuTarget(effectiveLink) : null;
  const errors = {
    name: !name.trim() ? "Enter a name." : null,
    link: isPage && isGroupLink(effectiveLink) ? "Enter the page link, e.g. manage_product.php." : !effectiveLink ? "Enter a link." : null,
  };
  const locked = editing && PROTECTED.has(norm(node.link));

  const changeParent = (value) => {
    setParentId(value);
    if (editing) return;
    if (value === "0") setKind("section");
    else if (kind === "section") setKind("group");
  };

  const title = editing ? `Edit “${node.name}”` : kind === "section" ? "Add section" : `Add ${kind} to ${parentLabel}`;

  const save = () => {
    setTouched(true);
    if (errors.name || errors.link) return;
    const input = { name: name.trim(), link: effectiveLink, icon: icon.trim(), parentId: Number(parentId) };
    startSaving(async () => {
      const result = editing ? await updateMenuAction(node.id, { ...input, status: visible ? 1 : 0 }) : await createMenuAction(input);
      notify({ message: result.message || (result.ok ? "Saved." : "Could not save."), tone: result.ok ? "success" : "error" });
      if (result.ok) onSaved();
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      description={editing ? `${kind[0].toUpperCase()}${kind.slice(1)} · admin_menus #${node.id}` : "Your role gets view on the new entry so it shows in your sidebar. Give other roles access in Manage Role."}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} loading={saving}>
            {editing ? "Save changes" : `Add ${kind}`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={editing ? "Parent" : "Add to"} hint={editing && parentId !== initialParent ? "The entry moves to the end of its new parent." : undefined}>
          {({ id }) => <Select id={id} value={parentId} onChange={(e) => changeParent(e.target.value)} options={parents} />}
        </Field>

        {!editing && parentId !== "0" && (
          <fieldset className="space-y-1.5">
            <legend className="text-[13px] font-medium text-ink-soft">Type</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "group", label: "Group", hint: "A sub-menu that holds pages" },
                { value: "page", label: "Page", hint: "Opens a screen" },
              ].map((option) => (
                <label key={option.value} className={cn("cursor-pointer rounded-lg border px-3 py-2", kind === option.value ? "border-brand-600 bg-brand-50" : "border-line-strong hover:bg-surface-muted")}>
                  <input type="radio" name="menu-kind" value={option.value} checked={kind === option.value} onChange={() => setKind(option.value)} className="sr-only" />
                  <span className="block text-sm font-medium text-ink">{option.label}</span>
                  <span className="block text-xs text-ink-muted">{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <Field label="Name" required hint="Shown in the sidebar and breadcrumbs." error={touched ? errors.name : null}>
          {({ id, invalid, describedBy }) => <Input id={id} value={name} maxLength={150} onChange={(e) => setName(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />}
        </Field>

        <Field
          label={isPage ? "Page link" : "Link"}
          required={isPage}
          error={touched ? errors.link : null}
          hint={
            locked
              ? "This link controls access to this screen and cannot be changed."
              : isPage
                ? linkHint(target)
                : "Groups and sections use a #link as their key. Keep the suggested one unless the PHP admin expects another."
          }
        >
          {({ id, invalid, describedBy }) => (
            <>
              <Input
                id={id}
                value={effectiveLink}
                maxLength={255}
                list={isPage ? `${id}-pages` : undefined}
                disabled={locked}
                onChange={(e) => {
                  setLinkTouched(true);
                  setLink(e.target.value);
                }}
                placeholder={isPage ? "manage_product.php or /admin/sales/targets" : "#my-group"}
                className="font-mono"
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
              />
              {isPage && (
                <datalist id={`${id}-pages`}>
                  {pages.map((p) => (
                    <option key={p.page} value={p.page}>
                      {p.label}
                    </option>
                  ))}
                </datalist>
              )}
            </>
          )}
        </Field>

        <Field label="Icon" hint="A Font Awesome class from the PHP admin, e.g. fa fa-truck. The preview is the icon this sidebar shows.">
          {({ id }) => (
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-muted text-ink-soft">
                <NavIcon name={faIcon(icon)} className="size-4" />
              </span>
              <Input id={id} value={icon} maxLength={80} list={`${id}-icons`} onChange={(e) => setIcon(e.target.value)} placeholder="fa fa-cubes" className="font-mono" />
              <datalist id={`${id}-icons`}>
                {icons.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </div>
          )}
        </Field>

        {editing && (
          <div className="rounded-lg border border-line px-3 py-2.5">
            <Switch
              checked={visible}
              onChange={setVisible}
              disabled={locked && visible}
              label="Show in sidebar"
              description={locked ? "This entry cannot be hidden." : kind === "page" ? "Hidden pages disappear from every role's sidebar." : "Hiding it also hides everything under it."}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}

/** Screens this admin has that no admin_menus row points at, so the sidebar leaves them out. */
function NotInSidebar({ q, tree }) {
  const screens = useMemo(() => {
    const linked = new Set();
    const visit = (nodes) => {
      for (const node of nodes) {
        if (!node.status) continue;
        const target = menuTarget(node.link);
        if (target.route) linked.add(target.href.split(/[?#]/)[0]);
        visit(node.children || []);
      }
    };
    visit(tree);
    return nextOnlyScreens().filter((screen) => !linked.has(screen.href.split(/[?#]/)[0]));
  }, [tree]);
  const shown = q ? screens.filter((s) => `${s.label} ${s.href} ${s.group ?? ""}`.toLowerCase().includes(q)) : screens;
  const byGroup = new Map();
  for (const screen of shown) {
    const where = [screen.section, screen.group].filter(Boolean).join(" › ") || "Top level";
    if (!byGroup.has(where)) byGroup.set(where, []);
    byGroup.get(where).push(screen);
  }
  if (!shown.length) return null;
  return (
    <Card as="details" className="group">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-90" aria-hidden />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">Screens not in the sidebar ({shown.length})</span>
          <span className="block text-xs text-ink-muted">These screens exist in this admin but have no admin_menus row, so the sidebar does not show them. They still open by URL.</span>
        </span>
      </summary>
      <div className="border-t border-line">
        {[...byGroup.entries()].map(([where, list]) => (
          <div key={where} className="border-b border-line px-4 py-2.5 last:border-b-0">
            <p className="text-xs font-semibold text-ink-muted">{where}</p>
            <ul className="mt-1.5 grid gap-x-6 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((screen) => (
                <li key={screen.key} className="flex min-w-0 items-baseline gap-2 text-[13px]">
                  <Link href={screen.href} className="shrink-0 font-medium text-brand-700 hover:underline">
                    {screen.label}
                  </Link>
                  <code className="truncate font-mono text-xs text-ink-muted" title={screen.href}>
                    {screen.href}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MenuMaster({ tree, can }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, startBusy] = useTransition();
  const [query, setQuery] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [dialog, setDialog] = useState(null);
  const [removing, setRemoving] = useState(null);

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => prune(tree, showHidden, q), [tree, showHidden, q]);
  const { byId, lockedIds } = useMemo(() => {
    const map = new Map();
    walk(tree, (node) => map.set(node.id, node));
    return { byId: map, lockedIds: new Set([...map.values()].filter(isLocked).map((n) => n.id)) };
  }, [tree]);
  const full = (node) => byId.get(node.id) ?? node;
  const pages = useMemo(() => knownPages().sort((a, b) => a.page.localeCompare(b.page)), []);
  const stats = useMemo(() => {
    const out = { sections: tree.length, groups: 0, pages: 0, hidden: 0 };
    const icons = new Set();
    walk(tree, (node, depth) => {
      if (!node.status) out.hidden += 1;
      if (node.icon) icons.add(node.icon.trim());
      if (depth > 0) out[isGroupLink(node.link) ? "groups" : "pages"] += 1;
    });
    return { ...out, icons: [...icons].sort() };
  }, [tree]);

  const allCollapsed = visible.length > 0 && visible.every((s) => collapsed.has(s.id));
  const toggle = (id) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const run = (work) =>
    startBusy(async () => {
      const result = await work();
      notify({ message: result.message || (result.ok ? "Done." : "Action failed."), tone: result.ok ? "success" : "error" });
      if (result.ok) router.refresh();
    });

  const onMove = (node, direction) => run(() => moveMenuAction(node.id, direction, !showHidden));

  const onAction = (action, shown, kind) => {
    const node = full(shown);
    if (action === "edit") {
      let depth = 0;
      walk(tree, (n, d) => {
        if (n.id === node.id) depth = d;
      });
      setDialog({ mode: "edit", node, depth });
    }
    if (action === "add") setDialog({ mode: "add", parentId: node.id, kind: kind === "section" ? "group" : "page" });
    if (action === "toggle") run(() => updateMenuAction(node.id, { status: node.status ? 0 : 1 }));
    if (action === "delete") setRemoving(node);
  };

  const removeCount = removing ? subtree(removing).length - 1 : 0;
  const ctx = { can, busy, lockedIds, full, onAction, onMove };

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 sm:w-80">
            <span className="sr-only">Search menus</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or link" className="pl-9" />
          </label>
          <Checkbox label={`Show hidden (${stats.hidden})`} checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted tabular">
            {plural(stats.sections, "section")} · {plural(stats.groups, "group")} · {plural(stats.pages, "page")}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(visible.map((s) => s.id)))} disabled={!visible.length}>
            {allCollapsed ? "Expand all" : "Collapse all"}
          </Button>
          {can.add && (
            <Button size="sm" variant="primary" onClick={() => setDialog({ mode: "add", parentId: 0, kind: "section" })}>
              <Plus className="size-4" aria-hidden /> Add section
            </Button>
          )}
        </div>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <EmptyState title={q ? "No menu matches your search" : "No menus yet"} description={q ? "Try another name or link, or show hidden entries." : undefined} />
        </Card>
      ) : (
        visible.map((section, i) => (
          <SectionCard
            key={section.id}
            node={section}
            index={i}
            count={visible.length}
            canMove={!q}
            expanded={Boolean(q) || !collapsed.has(section.id)}
            onToggle={() => toggle(section.id)}
            ctx={ctx}
          />
        ))
      )}

      <NotInSidebar q={q} tree={tree} />

      {dialog && (
        <MenuDialog
          key={`${dialog.mode}-${dialog.node?.id ?? dialog.parentId}-${dialog.kind ?? ""}`}
          dialog={dialog}
          tree={tree}
          pages={pages}
          icons={stats.icons}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            router.refresh();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={(reason) =>
          run(async () => {
            const result = await deleteMenuAction(removing.id, reason);
            if (result.ok) setRemoving(null);
            return result;
          })
        }
        title={removing ? `Delete “${removing.name}”?` : ""}
        description={
          removing
            ? `${removeCount ? `This also deletes the ${plural(removeCount, "entry", "entries")} under it. ` : ""}Every role loses access to ${removeCount ? "them" : "it"} and the sidebar entry disappears. To keep it for later, hide it instead. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        requireReason
        loading={busy}
      />
    </div>
  );
}
