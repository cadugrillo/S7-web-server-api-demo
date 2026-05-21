/**
 * TankOverviewPage
 *
 * Displays live tank state with 500 ms polling and provides control buttons.
 * All PLC interaction is handled by useTankOverview() — this component is pure UI.
 *
 * simatic-s7-webserver-api calls (inside useTankOverview):
 *   • PlcProgramRead.bulkExecute()  — reads 11 variables per poll cycle
 *   • PlcProgramWrite.execute()     — writes control commands (start, stop, valve, flowrate)
 */
import { useTankOverview } from '@/hooks/useTankOverview'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TankOverviewPage() {
  const {
    data,
    inputFlowrate,
    setInputFlowrate,
    tankImage,
    startProcess,
    stopProcess,
    openValve,
    closeValve,
    resetPlant,
    setFlowrate,
  } = useTankOverview()

  const levelPct = data.tankLevelScale ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tank Overview</h2>
        <p className="text-sm text-muted-foreground">Live data · 500 ms poll · PlcProgram.Read (bulk)</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Tank visualization */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6 gap-4">
          <img src={tankImage} alt="Tank state" className="h-48 object-contain" />
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium">{levelPct}%</span>
            </div>
            <Progress value={levelPct} />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge variant={data.start ? 'success' : 'secondary'}>
              {data.start ? 'Running' : 'Stopped'}
            </Badge>
            <Badge variant={data.statusValveCPU ? 'warning' : 'outline'}>
              Valve {data.statusValveCPU ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </Card>

        {/* Process controls */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Process Control</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {/* PlcProgramWrite: "web2plc".start / "web2plc".stop */}
            <div className="flex gap-2">
              <Button variant="success" className="flex-1" onClick={startProcess}>Start</Button>
              <Button variant="destructive" className="flex-1" onClick={stopProcess}>Stop</Button>
            </div>
            <Separator />
            {/* PlcProgramWrite: "web2plc".openValve / "web2plc".closeValve */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={openValve}>Open Valve</Button>
              <Button variant="outline" className="flex-1" onClick={closeValve}>Close Valve</Button>
            </div>
            <Separator />
            {/* PlcProgramWrite: "web2plc".reset */}
            <Button variant="secondary" className="w-full" onClick={resetPlant}>Reset Plant</Button>
          </CardContent>
        </Card>

        {/* Flowrate setpoint */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Flowrate Setpoint</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Current flowrate</Label>
              <p className="text-2xl font-bold">{data.flowrate ?? '—'}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="flowrateInput">New setpoint (1–10)</Label>
              <div className="flex gap-2">
                <Input
                  id="flowrateInput"
                  type="number"
                  min={1}
                  max={10}
                  value={inputFlowrate}
                  onChange={e => setInputFlowrate(Number(e.target.value))}
                />
                {/* PlcProgramWrite: "web2plc".flowrate */}
                <Button onClick={() => setFlowrate(inputFlowrate)}>Set</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <Card>
        <CardHeader><CardTitle>Live Measurements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {[
              ['Tank Level (raw)', data.tankLevel],
              ['Tank Level (%)',   data.tankLevelScale],
              ['Overflow',        data.tankLevelOverflow],
              ['Maximum',         data.tankLevelMaximum],
              ['Midth',           data.tankLevelMidth],
              ['Minimum',         data.tankLevelMinimum],
              ['Lack',            data.tankLevelLack],
              ['Flowrate',        data.flowrate],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex flex-col">
                <span className="text-muted-foreground text-xs">{label}</span>
                <span className="font-medium">{val ?? '—'}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
