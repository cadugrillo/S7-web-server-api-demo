/**
 * AlarmsPage
 *
 * Lists active PLC alarms and allows acknowledging them by ID.
 *
 * simatic-s7-webserver-api calls (inside useAlarms):
 *   • AlarmsBrowse.execute()      — fetches alarm list with attribute filters
 *   • AlarmsAcknowledge.execute() — acknowledges a specific alarm by ID
 *
 * Only alarms where entry.acknowledgement === true can be acknowledged.
 * The Filters object limits which attributes are returned, reducing payload size.
 */
import { useState } from 'react'
import { useAlarms } from '@/hooks/useAlarms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AlarmsPage() {
  const { entries, countCurrent, countMax, lastModified, ackMessage, ackSuccess, loading, refresh, acknowledge } =
    useAlarms()

  const [alarmId, setAlarmId] = useState('')

  const handleAck = async (e: React.FormEvent) => {
    e.preventDefault()
    // AlarmsAcknowledge.execute() — sends "Alarms.Acknowledge" JSON-RPC to the PLC
    await acknowledge(alarmId)
    setAlarmId('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Alarms</h2>
          <p className="text-sm text-muted-foreground">
            Alarms.Browse · filtered attributes · Alarms.Acknowledge
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap text-sm">
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

      {/* Acknowledge form */}
      <Card>
        <CardHeader><CardTitle>Acknowledge Alarm</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAck} className="flex gap-3 items-end flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-48">
              <Label htmlFor="alarmId">Alarm ID</Label>
              <Input
                id="alarmId"
                placeholder="Enter alarm ID…"
                value={alarmId}
                onChange={e => setAlarmId(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!alarmId}>Acknowledge</Button>
          </form>

          {ackMessage && (
            <Alert variant={ackSuccess ? 'success' : 'destructive'} className="mt-3">
              <AlertDescription>{ackMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Alarms table */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Alarm Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ack.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {loading ? 'Loading…' : 'No alarms found.'}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{String(entry.id ?? '—')}</TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>{String(entry.alarm_text ?? '—')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{String(entry.status ?? '—')}</Badge>
                    </TableCell>
                    <TableCell>
                      {/* Only alarms with acknowledgement=true can be acknowledged */}
                      <Badge variant={entry.acknowledgement ? 'warning' : 'secondary'}>
                        {entry.acknowledgement ? 'Pending' : 'N/A'}
                      </Badge>
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
