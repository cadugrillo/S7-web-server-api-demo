/**
 * SyslogBufferPage
 *
 * Displays raw syslog entries from the S7 Web Server.
 *
 * simatic-s7-webserver-api calls (inside useSyslogBuffer):
 *   • SyslogBrowse.execute() — fetches the web server's syslog ring buffer.
 *     count_lost > 0 indicates the buffer overflowed and entries were dropped.
 */
import { useSyslogBuffer } from '@/hooks/useSyslogBuffer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function SyslogBufferPage() {
  const { entries, countTotal, countLost, loading, refresh } = useSyslogBuffer()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Syslog Buffer</h2>
          <p className="text-sm text-muted-foreground">Syslog.Browse · fetched on load</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </Button>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total:</span>
          <Badge variant="secondary">{countTotal}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Lost:</span>
          {/* count_lost > 0 means the ring buffer overflowed */}
          <Badge variant={countLost > 0 ? 'destructive' : 'secondary'}>{countLost}</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Syslog Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    {loading ? 'Loading…' : 'No syslog entries found.'}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs break-all">
                      {typeof entry === 'string' ? entry : JSON.stringify(entry)}
                    </TableCell>
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
