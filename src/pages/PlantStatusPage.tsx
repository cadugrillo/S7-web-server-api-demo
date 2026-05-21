/**
 * PlantStatusPage
 *
 * Alternative plant control view with status image, tank level bar, and flowrate setter.
 * All PLC interaction is in usePlantStatus().
 *
 * simatic-s7-webserver-api calls (inside usePlantStatus):
 *   • PlcProgramRead.execute()  — reads "web2plc".start and "web2plc".tankLevelScale
 *   • PlcProgramWrite.execute() — writes start / stop / reset / flowrate
 */
import { usePlantStatus } from '@/hooks/usePlantStatus'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PlantStatusPage() {
  const {
    isRunning,
    tankLevelScale,
    flowrate,
    statusImage,
    startPlant,
    stopPlant,
    resetPlant,
    setFlowrate,
  } = usePlantStatus()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Plant Status</h2>
        <p className="text-sm text-muted-foreground">Live data · 500 ms poll · PlcProgram.Read</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Status image card */}
        <Card className="flex flex-col items-center justify-center p-8 gap-4">
          <img src={statusImage} alt="Plant status" className="h-40 object-contain" />
          <Badge variant={isRunning ? 'success' : 'secondary'} className="text-base px-4 py-1">
            {isRunning ? 'Running' : 'Stopped'}
          </Badge>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {/* PlcProgramWrite: "web2plc".start = true, "web2plc".stop = false */}
              <Button variant="success" className="flex-1" onClick={startPlant}>Start Plant</Button>
              {/* PlcProgramWrite: "web2plc".start = false, "web2plc".stop = true */}
              <Button variant="destructive" className="flex-1" onClick={stopPlant}>Stop Plant</Button>
            </div>

            {/* PlcProgramWrite: "web2plc".reset = true */}
            <Button variant="secondary" className="w-full" onClick={resetPlant}>Reset Plant</Button>

            <div className="space-y-1.5 pt-2">
              <Label>Tank Level</Label>
              <Progress value={tankLevelScale ?? 0} className="h-6" />
              <p className="text-right text-sm text-muted-foreground">{tankLevelScale ?? 0}%</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="fr">Flowrate Setpoint (1–10)</Label>
              <div className="flex gap-2">
                <Input
                  id="fr"
                  type="number"
                  min={1}
                  max={10}
                  value={flowrate}
                  onChange={e => setFlowrate(Number(e.target.value))}
                />
                {/* PlcProgramWrite: "web2plc".flowrate */}
                <Button onClick={() => setFlowrate(flowrate)}>Set</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
