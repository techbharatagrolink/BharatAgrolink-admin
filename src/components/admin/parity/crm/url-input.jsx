"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Input } from "@/components/ui/form";

/** Text / number input synced (debounced) to one URL param. */
export function UrlInput({ id, name, label, placeholder, type = "text", className }) {
  const { get, setParams } = useQueryState();
  const urlValue = get(name);
  const [value, setValue] = useState(urlValue);
  const [lastUrl, setLastUrl] = useState(urlValue);
  if (lastUrl !== urlValue) {
    setLastUrl(urlValue);
    setValue(urlValue);
  }
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onChange = (next) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setParams({ [name]: next.trim() }), 400);
  };
  return <Input id={id} type={type} aria-label={label} placeholder={placeholder ?? label} value={value} min={type === "number" ? 1 : undefined} onChange={(e) => onChange(e.target.value)} className={className} />;
}
