"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Dummy chart data
const salesData = [
  { day: "Mon", sales: 2400 },
  { day: "Tue", sales: 3200 },
  { day: "Wed", sales: 2800 },
  { day: "Thu", sales: 3500 },
  { day: "Fri", sales: 4100 },
  { day: "Sat", sales: 3000 },
  { day: "Sun", sales: 3800 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Fashion", value: 300 },
  { name: "Home", value: 200 },
  { name: "Beauty", value: 150 },
];

const COLORS = ["#4F46E5", "#16A34A", "#DC2626", "#F59E0B"];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Business Dashboard</h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">4,321</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">₹12,45,200</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Active Vendors</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">1,234</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>RTO %</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">4.2%</p></CardContent>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-3 gap-4">
        
        {/* Line Chart */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Weekly Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4F46E5"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>Top Categories</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
