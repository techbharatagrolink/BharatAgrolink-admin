"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Notice, StatCard, StatGrid } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { ShallowQuery, useQueryState } from "@/components/data-table/use-query-state";
import { payoutSummaryListAction } from "@/lib/actions/admin/payout-summary";
import { PayoutSummaryTable } from "./payout-summary-table";

/**
 * Stats + table of the Vendor Payout Summary. Filters only rewrite the URL (ShallowQuery); the rows
 * for the new URL come from payoutSummaryListAction, so a filter click is one small request, not a page load.
 */
function PayoutSummaryBody({ initialData, cycles }) {
  const { searchParams } = useQueryState();
  const { notify } = useToast();
  const key = searchParams.toString();
  const [view, setView] = useState({ key, data: initialData });
  const [lastInitial, setLastInitial] = useState(initialData);
  const latest = useRef(key);

  // A server render (link or refresh) brings fresh data with it
  if (lastInitial !== initialData) {
    setLastInitial(initialData);
    setView({ key, data: initialData });
  }

  useEffect(() => {
    latest.current = key;
    if (key === view.key) return;
    payoutSummaryListAction(Object.fromEntries(new URLSearchParams(key))).then(
      (result) => {
        if (latest.current !== key) return;
        if (!result?.ok) notify({ message: result?.message || "Vendor payouts could not be loaded.", tone: "error" });
        setView((v) => ({ key, data: result?.ok ? result.data : v.data }));
      },
      () => {
        if (latest.current !== key) return;
        notify({ message: "Vendor payouts could not be loaded.", tone: "error" });
        setView((v) => ({ ...v, key }));
      },
    );
  }, [key, view.key, notify]);

  const loading = key !== view.key;
  const { data } = view;
  const t = data.totals ?? {};
  const cycleText = data.cycle ? data.cycle.cycles.map((c) => c.label).join(" + ") : "";

  return (
    <div className="min-w-0 space-y-4">
      {data.cycle && (
        <Notice title={`Cycle: ${cycleText}`}>
          Orders, Gross, Taxable and Net are the sums of this cycle&apos;s payout items; without a cycle they are the stored vendor payout totals, as in the PHP summary.
        </Notice>
      )}
      <div aria-busy={loading} className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
        <StatGrid className="md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Records" value={formatNumber(t.records)} hint={`${formatNumber(t.pendingItems)} pending items`} />
          <StatCard label="Total BSA" value={formatINR(t.totalBsa)} hint="Paid + pending BSA" tone="info" />
          <StatCard label="Paid BSA" value={formatINR(t.paidBsa)} hint="Items marked paid" />
          <StatCard label="Pending BSA" value={formatINR(t.pendingBsa)} hint="Items still pending" tone="warning" />
        </StatGrid>
        <PayoutSummaryTable data={data} cycles={cycles} />
      </div>
    </div>
  );
}

export function PayoutSummaryView(props) {
  return (
    <ShallowQuery value>
      <PayoutSummaryBody {...props} />
    </ShallowQuery>
  );
}
