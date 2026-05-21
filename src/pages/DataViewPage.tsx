/**
 * DataViewPage
 *
 * Displays 20 rows from the DataBuffer DB with timestamp and value columns.
 * Data is refreshed every 2 s via a bulk read.
 *
 * simatic-s7-webserver-api calls (inside useDataView):
 *   • PlcProgramRead.bulkExecute() — 40 variables (20 × timestamp + 20 × value)
 *     fetched in a single HTTP request.  This demonstrates the efficiency of
 *     bulkExecute() vs 40 individual PlcProgramRead.execute() calls.
 */
import { useDataView } from '@/hooks/useDataView'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function DataViewPage() {
  const { rows } = useDataView()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Data View</h2>
          <p className="text-sm text-muted-foreground">
            DataBuffer DB · 2 s poll · PlcProgram.Read (bulkExecute — 40 vars / request)
          </p>
        </div>
        <Badge variant="secondary">{rows.length} rows</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DataBuffer.data[ ]</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {/* "DataBuffer".data[i].timeStamp */}
                <TableHead>Timestamp</TableHead>
                {/* "DataBuffer".data[i].value */}
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Waiting for data…
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs">{row.timestamp}</TableCell>
                    <TableCell className="font-medium">{row.value}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
