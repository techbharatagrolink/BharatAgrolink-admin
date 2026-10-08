"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/components/auth-provider";
import { errorMessage } from "@/lib/format";

const HIDDEN = new Set(["password", "token", "secret", "html", "content", "products", "permissions", "permissionsJson"]);

function labelOf(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cell(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 77)}…` : text;
}

function rowsOf(data) {
  if (Array.isArray(data)) return { rows: data, total: data.length, pageCount: 1 };
  if (data && Array.isArray(data.rows)) return data;
  if (data && Array.isArray(data.items)) return { rows: data.items, total: data.items.length, pageCount: 1 };
  if (data && Array.isArray(data.funnel)) return null;
  return null;
}

function columnsOf(rows) {
  const keys = [];
  for (const row of rows.slice(0, 20)) {
    if (!row || typeof row !== "object") continue;
    for (const key of Object.keys(row)) {
      if (HIDDEN.has(key) || keys.includes(key)) continue;
      const value = row[key];
      if (value && typeof value === "object") continue;
      keys.push(key);
    }
  }
  return keys.length ? keys : ["value"];
}

function Summary({ data }) {
  if (data === null || data === undefined) return <p className="text-sm text-muted-foreground">No records.</p>;
  if (Array.isArray(data)) {
    return <RecordTable rows={data} />;
  }
  const entries = Object.entries(data).filter(([key]) => !HIDDEN.has(key));
  return (
    <div className="space-y-6">
      {entries.map(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          const fields = Object.entries(value).filter(([name, field]) => !HIDDEN.has(name) && (field === null || typeof field !== "object"));
          if (!fields.length) return null;
          return (
            <section key={key}>
              <h2 className="mb-2 text-sm font-semibold">{labelOf(key)}</h2>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map(([name, field]) => (
                  <div key={name} className="rounded-lg border px-3 py-2">
                    <dt className="text-xs text-muted-foreground">{labelOf(name)}</dt>
                    <dd className="truncate text-sm font-medium">{cell(field)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        }
        if (Array.isArray(value)) {
          return (
            <section key={key}>
              <h2 className="mb-2 text-sm font-semibold">{labelOf(key)}</h2>
              <RecordTable rows={value.slice(0, 25)} />
            </section>
          );
        }
        return (
          <div key={key} className="flex max-w-xl items-baseline justify-between gap-4 border-b py-2 text-sm">
            <span className="text-muted-foreground">{labelOf(key)}</span>
            <span className="truncate font-medium">{cell(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

function RecordTable({ rows }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">No records.</p>;
  const columns = columnsOf(rows);
  return (
    <div className="max-h-[70vh] overflow-auto rounded-xl border border-line">
      <table className="w-max min-w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="sticky top-0 z-10 whitespace-nowrap border-b bg-surface px-3 py-2 text-left text-xs font-semibold text-ink-muted">
                {labelOf(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? row.review_id ?? row.session_id ?? index} className="border-b last:border-0 hover:bg-surface-muted">
              {columns.map((column) => (
                <td key={column} className="max-w-64 truncate whitespace-nowrap px-3 py-2" title={cell(row?.[column])}>
                  {cell(row?.[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScreenView({ screen }) {
  const request = useApi();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request(screen.api, {
        query: screen.kind === "list" ? { page, pageSize: 25, q: query, ...(screen.query || {}) } : screen.query,
      });
      setPayload(result.data);
    } catch (err) {
      setPayload(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query, request, screen.api, screen.kind, screen.query]);

  useEffect(() => {
    load();
  }, [load]);

  const list = screen.kind === "list" ? rowsOf(payload) : null;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">{screen.title}</h1>
        </div>
        {screen.kind === "list" ? (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setQuery(q.trim());
            }}
          >
            <Input aria-label={`Search ${screen.title}`} placeholder="Search" value={q} onChange={(event) => setQ(event.target.value)} />
            <Button type="submit">Search</Button>
          </form>
        ) : null}
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
      {!loading && !error && list ? <RecordTable rows={list.rows || []} /> : null}
      {!loading && !error && !list ? <Summary data={payload} /> : null}

      {list && (list.pageCount || 1) > 1 ? (
        <div className="flex items-center gap-2 text-sm">
          <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {list.pageCount}
          </span>
          <Button type="button" variant="outline" disabled={page >= list.pageCount} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
