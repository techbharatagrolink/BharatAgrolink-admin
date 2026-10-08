"use client";

import { useState } from "react";
import { pincodeAction, serviceabilityAction, shippingCostAction } from "@/lib/actions/admin/parity/ops";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

const EMPTY = { pickupPincode: "", deliveryPincode: "", weightKg: "0.5", codAmount: "" };
const digits = (v) => v.replace(/\D/g, "").slice(0, 6);

function ShipmentFields({ values, onChange }) {
  const set = (key, clean = (v) => v) => (e) => onChange({ ...values, [key]: clean(e.target.value) });
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Field label="Pickup Pincode" required>
        {({ id }) => <Input id={id} inputMode="numeric" value={values.pickupPincode} onChange={set("pickupPincode", digits)} placeholder="6-digit pincode" required />}
      </Field>
      <Field label="Delivery Pincode" required>
        {({ id }) => <Input id={id} inputMode="numeric" value={values.deliveryPincode} onChange={set("deliveryPincode", digits)} placeholder="6-digit pincode" required />}
      </Field>
      <Field label="Weight (kg)" required>
        {({ id }) => <Input id={id} type="number" min="0.1" step="0.1" value={values.weightKg} onChange={set("weightKg")} required />}
      </Field>
      <Field label="COD Amount">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={values.codAmount} onChange={set("codAmount")} placeholder="0 for prepaid" />}</Field>
    </div>
  );
}

function useRunner(action) {
  const [state, setState] = useState({ busy: false, result: null });
  async function run(input) {
    setState({ busy: true, result: null });
    setState({ busy: false, result: await action(input) });
  }
  return [state, run];
}

function OptionCard({ option }) {
  return (
    <div className="rounded-lg border border-line p-3 text-[13px]">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-ink">{option.name ?? option.courierName}</p>
        <p className="font-semibold text-brand-700 tabular">{formatINR(option.totalCharges)}</p>
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-ink-soft">
        <div>
          <dt className="text-[11px] text-ink-muted uppercase">Freight</dt>
          <dd className="tabular">{formatINR(option.freightCharges)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-muted uppercase">COD Charges</dt>
          <dd className="tabular">{formatINR(option.codCharges)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-muted uppercase">Estimated Days</dt>
          <dd>{option.estimatedDays || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

function ServiceabilityCheck() {
  const [values, setValues] = useState(EMPTY);
  const [{ busy, result }, run] = useRunner(serviceabilityAction);
  return (
    <Card>
      <CardHeader title="Serviceability Check" description="Check whether Delhivery serves a pickup and delivery pincode pair." />
      <CardBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(values);
          }}
          className="space-y-3"
        >
          <ShipmentFields values={values} onChange={setValues} />
          <Button type="submit" variant="primary" loading={busy}>
            Check Serviceability
          </Button>
        </form>
        {result && !result.ok && <Notice tone="danger" className="mt-3">{result.message}</Notice>}
        {result?.ok && !result.data.serviceable && (
          <Notice tone="warning" title="Not Serviceable" className="mt-3">
            {result.data.message || "Delhivery does not serve this route."}
          </Notice>
        )}
        {result?.ok && result.data.serviceable && (
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {result.data.options.map((option, i) => (
              <OptionCard key={`${option.name}-${i}`} option={option} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

const yesNo = (v) => <Badge tone={v ? "success" : "danger"}>{v ? "Yes" : "No"}</Badge>;

function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [{ busy, result }, run] = useRunner(pincodeAction);
  const data = result?.ok ? result.data : null;
  return (
    <Card>
      <CardHeader title="Pincode Serviceability" description="Look up what Delhivery offers at a single pincode." />
      <CardBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(pincode);
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <Field label="Pincode" required className="w-48">
            {({ id }) => <Input id={id} inputMode="numeric" value={pincode} onChange={(e) => setPincode(digits(e.target.value))} placeholder="6-digit pincode" required />}
          </Field>
          <Button type="submit" variant="primary" loading={busy}>
            Check Pincode
          </Button>
        </form>
        {result && !result.ok && <Notice tone="danger" className="mt-3">{result.message}</Notice>}
        {data && (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-ink">{data.pincode}</span>
              <Badge tone={data.serviceable ? "success" : "danger"}>{data.serviceable ? "Serviceable" : "Not Serviceable"}</Badge>
              {data.remark && <span className="text-ink-muted">{data.remark}</span>}
            </div>
            {data.details.length === 0 ? (
              <Notice tone="warning">Non-serviceable zone (NSZ): Delhivery returned no data for this pincode.</Notice>
            ) : (
              <MiniTable
                columns={[
                  { key: "pincode", label: "Pincode" },
                  { key: "serviceable", label: "Serviceable", render: (r) => yesNo(r.serviceable) },
                  { key: "prePaid", label: "Pre-Paid", render: (r) => r.prePaid || "—" },
                  { key: "cod", label: "COD", render: (r) => r.cod || "—" },
                  { key: "pickup", label: "Pickup", render: (r) => r.pickup || "—" },
                  { key: "replacement", label: "Replacement", render: (r) => r.replacement || "—" },
                  { key: "remark", label: "Remark", render: (r) => r.remark || "—" },
                  { key: "center", label: "Delhivery Center", render: (r) => r.center || "—" },
                ]}
                rows={data.details.map((d, i) => ({ ...d, id: `${d.pincode}-${i}` }))}
              />
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function CostCalculator() {
  const [values, setValues] = useState(EMPTY);
  const [{ busy, result }, run] = useRunner(shippingCostAction);
  return (
    <Card>
      <CardHeader title="Calculate Shipping Cost" description="Delhivery freight and COD charges for a shipment." />
      <CardBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(values);
          }}
          className="space-y-3"
        >
          <ShipmentFields values={values} onChange={setValues} />
          <Button type="submit" variant="primary" loading={busy}>
            Calculate Cost
          </Button>
        </form>
        {result && !result.ok && <Notice tone="danger" className="mt-3">{result.message}</Notice>}
        {result?.ok &&
          (result.data.length === 0 ? (
            <Notice tone="warning" className="mt-3">No rates were returned for this route.</Notice>
          ) : (
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {result.data.map((option, i) => (
                <OptionCard key={`${option.courierName}-${i}`} option={option} />
              ))}
            </div>
          ))}
      </CardBody>
    </Card>
  );
}

/** servicebilty_delhivery.php: three independent Delhivery lookups. */
export function ServiceabilityTools() {
  return (
    <div className="space-y-4">
      <ServiceabilityCheck />
      <PincodeCheck />
      <CostCalculator />
    </div>
  );
}
