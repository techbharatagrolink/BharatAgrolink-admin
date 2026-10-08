"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";

const MAX_IMAGE = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** signup_modal_settings.php: title, subtitle and image of the storefront login / signup modal. */
export function LoginModalForm({ values, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [title, setTitle] = useState(values.title);
  const [subtitle, setSubtitle] = useState(values.subtitle);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, startSaving] = useTransition();

  useEffect(() => (preview ? () => URL.revokeObjectURL(preview) : undefined), [preview]);

  const pick = (event) => {
    const file = event.target.files?.[0] ?? null;
    setErrors((e) => ({ ...e, image: undefined }));
    setImage(null);
    setPreview("");
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, image: "Invalid file type. Only JPG, PNG and WebP are allowed." }));
      setInputKey((k) => k + 1);
      return;
    }
    if (file.size > MAX_IMAGE) {
      setErrors((e) => ({ ...e, image: "File size exceeds 10MB limit" }));
      setInputKey((k) => k + 1);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const reset = () => {
    setTitle(values.title);
    setSubtitle(values.subtitle);
    setImage(null);
    setPreview("");
    setErrors({});
    setInputKey((k) => k + 1);
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!title.trim()) next.title = "Modal title is required.";
    if (!subtitle.trim()) next.subtitle = "Modal subtitle is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = new FormData();
    body.set("title", title.trim());
    body.set("subtitle", subtitle.trim());
    if (image) body.set("image", image);
    startSaving(async () => {
      let result;
      try {
        const response = await fetch("/admin/settings/login-modal/save", { method: "POST", body });
        result = await response.json();
      } catch {
        result = { ok: false, message: "Could not save the signup modal settings. Please try again." };
      }
      notify({ message: result.message || "Could not save the signup modal settings.", tone: result.ok && !result.uploadError ? "success" : "error" });
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.ok) {
        setImage(null);
        setPreview("");
        setInputKey((k) => k + 1);
        router.refresh();
      }
    });
  };

  const shown = preview || values.imageUrl;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {!canEdit && <Notice>You can view these settings. Changing them needs edit permission.</Notice>}
      <Field label="Modal Title" required error={errors.title} hint="This will be displayed as the main heading in the signup modal.">
        {({ id, invalid, describedBy }) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit || saving} maxLength={255} placeholder="Enter modal title" aria-invalid={invalid || undefined} aria-describedby={describedBy} />}
      </Field>
      <Field label="Modal Subtitle" required error={errors.subtitle} hint="This will be displayed below the title in the signup modal.">
        {({ id, invalid, describedBy }) => <Input id={id} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} disabled={!canEdit || saving} maxLength={255} placeholder="Enter modal subtitle" aria-invalid={invalid || undefined} aria-describedby={describedBy} />}
      </Field>
      <Field label="Modal Image" error={errors.image} hint="Recommended size: 400x400px or larger. Supported formats: JPG, PNG, WebP (max 10MB).">
        {({ id, describedBy }) => <input key={inputKey} id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={!canEdit || saving} aria-describedby={describedBy} className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-[13px] file:font-medium" />}
      </Field>
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-ink-soft">{preview ? "New Image (not saved yet)" : "Current Image"}</p>
        {shown ? (
          <Image src={shown} alt="Signup modal" width={240} height={240} unoptimized className="h-auto max-h-60 w-auto max-w-full rounded-lg border border-line object-contain" />
        ) : (
          <p className="text-sm text-ink-muted">No image uploaded yet.</p>
        )}
      </div>
      {canEdit && (
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="secondary" onClick={reset} disabled={saving}>
            Reset
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Settings
          </Button>
        </div>
      )}
    </form>
  );
}
