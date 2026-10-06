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

export const metadata = { title: "Product Management" };

export default function ProductsDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search SKU / title" aria-label="Search products" />
          <Button>Add Product</Button>
        </div>
      </header>

      {/* Approval queue */}
      <div>
        <h2 className="text-lg font-medium mb-2">Listing Approval Queue</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>SKU-001</TableCell>
              <TableCell>Wireless Headphones</TableCell>
              <TableCell>ABC Store</TableCell>
              <TableCell>₹1,999</TableCell>
              <TableCell><Badge>Pending</Badge></TableCell>
              <TableCell className="text-right"><Button size="sm">Approve</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Analytics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">SKU Mismatch</div>
          <div className="font-bold text-xl">12 flagged</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Low Stock</div>
          <div className="font-bold text-xl">42 SKUs</div>
        </div>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
          <div className="font-bold text-xl">2.8%</div>
        </div>
      </div>
    </div>
  );
}
