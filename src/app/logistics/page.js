import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Logistics & Operations" };

export default function LogisticsDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Logistics & Operations</h1>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Forward vs Reverse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">Forward 92% / Reverse 8%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li>• Ekart — 98% on-time</li>
              <li>• Shiprocket — 94% on-time</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">Pincode coverage: 18k</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Recent Deliveries</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AWB</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>AWB-12345</TableCell>
              <TableCell>Ekart</TableCell>
              <TableCell>North</TableCell>
              <TableCell><Badge>Delivered</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
