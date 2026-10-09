"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { ProductHtmlEditor } from "@/components/admin/products/product-html-editor";
import { saveHomeContentAction, saveHomeFooterAction, saveHomeSettingsAction } from "@/lib/actions/admin/home-editor";
import { cn } from "@/lib/utils";

const TEXT_FIELDS = [
  ["homePageTitle", "Home page title", false],
  ["metaTitle", "Home meta title", false],
  ["metaDescription", "Home meta description", true],
  ["metaKeywords", "Home meta keywords", false],
  ["marquee", "Home marquee text", true],
  ["notificationTitle", "Topbar notification title", false],
  ["notificationLink", "Topbar notification link", false],
];

/** newhomepage_website.php page title, meta, marquee, top bar, description and footer. */
export function HomePageText({ settings, content, footer, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState("");

  async function run(key, action) {
    setBusy(key);
    const result = await action();
    setBusy("");
    notify({
      message: result?.ok ? result.data?.message || "Saved." : result?.message || "That could not be saved.",
      tone: result?.ok ? "success" : "error",
    });
    if (result?.ok) router.refresh();
  }

  return (
    <div className="space-y-4">
      <SettingsForm settings={settings} canEdit={canEdit} busy={busy === "settings"} onSave={(values) => run("settings", () => saveHomeSettingsAction(values))} />
      <ContentForm content={content} canEdit={canEdit} busy={busy === "content"} onSave={(values) => run("content", () => saveHomeContentAction(values))} />
      <FooterForm footer={footer} canEdit={canEdit} busy={busy === "footer"} onSave={(categories) => run("footer", () => saveHomeFooterAction(categories))} />
    </div>
  );
}

function SettingsForm({ settings, canEdit, busy, onSave }) {
  const [values, setValues] = useState(settings || {});
  useEffect(() => setValues(settings), [settings]);
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));
  return (
    <Card>
      <CardHeader title="Homepage text" description="Home page title, meta tags, marquee, and the top bar notification." />
      <CardBody>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSave(values); }}>
          {TEXT_FIELDS.map(([name, label, area]) => {
            const rich = name === "homePageTitle" || hasHtml(values[name]);
            return (
              <Field key={name} label={label} required={name !== "notificationLink"} className={area || name === "metaKeywords" || rich ? "sm:col-span-2" : ""}>
                {({ id }) =>
                  rich ? (
                    <InlineHtmlField id={id} value={values[name] || ""} disabled={!canEdit} onChange={(next) => setValues((current) => ({ ...current, [name]: next }))} />
                  ) : area ? (
                    <Textarea id={id} value={values[name] || ""} onChange={set(name)} disabled={!canEdit} />
                  ) : (
                    <Input id={id} value={values[name] || ""} onChange={set(name)} disabled={!canEdit} />
                  )
                }
              </Field>
            );
          })}
          {canEdit && (
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" loading={busy}>
                Save text
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}

function ContentForm({ content, canEdit, busy, onSave }) {
  const [title, setTitle] = useState(content?.title || "");
  const [description, setDescription] = useState(content?.description || "");
  useEffect(() => {
    setTitle(content.title || "");
    setDescription(content.description || "");
  }, [content]);
  return (
    <Card>
      <CardHeader title="Homepage description" description="The title and HTML shown in the homepage description block." />
      <CardBody>
        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave({ title, description }); }}>
          <Field label="Title" required>
            {({ id }) =>
              hasHtml(title) ? (
                <InlineHtmlField id={id} value={title} disabled={!canEdit} onChange={setTitle} />
              ) : (
                <Input id={id} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} disabled={!canEdit} />
              )
            }
          </Field>
          <Field label="Description" required>
            {() => <ProductHtmlEditor value={description} onChange={setDescription} />}
          </Field>
          {canEdit && (
            <Button type="submit" variant="primary" loading={busy}>
              Save description
            </Button>
          )}
        </form>
      </CardBody>
    </Card>
  );
}

