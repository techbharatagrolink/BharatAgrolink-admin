import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Order Management" };

export default function OrdersDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search order id / customer" aria-label="Search orders" />
          <Button>Filter</Button>
          <Button variant="ghost">Export</Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input type="date" aria-label="Order date" className="w-auto" />
        <select aria-label="Order status" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs">
          <option>All Status</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>RTO</option>
        </select>
        <select aria-label="Payment method" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs">
          <option>All Payments</option>
          <option>COD</option>
          <option>Prepaid</option>
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1023</TableCell>
            <TableCell>Rahul Kumar</TableCell>
            <TableCell>Ekart (AWB: 123456)</TableCell>
            <TableCell>COD</TableCell>
            <TableCell><Badge>Processing</Badge></TableCell>
            <TableCell className="text-right"><Button size="sm" variant="outline">Track</Button></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#1027</TableCell>
            <TableCell>Priya Sharma</TableCell>
            <TableCell>Shiprocket</TableCell>
            <TableCell>Prepaid</TableCell>
            <TableCell><Badge variant="secondary">Shipped</Badge></TableCell>
            <TableCell className="text-right"><Button size="sm" variant="outline">Track</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Reports summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">COD vs Prepaid</div>
          <div className="font-bold text-xl">COD 32% / Prepaid 68%</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">RTO Rate</div>
          <div className="font-bold text-xl">4.2%</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Avg Delivery Time</div>
          <div className="font-bold text-xl">2.3 days</div>
        </div>
      </div>
    </div>
  );
}
