/**
 * usePlantStatus — polls PLC every 500 ms for plant running state and tank level.
 *
 * Mirrors PlantStatusComponent from the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • PlcProgramRead.execute()  (via readVariable) — single variable reads
 *   • PlcProgramWrite.execute() (via writeVariable) — start / stop / reset commands
 */
import { useState, useEffect, useCallback } from 'react'
import { createPlcConfig } from '@/lib/plc/config'
import { readVariable, writeVariable } from '@/lib/plc/program'

export function usePlantStatus() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [isRunning, setIsRunning] = useState(false)
  const [tankLevelScale, setTankLevelScale] = useState<number | null>(null)
  const [flowrate, setFlowrateState] = useState<number>(1)

  const poll = useCallback(async () => {
    const config = createPlcConfig(address)
    try {
      // Read "web2plc".start to determine running state
      const [statusRes, levelRes] = await Promise.all([
        readVariable(config, token, '"web2plc".start'),
        readVariable(config, token, '"web2plc".tankLevelScale'),
      ])
      setIsRunning(statusRes?.result ?? false)
      setTankLevelScale(levelRes?.result ?? null)
    } catch (err) {
      console.error('Plant status poll error:', err)
    }
  }, [address, token])

  useEffect(() => {
    void poll()
    const id = setInterval(() => void poll(), 500)
    return () => clearInterval(id)
  }, [poll])

  const write = (varName: string, value: unknown) =>
    writeVariable(createPlcConfig(address), token, varName, value)

  const startPlant = async () => {
    await write('"web2plc".start', true)
    await write('"web2plc".stop', false)
    void poll()
  }

  const stopPlant = async () => {
    await write('"web2plc".start', false)
    await write('"web2plc".stop', true)
    void poll()
  }

  const resetPlant = async () => {
    await write('"web2plc".reset', true)
    void poll()
  }

  const setFlowrate = async (value: number) => {
    if (value >= 1 && value <= 10) {
      setFlowrateState(value)
      await write('"web2plc".flowrate', value)
    }
  }

  const statusImage = isRunning ? '/assets/StatusRun.png' : '/assets/StatusStop.png'

  return { isRunning, tankLevelScale, flowrate, statusImage, startPlant, stopPlant, resetPlant, setFlowrate }
}
