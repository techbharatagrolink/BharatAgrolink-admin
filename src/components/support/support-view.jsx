"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResourceTable } from "@/components/resource-table";

const STATUSES = ["Open", "In-Progress", "Awaiting Response", "Resolved", "Closed", "Rejected"];

export function SupportView() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState({ q: "", status: "" });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Customer Support</h1>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery({ q: q.trim(), status });
          }}
        >
          <Input aria-label="Search tickets" placeholder="Subject or user" value={q} onChange={(event) => setQ(event.target.value)} />
          <select
            aria-label="Ticket status"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button type="submit">Filter</Button>
        </form>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            path="/support/tickets"
            query={query}
            columns={[
              { key: "id", label: "Ticket" },
              { key: "subject", label: "Subject" },
              { key: "user", label: "User" },
              { key: "userType", label: "Who" },
              { key: "category", label: "Type" },
              { key: "department", label: "Department" },
              { key: "priority", label: "Priority" },
              { key: "status", label: "Status", badge: true },
              { key: "createdAt", label: "Opened", date: true },
            ]}
            emptyLabel="No tickets."
          />
        </CardContent>
      </Card>
    </div>
  );
}
