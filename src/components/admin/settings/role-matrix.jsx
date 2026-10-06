"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { updateRolePermissionsAction } from "@/lib/actions/admin/settings";

const ACTIONS = ["view", "add", "edit", "delete"];

function countChanges(a, b, keys) {
  let n = 0;
  for (const key of keys) for (const act of ACTIONS) if ((a[key] ?? []).includes(act) !== (b[key] ?? []).includes(act)) n++;
  return n;
}

export function RoleMatrix({ roleId, catalog, permissions, editable, grantable, lockedReason }) {
  const router = useRouter();
  const { notify } = useToast();
  const [saved, setSaved] = useState(permissions);
  const [grants, setGrants] = useState(permissions);
  const [confirm, setConfirm] = useState(false);
  const [busy, startBusy] = useTransition();
  const keys = useMemo(() => catalog.map((p) => p.key), [catalog]);
  const groups = useMemo(() => {
    const map = new Map();
    for (const p of catalog) {
      const g = `${p.section} · ${p.group}`;
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(p);
    }
    return [...map.entries()];
  }, [catalog]);
  const changes = countChanges(saved, grants, keys);

  const toggle = (key, action, on) => {
    const current = new Set(grants[key] ?? []);
    if (on) {
      current.add(action);
      current.add("view");
    } else {
      current.delete(action);
      if (action === "view") current.clear();
    }
    const next = { ...grants };
    if (current.size) next[key] = ACTIONS.filter((a) => current.has(a));
    else delete next[key];
    setGrants(next);
  };

  const save = (reason) =>
    startBusy(async () => {
      const r = await updateRolePermissionsAction(roleId, grants, reason);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      setConfirm(false);
      if (r.ok) {
        setSaved(grants);
        router.refresh();
      }
    });

  return (
    <div>
      {!editable && lockedReason && (
        <Notice className="m-4" tone="info">
          <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" aria-hidden />{lockedReason}</span>
        </Notice>
      )}
      <div className="md:hidden">
        {groups.map(([group, items]) => (
          <section key={group}>
            <h3 className="border-b border-line bg-surface-muted px-4 py-1.5 text-xs font-semibold text-ink-soft">{group}</h3>
            <ul className="divide-y divide-line">
              {items.map((p) => (
                <li key={p.key} className="px-4 py-3">
                  <p className="text-sm text-ink">
                    {p.label}
                    {p.sensitive && <span className="ml-1.5 text-[11px] font-medium text-warning-ink">sensitive</span>}
                  </p>
                  <p className="font-mono text-[11px] break-all text-ink-muted">{p.key}</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {ACTIONS.map((a) => {
                      const on = (grants[p.key] ?? []).includes(a);
                      const allowed = editable && (grantable === true || grantable?.[p.key]?.includes(a) || on);
                      return <Checkbox key={a} label={<span className="capitalize">{a}</span>} checked={on} disabled={!allowed} onChange={(e) => toggle(p.key, a, e.target.checked)} aria-label={`${a} ${p.label}`} className="text-[13px]" />;
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">Permissions by module</caption>
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-line">
              <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-ink-muted">Module (permission key)</th>
              {ACTIONS.map((a) => (
                <th key={a} scope="col" className="w-20 px-2 py-2 text-center text-xs font-semibold text-ink-muted capitalize">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(([group, items]) => (
              <Fragment key={group}>
                <tr className="bg-surface-muted">
                  <th scope="rowgroup" colSpan={5} className="px-4 py-1.5 text-left text-xs font-semibold text-ink-soft">{group}</th>
                </tr>
                {items.map((p) => (
                  <tr key={p.key} className="border-b border-line">
                    <th scope="row" className="px-4 py-2 text-left font-normal">
                      <span className="text-ink">{p.label}</span>
                      {p.sensitive && <span className="ml-1.5 text-[11px] font-medium text-warning-ink">sensitive</span>}
                      <span className="block font-mono text-[11px] text-ink-muted">{p.key}</span>
                    </th>
                    {ACTIONS.map((a) => {
                      const on = (grants[p.key] ?? []).includes(a);
                      const allowed = editable && (grantable === true || grantable?.[p.key]?.includes(a) || on);
                      return (
                        <td key={a} className="px-2 py-2 text-center">
                          <Checkbox checked={on} disabled={!allowed} onChange={(e) => toggle(p.key, a, e.target.checked)} aria-label={`${a} ${p.label}`} className="mx-auto" />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {editable && (
        <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface px-4 py-3">
          <span className="mr-auto text-sm text-ink-muted">{changes ? `${changes} unsaved change${changes === 1 ? "" : "s"}` : "No changes"}</span>
          <Button variant="secondary" disabled={!changes || busy} onClick={() => setGrants(saved)}>Discard</Button>
          <Button variant="primary" disabled={!changes} onClick={() => setConfirm(true)}>Save permissions</Button>
        </div>
      )}
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={save} loading={busy} tone="warning" title="Save permission changes?" description={`${changes} change${changes === 1 ? "" : "s"} will apply to every user with this role on their next request.`} confirmLabel="Save permissions" requireReason />
    </div>
  );
}
