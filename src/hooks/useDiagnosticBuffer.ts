/**
 * useDiagnosticBuffer — fetches PLC diagnostic events on demand.
 *
 * Mirrors DiagnosticBufferComponent from the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • DiagnosticBufferBrowse.execute() (via browseDiagnosticBuffer)
 *     Returns CPU events with short_text / long_text / help_text descriptions.
 *     The Filters object tells the PLC which text fields to include in the response.
 */
import { useState, useEffect, useCallback } from 'react'
import type { Entry as DiagnosticEntry } from '@siemens/simatic-s7-webserver-api'
import { createPlcConfig } from '@/lib/plc/config'
import { browseDiagnosticBuffer } from '@/lib/plc/diagnostics'

export interface DiagnosticRow extends DiagnosticEntry {
  formattedTimestamp: string
}

export function useDiagnosticBuffer() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [entries, setEntries] = useState<DiagnosticRow[]>([])
  const [countCurrent, setCountCurrent] = useState(0)
  const [countMax, setCountMax] = useState(0)
  const [lastModified, setLastModified] = useState('')
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!token || !address) return
    setLoading(true)
    const config = createPlcConfig(address)

    // Request only the text fields the UI shows — reduces response payload
    const filters = {
      mode: 'include' as const,
      attributes: ['short_text', 'long_text', 'help_text'],
    }

    try {
      const response = await browseDiagnosticBuffer(config, token, 'en-US', filters)
      if (response?.result?.entries) {
        setEntries(
          response.result.entries.map((e: DiagnosticEntry) => ({
            ...e,
            formattedTimestamp: new Date(e.timestamp).toLocaleString(),
          })),
        )
        setCountCurrent(response.result.count_current)
        setCountMax(response.result.count_max)
        setLastModified(response.result.last_modified)
      }
    } catch (err) {
      console.error('DiagnosticBuffer fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [address, token])

  useEffect(() => { void fetch() }, [fetch])

  return { entries, countCurrent, countMax, lastModified, loading, refresh: fetch }
}
