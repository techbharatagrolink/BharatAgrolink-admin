"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResourceTable } from "@/components/resource-table";

export function CouponsView() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState({ q: "", status: "" });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery({ q: q.trim(), status });
          }}
        >
          <Input aria-label="Search coupons" placeholder="Code or name" value={q} onChange={(event) => setQ(event.target.value)} />
          <select
            aria-label="Coupon status"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Button type="submit">Filter</Button>
        </form>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coupon codes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            path="/coupons"
            query={query}
            columns={[
              { key: "code", label: "Code" },
              { key: "name", label: "Name" },
              { key: "type", label: "Type" },
              { key: "value", label: "Value" },
              { key: "userType", label: "Customers" },
              { key: "used", label: "Used" },
              { key: "status", label: "Status", badge: true },
              { key: "expiresAt", label: "Expires", date: true },
            ]}
            actions={[
              { id: "activate", label: "Activate", when: (row) => row.status !== "Active" },
              { id: "deactivate", label: "Deactivate", when: (row) => row.status === "Active" },
            ]}
            emptyLabel="No coupons."
          />
        </CardContent>
      </Card>
    </div>
  );
}
