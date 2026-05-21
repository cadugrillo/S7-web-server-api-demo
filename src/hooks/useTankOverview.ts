/**
 * useTankOverview — polls the PLC every 500 ms for tank state.
 *
 * Mirrors the OverviewTankComponent in the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • readVariable()      → PlcProgramRead.execute()   — single variable per request
 *   • readVariablesBulk() → PlcProgramRead.bulkExecute() — N variables in one HTTP round-trip
 *   • writeVariable()     → PlcProgramWrite.execute()  — sends a control command to the PLC
 */
import { useState, useEffect, useCallback } from 'react'
import { createPlcConfig } from '@/lib/plc/config'
import { readVariablesBulk, writeVariable } from '@/lib/plc/program'

export interface TankData {
  statusValveCPU: boolean
  start: boolean
  stop: boolean
  flowrate: number | null
  tankLevel: number | null
  tankLevelScale: number | null
  tankLevelOverflow: number | null
  tankLevelMaximum: number | null
  tankLevelMidth: number | null
  tankLevelMinimum: number | null
  tankLevelLack: number | null
}

const initial: TankData = {
  statusValveCPU: false, start: false, stop: false,
  flowrate: null, tankLevel: null, tankLevelScale: null,
  tankLevelOverflow: null, tankLevelMaximum: null,
  tankLevelMidth: null, tankLevelMinimum: null, tankLevelLack: null,
}

export function useTankOverview() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [data, setData] = useState<TankData>(initial)
  const [inputFlowrate, setInputFlowrate] = useState<number>(1)

  // All variables fetched as a single bulk request — one HTTP call for 11 values.
  // Ordering matters: responses come back in the same order as params.
  const poll = useCallback(async () => {
    const config = createPlcConfig(address)
    const params = [
      { var: '"web2plc".statusValveCPU', mode: 'simple' },
      { var: '"web2plc".start',          mode: 'simple' },
      { var: '"web2plc".stop',           mode: 'simple' },
      { var: '"web2plc".flowrate',        mode: 'simple' },
      { var: '"web2plc".tankLevel',       mode: 'simple' },
      { var: '"web2plc".tankLevelScale',  mode: 'simple' },
      { var: '"web2plc".tankLevelOverflow',  mode: 'simple' },
      { var: '"web2plc".tankLevelMaximum',   mode: 'simple' },
      { var: '"web2plc".tankLevelMidth',     mode: 'simple' },
      { var: '"web2plc".tankLevelMinimum',   mode: 'simple' },
      { var: '"web2plc".tankLevelLack',      mode: 'simple' },
    ]
    try {
      const r = await readVariablesBulk(config, token, params)
      if (!r) return
      setData({
        statusValveCPU:    r[0]?.result ?? false,
        start:             r[1]?.result ?? false,
        stop:              r[2]?.result ?? false,
        flowrate:          r[3]?.result ?? null,
        tankLevel:         r[4]?.result ?? null,
        tankLevelScale:    r[5]?.result ?? null,
        tankLevelOverflow: r[6]?.result ?? null,
        tankLevelMaximum:  r[7]?.result ?? null,
        tankLevelMidth:    r[8]?.result ?? null,
        tankLevelMinimum:  r[9]?.result ?? null,
        tankLevelLack:     r[10]?.result ?? null,
      })
    } catch (err) {
      console.error('Tank overview poll error:', err)
    }
  }, [address, token])

  // Poll every 500 ms; clean up on unmount to avoid memory leaks
  useEffect(() => {
    void poll()
    const id = setInterval(() => void poll(), 500)
    return () => clearInterval(id)
  }, [poll])

  // ── Control actions ───────────────────────────────────────────────────────
  // Each action writes to the PLC then immediately calls poll() for a fast UI update.

  const write = (varName: string, value: unknown) =>
    writeVariable(createPlcConfig(address), token, varName, value)

  const startProcess = async () => {
    await write('"web2plc".start', true)
    await write('"web2plc".stop', false)
    void poll()
  }

  const stopProcess = async () => {
    await write('"web2plc".start', false)
    await write('"web2plc".stop', true)
    void poll()
  }

  const openValve = async () => {
    await write('"web2plc".openValve', true)
    await write('"web2plc".closeValve', false)
    void poll()
  }

  const closeValve = async () => {
    await write('"web2plc".closeValve', true)
    await write('"web2plc".openValve', false)
    void poll()
  }

  const resetPlant = async () => {
    await write('"web2plc".reset', true)
    void poll()
  }

  const setFlowrate = async (value: number) => {
    if (value >= 1 && value <= 10) {
      await write('"web2plc".flowrate', value)
      void poll()
    }
  }

  // Tank image selection: mirrors the Angular component logic exactly
  const tankImage = !data.start
    ? '/assets/EmptyTank.png'
    : data.statusValveCPU
      ? '/assets/EmptyingTank.png'
      : '/assets/FillingTank.png'

  return {
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
  }
}
