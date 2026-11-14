"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Switch, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { savePackageAction, savePlacementAction, saveServiceAction, setActiveAction } from "@/lib/actions/admin/monetization";

/*
 * Monetization Center configuration editors. Each opens a drawer, saves through a server action
 * (permission checked there and by the API) and refreshes the page. The API returns the field
 * errors in plain words; they are shown as a toast.
 */

const digits = (v) => String(v ?? "").replace(/[^\d]/g, "");
const decimal = (v) => String(v ?? "").replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
const FORMATS = ["jpg", "png", "webp", "gif"];
const ROTATIONS = [
  { value: "ROUND_ROBIN", label: "Round robin (take turns)" },
  { value: "RANDOM", label: "Random" },
  { value: "PRIORITY", label: "Priority (oldest approved first)" },
];
const POSITIONS = [
  { value: "INTERLEAVE", label: "Mixed between admin banners" },
  { value: "START", label: "Before admin banners" },
  { value: "END", label: "After admin banners" },
];

function useSave() {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const run = (action, success, onDone) =>
    startTransition(async () => {
      const res = await action();
      notify(res.ok ? { message: success } : { tone: "error", message: res.message });
      if (res.ok) {
        onDone?.();
        router.refresh();
      }
    });
  return { pending, run };
}

/** On / off switch for a service, placement or package (an active package needs a price above 0). */
export function ActiveToggle({ resource, id, active, disabled, label }) {
  const { pending, run } = useSave();
  return (
    <Switch
      checked={active}
      disabled={disabled || pending}
      label={label}
      onChange={(next) => run(() => setActiveAction(resource, id, next), next ? "Activated." : "Deactivated.")}
    />
  );
}

function EditorDrawer({ button, title, description, onSubmit, pending, children, submitLabel = "Save" }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const formId = `form-${title.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <>
      <Button variant={button?.variant ?? "secondary"} size={button?.size ?? "sm"} onClick={() => setOpen(true)}>
        {button?.label ?? "Edit"}
      </Button>
      <Drawer
        open={open}
        onClose={close}
        title={title}
        description={description}
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" form={formId} variant="primary" loading={pending}>
              {submitLabel}
            </Button>
          </>
        }
      >
        <form
          id={formId}
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(close);
          }}
        >
          {children}
        </form>
      </Drawer>
    </>
  );
}

// ---------------------------------------------------------------------------------- package

/** Create (no `pkg`) or edit a fixed-price package. New packages start inactive. */
export function PackageEditor({ pkg, placements, button }) {
  const { pending, run } = useSave();
  const [v, setV] = useState({
    name: pkg?.name ?? "",
    placementId: String(pkg?.placementId ?? placements[0]?.id ?? ""),
    durationDays: String(pkg?.durationDays ?? 7),
    price: String(pkg?.price ?? ""),
    gstRate: String(pkg?.gstRate ?? 18),
    sacCode: pkg?.sacCode ?? "",
    terms: pkg?.terms ?? "",
    sortOrder: String(pkg?.sortOrder ?? 0),
  });
  const set = (k, clean = (x) => x) => (e) => setV((s) => ({ ...s, [k]: clean(e.target.value) }));
  const price = Number(v.price) || 0;
  const gst = Number(v.gstRate) || 0;
  const total = Math.round(price * (1 + gst / 100) * 100) / 100;

  return (
    <EditorDrawer
      button={button}
      title={pkg ? `Edit package: ${pkg.name}` : "New package"}
      description="Paid orders keep the price and terms they were bought with; changes apply to new orders only."
      pending={pending}
      onSubmit={(close) => run(() => savePackageAction(pkg?.id, v), pkg ? "Package saved." : "Package added (inactive). Activate it when ready.", close)}
    >
      <Field label="Placement (ad type)" required hint={pkg?.orderCount ? "This package has orders; those keep their own placement." : null}>
        <Select
          value={v.placementId}
          onChange={set("placementId")}
          options={placements.map((p) => ({ value: String(p.id), label: `${p.name} · ${p.serviceName}` }))}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Package name" required>
          <Input value={v.name} onChange={set("name")} maxLength={120} placeholder="e.g. 15 Days" />
        </Field>
        <Field label="Duration (days)" required>
          <Input inputMode="numeric" value={v.durationDays} onChange={set("durationDays", digits)} className="tabular" />
        </Field>
        <Field label="Price (₹, before GST)" required hint="Must be above 0 to activate.">
          <Input inputMode="decimal" value={v.price} onChange={set("price", decimal)} className="tabular" />
        </Field>
        <Field label="GST rate (%)" hint={`Seller pays ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}>
          <Input inputMode="decimal" value={v.gstRate} onChange={set("gstRate", decimal)} className="tabular" />
        </Field>
        <Field label="SAC code" hint="Printed on the BAN invoice. Confirm with the CA.">
          <Input inputMode="numeric" value={v.sacCode} onChange={set("sacCode", digits)} maxLength={6} className="tabular" />
        </Field>
        <Field label="Sort order">
          <Input inputMode="numeric" value={v.sortOrder} onChange={set("sortOrder", digits)} className="tabular" />
        </Field>
      </div>
      <Field label="Package terms" hint="Shown to the seller before payment and frozen on every order.">
        <Textarea rows={5} value={v.terms} onChange={set("terms")} maxLength={10000} />
      </Field>
    </EditorDrawer>
  );
}

