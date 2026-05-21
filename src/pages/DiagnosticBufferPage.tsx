/**
 * DiagnosticBufferPage
 *
 * Displays PLC diagnostic events fetched on mount (and on manual refresh).
 *
 * simatic-s7-webserver-api calls (inside useDiagnosticBuffer):
 *   • DiagnosticBufferBrowse.execute() — fetches internal PLC events with
 *     short_text / long_text / help_text in the requested language.
 *     The language string must match a configured language in the TIA Portal project.
 */
import { useDiagnosticBuffer } from '@/hooks/useDiagnosticBuffer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function DiagnosticBufferPage() {
  const { entries, countCurrent, countMax, lastModified, loading, refresh } = useDiagnosticBuffer()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Diagnostic Buffer</h2>
          <p className="text-sm text-muted-foreground">DiagnosticBuffer.Browse · language: en-US</p>
        </div>
        {/* Manual refresh — DiagnosticBufferBrowse.execute() */}
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Count:</span>
          <Badge variant="secondary">{countCurrent} / {countMax}</Badge>
        </div>
        {lastModified && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Last modified:</span>
            <span className="font-medium">{new Date(lastModified).toLocaleString()}</span>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Short Text</TableHead>
                <TableHead>Long Text</TableHead>
                <TableHead>Help Text</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {loading ? 'Loading…' : 'No diagnostic entries found.'}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {entry.formattedTimestamp}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{String(entry.status ?? '—')}</Badge>
                    </TableCell>
                    <TableCell>{String(entry.short_text ?? '—')}</TableCell>
                    <TableCell className="max-w-64 truncate">{String(entry.long_text ?? '—')}</TableCell>
                    <TableCell className="max-w-48 truncate text-muted-foreground">
                      {String(entry.help_text ?? '—')}
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
