"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceTable } from "@/components/resource-table";

export function SupportView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Customer Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            path="/support/tickets"
            columns={[
              { key: "id", label: "Ticket" },
              { key: "user", label: "User" },
              { key: "category", label: "Type" },
              { key: "priority", label: "Priority" },
              { key: "status", label: "Status", badge: true },
            ]}
            emptyLabel="No tickets."
          />
        </CardContent>
      </Card>
    </div>
  );
}
