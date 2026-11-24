import {
  AlertTriangle,
  Ban,
  ClipboardList,
  Clock,
  Layers,
  Package,
  PackageCheck,
  PackageOpen,
  Percent,
  RotateCcw,
  Route,
  Scale,
  Send,
  Truck,
  XCircle,
} from "lucide-react";
import { KpiCard as StatCard } from "@/components/admin/dashboard/zoho";
import { dashboardFilterHref } from "@/lib/services/admin/main-dashboard";
import { BUCKET_DRILL, METRIC_DRILL, snapshotHash } from "@/lib/services/admin/order-status";
import { formatDateTime, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const BUCKET_CARD = {
  P: { icon: ClipboardList, tone: "neutral", hint: "Not manifested" },
  M: { icon: PackageOpen, tone: "warning", hint: "Manifest created, not picked up" },
  I: { icon: Truck, tone: "info", hint: "With the courier" },
  O: { icon: Route, tone: "info", hint: "Out for delivery" },
  D: { icon: PackageCheck, tone: "brand", hint: "Delivered" },
  J: { icon: XCircle, tone: "danger", hint: "Rejected" },
  C: { icon: Ban, tone: "danger", hint: "Cancelled" },
  R: { icon: RotateCcw, tone: "danger", hint: "Return to origin" },
};

function Grid({ children, className }) {
  return <div className={cn("z-stagger grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 2xl:grid-cols-5", className)}>{children}</div>;
}

function Group({ title, note, children }) {
  return (
    <div className="mt-4 first:mt-0">
      <h3 className="mb-2 flex items-baseline gap-2 text-xs font-semibold tracking-wide text-[var(--z-soft)] uppercase">
        {title}
        {note && <span className="font-normal tracking-normal text-[var(--z-muted)] normal-case">{note}</span>}
      </h3>
      {children}
    </div>
  );
}

/**
 * Orders overview from the canonical sub-order dataset (Order Analytics V2.0).
 * Every count opens its exact list; rate cards open their numerator records with the denominator shown.
 * `performanceExtra` are existing rate cards kept as they are (event-date RTO rate);
 * `extra` the remaining non-status order cards (value, AOV, returns, repeat...).
 */
export function OrderStatusOverview({ summary: s, params, performanceExtra, extra }) {
  const snap = snapshotHash(s.snapshot.id);
  const href = (seg) => {
    const base = dashboardFilterHref(`/admin/dashboard/order-status/${seg}`, params);
    return `${base}${base.includes("?") ? "&" : "?"}snap=${snap}`;
  };
  const T = s.totals.subOrders;
  const o = s.overview;
  const share = (n) => (T > 0 ? `${((n / T) * 100).toFixed(2)}% of sub-orders` : "N/A");
  const rec = s.reconciliation;
  const buckets = s.buckets.filter((b) => b.key !== "U");
  const unmapped = s.buckets.find((b) => b.key === "U");

  return (
    <>
      <Group title="Order overview" note={`B2C · ${s.filters.cohort}`}>
        <Grid>
          <StatCard label="Total orders (B2C)" value={formatNumber(o.totalOrders)} hint="Distinct parent order IDs" icon={ClipboardList} href={href("orders")} />
          <StatCard label="Total sub-orders" value={formatNumber(T)} hint="One per seller in an order (T)" icon={Layers} tone="neutral" href={href("total")} />
          <StatCard label="Pending dispatch" value={formatNumber(o.pendingDispatch)} hint={`Placed + Manifested · ${share(o.pendingDispatch)}`} icon={Clock} tone="warning" href={href("pending")} />
          <StatCard label="Dispatched" value={formatNumber(o.dispatched)} hint={`In Transit + OFD + Delivered + RTO · ${share(o.dispatched)}`} icon={Send} tone="info" href={href("dispatched")} />
          <StatCard label="Active shipments" value={formatNumber(o.activeShipments)} hint={`In Transit + OFD · ${share(o.activeShipments)}`} icon={Truck} tone="info" href={href("active")} />
        </Grid>
      </Group>

      <Group title="Current status overview" note="each sub-order counted once · share of T">
        <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
          {buckets.map((b) => {
            const c = BUCKET_CARD[b.key];
            return <StatCard key={b.key} label={b.label} value={formatNumber(b.count)} hint={`${b.display} · ${c.hint}`} icon={c.icon} tone={c.tone} href={href(BUCKET_DRILL[b.key])} />;
          })}
        </Grid>
      </Group>

      <Group title="Performance overview" note="rates open their numerator records">
        <Grid className="lg:grid-cols-3 2xl:grid-cols-3">
          {s.performance.map((m) => (
            <StatCard
              key={m.key}
              label={m.label}
              value={m.display}
              hint={`${m.formula} · ${formatNumber(m.numerator)} / ${formatNumber(m.denominator)}`}
              icon={Percent}
              tone={m.key === "rtoShare" || m.key === "finalRto" ? "danger" : m.key === "pendingRate" ? "warning" : "brand"}
              href={href(METRIC_DRILL[m.key])}
            />
          ))}
          <StatCard label="Unsuccessful sub-orders" value={formatNumber(o.unsuccessful)} hint={`Rejected + Cancelled + RTO · ${share(o.unsuccessful)}`} icon={AlertTriangle} tone="danger" href={href("unsuccessful")} />
          {performanceExtra}
        </Grid>
      </Group>

      {extra && (
        <Group title="Order value & customers">
          <Grid>{extra}</Grid>
        </Group>
      )}

      <Group title="Reconciliation" note={`last refresh ${formatDateTime(s.snapshot.asOf)} · snapshot ${snap}`}>
        <Grid>
          <StatCard
            label="Business difference"
            value={formatNumber(rec.businessDifference)}
            hint="T − (P + M + I + O + D + J + C + R)"
            icon={Scale}
            tone={rec.businessDifference === 0 ? "brand" : "danger"}
            href={rec.businessDifference ? href("unmapped") : undefined}
          />
          <StatCard label="Diagnostic difference" value={formatNumber(rec.diagnosticDifference)} hint="T − (all buckets + Unmapped)" icon={Scale} tone={rec.diagnosticDifference === 0 ? "brand" : "danger"} />
          <StatCard
            label="Unmapped / conflict"
            value={formatNumber(unmapped?.count ?? 0)}
            hint={unmapped?.count ? `${unmapped.display} · needs mapping or data fix` : "None"}
            icon={AlertTriangle}
            tone={unmapped?.count ? "danger" : "brand"}
            href={unmapped?.count ? href("unmapped") : undefined}
          />
          <StatCard label="Mixed-status sub-orders" value={formatNumber(rec.mixedStatusSubOrders)} hint="Lines differ; resolved by the sub-order rule" icon={Package} tone="neutral" href={rec.mixedStatusSubOrders ? href("mixed") : undefined} />
          <StatCard
            label="Lines without parent order"
            value={formatNumber(rec.orphanLines)}
            hint={`${formatNumber(rec.orphanSubOrders)} sub-orders · not eligible, excluded from T`}
            icon={AlertTriangle}
            tone={rec.orphanLines ? "warning" : "brand"}
          />
          <StatCard
            label="Excluded (Lost)"
            value={formatNumber(rec.excludedSubOrders ?? 0)}
            hint="Lost parcels · kept out of T by business decision"
            icon={AlertTriangle}
            tone="neutral"
          />
        </Grid>
        {!(rec.assertions.rowsEqualDistinctIds && rec.assertions.baseIdCoverage) && (
          <p className="mt-2 text-xs text-danger-ink" role="alert">
            Integrity check failed: canonical rows do not match the distinct base sub-order IDs ({formatNumber(T)} vs {formatNumber(rec.assertions.baseIds)}).
          </p>
        )}
      </Group>
    </>
  );
}