// ---------------------------------------------------------------------------------- placement

export function PlacementEditor({ placement, services, sections, button }) {
  const { pending, run } = useSave();
  const [v, setV] = useState({
    code: placement?.code ?? "",
    name: placement?.name ?? "",
    serviceId: String(placement?.serviceId ?? services[0]?.id ?? ""),
    homeSection: placement?.homeSection ?? sections[0]?.value ?? "",
    maxSlots: String(placement?.maxSlots ?? 1),
    showDesktop: placement?.showDesktop ?? true,
    showMobile: placement?.showMobile ?? true,
    priority: String(placement?.priority ?? 0),
    rotation: placement?.rotation ?? "ROUND_ROBIN",
    paidPosition: placement?.paidPosition ?? "INTERLEAVE",
  });
  const set = (k, clean = (x) => x) => (e) => setV((s) => ({ ...s, [k]: clean(e.target.value) }));
  const fewerSlots = placement && Number(v.maxSlots) < placement.liveAds;

  return (
    <EditorDrawer
      button={button}
      title={placement ? `Edit placement: ${placement.name}` : "New placement"}
      description="Where paid banners show on the storefront, and how many at a time."
      pending={pending}
      onSubmit={(close) => run(() => savePlacementAction(placement?.id, v), placement ? "Placement saved." : "Placement added.", close)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Code" required hint={placement ? "The code cannot change." : "Capital letters, digits, _ e.g. HOME_HERO"}>
          <Input value={v.code} onChange={set("code", (x) => x.toUpperCase())} disabled={Boolean(placement)} maxLength={40} />
        </Field>
        <Field label="Name" required>
          <Input value={v.name} onChange={set("name")} maxLength={120} />
        </Field>
        <Field label="Ad type it accepts" required>
          <Select value={v.serviceId} onChange={set("serviceId")} options={services.map((s) => ({ value: String(s.id), label: s.name }))} />
        </Field>
        <Field label="Homepage section" required hint="Paid banners are mixed into this existing section.">
          <Select value={v.homeSection} onChange={set("homeSection")} options={sections} />
        </Field>
        <Field label="Paid slots at a time" required error={fewerSlots ? `${placement.liveAds} ads are already booked here; new bookings will wait.` : null}>
          <Input inputMode="numeric" value={v.maxSlots} onChange={set("maxSlots", digits)} className="tabular" />
        </Field>
        <Field label="Priority" hint="Higher shows first when placements compete.">
          <Input inputMode="numeric" value={v.priority} onChange={set("priority", digits)} className="tabular" />
        </Field>
        <Field label="Rotation">
          <Select value={v.rotation} onChange={set("rotation")} options={ROTATIONS} />
        </Field>
        <Field label="Position among admin banners">
          <Select value={v.paidPosition} onChange={set("paidPosition")} options={POSITIONS} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Show on desktop" checked={v.showDesktop} onChange={(e) => setV((s) => ({ ...s, showDesktop: e.target.checked }))} />
        <Checkbox label="Show on mobile" checked={v.showMobile} onChange={(e) => setV((s) => ({ ...s, showMobile: e.target.checked }))} />
      </div>
    </EditorDrawer>
  );
}

// ---------------------------------------------------------------------------------- service

export function ServiceEditor({ service, button }) {
  const { pending, run } = useSave();
  const [v, setV] = useState({
    code: service?.code ?? "",
    adFormat: service?.adFormat ?? "BANNER",
    name: service?.name ?? "",
    description: service?.description ?? "",
    desktopWidth: String(service?.desktopWidth ?? ""),
    desktopHeight: String(service?.desktopHeight ?? ""),
    mobileRequired: service?.mobileRequired ?? false,
    mobileWidth: String(service?.mobileWidth ?? ""),
    mobileHeight: String(service?.mobileHeight ?? ""),
    sizeTolerancePct: String(service?.sizeTolerancePct ?? 0),
    allowedFormats: service?.allowedFormats ?? ["jpg", "png", "webp"],
    maxFileKb: String(service?.maxFileKb ?? 2048),
    terms: service?.terms ?? "",
    sortOrder: String(service?.sortOrder ?? 0),
  });
  const set = (k, clean = (x) => x) => (e) => setV((s) => ({ ...s, [k]: clean(e.target.value) }));
  const toggleFormat = (f) =>
    setV((s) => ({ ...s, allowedFormats: s.allowedFormats.includes(f) ? s.allowedFormats.filter((x) => x !== f) : [...s.allowedFormats, f] }));

  return (
    <EditorDrawer
      button={button}
      title={service ? `Edit ad type: ${service.name}` : "New ad type"}
      description="Creative rules the seller's upload is checked against."
      pending={pending}
      onSubmit={(close) => run(() => saveServiceAction(service?.id, v), service ? "Ad type saved." : "Ad type added.", close)}
    >
      {!service && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Code" required hint="e.g. CATEGORY_BANNER">
            <Input value={v.code} onChange={set("code", (x) => x.toUpperCase())} maxLength={40} />
          </Field>
          <Field label="Shape" required>
            <Select value={v.adFormat} onChange={set("adFormat")} options={[{ value: "BANNER", label: "Wide banner" }, { value: "SQUARE", label: "Square 1:1" }]} />
          </Field>
        </div>
      )}
      <Field label="Name" required>
        <Input value={v.name} onChange={set("name")} maxLength={120} />
      </Field>
      <Field label="Description" hint="Shown to sellers.">
        <Textarea rows={2} value={v.description} onChange={set("description")} maxLength={1000} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Desktop width (px)" required>
          <Input inputMode="numeric" value={v.desktopWidth} onChange={set("desktopWidth", digits)} className="tabular" />
        </Field>
        <Field label="Desktop height (px)" required>
          <Input inputMode="numeric" value={v.desktopHeight} onChange={set("desktopHeight", digits)} className="tabular" />
        </Field>
      </div>
      <Checkbox label="Seller must upload a separate mobile creative" checked={v.mobileRequired} onChange={(e) => setV((s) => ({ ...s, mobileRequired: e.target.checked }))} />
      {v.mobileRequired && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mobile width (px)" required>
            <Input inputMode="numeric" value={v.mobileWidth} onChange={set("mobileWidth", digits)} className="tabular" />
          </Field>
          <Field label="Mobile height (px)" required>
            <Input inputMode="numeric" value={v.mobileHeight} onChange={set("mobileHeight", digits)} className="tabular" />
          </Field>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Size tolerance (%)" hint="0 = exact size only.">
          <Input inputMode="decimal" value={v.sizeTolerancePct} onChange={set("sizeTolerancePct", decimal)} className="tabular" />
        </Field>
        <Field label="Max file size (KB)" required>
          <Input inputMode="numeric" value={v.maxFileKb} onChange={set("maxFileKb", digits)} className="tabular" />
        </Field>
        <Field label="Sort order">
          <Input inputMode="numeric" value={v.sortOrder} onChange={set("sortOrder", digits)} className="tabular" />
        </Field>
      </div>
      <Field label="Allowed formats" required>
        <div className="flex flex-wrap gap-4">
          {FORMATS.map((f) => (
            <Checkbox key={f} label={f.toUpperCase()} checked={v.allowedFormats.includes(f)} onChange={() => toggleFormat(f)} />
          ))}
        </div>
      </Field>
      <Field label="Terms and conditions" hint="Shown to the seller and frozen on every order.">
        <Textarea rows={5} value={v.terms} onChange={set("terms")} maxLength={10000} />
      </Field>
    </EditorDrawer>
  );
}
