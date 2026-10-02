import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
  
  import { Badge } from "@/components/ui/badge";
  
  export default function SalesPage() {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Sales Management</h1>
  
        {/* Sales Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹24,600</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹1,45,200</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹6,42,800</p>
            </CardContent>
          </Card>
        </div>
  
        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
  
              <TableBody>
                <TableRow>
                  <TableCell>Wireless Earbuds</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>₹1,299</TableCell>
                  <TableCell>
                    <Badge variant="default">Completed</Badge>
                  </TableCell>
                </TableRow>
  
                <TableRow>
                  <TableCell>Sports Shoes</TableCell>
                  <TableCell>Fashion</TableCell>
                  <TableCell>₹2,499</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pending</Badge>
                  </TableCell>
                </TableRow>
  
                <TableRow>
                  <TableCell>Fitness Band</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>₹1,699</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Refunded</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
  