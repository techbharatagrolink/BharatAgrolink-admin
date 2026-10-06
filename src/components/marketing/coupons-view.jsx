"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceTable } from "@/components/resource-table";

export function CouponsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Coupons</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coupon codes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            path="/coupons"
            columns={[
              { key: "code", label: "Code" },
              { key: "name", label: "Name" },
              { key: "type", label: "Type" },
              { key: "value", label: "Value" },
              { key: "status", label: "Status", badge: true },
              { key: "expiresAt", label: "Expires", date: true },
            ]}
            emptyLabel="No coupons."
          />
        </CardContent>
      </Card>
    </div>
  );
}
