"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { saveScriptsAction } from "@/lib/actions/admin/parity/support-admin";

const FIELDS = [
  { name: "google_script", label: "Google Script" },
  { name: "facebook_pixel", label: "Facebook Pixel" },
  { name: "tag_manager", label: "Tag Manager" },
];

/** script_settings.php: the three tracking snippets injected into the storefront. */
export function ScriptsForm({ values, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(values);
  const [saving, startSaving] = useTransition();

  const submit = (event) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveScriptsAction(form);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        if (result.values) setForm(result.values);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {!canEdit && <Notice>You can view these scripts. Changing them needs edit permission.</Notice>}
      {FIELDS.map((f) => (
        <Field key={f.name} label={f.label}>
          {({ id }) => (
            <Textarea id={id} rows={8} value={form[f.name] ?? ""} disabled={!canEdit || saving} maxLength={60000} spellCheck={false} className="font-mono text-[12.5px]" onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
          )}
        </Field>
      ))}
      {canEdit && (
        <div className="flex justify-end border-t border-line pt-4">
          <Button type="submit" variant="primary" loading={saving}>
            Update
          </Button>
        </div>
      )}
    </form>
  );
}
