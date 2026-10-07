const CARRIER_LABEL = { shiprocket: "Shiprocket", delhivery: "Delhivery", nimbuspost: "NimbusPost" };

export function TrackingCell({ awb, courier, carrier, trackingUrl, labelUrl, manifestUrl }) {
  if (!awb) return <span className="text-xs text-ink-muted">Not shipped</span>;
  return (
    <div className="min-w-0 space-y-0.5">
      {trackingUrl ? (
        <a href={trackingUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-brand-700 hover:underline" title="Track on the courier site">
          {awb}
        </a>
      ) : (
        <span className="font-mono text-xs text-ink">{awb}</span>
      )}
      <p className="max-w-56 truncate text-[11px] text-ink-muted" title={courier || undefined}>
        {[CARRIER_LABEL[carrier] ?? carrier, courier].filter(Boolean).join(" · ")}
      </p>
      {(labelUrl || manifestUrl) && (
        <p className="space-x-2 text-[11px]">
          {labelUrl && <a href={labelUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Label</a>}
          {manifestUrl && <a href={manifestUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Manifest</a>}
        </p>
      )}
    </div>
  );
}
