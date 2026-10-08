"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";

/** A small GET filter form (the PHP b2bp_toolbar): fields write to the URL on Apply; Reset clears them. */
export function QueryFilters({ fields }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, searchParams.get(f.name) ?? f.defaultValue ?? ""])));

  const apply = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    for (const f of fields) {
      const v = String(values[f.name] ?? "").trim();
      if (v) params.set(f.name, v);
      else params.delete(f.name);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => {
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])));
    router.push(pathname);
  };

  return (
    <form onSubmit={apply} className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-3">
      {fields.map((f) => (
        <Field key={f.name} label={f.label} className={f.type === "search" ? "min-w-56 flex-1" : "w-48"}>
          {({ id }) =>
            f.type === "select" ? (
              <Select id={id} value={values[f.name]} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} options={f.options} placeholder={f.placeholder} />
            ) : (
              <Input id={id} type={f.type === "date" || f.type === "month" ? f.type : "search"} value={values[f.name]} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} placeholder={f.placeholder} maxLength={120} />
            )
          }
        </Field>
      ))}
      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Apply
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </form>
  );
}
