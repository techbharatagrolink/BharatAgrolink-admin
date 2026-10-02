"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const paymentData = [
  { label: "COD", value: 3200 },
  { label: "Prepaid", value: 1800 },
];

const COLORS = ["#0088FE", "#00C49F"];

export default function PaymentReport() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">COD vs Prepaid Report</h2>

      <Card className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="value"
              nameKey="label"
              outerRadius={100}
            >
              {paymentData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