function FooterForm({ footer, canEdit, busy, onSave }) {
  const rows = Array.isArray(footer) ? footer : [];
  const [categories, setCategories] = useState(rows.length ? rows : [{ name: "", items: [{ keyword: "", link: "" }] }]);
  useEffect(() => setCategories(rows.length ? rows : [{ name: "", items: [{ keyword: "", link: "" }] }]), [footer]);
  const update = (index, patch) => setCategories((current) => current.map((category, i) => (i === index ? { ...category, ...patch } : category)));
  return (
    <Card>
      <CardHeader
        title="Footer categories and keywords"
        description="Each category has a name, and each row has a keyword and a link. Saving replaces the footer."
        actions={
          canEdit ? (
            <Button size="sm" onClick={() => setCategories((current) => [...current, { name: "", items: [{ keyword: "", link: "" }] }])}>
              Add category
            </Button>
          ) : null
        }
      />
      <CardBody className="space-y-4">
        {categories.map((category, index) => (
          <div key={category.id ?? `new-${index}`} className="space-y-3 rounded-lg border border-line p-3">
            <div className="flex flex-wrap items-end gap-2">
              <Field label="Category name" className="min-w-[200px] flex-1" required>
                {({ id }) => <Input id={id} value={category.name} disabled={!canEdit} onChange={(event) => update(index, { name: event.target.value })} />}
              </Field>
              {canEdit && (
                <Button size="sm" variant="ghost" className="text-danger-ink" onClick={() => setCategories((current) => current.filter((_, i) => i !== index))}>
                  Remove category
                </Button>
              )}
            </div>
            {category.items.map((item, itemIndex) => (
              <div key={item.id ?? `item-${itemIndex}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  value={item.keyword}
                  placeholder="Keyword"
                  aria-label="Keyword"
                  disabled={!canEdit}
                  onChange={(event) => update(index, { items: category.items.map((row, i) => (i === itemIndex ? { ...row, keyword: event.target.value } : row)) })}
                />
                <Input
                  value={item.link}
                  placeholder="Link"
                  aria-label="Link"
                  disabled={!canEdit}
                  onChange={(event) => update(index, { items: category.items.map((row, i) => (i === itemIndex ? { ...row, link: event.target.value } : row)) })}
                />
                {canEdit && (
                  <Button size="sm" variant="ghost" onClick={() => update(index, { items: category.items.filter((_, i) => i !== itemIndex) })}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {canEdit && (
              <Button size="sm" onClick={() => update(index, { items: [...category.items, { keyword: "", link: "" }] })}>
                Add keyword
              </Button>
            )}
          </div>
        ))}
        {canEdit && (
          <Button
            variant="primary"
            loading={busy}
            onClick={() => onSave(categories.map(({ name, items }) => ({ name, items: items.map(({ keyword, link }) => ({ keyword, link })) })))}
          >
            Save footer
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

function hasHtml(value) {
  return /<\/?[a-z][^>]*>/i.test(String(value ?? ""));
}

/** Compact title editor. Renders stored spans, and writes the same color markup back. */
function InlineHtmlField({ id, value, onChange, disabled }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (sameTitle(serializeTitle(node), value)) return;
    node.innerHTML = value || "";
  }, [value]);

  const publish = () => {
    const node = ref.current;
    if (!node || disabled) return;
    const next = serializeTitle(node);
    onChange(sameTitle(next, value) ? value : next);
  };

  return (
    <div
      id={id}
      ref={ref}
      role="textbox"
      aria-multiline="false"
      contentEditable={disabled ? "false" : "true"}
      suppressContentEditableWarning
      onInput={publish}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.preventDefault();
      }}
      className={cn(
        "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-ink outline-none",
        "hover:border-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20",
        disabled && "bg-surface-muted text-ink-muted"
      )}
    />
  );
}

function sameTitle(next, stored) {
  return serializeHtml(next) === serializeHtml(stored);
}

function serializeHtml(html) {
  if (typeof document === "undefined") return String(html ?? "");
  const holder = document.createElement("div");
  holder.innerHTML = html || "";
  return serializeTitle(holder);
}

function serializeTitle(root) {
  return [...root.childNodes].map(serializeNode).join("");
}

function serializeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent || "");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const tag = node.tagName.toLowerCase();
  if (tag === "br") return "";
  const inner = [...node.childNodes].map(serializeNode).join("");
  const color = hexColor(node.getAttribute("style") || node.style?.color || "");
  if ((tag === "span" || tag === "font") && color) return `<span style='color:${color};'>${inner}</span>`;
  return inner;
}

function hexColor(value) {
  const matched = String(value).toLowerCase().match(/color\s*:\s*([^;]+)/);
  const raw = (matched ? matched[1] : String(value)).trim().toLowerCase().replace(/\s+/g, "");
  const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const body = hex[1].length === 3 ? [...hex[1]].map((char) => char + char).join("") : hex[1];
    return `#${body}`;
  }
  const rgb = raw.match(/^rgba?\((\d+),(\d+),(\d+)/);
  if (!rgb) return "";
  return `#${[rgb[1], rgb[2], rgb[3]].map((part) => Number(part).toString(16).padStart(2, "0")).join("")}`;
}

function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
