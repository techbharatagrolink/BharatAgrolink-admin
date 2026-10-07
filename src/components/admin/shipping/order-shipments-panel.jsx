"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { CreateShipmentDialog } from "./create-shipment-dialog";
import { ShipmentActions } from "./shipment-actions";
import { TrackingCell } from "./tracking-cell";

/** Shipments of one order: a parcel per vendor with its AWB, courier, tracking link and actions. */
export function OrderShipmentsPanel({ orderId, rows, error, canAdd, canEdit }) {
  const [creating, setCreating] = useState(false);
  const canCreate = canAdd && rows.some((r) => r.canCreate);
  return (
    <Card>
      <CardHeader
        title="Shipments"
        description="Courier parcels per vendor"
        actions={canCreate ? <Button size="xs" variant="primary" onClick={() => setCreating(true)}>Create shipment</Button> : null}
      />
      {error ? (
        <Notice tone="danger" className="m-4">{error}</Notice>
      ) : rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-ink-muted">No parcels.</p>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.vendorId} className="space-y-2 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{r.vendorName}</p>
                  <StatusBadge status={r.status} className="mt-1" />
                </div>
                <ShipmentActions row={r} canAdd={canAdd} canEdit={canEdit} />
              </div>
              <TrackingCell awb={r.awb} courier={r.courier} carrier={r.carrier} trackingUrl={r.trackingUrl} labelUrl={r.labelUrl} manifestUrl={r.manifestUrl} />
            </li>
          ))}
        </ul>
      )}
      {creating && <CreateShipmentDialog orderId={orderId} open={creating} onClose={() => setCreating(false)} />}
    </Card>
  );
}
