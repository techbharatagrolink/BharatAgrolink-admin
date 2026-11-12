"use client";

import Link from "next/link";
import { useState } from "react";
import { loadProductPricingAction, previewProductPricingAction } from "@/lib/actions/admin/pricing-factors";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatNumber } from "@/lib/format";

const VERDICT_LABEL = { loss: "Loss-making", below_floor: "Below floor CM" };
const VERDICT_TONE = { loss: "danger", below_floor: "warning" };

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(rows) {
  const header = ["Product ID", "Name", "SKU", "Vendor", "Category", "Verdict", "Contribution Margin", "Take Rate %", "Display Price", "Stock"];
  const lines = [header, ...rows.map((r) => [r.id, r.name, r.sku, r.vendor, r.category, r.verdict, r.contributionMargin, r.takeRate, r.display, r.stock])];
  const csv = lines.map((line) => line.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `profitability-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Asks the pricing engine's own FROM_ACTUALS solve what take rate would hit the live target margin — never saves anything. */
async function suggestCorrection(id) {
  const loaded = await loadProductPricingAction(id, 0);
  if (!loaded.ok) return { error: loaded.message };
  const p = loaded.pricing;
  const targetMarginBps = p.config?.defaultTargetMarginBps;
  const body = {
    mode: "FROM_ACTUALS",
    targetMarginBps,
    mrp: p.input.mrp,
    nrv: p.input.nrv,
    gstPercent: p.input.gstPercent,
    hsn: p.input.hsn,
    serviceCodes: p.services?.selected ?? [],
    serviceBasis: p.services?.basis ?? "ORDER_VALUE",
    factors: (p.result.factors || []).map((f) => ({ code: f.code, overridden: f.overridden, actual: f.overridden ? f.actualAmount : "", notes: f.notes || "" })),
  };
  const preview = await previewProductPricingAction(id, body);
  if (!preview.ok) return { error: preview.message };
  return {
    current: { takeRate: p.result.takeRate, displayPrice: p.result.displayPrice },
    suggested: { takeRate: preview.pricing.result.takeRate, displayPrice: preview.pricing.result.displayPrice },
    targetPct: targetMarginBps != null ? (targetMarginBps / 100).toFixed(2) : "—",
  };
}

function SuggestionRow({ id }) {
  const [state, setState] = useState({ status: "idle" });

  const run = async () => {
    setState({ status: "loading" });
    const result = await suggestCorrection(id);
    setState(result.error ? { status: "error", message: result.error } : { status: "done", ...result });
  };

  if (state.status === "idle") {
    return (
      <button type="button" onClick={run} className="text-xs font-medium text-brand-700 hover:underline">
        Suggest correction
      </button>
    );
  }
  if (state.status === "loading") return <span className="text-xs text-ink-muted">Calculating…</span>;
  if (state.status === "error") return <span className="text-xs text-danger-ink">{state.message}</span>;
  return (
    <div className="text-xs">
      <p className="text-ink-muted">
        To hit {state.targetPct}% contribution: take rate {state.current.takeRate}% <span className="text-ink-muted">→</span>{" "}
        <span className="font-medium text-ink">{state.suggested.takeRate}%</span>
      </p>
      <p className="text-ink-muted">
        Display price {formatINR(state.current.displayPrice)} <span className="text-ink-muted">→</span>{" "}
        <span className="font-medium text-ink">{formatINR(state.suggested.displayPrice)}</span>
      </p>
      <Link href={`/admin/products/${id}`} className="font-medium text-brand-700 hover:underline">
        Open product to apply →
      </Link>
    </div>
  );
}

export function ProfitabilityAuditTable({ rows }) {
  return (
    <div>
      <div className="flex justify-end border-b border-line p-3">
        <button type="button" onClick={() => downloadCsv(rows)} className="text-xs font-medium text-brand-700 hover:underline">
          Download CSV
        </button>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
              <th scope="col" className="px-4 py-2.5">Product</th>
              <th scope="col" className="px-4 py-2.5">Vendor</th>
              <th scope="col" className="px-4 py-2.5">Verdict</th>
              <th scope="col" className="px-4 py-2.5 text-right">Contribution margin</th>
              <th scope="col" className="px-4 py-2.5 text-right">Take rate</th>
              <th scope="col" className="px-4 py-2.5 text-right">Display price</th>
              <th scope="col" className="px-4 py-2.5">Correction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id} className="align-top hover:bg-surface-muted/60">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/products/${r.id}`} className="font-medium text-brand-700 hover:underline">
                    {r.name}
                  </Link>
                  <div className="text-xs text-ink-muted">{r.sku} · {r.category}</div>
                </td>
                <td className="px-4 py-2.5 text-ink-soft">{r.vendor}</td>
                <td className="px-4 py-2.5">
                  <Badge tone={VERDICT_TONE[r.verdict] || "neutral"}>{VERDICT_LABEL[r.verdict] || r.verdict}</Badge>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(r.contributionMargin)}</td>
                <td className="px-4 py-2.5 text-right tabular">{r.takeRate}%</td>
                <td className="px-4 py-2.5 text-right tabular">{formatINR(r.display)}</td>
                <td className="px-4 py-2.5">
                  <SuggestionRow id={r.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2.5 border-t border-line p-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/admin/products/${r.id}`} className="font-medium text-brand-700 hover:underline">
                {r.name}
              </Link>
              <Badge tone={VERDICT_TONE[r.verdict] || "neutral"}>{VERDICT_LABEL[r.verdict] || r.verdict}</Badge>
            </div>
            <p className="text-xs text-ink-muted">{r.sku} · {r.vendor} · {r.category}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
              <div><dt className="text-xs text-ink-muted">Contribution margin</dt><dd className="font-medium text-ink">{formatINR(r.contributionMargin)}</dd></div>
              <div><dt className="text-xs text-ink-muted">Take rate</dt><dd className="text-ink-soft">{r.takeRate}%</dd></div>
              <div><dt className="text-xs text-ink-muted">Display price</dt><dd className="text-ink-soft">{formatINR(r.display)}</dd></div>
              <div><dt className="text-xs text-ink-muted">Stock</dt><dd className="text-ink-soft">{formatNumber(r.stock)}</dd></div>
            </dl>
            <div className="mt-2">
              <SuggestionRow id={r.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
