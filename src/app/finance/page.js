import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Finance & Payouts</h1>
        <Button>Export Ledger</Button>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Commission Collected</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">₹ 2,45,200</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pending Payouts</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">₹ 1,24,200</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>GST Collected</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">₹ 84,600</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#T1001</TableCell>
                <TableCell>Order payout</TableCell>
                <TableCell>₹6,400</TableCell>
                <TableCell><Badge>Paid</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
