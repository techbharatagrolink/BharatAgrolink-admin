"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { startRouteProgress } from "@/components/admin/shell/route-progress";

const PAGE_SIZES = ["10", "20", "50", "100"];
const SORTS = [
  { value: "DESC", label: "DESC" },
  { value: "ASC", label: "ASC" },
];

/** Numeric status codes first, then labels (the PHP status dropdown order). */
function byCode(a, b) {
  const na = Number.parseInt(a.value, 10);
  const nb = Number.parseInt(b.value, 10);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  if (!Number.isNaN(na)) return -1;
  if (!Number.isNaN(nb)) return 1;
  return a.label.localeCompare(b.label);
}

/**
 * Filters of shiprocket_orders_report.php. The status list is built from the
 * orders loaded so far (the PHP page added every status it had seen), so it
 * keeps growing while the page stays open.
 */
export function ShiprocketFilters({ values, statuses }) {
  const router = useRouter();
  const [seen, setSeen] = useState(statuses);
  const [lastStatuses, setLastStatuses] = useState(statuses);
  if (lastStatuses !== statuses) {
    setLastStatuses(statuses);
    setSeen((list) => [...list, ...statuses.filter((s) => !list.some((x) => x.value === s.value))].sort(byCode));
  }
  const options = [...seen].sort(byCode);

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({ tab: "shiprocket" });
    for (const key of ["q", "status", "pickup", "sort", "from", "to", "perPage"]) {
      const value = String(form.get(key) ?? "").trim();
      if (value && !(key === "sort" && value === "DESC") && !(key === "perPage" && value === "10")) params.set(key, value);
    }
    startRouteProgress();
    router.push(`/admin/shipping?${params}`);
  };

  // PHP's Reset clears the filters but keeps "entries per page".
  const filtered = values.q || values.status || values.pickup || values.from || values.to || values.sort !== "DESC";
  const resetHref = `/admin/shipping?tab=shiprocket${values.perPage !== "10" ? `&perPage=${values.perPage}` : ""}`;
  return (
    <form key={JSON.stringify(values)} onSubmit={submit} className="flex flex-wrap items-end gap-2 border-b border-line px-4 py-3">
      <label className="min-w-56 flex-1 space-y-1 text-xs text-ink-muted">
        Search
        <Input name="q" defaultValue={values.q} placeholder="Order ID, AWB…" />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        Status
        <Select name="status" defaultValue={options.some((o) => o.value === values.status) ? values.status : ""} options={options} placeholder="All Status" />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        Pickup location
        <Input name="pickup" defaultValue={values.pickup} placeholder="Pickup Location" />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        Order
        <Select name="sort" defaultValue={values.sort} options={SORTS} />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        From
        <Input type="date" name="from" defaultValue={values.from} />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        To
        <Input type="date" name="to" defaultValue={values.to} />
      </label>
      <label className="space-y-1 text-xs text-ink-muted">
        Per page
        <Select name="perPage" defaultValue={values.perPage} options={PAGE_SIZES} />
      </label>
      <Button type="submit" size="md">Filter</Button>
      {filtered && <ButtonLink href={resetHref} variant="ghost">Reset</ButtonLink>}
    </form>
  );
}
