"use client";

import { Card } from "@/components/ui/card";

const orders = [
  {
    id: "#ORD1021",
    date: "2025-11-25",
    customer: "Rahul",
    amount: "₹1,250",
    status: "Shipped",
  },
  {
    id: "#ORD1022",
    date: "2025-11-26",
    customer: "Priya",
    amount: "₹980",
    status: "Delivered",
  },
  {
    id: "#ORD1023",
    date: "2025-11-26",
    customer: "Aman",
    amount: "₹750",
    status: "Processing",
  },
];

export default function OrdersList() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order List</h2>

      <Card className="p-4">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.date}</td>
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2 font-medium">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
