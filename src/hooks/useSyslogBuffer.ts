/**
 * useSyslogBuffer — fetches PLC syslog entries once on mount.
 *
 * Mirrors SyslogBufferComponent from the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • SyslogBrowse.execute() (via browseSyslog)
 *     Returns raw syslog entries plus count_total / count_lost.
 *     count_lost > 0 means the PLC's ring buffer overflowed and entries were dropped.
 */
import { useState, useEffect, useCallback } from 'react'
import type { SyslogData } from '@siemens/simatic-s7-webserver-api'
import { createPlcConfig } from '@/lib/plc/config'
import { browseSyslog } from '@/lib/plc/syslog'

export function useSyslogBuffer() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [entries, setEntries] = useState<SyslogData[]>([])
  const [countTotal, setCountTotal] = useState(0)
  const [countLost, setCountLost]   = useState(0)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!token || !address) return
    setLoading(true)
    const config = createPlcConfig(address)
    try {
      const response = await browseSyslog(config, token)
      if (response?.result?.entries) {
        setEntries(response.result.entries)
        setCountTotal(response.result.count_total)
        setCountLost(response.result.count_lost)
      }
    } catch (err) {
      console.error('SyslogBuffer fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [address, token])

  useEffect(() => { void fetch() }, [fetch])

  return { entries, countTotal, countLost, loading, refresh: fetch }
}
