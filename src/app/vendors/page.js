import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  
  export default function VendorsDashboard() {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Vendor Management</h1>
          <div className="flex gap-2">
            <Button>Export</Button>
          </div>
        </header>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead>Sales (30d)</TableHead>
              <TableHead>RTO %</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
  
          <TableBody>
            <TableRow>
              <TableCell>ABC Store</TableCell>
              <TableCell><Badge>Verified</Badge></TableCell>
              <TableCell>₹1,24,000</TableCell>
              <TableCell>2.3%</TableCell>
              <TableCell>4.5</TableCell>
              <TableCell className="text-right"><Button size="sm">View</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
  
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Settlement Pending</div>
            <div className="font-bold text-xl">₹ 1,24,200</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">KYC Pending</div>
            <div className="font-bold text-xl">12</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Avg Rating</div>
            <div className="font-bold text-xl">4.3</div>
          </div>
        </div>
      </div>
    );
  }
  