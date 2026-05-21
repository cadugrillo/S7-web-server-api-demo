/**
 * useDataView — polls PLC every 2 s for the DataBuffer array.
 *
 * Mirrors DataViewComponent from the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • PlcProgramRead.bulkExecute() (via readVariablesBulk) — reads 40 variables
 *     (20 timestamp + 20 value entries) in a single HTTP request.
 *     This is the key efficiency advantage of the bulk API over individual reads.
 */
import { useState, useEffect, useCallback } from 'react'
import { createPlcConfig } from '@/lib/plc/config'
import { readVariablesBulk } from '@/lib/plc/program'

export interface DataRow {
  timestamp: string
  value: string
}

const ROWS = 20

export function useDataView() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [rows, setRows] = useState<DataRow[]>([])

  const poll = useCallback(async () => {
    const config = createPlcConfig(address)

    // Build a bulk params array: alternating timestamp / value for each row index
    const params: { var: string; mode: string }[] = []
    for (let i = 0; i < ROWS; i++) {
      params.push({ var: `"DataBuffer".data[${i}].timeStamp`, mode: 'simple' })
      params.push({ var: `"DataBuffer".data[${i}].value`,     mode: 'simple' })
    }

    try {
      // Single bulk request replaces 40 individual HTTP calls
      const responses = await readVariablesBulk(config, token, params)
      if (!responses) return

      // Parse interleaved timestamp/value responses.
      // The Angular app starts from index 2 (skipping the first entry which may be empty),
      // pairing responses[i*2] = timestamp, responses[i*2+1] = value.
      const parsed: DataRow[] = []
      for (let i = 1; i <= ROWS; i++) {
        const tsIdx  = i * 2
        const valIdx = i * 2 + 1
        if (tsIdx < responses.length && valIdx < responses.length) {
          const ts  = responses[tsIdx]?.result  ?? '0000-00-00/00:00:00'
          const val = responses[valIdx]?.result
          parsed.push({
            timestamp: ts,
            value: val === 0 ? '0' : val !== undefined && val !== null ? String(val) : 'N/A',
          })
        }
      }
      setRows(parsed)
    } catch (err) {
      console.error('DataView poll error:', err)
    }
  }, [address, token])

  useEffect(() => {
    void poll()
    const id = setInterval(() => void poll(), 2000)
    return () => clearInterval(id)
  }, [poll])

  return { rows }
}
