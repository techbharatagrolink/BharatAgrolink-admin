"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const rtoData = [
  { reason: "Fake Address", count: 120 },
  { reason: "Customer Cancel", count: 95 },
  { reason: "COD Refusal", count: 150 },
  { reason: "Unreachable", count: 78 },
];

export default function RTOPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">RTO Analysis</h2>

      <Card className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rtoData}>
            <XAxis dataKey="reason" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff6b6b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
