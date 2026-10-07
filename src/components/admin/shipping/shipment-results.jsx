import { Badge } from "@/components/ui/badge";

/** Per-vendor outcome of a booking call, as returned by the API. */
export function ShipmentResults({ vendors = [] }) {
  if (!vendors.length) return <p className="text-sm text-ink-muted">No parcels were processed.</p>;
  return (
    <ul className="divide-y divide-line rounded-lg border border-line">
      {vendors.map((v) => (
        <li key={v.vendorId} className="space-y-1 px-3 py-2.5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-ink">{v.vendorName || v.vendorId}</span>
            <Badge tone={v.success ? "success" : "danger"}>{v.success ? "Booked" : "Failed"}</Badge>
          </div>
          {v.success ? (
            <p className="text-xs text-ink-muted">
              AWB <span className="font-mono text-ink">{v.awb}</span>
              {v.courierName ? ` · ${v.courierName}` : ""}
              {v.status ? ` · ${v.status}` : ""}
              {v.trackingUrl && (
                <>
                  {" · "}
                  <a href={v.trackingUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Track</a>
                </>
              )}
              {v.labelUrl && (
                <>
                  {" · "}
                  <a href={v.labelUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Label</a>
                </>
              )}
            </p>
          ) : (
            <p className="text-xs text-danger-ink">{v.error}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
